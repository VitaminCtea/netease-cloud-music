import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { FixedSizeList } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import { getUserPlaylist } from 'common/ts/fetch'
import { Loading } from 'common/Loading'
import { workerCode } from './worker'
import { createWorker } from 'common/ts/createWorker'
import { addChineseUnit } from 'helper/index'
import './index.sass'

const CONTAINER_CLASS_NAME = 'list-scroll-container'
const TARGET_CLASS_NAME = 'song-item'

const getTargetElement = (target: HTMLElement) => {
    if (target.className !== CONTAINER_CLASS_NAME) {
        while (target.className !== TARGET_CLASS_NAME) target = target.parentNode as HTMLElement
    } else {
        while (target.className !== TARGET_CLASS_NAME) target = target.firstElementChild as HTMLElement
    }
    return target
}

const getIndex = (target: HTMLElement, callback: (target: HTMLElement) => number) => callback(target)

const updateRedux = (
        target: HTMLElement,
        data: any[],
        callback: (target: HTMLElement) => number,
        updateCurrentIndex: (data: any[], index: number, isFullScreen: boolean) => void,
        isFullScreen: boolean = false
) => updateCurrentIndex(data, getIndex(getTargetElement(target), callback), isFullScreen)

type RowProps = {
    index: number
    style: { [PropName: string]: any }
    data: any[]
}
const Row = ({ index, style, data }: RowProps) => {
    const item = data[index]
    return (
        <div className={'song-item'} style={style}>
            <span className={'song-serialNumber'}>{index + 1}</span>
            <div className={'song-right-container'}>
                <div className={'song-info'}>
                    <span className={'song-name'}>{item.name}</span>
                    <div className={'song-singer-container'}>
                        {item.ar.map((singer: typeof item.ar[0], index: number, array: typeof item.ar) => {
                            let singerName = index > 0 ? '/' + singer.name : singer.name
                            if (index === array.length - 1) {
                                singerName += ' - ' + item.name
                            }
                            return (
                                <span className={'song-singer-name'} key={uuidv4()}>
                                    {singerName}
                                </span>
                            )
                        })}
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

type SongListProps<S extends any = { [PropName: string]: any }> = {
    data: S
    style: S
    outerElementType: any
}
const SongList = ({ data, style, outerElementType }: SongListProps) => (
    <AutoSizer>
        {({ height, width }) => (
            <FixedSizeList height={height}
                           itemCount={
                               data?.tracks ? data.tracks.length : 0
                           }
                           itemSize={65}
                           width={width}
                           style={{ ...style }}
                           itemData={data?.tracks}
                           className={'list-scroll-container'}
                           outerElementType={ outerElementType }
            >
                {
                    ({ index, style, data }) => (
                        <Row index={ index }
                             style={ style }
                             data={ data } />
                    )
                }
            </FixedSizeList>
        )}
    </AutoSizer>
)

type SearchProps<T extends number = number, S = { [PropName: string]: any }> = {
    rgb: {
        r: T,
        g: T,
        b: T,
        a: T
    }
    data: S[]
    setSearchStatus: Function
    updatePlayState: Function
}
const SearchComponent = ({ rgb, data, setSearchStatus, updatePlayState }: SearchProps) => {
    const [ searchData, setSearchData ] = useState<SearchProps['data']>([])
    const [ hasValue, setValueStatus ] = useState(false)

    const inputRef: Ref<HTMLInputElement> = useRef(null)

    const handleBack = useCallback(() => {
        setSearchStatus(false)
    }, [])

    const changeKeyWord = useCallback((e: React.SyntheticEvent) => {
        const target = e.target as HTMLInputElement
        const value = target.value.toLowerCase()
        if (value === '') {
            setValueStatus(false)
            setSearchData([])
        } else {
            setValueStatus(true)
            const songs = data.filter((item) => {
                let keyWord = ''
                if (/[a-zA-Z]+/g.test(value)) {
                    keyWord = item.name.toLowerCase()
                } else {
                    keyWord = item.name
                }
                return keyWord.includes(value)
            })
            setSearchData(songs)
        }
    }, [])
    const clearInput = useCallback(() => {
        if (!inputRef.current!.value) return
        inputRef.current!.value = ''
        inputRef.current!.focus()
        setSearchData([])
    }, [])

    const clickPlay = useCallback((e: React.SyntheticEvent) => {
        updateRedux(e.target as HTMLElement, data, (target) => {
            return data.findIndex(item => item.id === +(target!.dataset.id)!)
        }, (data, index, isFullScreen) => {
            updatePlayState(data, index, isFullScreen)
        }, true)
    }, [data])

    useEffect(() => {
        inputRef.current!.focus()
    }, [])

    return (
        <div className={'playlist-container'} style={{ zIndex: 1 }}>
            <div className={'playlist-content'} style={{ padding: '0 10px' }}>
                <div className={'playlist-header-placeholder'} />
                <div className={'playlist-header'} style={{ backgroundColor: `rgb(${ rgb.r }, ${ rgb.g }, ${ rgb.b })` }}>
                    <div className={'playlist-header-left'}>
                        <i className={'icon-back'} onClick={ handleBack }/>
                        <input type={ 'text' }
                               placeholder={'搜索歌单内歌曲'}
                               className={ 'playlist-searchInput' }
                               onInput={ changeKeyWord }
                               ref={ inputRef }/>
                        {
                            hasValue && <i className={ 'icon-login-close' } onClick={ clearInput }/>
                        }
                    </div>
                </div>
                {
                    !data ?
                    <Loading /> :
                    <div className={'songList-content'}>
                        <div className={'songList-list-content'} style={{ padding: 0 }} onClick={ clickPlay }>
                            {
                                searchData.map((item: typeof searchData[0]) => (
                                    <div className={'song-item'} key={ uuidv4() } style={{ paddingBottom: '20px' }} data-id={ item.id }>
                                        <div className={'song-right-container'}>
                                            <div className={'song-info'}>
                                                <span className={'song-name'}>{item.name}</span>
                                                <div className={'song-singer-container'}>
                                                    {
                                                        item.ar.map((singer: typeof item.ar[0], index: number, array: typeof item.ar) => {
                                                            let singerName = index > 0 ? '/' + singer.name : singer.name
                                                            if (index === array.length - 1) {
                                                                singerName += ' - ' + item.name
                                                            }
                                                            return (
                                                                <span className={'song-singer-name'} key={uuidv4()}>{singerName}</span>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                            <div className={'song-controls-container'}>
                                                <i className={'icon-video'} />
                                                <i className={'icon-more'} />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

type Ref<T extends HTMLElement = HTMLDivElement> = React.RefObject<T>
type Props = {
    id: number
    setShow: Function
    updatePlayState: Function
}

export default function Playlist({ id, setShow, updatePlayState }: Props) {
    const [ info, setInfo ] = useState<{ [PropName: string]: any } | null>(null)
    const [ style, setStyle ] = useState({
        overflow: 'hidden',
    })

    const [ searchStatus, setSearchStatus ] = useState(false)

    const songListRef: Ref = useRef(null)
    const playlistContainerRef: Ref = useRef(null)
    const playlistHeaderRef: Ref = useRef(null)
    const playlistContentLayerRef: Ref = useRef(null)
    const songListHeaderRef: Ref = useRef(null)
    const controlsOpacityRef: Ref = useRef(null)
    const playlistHeaderTextRef: Ref = useRef(null)
    const handle = useRef<(e: Event) => void>()
    const rgb = useRef({
        r: 0,
        g: 0,
        b: 0,
        a: 1
    })

    const outerElementType = useMemo(() => React.forwardRef((props, ref: any) => (
        <div ref={ ref } onClick={ playSong } { ...props } />
    )), [info])

    const playSong = (e: React.SyntheticEvent) => {
        updateRedux(e.target as HTMLElement, info?.tracks, (target) => {
            const style = window.getComputedStyle(target, null)
            const top = style.getPropertyValue('top')
            return parseInt(top, 10) / target.clientHeight
        }, (data, index) => {
            updatePlayState(info?.tracks, index)
        })
    }

    const icons: { name: string; text: number | string }[] = useMemo(
        () => [
            {
                name: 'icon-player-comment',
                text: info?.commentCount ? info.commentCount : '评论',
            },
            {
                name: 'icon-share',
                text: info?.shareCount ? info.shareCount : '分享',
            },
            {
                name: 'icon-download',
                text: '下载',
            },
            {
                name: 'icon-multi-select',
                text: '多选',
            },
        ],
        [ info ]
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
            const distance = songListRef.current!.getBoundingClientRect().top - playlistHeaderHeight

            const scroll = (e: Event) => {
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
                playlistHeaderRef.current!.style.backgroundColor = `rgba(${rgb.current.r}, ${rgb.current.g}, ${rgb.current.b}, ${opacity})`
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
                const data = context.getImageData(0, 0, img.width, img.height).data
                const height = img.height
                const width = img.width

                const [worker, killWorker] = createWorker(workerCode)
                worker!.onmessage = function (e) {
                    const [r, g, b] = e.data
                    rgb.current = { r, g, b, a: 1 }
                    setBackgroundColor(
                            playlistContentLayerRef,
                            `rgb(${rgb.current.r}, ${rgb.current.g}, ${rgb.current.b})`
                    )
                    setBackgroundColor(
                            playlistHeaderRef,
                            `rgba(${rgb.current.r}, ${rgb.current.g}, ${rgb.current.b}, 0)`
                    )
                    handle.current = scroll
                    playlistContainerRef.current!.addEventListener('scroll', handle.current)
                    killWorker()
                }
                worker!.postMessage([data, height, width])
            }
            img.src = info!.coverImgUrl
        }
    }, [info])

    return (
        <>
            { searchStatus && <SearchComponent data={info!.tracks}
                                               rgb={rgb.current}
                                               setSearchStatus={setSearchStatus}
                                               updatePlayState={updatePlayState}/>
            }
            <div className={'playlist-container'} ref={playlistContainerRef}>
                <div className={'playlist-content'}>
                    <div className={'playlist-content-layer'} ref={playlistContentLayerRef}/>
                    <div className={'playlist-header'} ref={playlistHeaderRef}>
                        <div className={'playlist-header-left'}>
                            <i className={'icon-back'} onClick={() => setShow(false)} />
                            <span className={'playlist-header-text'} ref={playlistHeaderTextRef}>
                                歌单
                            </span>
                        </div>
                        <div className={'playlist-header-right'}>
                            <i className={'icon-search'} onClick={ () => setSearchStatus(!searchStatus) }/>
                            <i className={'icon-more'} />
                        </div>
                    </div>
                    <div className={'playlist-header-placeholder'} />
                    <div ref={controlsOpacityRef}>
                        <div className={'playlist-show-content'}>
                            <div className={'playlist-show-imageContainer'}>
                                <img src={!info?.coverImgUrl ? '' : info.coverImgUrl} className={'show-image'} />
                                <div className={'playlist-playCount-container'}>
                                    <i className={'icon-recommend-playCount'} />
                                    <span className={'playlist-playCount'}>
                                        { !info?.playCount ? 0 : addChineseUnit(info.playCount) }
                                    </span>
                                </div>
                            </div>
                            <div className={'playlist-show-info'}>
                                <div className={'playlist-show-infoTop'}>
                                    <span className={'playlist-show-title'}>
                                        {headerTitle}
                                    </span>
                                    <div className={'playlist-creator-info'}>
                                        <div className={'playlist-creator-imageContainer'}>
                                            <img src={`${!info?.creator?.avatarUrl ? '' : info.creator.avatarUrl}`} className={'playlist-creator-image'}/>
                                        </div>
                                        <span className={'playlist-creatorName'}>
                                            { !info?.creator?.nickname ? 'xxx' : info.creator.nickname }{'>'}
                                        </span>
                                    </div>
                                </div>
                                <p className={'playlist-description'}>
                                    { !info?.description ? '' : info.description }
                                </p>
                            </div>
                        </div>
                        <div className={'playlist-operation-content'}>
                            {
                                icons.map(({ name, text }) => (
                                    <div className={'playlist-operation-item'} key={uuidv4()}>
                                        <i className={`${name}`} />
                                        <span className={'playlist-operation-text'}>
                                            {text}
                                        </span>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                {
                    !info ?
                    <Loading /> :
                    <div className={'songList-content'} ref={songListRef}>
                        <div className={'songList-header'} ref={songListHeaderRef}>
                            <i className={'icon-miniPlayer_pause'} />
                            <div className={'songList-header-text-container'}>
                                <span className={'songList-header-text'}>
                                    播放全部
                                </span>
                                <span className={'songList-count'}>
                                    (共{ info?.tracks ? info.tracks.length : 0 }首)
                                </span>
                            </div>
                        </div>
                        <div className={'songList-list-content'}>
                            <SongList data={ info }
                                      style={{ ...style }}
                                      outerElementType={ outerElementType } />
                        </div>
                    </div>
                }
            </div>
        </>
    )
}
