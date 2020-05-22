import { connect } from 'react-redux'
import Login from 'components/Login'
import { Dispatch } from '../index'
import { getUserInfo } from '../actions/user'
import { RootState } from '../reducers'

export type UserState = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps> & { [PropName: string]: any }
const mapStateToProps = (state: RootState) => ({
    userRegisterState: state.userRegisterState,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
    onIncrement: (phone: string, password: string) => {
        dispatch(getUserInfo(phone, password) as any)
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
