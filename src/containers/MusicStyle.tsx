import { connect } from 'react-redux'
import MusicStyle from 'components/found/MusicStyle'
import { mapDispatchToProps } from './PlaySong'

export type PlayerProps = ReturnType<
    typeof mapDispatchToProps
>['updatePlayState']

export default connect(null, mapDispatchToProps)(MusicStyle)
