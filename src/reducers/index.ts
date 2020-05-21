import { combineReducers } from "redux";
import {
  fullScreen,
  playing,
  playlist,
  sequenceList,
  currentIndex,
  currentSong,
  playMode,
  playModeIconClassName,
} from "./player";
import {
  userInfo,
  userPlaylist,
  userPlaylistCountInfo,
  userLoginState,
  userRegisterState,
} from "./user";

export type RootState = ReturnType<typeof rootReducer>;
const rootReducer = combineReducers({
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
});

export default rootReducer;
