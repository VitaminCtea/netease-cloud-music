import * as constants from "constants/index";
import { Dispatch, store } from "../index";
import axios from "axios";
import { parsingLyrics } from "helper/index";
import { createAction } from "./createAction";

export const playModeIconClassNames = [
  "icon-player-listCirculation",
  "icon-player-singleCirculation",
  "icon-player-randomPlay",
];

export enum PlayMode {
  listCirculation,
  singleCycle,
  randomPlay,
}

type ThunkDispatch = (
  ...args: any[]
) => (dispatch: Dispatch, getState: typeof store.getState) => void;

export const setFullScreen = createAction(
  constants.SET_FULL_SCREEN,
  "fullScreen"
);

export const setPlaying = createAction(constants.SET_PLAYING, "playing");

export const setPlaylist = createAction(constants.SET_PLAYLIST, "playlist");

export const setSequenceList = createAction(
  constants.SET_SEQUENCE_LIST,
  "playlist"
);

export const setCurrentIndex = createAction(
  constants.SET_CURRENT_INDEX,
  "currentIndex"
);

export const setCurrentSong = createAction(
  constants.SET_CURRENT_SONG,
  "currentSong"
);

export const setMode = createAction(constants.SET_PLAY_MODE, "playMode");

export const setPlayIconClassName = createAction(
  constants.SET_PLAY_MODE_ICON,
  "iconClassName"
);

export const getCurrentSong: ThunkDispatch = () => async (
  dispatch,
  getState
) => {
  const state = getState();
  dispatch(setCurrentSong(state.playlist[state.currentIndex]));
  const song = state.playlist[state.currentIndex];
  const res = await axios.get(`/api/lyric?id=${song.id}`);
  const result = res.data;
  if (result.nolyric) {
    dispatch(
      setCurrentSong({ ...state.playlist[state.currentIndex], lyric: [] })
    );
  } else {
    const lyric = {
      lyric: result.nolyric ? "" : parsingLyrics(result?.lrc?.lyric),
    };
    dispatch(
      setCurrentSong({ ...state.playlist[state.currentIndex], ...lyric })
    );
  }
};

export type List = { [PropName: string]: any };

export const findIndex = <T extends List>(list: T[], current: T) =>
  list.findIndex((item) => item.id === current.id);

// 点击播放列表Action
export const updatePlayInfo: ThunkDispatch = (
  playlist: any[],
  index: number
) => (dispatch, getState) => {
  const state = getState();
  if (state.playMode === PlayMode.randomPlay && state.playlist.length > 0) {
    const sequenceIndex = findIndex(state.playlist, state.sequenceList[index]);
    dispatch(setCurrentIndex(sequenceIndex));
    dispatch(setPlaylist(state.playlist));
  } else {
    dispatch(setPlaylist(playlist));
    dispatch(setCurrentIndex(index));
  }
};

export const updatePlayModeIconClassName: ThunkDispatch = () => (
  dispatch,
  getState
) => {
  const state = getState();
  dispatch(setPlayIconClassName(playModeIconClassNames[state.playMode]));
};
