import { connect } from 'react-redux'
import { RootState } from 'reducers/index'
import Found from 'components/found'

const mapStateToProps = (state: RootState) => ({
    isCurrentSong: !!state.currentSong,
})

export default connect(mapStateToProps, null)(Found)
