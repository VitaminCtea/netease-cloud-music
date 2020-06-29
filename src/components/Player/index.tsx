import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Transition } from 'react-transition-group'
import { PlayerProps } from 'containers/Player'
import { padZero, shuffle } from 'helper/index'
import { findIndex, PlayMode } from 'actions/player'
import ProgressRing from 'common/ProgressRing'
import { Song } from 'common/ts/songFade'
import { useLyric } from 'hooks/showLyric'
import {
    pageDefaultStyle,
    pageTransitionStyle,
    DURATION,
    miniPlayerDefaultStyle,
} from 'common/ts/pageTransitionStyle'
import Marquee from 'common/Marquee'
import './index.sass'

const MINUTES = 60

type Ref<T extends HTMLElement> = React.RefObject<T>
type Touch = {
    startX: number
    isTouch: boolean
    left: number
    ballNode: HTMLElement | null
    progressPercentNode: HTMLElement | null
}
export default function Player({
    fullScreen,
    playing,
    currentSong,
    currentIndex,
    playlist,
    updateFullScreenState,
    updatePlayingState,
    updateSong,
    playMode,
    updatePlayMode,
    sequenceList,
    updatePlaylist,
    updateCurrentIndex,
    playModeIconClassName,
    updatePlayModeIconClassName,
}: PlayerProps) {
    const [time, setTime] = useState<number>(0)
    const audioRef: Ref<HTMLAudioElement> = useRef(null)
    const lyricRef: Ref<HTMLSpanElement> = useRef(null)
    const lyric = useLyric(currentSong!, time)
    const [miniPlayerHeight, setMiniPlayerHeight] = useState(0)

    const touch = useRef<Touch>({
        startX: 0,
        isTouch: false,
        left: 0,
        ballNode: null,
        progressPercentNode: null,
    })

    // icon图标
    const icons = useMemo(
        () => [
            currentSong?.isFavoriteMusic
                ? 'icon-favorite_background'
                : 'icon-favorite_border',
            'icon-download',
            'icon-vip',
            'icon-player-comment',
            'icon-player-info',
        ],
        [currentSong]
    )
    const controlsIcons = useRef([
        'icon-player-prevSong',
        'icon-normalPlayer_play',
        'icon-player-nextSong',
        'icon-normalPlayer_playlist',
    ])

    // 创建icon图标DOM
    const createIcons = useCallback(
        (icons: string[]) =>
            icons.map((iconClassName: string, index) => (
                <i className={`${iconClassName}`} key={index} />
            )),
        []
    )

    const getSelector = useCallback(
        (selector: string) => document.querySelector(selector) as HTMLElement,
        []
    )

    // 控制播放或暂停图标
    const updatePlayIcon = useMemo(
        () => (playing ? 'icon-miniPlayer_play' : 'icon-miniPlayer_pause'),
        [playing]
    )

    // 控制全屏隐藏及显示
    const setFullScreen = useCallback(
        (e: any) => {
            if (!currentSong) {
                e.preventDefault()
                return
            }
            updateFullScreenState(!fullScreen)
        },
        [fullScreen, currentSong]
    )

    // 歌曲时间更新及时间格式化
    const timeUpdate = useCallback(
        () => setTime(audioRef!.current!.currentTime),
        [time]
    )
    const formatTime = useCallback((time) => {
        const floor = ~~time
        const minutes = padZero(~~(floor / MINUTES))
        const seconds = padZero(~~(floor % MINUTES))
        return `${minutes}:${seconds}`
    }, [])

    // public method
    const setRef = useCallback(
        (node: HTMLDivElement, callback: (node: HTMLDivElement) => void) => {
            node && callback(node)
        },
        []
    )

    const setHeight = (node: HTMLDivElement) =>
        setMiniPlayerHeight(node.offsetHeight)
    const miniPlayerRef = useCallback(
        (node: HTMLDivElement) => setRef(node, setHeight),
        [miniPlayerHeight]
    )

    const getBallRemainingDistanceX = useCallback((node: HTMLElement) => {
        const ballWidth = node.clientWidth
        const parentWidth = (node.parentNode! as HTMLElement).clientWidth
        return parentWidth - ballWidth
    }, [])

    const setAudioCurrentTime = useCallback(
        (
            currentOffset: number,
            totalWidth: number,
            audio: HTMLAudioElement = audioRef!.current!
        ) => {
            const percent = currentOffset / totalWidth
            audio.currentTime = percent * audio.duration
        },
        []
    )

    const setAnimationPlayState = useCallback(
        (node: HTMLElement, val: 'running' | 'paused') =>
            (node.style.animationPlayState = val),
        []
    )

    // 使用await，因为使用了requestAnimationFrame方法，从而不会是同步执行，当频繁切换播放或暂停时，会产生累积，所以这里要同步运行
    const setSongFade = useCallback(
        (audio: HTMLAudioElement) => {
            return new Promise(async (resolve) => {
                const song = new Song(audioRef!.current!)
                if (playing) {
                    await song.songFadeOutPause()
                    audio.pause()
                } else {
                    audio.play()
                    await song.songFadeInPlay()
                }
                resolve(true)
            })
        },
        [playing]
    )

    const getPercent = useCallback(() => {
        const currentTime = ~~time
        const totalTime = ~~audioRef!.current!.duration
        return currentTime / totalTime
    }, [time])

    const percent = useMemo(() => {
        if (currentSong) {
            return time / audioRef!.current!.duration
        }
    }, [time, currentSong])

    const updatePrevOrNextSong = useCallback(
        (type: string) => {
            let index = type === 'prev' ? currentIndex - 1 : currentIndex + 1
            if (index < 0) {
                index = playlist.length - 1
            } else if (index > playlist.length - 1) {
                index = 0
            }
            if (!playing) {
                updatePlayingState(true)
            }
            updateSong(index)
        },
        [currentIndex, playlist, playing]
    )

    // 播放器进度条及小球随着歌曲进度而变化
    const setProgressPercentRef = useCallback(
        (node: HTMLDivElement) => setRef(node, updateProgressPercent),
        [time]
    )
    const setProgressBallRef = useCallback(
        (node: HTMLDivElement) => {
            if (node) {
                setRef(node, updateProgressBallPosition)
                const state = playing ? 'running' : 'paused'
                setAnimationPlayState(node, state)
            }
        },
        [time, playing]
    )
    const updateProgressPercent = useCallback(
        (node: HTMLDivElement) => {
            if (time >= 0 && !touch.current.isTouch) {
                const percent = getPercent()
                const offset = percent * 100
                node.style.width = `${offset}%`
            }
        },
        [time]
    )
    const updateProgressBallPosition = useCallback(
        (node: HTMLDivElement) => {
            if (time >= 0 && !touch.current.isTouch) {
                const totalWidth = getBallRemainingDistanceX(node)
                const percent = getPercent()
                const offset = totalWidth * percent
                node.style.transform = `translate3d(${offset}px, -50%, 0)`
            }
        },
        [time]
    )

    // ball touch
    const progressTouchStart = useCallback((e: any) => {
        e.preventDefault()
        touch.current.startX = e.touches[0].pageX
        touch.current.isTouch = true
        touch.current.ballNode =
            touch.current.ballNode ||
            getSelector('.normal-player-progress-ball')
        touch.current.progressPercentNode =
            touch.current.progressPercentNode ||
            getSelector('.normal-player-progress-percent')
        touch.current.left = touch.current.progressPercentNode.clientWidth
    }, [])

    const progressTouchMove = useCallback((e: any) => {
        if (!touch.current.isTouch) return
        e.preventDefault()
        const distanceX = e.touches[0].pageX - touch.current.startX
        const offsetX = Math.min(
            getBallRemainingDistanceX(touch.current.ballNode!),
            Math.max(0, touch.current.left + distanceX)
        )
        touch.current.ballNode!.style.transform = `translate3d(${offsetX}px, -50%, 0)`
        touch.current.progressPercentNode!.style.width = `${offsetX}px`
    }, [])

    // 待添加，当歌曲暂停的时候，拖动进度条之后，也应该是暂停的(待处理)
    const progressTouchEnd = useCallback(
        (e: any) => {
            e.preventDefault()
            touch.current.isTouch = false
            setAudioCurrentTime(
                touch.current.progressPercentNode!.clientWidth,
                getBallRemainingDistanceX(touch.current.ballNode!)
            )
            if (!playing) {
                updatePlayingState(!playing)
            }
        },
        [playing]
    )

    // 设置专辑图片状态
    const setRecordRef = useCallback(
        (node: HTMLDivElement) => {
            if (node !== null) {
                const state = fullScreen && playing ? 'running' : 'paused'
                setAnimationPlayState(node, state)
            }
        },
        [fullScreen, playing]
    )

    // 控制播放
    const miniPlayerControlsPlay = useCallback(
        (audioRef: Ref<HTMLAudioElement>) => async (
            e: React.SyntheticEvent
        ) => {
            e.stopPropagation()
            if (!currentSong || !audioRef!.current!.src) return
            updatePlayingState(!playing)
            setSongFade(audioRef!.current!)
        },
        [playing, currentSong]
    )

    const startPlay = useCallback(
        (audioRef: Ref<HTMLAudioElement>) => () => {
            const song = new Song(audioRef!.current!)
            audioRef!.current!.play()
            song.songFadeInPlay()
        },
        [currentSong]
    )

    const setSongSeeked = useCallback(
        (e: any) => {
            // 这里需要使用currentTarget, 不能使用target
            const target = e.currentTarget as HTMLDivElement
            const { left, width } = target.getBoundingClientRect()
            setAudioCurrentTime(e.pageX - left, width)
            if (!playing) {
                updatePlayingState(!playing)
            }
        },
        [playing]
    )

    const setPlayMode = useCallback(() => {
        const mode = (playMode + 1) % 3
        mode === PlayMode.singleCycle
            ? (audioRef!.current!.loop = true)
            : (audioRef!.current!.loop = false)
        if (mode === PlayMode.randomPlay) {
            const list = shuffle(sequenceList)
            const index = findIndex(list, sequenceList[currentIndex])
            if (index !== -1) {
                updateCurrentIndex(index)
            }
            updatePlaylist(list)
        } else {
            updateCurrentIndex(currentIndex)
            updatePlaylist(sequenceList)
        }
        updatePlayMode(mode)
        updatePlayModeIconClassName()
    }, [playMode, playlist, currentIndex, sequenceList])

    // 播放器控制按钮方法
    const setControlSong = useCallback(
        (audioRef: Ref<HTMLAudioElement>) => async (
            e: React.SyntheticEvent
        ) => {
            const target = e.target as HTMLElement
            switch (target.className) {
                case 'icon-normalPlayer_pause':
                case 'icon-normalPlayer_play':
                    const className = playing
                        ? 'icon-normalPlayer_pause'
                        : 'icon-normalPlayer_play'
                    target.className = className
                    await setSongFade(audioRef!.current!)
                    updatePlayingState(!playing)
                    break
                case 'icon-player-prevSong':
                    updatePrevOrNextSong('prev')
                    break
                case 'icon-player-nextSong':
                    updatePrevOrNextSong('next')
                    break
            }
        },
        [playing, currentIndex]
    )

    // 歌曲结束的时候应该下一曲
    const songEnd = useCallback(() => updatePrevOrNextSong('next'), [
        currentIndex,
    ])

    useEffect(() => {
        if (fullScreen) {
            const iconPlay = getSelector('.icon-normalPlayer_pause')
            const className = playing
                ? 'icon-normalPlayer_play'
                : 'icon-normalPlayer_pause'
            if (iconPlay !== null) {
                iconPlay.className = className
            }
        }
        // 当前歌曲链接地址无效时, 自动下一曲
        if (currentSong && !currentSong.url) {
            setTimeout(() => {
                songEnd()
            }, 3000)
        }
    }, [fullScreen, playing, miniPlayerHeight, currentSong])

    return (
        <div className={'player-container'}>
            <Transition
                in={fullScreen && !!currentSong}
                timeout={DURATION}
                appear={true}
                unmountOnExit={true}
            >
                {(state: keyof typeof pageTransitionStyle) => (
                    <div
                        className={'normal-player'}
                        style={{
                            ...pageDefaultStyle,
                            ...pageTransitionStyle[state],
                        }}
                    >
                        <div
                            className={'background-virtualization'}
                            style={{
                                backgroundImage: `url(${
                                    currentSong!.al.picUrl
                                })`,
                            }}
                        />
                        <div className={'normal-player-header'}>
                            <div className={'normal-player-header-left'}>
                                <i
                                    className={'icon-back'}
                                    onClick={setFullScreen}
                                />
                                <div className={'normal-player-song-details'}>
                                    <Marquee
                                        spaceRight={100}
                                        style={{ marginBottom: '4px' }}
                                        nodeKey={currentSong.id}
                                    >
                                        <span className={'normal-player-song'}>
                                            {currentSong!.name}
                                        </span>
                                    </Marquee>
                                    <span className={'normal-player-singer'}>
                                        {currentSong!.ar[0].name + '>'}{' '}
                                    </span>
                                </div>
                            </div>
                            <div className={'normal-player-header-right'}>
                                <i className={'icon-share'} />
                            </div>
                        </div>
                        <div className={'singing-arm-container '}>
                            <div className={'singing-arm-content'} />
                        </div>
                        <div
                            className={' record-container keyframes-rotate'}
                            ref={setRecordRef}
                        >
                            <div className={'record-negative'} />
                            <div className={'record-negativeHighlight'} />
                            <div className={'record-songPicture-container'}>
                                <div className={'record-songPicture-content'}>
                                    <img
                                        src={`${currentSong!.al.picUrl}`}
                                        alt={'lion'}
                                        className={'record-songPicture'}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={'normal-player-bottom-container'}>
                            <div className={'normal-player-bottom-top'}>
                                {createIcons(icons)}
                            </div>
                            <div className={'normal-player-progress'}>
                                <div className={'normal-player-startTime'}>
                                    {formatTime(time)}
                                </div>
                                <div
                                    className={
                                        'normal-player-progress-background'
                                    }
                                    onClick={setSongSeeked}
                                >
                                    <div
                                        className={
                                            'normal-player-progress-percent'
                                        }
                                        ref={setProgressPercentRef}
                                    />
                                    <div
                                        className={
                                            'normal-player-progress-ball keyframes-boxShadow'
                                        }
                                        ref={setProgressBallRef}
                                        onTouchStart={progressTouchStart}
                                        onTouchMove={progressTouchMove}
                                        onTouchEnd={progressTouchEnd}
                                    />
                                </div>
                                <div className={'normal-player-endTime'}>
                                    {formatTime(audioRef!.current!.duration)}
                                </div>
                            </div>
                            <div
                                className={'control-songs-container'}
                                onClick={setControlSong(audioRef)}
                            >
                                <i
                                    className={`${playModeIconClassName}`}
                                    onClick={setPlayMode}
                                />
                                {createIcons(controlsIcons.current)}
                            </div>
                        </div>
                    </div>
                )}
            </Transition>
            <Transition
                in={!!currentSong}
                timeout={DURATION}
                unmountOnExit={true}
                appear={true}
            >
                {(state: keyof typeof transitionStyle) => {
                    const {
                        defaultStyle,
                        transitionStyle,
                    } = miniPlayerDefaultStyle(`${miniPlayerHeight}px`, 0)
                    return (
                        <div
                            className={'mini-player'}
                            onClick={setFullScreen}
                            style={{
                                ...defaultStyle,
                                ...transitionStyle[state],
                            }}
                            ref={miniPlayerRef}
                        >
                            <div className={'mini-player-songs-details'}>
                                <div className={'mini-player-image-container'}>
                                    <img
                                        className={'mini-player-image'}
                                        src={`${currentSong!.al.picUrl}`}
                                    />
                                </div>
                                <div className={'mini-player-songs-info'}>
                                    <span className={'mini-player-songName'}>
                                        {currentSong!.name}
                                    </span>
                                    {currentSong?.lyric?.length > 0 ? (
                                        <div className={'mini-player-lyrics'}>
                                            <span
                                                className={'lyric'}
                                                ref={lyricRef}
                                            >
                                                {lyric}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className={'mini-player-lyrics'}>
                                            {currentSong!.ar[0].name}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className={'mini-player-controls-icon'}>
                                <ProgressRing
                                    percent={percent as number}
                                    miniPlayerControlsPlay={miniPlayerControlsPlay(
                                        audioRef
                                    )}
                                >
                                    <i className={`${updatePlayIcon}`} />
                                </ProgressRing>
                                <i className={'icon-miniPlayer_playlist'} />
                            </div>
                        </div>
                    )
                }}
            </Transition>
            <audio
                ref={audioRef}
                src={`${currentSong ? currentSong!.url : null}`}
                onCanPlay={startPlay(audioRef)}
                onTimeUpdate={timeUpdate}
                onEnded={songEnd}
            >
                Your browser does not support the <code>audio</code> element.
            </audio>
        </div>
    )
}
