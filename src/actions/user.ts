import axios from 'axios'
import * as constants from 'constants/index'
import { createAction } from './createAction'
import { Dispatch } from '../index'

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

export type UserInfoInterface = typeof getUserInfo
export const getUserInfo = (phone: string, password: string) => async (
    dispatch: Dispatch
) => {
    const result = await axios.get(
        `/api/login/cellphone?phone=${phone}&password=${password}`
    )
    if (result) {
        const userId = result.data.profile.userId
        const userInfo = await axios.get(`/api/user/detail?uid=${userId}`)
        dispatch(setUserInfo(userInfo.data))
        const playlistInfo = await axios.get('/api/user/subcount')
        dispatch(setUserPlaylistCountInfo(playlistInfo.data))
        const userPlaylist = await axios.get(`/api/user/playlist?uid=${userId}`)
        dispatch(setUserPlaylist(userPlaylist.data))
        dispatch(setUserRegisterState(true))
        dispatch(setUserLoginState(true))
    }
}
