import { connect } from 'react-redux'
import User from 'components/User'
import { RootState } from '../reducers'

export type MapStateToProps = ReturnType<typeof mapStateToProps>
const mapStateToProps = (state: RootState) => ({
    userInfo: state.userInfo,
    userPlaylistCountInfo: state.userPlaylistCountInfo,
    userPlaylist: state.userPlaylist,
    userRegisterState: state.userRegisterState,
    userLoginState: state.userLoginState,
})

export default connect(mapStateToProps, null)(User)
