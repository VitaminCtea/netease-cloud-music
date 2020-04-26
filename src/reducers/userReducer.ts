import { combineReducers } from 'redux'
import * as types from 'actions/userAction'

type LoginAction = {
    type: keyof typeof types
    isLogin: boolean
    isRegister: boolean
    isFetching: boolean
    userInfo: object | null
    userPlaylist: any[] | null
}

function setLoginState(state: boolean = false, action: LoginAction) {
    if (action.type === types.SET_LOGIN) return action.isLogin
    return state
}

function setRegisterState(state: boolean = false, action: LoginAction) {
    if (action.type === types.SET_REGISTER) return action.isRegister
    return state
}

function setUserInfo(state: null = null, action: LoginAction) {
    if (action.type === types.SET_USER_INFO) return action.userInfo
    return state
}

function setUserPlaylist(state: null = null, action: LoginAction) {
    if (action.type === types.SET_USER_PLAYLIST) return action.userPlaylist
    return state
}

function setIsFetchingState(state: boolean = false, action: LoginAction) {
    if (action.type === types.SET_FETCHING_STATE) return action.isFetching
    return state
}

export default combineReducers({
    isLogin: setLoginState,
    isRegister: setRegisterState,
    isFetching: setIsFetchingState,
    userInfo: setUserInfo,
    userPlaylist: setUserPlaylist
})