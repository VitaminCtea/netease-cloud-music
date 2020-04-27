import { request } from 'helper/axios'

export const SET_LOGIN = 'SET_LOGIN'
export const SET_REGISTER = 'SET_REGISTER'
export const SET_USER_PLAYLIST = 'SET_USER_PLAYLIST'
export const SET_USER_INFO = 'SET_USER_INFO'
export const SET_FETCHING_STATE = 'SET_FETCHING_STATE'

export const requestLogin = (isLogin: boolean) => ({ type: SET_LOGIN, isLogin })
export const requestRegister = (isRegister: boolean) => ({ type: SET_REGISTER, isRegister })
export const requestUserPlaylist = (userPlaylist: any[]) => ({ type: SET_USER_PLAYLIST, userPlaylist })
export const requestUserInfo = (userInfo: object) => ({ type: SET_USER_INFO, userInfo })
export const isFetching = (isFetching: boolean) => ({ type: SET_FETCHING_STATE, isFetching })
export function fetchPostsIfNeeded(key: string, phone: string, password: string) {
    return (dispatch: any, getState: any) => {
        if (shouldFetchPosts(getState(), key)) {
            return dispatch(fetchUserData(phone, password))
        }
    }
}

function fetchUserData(phone: string, password: string) {
    return function (dispatch: (...args: any) => any) {
        dispatch(isFetching(true))
        return request(`/login/cellphone?phone=${ phone }&password=${ password }`).then((data: any) => {
            if (data.code === 200) {
                dispatch(requestLogin(true))
                dispatch(requestUserInfo(data.profile))
                dispatch(isFetching(false))
            }
        }).catch(error => {
            console.log(error)
        })
    }
}

function shouldFetchPosts(state: any, key: string) {
    const posts = state[key]
    if (!posts) {
        return true
    } else if (posts.isFetching) {
        return false
    } else {
        return posts.didInvalidate
    }
}
