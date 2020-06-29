import { combineReducers } from 'redux'
import {
    fullScreen,
    playing,
    playlist,
    sequenceList,
    currentIndex,
    currentSong,
    playMode,
    playModeIconClassName,
} from './player'
import {
    userInfo,
    userPlaylist,
    userPlaylistCountInfo,
    userLoginState,
    userRegisterState,
    loginStatusCode,
    favoriteList,
} from './user'

import { networkStatus } from './network'

export type RootState = ReturnType<typeof rootReducer>
const rootReducer = combineReducers({
    networkStatus,
    loginStatusCode,
    userRegisterState,
    userLoginState,
    userInfo,
    userPlaylist,
    userPlaylistCountInfo,
    favoriteList,
    fullScreen,
    playing,
    playlist,
    sequenceList,
    currentIndex,
    currentSong,
    playMode,
    playModeIconClassName,
})

export default rootReducer
