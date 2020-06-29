import { connect } from 'react-redux'
import Login from 'components/Login'
import { Dispatch } from '../index'
import { getUserInfo, setUserRegisterState } from 'actions/user'
import { RootState } from '../reducers'
import { NetworkStatus, setNetworkStatus } from '../actions/network'

export type UserState = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps> & { [PropName: string]: any }
const mapStateToProps = (state: RootState) => ({
    userRegisterState: state.userRegisterState,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
    getUser: (userId: number) => {
        dispatch(getUserInfo(userId) as any)
    },
    updateRegisterStatus: (status: boolean) => {
        dispatch(setUserRegisterState(status))
    },
    updateNetworkStatus: (status: NetworkStatus) => {
        dispatch(setNetworkStatus(status))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
