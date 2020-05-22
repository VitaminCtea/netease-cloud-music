import * as constants from 'constants/index'
import { createReducer } from './createReducer'

export const userInfo = createReducer(null, constants.SET_USER_INFO)

export const userPlaylistCountInfo = createReducer(
    null,
    constants.SET_USER_PLAYLIST_COUNT
)

export const userPlaylist = createReducer([], constants.SET_USER_PLAYLIST)

export const userRegisterState = createReducer(
    false,
    constants.SET_USER_REGISTER_STATE
)

export const userLoginState = createReducer(
    false,
    constants.SET_USER_LOGIN_STATE
)
