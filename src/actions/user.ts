import axios from 'axios'
import * as constants from 'constants/index'
import { createAction } from './createAction'
import { Dispatch } from '../index'
import { Playlist } from 'constants/index'

export const setUserInfo = createAction(constants.SET_USER_INFO, 'userInfo')

export const setUserPlaylistCountInfo = createAction(
    constants.SET_USER_PLAYLIST_COUNT,
    'userPlaylistCountInfo'
)

export const setUserPlaylist = createAction(
    constants.SET_USER_PLAYLIST,
    'userPlaylist'
)

export const setUserRegisterState = createAction(
    constants.SET_USER_REGISTER_STATE,
    'userRegisterState'
)

export const setUserLoginState = createAction(
    constants.SET_USER_LOGIN_STATE,
    'userLoginState'
)

export const setLoginStatusCode = createAction(
    constants.SET_LOGIN_STATUS_CODE,
    'loginStatusCode'
)

export type UserInfoInterface = typeof getUserInfo
export const getUserInfo = (phone: string, password: string) => async (
    dispatch: Dispatch
) => {
    const result = await axios.get(
        `/api/login/cellphone?phone=${phone}&password=${password}`
    )
    if (result.data.code > 200) {
        dispatch(setLoginStatusCode(result.data.code))
        return
    }
    const userId = result.data.profile.userId

    const userInfo = await axios.get(`/api/user/detail?uid=${userId}`)
    dispatch(setUserInfo(userInfo.data))

    const playlistInfo = await axios.get('/api/user/subcount')
    dispatch(setUserPlaylistCountInfo(playlistInfo.data))

    const userPlaylist = await axios.get(`/api/user/playlist?uid=${userId}`)
    const playlist = userPlaylist.data.playlist

    const list: Playlist = {
        user: {
            favoritePlaylist: {},
            createPlaylist: [],
        },
        collectionPlayList: [],
    }

    playlist.forEach((item: typeof playlist[0], index: number) => {
        if (index === 0) {
            list.user.favoritePlaylist = item
            return
        }
        if (userId !== item.creator.userId) {
            list.collectionPlayList.push(item)
        } else {
            list.user.createPlaylist.push(item)
        }
    })

    dispatch(setUserPlaylist(list))

    localStorage.setItem('userInfo', JSON.stringify(userInfo.data))
    localStorage.setItem('userPlaylistInfo', JSON.stringify(playlistInfo.data))
    localStorage.setItem('userPlaylist', JSON.stringify(list))

    dispatch(setUserRegisterState(true))
    dispatch(setUserLoginState(true))
    dispatch(setLoginStatusCode(200))
}
