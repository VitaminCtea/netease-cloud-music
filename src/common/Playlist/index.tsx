import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { FixedSizeList } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import { getUserPlaylist, getSongListReview } from 'common/ts/fetch'
import { Loading } from '../Loading'
import { workerCode } from './worker'
import { createWorker } from '../ts/createWorker'
import './index.sass'

type RowProps = {
    index: number
    style: { [PropName: string]: any }
    data: any[]
}
const Row = ({ index, style, data }: RowProps) => {
    const item = data[index]
    return (
        <div className={'song-item'} style={style} data-index={index}>
            <span className={'song-serialNumber'}>{index + 1}</span>
            <div className={'song-right-container'}>
                <div className={'song-info'}>
                    <span className={'song-name'}>{item.name}</span>
                    <div className={'song-singer-container'}>
                        {item.ar.map(
                            (
                                singer: typeof item.ar[0],
                                index: number,
                                array: typeof item.ar
                            ) => {
                                let singerName =
                                    index > 0 ? '/' + singer.name : singer.name
                                if (index === array.length - 1) {
                                    singerName += ' - ' + item.name
                                }
                                return (
                                    <span
                                        className={'song-singer-name'}
                                        key={uuidv4()}
                                    >
                                        {singerName}
                                    </span>
                                )
                            }
                        )}
                    </div>
                </div>
                <div className={'song-controls-container'}>
                    <i className={'icon-video'} />
                    <i className={'icon-more'} />
                </div>
            </div>
        </div>
    )
}

type Ref<T extends HTMLElement = HTMLDivElement> = React.RefObject<T>
type Props = {
    id: number
    setShow: Function
}

export default function Playlist({ id, setShow }: Props) {
    const [info, setInfo] = useState<{ [PropName: string]: any } | null>(null)
    const [style, setStyle] = useState({
        overflow: 'hidden',
    })
    const [songListReview, setSongListReview] = useState<{
        [PropName: string]: any
    } | null>(null)

    const songListRef: Ref = useRef(null)
    const playlistContainerRef: Ref = useRef(null)
    const playlistHeaderRef: Ref = useRef(null)
    const playlistContentLayerRef: Ref = useRef(null)
    const songListHeaderRef: Ref = useRef(null)
    const controlsOpacityRef: Ref = useRef(null)
    const playlistHeaderTextRef: Ref = useRef(null)

    const icons: { name: string; text: number | string }[] = useMemo(
        () => [
            {
                name: 'icon-player-comment',
                text: songListReview ? songListReview.comments.length : '评论',
            },
            {
                name: 'icon-share',
                text: '分享',
            },
            {
                name: 'icon-player-download',
                text: '下载',
            },
            {
                name: 'icon-multi-select',
                text: '多选',
            },
        ],
        [songListReview]
    )

    const headerTitle = useMemo(() => {
        if (info) {
            if (info.name.includes('喜欢')) return '我喜欢的音乐'
            return info.name
        }
        return 'title'
    }, [info])

    const setCSSText = useCallback(
        (el: React.RefObject<HTMLDivElement>, value: string) => {
            el.current!.style.cssText += value
        },
        []
    )
    const setBackgroundColor = useCallback(
        (el: React.RefObject<HTMLDivElement>, value: string) => {
            el.current!.style.backgroundColor = value
        },
        []
    )

    useEffect(() => {
        if (!songListReview) {
            getSongListReview(id).then((res) => {
                console.log(res.data)
                setSongListReview(res.data)
            })
        }
        if (!info) {
            getUserPlaylist(id).then((res) => {
                setInfo(res.data.playlist)
            })
        } else {
            console.log(info)
            const playlistHeaderHeight = playlistHeaderRef.current!.offsetHeight
            const style = window.getComputedStyle(
                document.documentElement,
                null
            )
            const fontSize = parseInt(style.getPropertyValue('font-size'), 10)
            const getRect = (px: number) => px / fontSize + 'rem'
            const songListHeaderHeight = songListHeaderRef.current!.offsetHeight
            const height = getRect(
                songListHeaderHeight +
                    songListHeaderRef.current!.offsetHeight / 2
            )
            const originHeight = getRect(-16)

            let lock = false
            const distance =
                songListRef.current!.getBoundingClientRect().top -
                playlistHeaderHeight

            const scroll = (r: number, g: number, b: number, e: Event) => {
                const top = songListRef.current!.getBoundingClientRect().top
                const target = e.target as typeof e.target & {
                    scrollTop: number
                }
                let opacity = target.scrollTop / distance

                if (target.scrollTop > 80) {
                    playlistHeaderTextRef.current!.innerText = headerTitle
                } else {
                    playlistHeaderTextRef.current!.innerText = '歌单'
                }

                opacity = opacity < 0 ? 0 : opacity > 1 ? 1 : opacity
                playlistHeaderRef.current!.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${opacity})`
                controlsOpacityRef.current!.style.opacity = `${1 - opacity}`

                if (top <= playlistHeaderHeight && !lock) {
                    setCSSText(
                        playlistContentLayerRef,
                        `position: fixed; left: 0; right: 0; height: ${height}; z-index: 6;`
                    )
                    setStyle({ overflow: 'auto' })
                    lock = true
                } else if (top > playlistHeaderHeight && lock) {
                    setStyle({ overflow: 'hidden' })
                    setCSSText(
                        playlistContentLayerRef,
                        `position: absolute; top: 0; right: 0; left: 0; height: auto; bottom: ${originHeight}; z-index: -1;`
                    )
                    lock = false
                }
            }

            const img = new Image()
            img.crossOrigin = ''

            img.onload = () => {
                const canvas = document.createElement('canvas')
                canvas.width = playlistContentLayerRef.current!.offsetWidth
                canvas.height = playlistContentLayerRef.current!.offsetHeight
                const context = canvas.getContext('2d')!
                context.drawImage(img, 0, 0)
                const data = context.getImageData(0, 0, img.width, img.height)
                    .data
                const height = img.height
                const width = img.width

                const [worker, killWorker] = createWorker(workerCode)
                worker!.onmessage = function (e) {
                    const [r, g, b] = e.data
                    setBackgroundColor(
                        playlistContentLayerRef,
                        `rgb(${r}, ${g}, ${b})`
                    )
                    setBackgroundColor(
                        playlistHeaderRef,
                        `rgba(${r}, ${g}, ${b}, 0)`
                    )
                    playlistContainerRef.current!.addEventListener(
                        'scroll',
                        scroll.bind(null, r, g, b)
                    )
                    killWorker()
                }
                worker!.postMessage([data, height, width])
            }
            img.src = info!.coverImgUrl
        }
    }, [info, songListReview])
    return (
        <div className={'playlist-container'} ref={playlistContainerRef}>
            <div className={'playlist-content'}>
                <div
                    className={'playlist-content-layer'}
                    ref={playlistContentLayerRef}
                />
                <div className={'playlist-header'} ref={playlistHeaderRef}>
                    <div className={'playlist-header-left'}>
                        <i
                            className={'icon-back'}
                            onClick={() => setShow(false)}
                        />
                        <span
                            className={'playlist-header-text'}
                            ref={playlistHeaderTextRef}
                        >
                            歌单
                        </span>
                    </div>
                    <div className={'playlist-header-right'}>
                        <i className={'icon-search'} />
                        <i className={'icon-more'} />
                    </div>
                </div>
                <div className={'playlist-header-placeholder'} />
                <div ref={controlsOpacityRef}>
                    <div className={'playlist-show-content'}>
                        <div className={'playlist-show-imageContainer'}>
                            <img
                                src={!info?.coverImgUrl ? '' : info.coverImgUrl}
                                className={'show-image'}
                            />
                            <div className={'playlist-playCount-container'}>
                                <i className={'icon-recommend-playCount'} />
                                <span className={'playlist-playCount'}>
                                    {!info?.playCount ? 0 : info.playCount}
                                </span>
                            </div>
                        </div>
                        <div className={'playlist-show-info'}>
                            <div className={'playlist-show-infoTop'}>
                                <span className={'playlist-show-title'}>
                                    {headerTitle}
                                </span>
                                <div className={'playlist-creator-info'}>
                                    <div
                                        className={
                                            'playlist-creator-imageContainer'
                                        }
                                    >
                                        <img
                                            src={`${
                                                !info?.creator?.avatarUrl
                                                    ? ''
                                                    : info.creator.avatarUrl
                                            }`}
                                            className={'playlist-creator-image'}
                                        />
                                    </div>
                                    <span className={'playlist-creatorName'}>
                                        {!info?.creator?.nickname
                                            ? 'xxx'
                                            : info.creator.nickname}
                                        {'>'}
                                    </span>
                                </div>
                            </div>
                            <p className={'playlist-description'}>
                                {!info?.description ? '' : info.description}
                            </p>
                        </div>
                    </div>
                    <div className={'playlist-operation-content'}>
                        {icons.map(({ name, text }) => (
                            <div
                                className={'playlist-operation-item'}
                                key={uuidv4()}
                            >
                                <i className={`${name}`} />
                                <span className={'playlist-operation-text'}>
                                    {text}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {!info ? (
                <Loading />
            ) : (
                <div className={'songList-content'} ref={songListRef}>
                    <div className={'songList-header'} ref={songListHeaderRef}>
                        <i className={'icon-play-borderPlay-black'} />
                        <div className={'songList-header-text-container'}>
                            <span className={'songList-header-text'}>
                                播放全部
                            </span>
                            <span className={'songList-count'}>
                                (共{info?.tracks ? info.tracks.length : 0}首)
                            </span>
                        </div>
                    </div>
                    <div className={'songList-list-content'}>
                        <AutoSizer>
                            {({ height, width }) => (
                                <FixedSizeList
                                    height={height}
                                    itemCount={
                                        info?.tracks ? info.tracks.length : 0
                                    }
                                    itemSize={65}
                                    width={width}
                                    style={{ ...style }}
                                    itemData={info?.tracks}
                                    className={'list-scroll-container'}
                                >
                                    {Row}
                                </FixedSizeList>
                            )}
                        </AutoSizer>
                    </div>
                </div>
            )}
        </div>
    )
}
