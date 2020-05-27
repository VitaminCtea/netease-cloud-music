import { connect } from 'react-redux'
import Login from 'components/Login'
import { Dispatch } from '../index'
import { getUserInfo, setUserRegisterState } from '../actions/user'
import { RootState } from '../reducers'

export type UserState = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps> & { [PropName: string]: any }
const mapStateToProps = (state: RootState) => ({
    userRegisterState: state.userRegisterState,
    loginStatusCode: state.loginStatusCode,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
    getUser: (phone: string, password: string) => {
        dispatch(getUserInfo(phone, password) as any)
    },
    updateRegisterStatus: () => {
        dispatch(setUserRegisterState(true))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
