import { connect, batch } from "react-redux";
import { RootState } from "reducers/index";
import {
  getCurrentSong,
  setCurrentIndex,
  setFullScreen,
  setMode,
  setPlaying,
  setPlaylist,
  updatePlayModeIconClassName,
} from "actions/player";
import { Dispatch } from "../index";
import Player from "components/Player";

export type PlayerProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

// 获取所有state下发到player里
const getState = (state: RootState) =>
  Object.entries(state).reduce(
    (result: { [PropName: string]: any }, [key, val]) => {
      result[key] = val;
      return result;
    },
    {}
  );

const mapStateToProps = (state: RootState) => getState(state);

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateFullScreenState: (isFullScreen: boolean) => {
    dispatch(setFullScreen(isFullScreen));
  },
  updatePlayingState: (isPlaying: boolean) => {
    dispatch(setPlaying(isPlaying));
  },
  updateSong: (index: number) => {
    batch(() => {
      dispatch(setCurrentIndex(index));
      dispatch(getCurrentSong() as any);
    });
  },
  updatePlayMode: (playMode: number) => {
    dispatch(setMode(playMode));
  },
  updatePlayModeIconClassName: () => {
    dispatch(updatePlayModeIconClassName() as any);
  },
  updatePlaylist: (playlist: any[]) => {
    dispatch(setPlaylist(playlist));
  },
  updateCurrentIndex: (index: number) => {
    dispatch(setCurrentIndex(index));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Player);
