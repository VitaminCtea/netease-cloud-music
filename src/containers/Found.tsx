import React from 'react'
import { connect } from 'react-redux'
import { RootState } from '../reducers'
import Found from 'components/found'

const mapStateToProps = (state: RootState) => ({
    isCurrentSong: !!state.currentSong,
})

export default connect(mapStateToProps, null)(Found)
