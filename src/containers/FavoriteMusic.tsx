import { connect } from 'react-redux'
import { RootState } from '../reducers'
import FavoriteMusic from 'components/User/FavoriteMusic'

export type FavoriteMapState = ReturnType<typeof mapStateToProps>
const mapStateToProps = (state: RootState) => ({
    playlist: state.userPlaylist,
})

export default connect(mapStateToProps, null)(FavoriteMusic)
