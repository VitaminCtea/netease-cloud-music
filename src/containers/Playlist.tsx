import { connect, batch } from 'react-redux'
import { RootState } from '../reducers'
import Playlist from 'common/Playlist'
import { Dispatch } from '../index'
import {
    getCurrentSong,
    insertSong,
    setFullScreen,
    setPlaying,
    setSequenceList,
    updatePlayInfo,
} from 'actions/player'

const mapStateToProps = (state: RootState) => ({
    playlist:
        state.loginStatusCode === 200 &&
        state.userPlaylist.user.favoritePlaylist,
    currentSong: state.currentSong,
    userLoginState: state.userLoginState,
})

const batchDispatch = (dispatch: Dispatch, playlist: any[]) => {
    dispatch(setSequenceList(playlist))
    dispatch(setPlaying(true))
    dispatch(getCurrentSong(true) as any)
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
    updatePlayState: (playlist: any[], index: number) => {
        batch(() => {
            dispatch(updatePlayInfo(playlist, index) as any)
            batchDispatch(dispatch, playlist)
        })
    },
    insertSongs: (songs: any[], playlist: any[], index: number) => {
        batch(() => {
            dispatch(insertSong(songs, playlist, index) as any)
            batchDispatch(dispatch, playlist)
            dispatch(setFullScreen(true))
        })
    },
})
export default connect(mapStateToProps, mapDispatchToProps)(Playlist)
