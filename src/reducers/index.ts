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
} from './user'

export type RootState = ReturnType<typeof rootReducer>
const rootReducer = combineReducers({
    loginStatusCode,
    userRegisterState,
    userLoginState,
    userInfo,
    userPlaylist,
    userPlaylistCountInfo,
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
