import { connect, batch } from 'react-redux'
import { RootState } from 'reducers/index'
import {
    getCurrentSong,
    setCurrentIndex,
    setFullScreen,
    setMode,
    setPlaying,
    setPlaylist,
    updatePlayModeIconClassName,
} from 'actions/player'
import { Dispatch } from '../index'
import Player from 'components/Player'

export type PlayerProps = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>

const mapStateToProps = (state: RootState) => ({
    fullScreen: state.fullScreen,
    playing: state.playing,
    currentSong: state.currentSong,
    currentIndex: state.currentIndex,
    playlist: state.playlist,
    playMode: state.playMode,
    sequenceList: state.sequenceList,
    playModeIconClassName: state.playModeIconClassName,
    favoritePlaylist: state.loginStatusCode === 200 && state.favoriteList,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
    updateFullScreenState: (isFullScreen: boolean) => {
        dispatch(setFullScreen(isFullScreen))
    },
    updatePlayingState: (isPlaying: boolean) => {
        dispatch(setPlaying(isPlaying))
    },
    updateSong: (index: number) => {
        batch(() => {
            dispatch(setCurrentIndex(index))
            dispatch(getCurrentSong() as any)
        })
    },
    updatePlayMode: (playMode: number) => {
        dispatch(setMode(playMode))
    },
    updatePlayModeIconClassName: () => {
        dispatch(updatePlayModeIconClassName() as any)
    },
    updatePlaylist: (playlist: any[]) => {
        dispatch(setPlaylist(playlist))
    },
    updateCurrentIndex: (index: number) => {
        dispatch(setCurrentIndex(index))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(Player)
