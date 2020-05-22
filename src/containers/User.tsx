import { connect } from 'react-redux'
import User from 'components/User'
import { RootState } from '../reducers'

const mapStateToProps = (state: RootState) => ({
    userInfo: state.userInfo,
    userPlaylistCountInfo: state.userPlaylistCountInfo,
    userPlaylist: state.userPlaylist,
})

export default connect(mapStateToProps, null)(User)
