import * as constants from 'constants/index'
import { createReducer } from './createReducer'

const getLocalVal = (name: string, defaultVal: any) => {
    const val = localStorage.getItem(name)
    return val ? JSON.parse(val) : defaultVal
}

const hasUser = (name: string) => !!localStorage.getItem(name)

export const userInfo = createReducer(
    getLocalVal('userInfo', null),
    constants.SET_USER_INFO
)

export const userPlaylistCountInfo = createReducer(
    getLocalVal('userPlaylistInfo', null),
    constants.SET_USER_PLAYLIST_COUNT
)

export const userPlaylist = createReducer(
    getLocalVal('userPlaylist', []),
    constants.SET_USER_PLAYLIST
)

export const userRegisterState = createReducer(
    hasUser('userInfo'),
    constants.SET_USER_REGISTER_STATE
)

export const userLoginState = createReducer(
    hasUser('userInfo'),
    constants.SET_USER_LOGIN_STATE
)

export const loginStatusCode = createReducer(
    hasUser('userInfo') ? 200 : 0,
    constants.SET_LOGIN_STATUS_CODE
)
