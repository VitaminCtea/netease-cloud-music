import { connect } from 'react-redux'
import NickName from 'components/Register/NickName'
import { Dispatch } from '../index'
import { setUserRegisterState } from 'actions/user'

export type NickNameProps = ReturnType<typeof mapDispatchToProps>
const mapDispatchToProps = (dispatch: Dispatch) => ({
    changeRegister: (status: boolean) => {
        dispatch(setUserRegisterState(status))
    },
})

export default connect(null, mapDispatchToProps)(NickName)
