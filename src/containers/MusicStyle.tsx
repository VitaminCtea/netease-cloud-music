import { connect, batch } from 'react-redux'
import { Dispatch } from '../index'
import { setPlaying, updatePlayInfo, setSequenceList } from 'actions/player'
import MusicStyle from 'components/found/MusicStyle'
import { getCurrentSong } from 'actions/player'

export type PlayerProps = ReturnType<
    typeof mapDispatchToProps
>['updatePlayState']

const mapDispatchToProps = (dispatch: Dispatch) => ({
    updatePlayState: (playlist: any[], index: number) => {
        batch(() => {
            dispatch(updatePlayInfo(playlist, index) as any)
            dispatch(setSequenceList(playlist))
            dispatch(setPlaying(true))
            dispatch(getCurrentSong() as any)
        })
    },
})

export default connect(null, mapDispatchToProps)(MusicStyle)
