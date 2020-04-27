import { combineReducers } from 'redux'
import * as types from 'actions/userAction'

type UserAction = {
    type: string
    isLogin: boolean
    isRegister: boolean
    isFetching: boolean
    userInfo: object | null
    userPlaylist: any[] | null
}

type Types = keyof typeof types
function setUserConfig<T>(val: T) {
    return function (state: T = val, action: UserAction) {
        let key: Types
        for (key in types) {
            if (typeof types[key] === 'function') continue
            if (action.type === types[key]) {
                return action[Object.getOwnPropertyNames(action)[1] as keyof UserAction]
            }
        }
        return state
    }
}

// function setLoginState(state: boolean = false, action: LoginAction) {
//     if (action.type === types.SET_LOGIN) return action.isLogin
//     return state
// }
//
// function setRegisterState(state: boolean = false, action: LoginAction) {
//     if (action.type === types.SET_REGISTER) return action.isRegister
//     return state
// }
//
// function setUserInfo(state: null = null, action: LoginAction) {
//     if (action.type === types.SET_USER_INFO) return action.userInfo
//     return state
// }
//
// function setUserPlaylist(state: null = null, action: LoginAction) {
//     if (action.type === types.SET_USER_PLAYLIST) return action.userPlaylist
//     return state
// }
//
// function setIsFetchingState(state: boolean = false, action: LoginAction) {
//     if (action.type === types.SET_FETCHING_STATE) return action.isFetching
//     return state
// }

export default combineReducers({
    isLogin: setUserConfig(false),
    isRegister: setUserConfig(false),
    isFetching: setUserConfig(false),
    userInfo: setUserConfig(null),
    userPlaylist: setUserConfig(null)
})