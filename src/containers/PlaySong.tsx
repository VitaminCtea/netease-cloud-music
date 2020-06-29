import React from 'react'
import { batch } from 'react-redux'
import { Dispatch } from '../index'
import {
    getCurrentSong,
    setFullScreen,
    setPlaying,
    setSequenceList,
    updatePlayInfo,
} from 'actions/player'

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

export { mapDispatchToProps }
