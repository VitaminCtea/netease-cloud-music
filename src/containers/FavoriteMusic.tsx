import { connect } from 'react-redux'
import { RootState } from '../reducers'
import FavoriteMusic from 'components/User/FavoriteMusic'
import { mapDispatchToProps } from './PlaySong'

export type FavoriteMapState = ReturnType<typeof mapStateToProps>

const mapStateToProps = (state: RootState) => ({
    playlist: state.userPlaylist.user.favoritePlaylist
})

export default connect(mapStateToProps, mapDispatchToProps)(FavoriteMusic)
