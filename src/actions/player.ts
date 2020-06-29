import * as constants from 'constants/index'
import { Dispatch, store } from '../index'
import axios from 'axios'
import { parsingLyrics } from 'helper/index'
import { createAction } from './createAction'
import { RootState } from '../reducers'
import { NetworkStatus, setNetworkStatus } from './network'

export const playModeIconClassNames = [
    'icon-listCirculation',
    'icon-singleCycle',
    'icon-randomPlay',
]

export enum PlayMode {
    listCirculation,
    singleCycle,
    randomPlay,
}

export type ThunkDispatch = (
    ...args: any[]
) => (dispatch: Dispatch, getState: typeof store.getState) => void

export const setFullScreen = createAction(
    constants.SET_FULL_SCREEN,
    'fullScreen'
)

export const setPlaying = createAction(constants.SET_PLAYING, 'playing')

export const setPlaylist = createAction(constants.SET_PLAYLIST, 'playlist')

export const setSequenceList = createAction(
    constants.SET_SEQUENCE_LIST,
    'playlist'
)

export const setCurrentIndex = createAction(
    constants.SET_CURRENT_INDEX,
    'currentIndex'
)

export const setCurrentSong = createAction(
    constants.SET_CURRENT_SONG,
    'currentSong'
)

export const setMode = createAction(constants.SET_PLAY_MODE, 'playMode')

export const setPlayIconClassName = createAction(
    constants.SET_PLAY_MODE_ICON,
    'iconClassName'
)

export const getCurrentSong: ThunkDispatch = (
    isFavoriteMusic: boolean = false
) => async (dispatch, getState) => {
    const state = getState()
    const song = state.playlist[state.currentIndex]

    const getLyric = () => axios.get(`/api/lyric?id=${song.id}`)
    const getSongUrl = () => axios.get(`/api/song/url?id=${song.id}`)

    axios
        .all([getLyric(), getSongUrl()])
        .then(
            axios.spread((lyric, songUrl) => {
                const lyricResult = lyric.data
                const songUrlResult = songUrl.data.data[0].url

                let lyrics
                if (lyricResult.nolyric) {
                    lyrics = []
                } else {
                    lyrics = lyricResult.nolyric
                        ? ''
                        : parsingLyrics(lyricResult?.lrc?.lyric)
                }

                const song = state.playlist[state.currentIndex]
                const favoriteList = state.favoriteList

                let index
                if (isFavoriteMusic) index = 0
                else
                    index = favoriteList.findIndex(
                        (item: typeof song) => item.id === song.id
                    )

                dispatch(
                    setCurrentSong({
                        ...state.playlist[state.currentIndex],
                        lyric: lyrics,
                        url: songUrlResult,
                        hasUrl: !!songUrlResult,
                        isFavoriteMusic: index > -1,
                    })
                )
            })
        )
        .catch((e) => {
            dispatch(setNetworkStatus(NetworkStatus.error))
        })
}

export type List = { [PropName: string]: any }

export const findIndex = <T extends List>(list: T[], current: T) =>
    list.findIndex((item) => item.id === current.id)

const updateCurrentSong = (
    state: RootState,
    dispatch: Dispatch,
    playlist: List[],
    index: number
) => {
    if (state.playMode === PlayMode.randomPlay && state.playlist.length > 0) {
        const sequenceIndex = findIndex(
            state.playlist,
            state.sequenceList[index]
        )
        dispatch(setCurrentIndex(sequenceIndex))
        dispatch(setPlaylist(state.playlist))
        return
    }
    dispatch(setCurrentIndex(index))
    dispatch(setPlaylist(playlist))
}

export const insertSong: ThunkDispatch = (
    songs: List[],
    playlist: List[],
    index: number
) => (dispatch, getState) => {
    const state = getState()
    if (!state.currentSong) {
        updateCurrentSong(state, dispatch, playlist, index)
    } else {
        if (state.currentIndex === index) return
        let currentIndex
        if (state.currentIndex > index) {
            currentIndex = state.currentIndex
        } else if (state.currentIndex < index) {
            currentIndex = state.currentIndex + 1
        }
        const list: typeof state.playlist = [].concat(state.playlist)
        songs.forEach((item: typeof state.playlist[0]) => {
            const index = list.findIndex(
                (listItem: typeof list[0]) => listItem.id === item.id
            )
            list.splice(index, 1)
        })
        list.splice(currentIndex, 0, ...songs)
        dispatch(setPlaylist(list))
        dispatch(setCurrentIndex(currentIndex))
    }
}

// 点击播放列表Action
export const updatePlayInfo: ThunkDispatch = (
    playlist: any[],
    index: number
) => (dispatch, getState) => {
    const state = getState()
    updateCurrentSong(state, dispatch, playlist, index)
}

export const updatePlayModeIconClassName: ThunkDispatch = () => (
    dispatch,
    getState
) => {
    const state = getState()
    dispatch(setPlayIconClassName(playModeIconClassNames[state.playMode]))
}
