import React, { useCallback, useRef } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import Tip from 'common/Tip'
import { ValidateForm } from 'common/ts/validateForm'
import { UserState } from 'containers/Login'
import { useTip } from 'hooks/showTip'
import './index.sass'

type Props = UserState
export default function Login({
    getUser,
    userRegisterState,
    setLoginStatus,
    loginStatusCode,
    updateRegisterStatus,
}: Props) {
    const history = useHistory()
    const [state, dispatch] = useTip({
        message: '请您先登录',
        enabled: false,
        type: 'warning',
    })
    const buttonRef: React.RefObject<HTMLButtonElement> = useRef(null)
    const loginFormRef: React.RefObject<HTMLFormElement> = useRef(null)
    const userNonRegister = useRef<any>(false)
    const userPhoneRef: React.RefObject<HTMLInputElement> = useRef(null)

    const validateValue = useCallback(() => {
        if (loginFormRef.current) {
            const form = loginFormRef!.current!
            const validator = new ValidateForm()
            validator.addRule(form.userPhone, [
                {
                    strategy: 'isNonEmpty',
                    errorMsg: '手机号码不能为空',
                },
                {
                    strategy: 'minLength:11',
                    errorMsg: '手机号码不能少于11位',
                },
                {
                    strategy: 'isMobile',
                    errorMsg: '手机号码格式不正确',
                },
            ])
            validator.addRule(form.userPassword, [
                {
                    strategy: 'isNonEmpty',
                    errorMsg: '密码不能为空',
                },
                {
                    strategy: 'minLength:6',
                    errorMsg: '密码不能小于6位',
                },
            ])

            const errorMsg = validator.check()
            return errorMsg
        }
    }, [])

    const getUserRegisterInfo = useCallback(async (e: React.SyntheticEvent) => {
        const target = e.target as HTMLInputElement
        const val = target.value
        if (val && /^1[358][0-9]{9}$/.test(val)) {
            const info = await axios.get(
                `/api/cellphone/existence/check?phone=${val}`
            )
            const data = info.data
            if (data.exist === -1) {
                userNonRegister!.current! = true
                dispatch({
                    type: 'warning',
                    value: '当前手机号码没有注册过，请您先注册!',
                })
                buttonRef!.current!.innerHTML = '立即注册'
                return
            }
        }
        updateRegisterStatus()
        buttonRef!.current!.innerHTML = '立即登录'
    }, [])

    const clickLogin = useCallback(
        (e: React.SyntheticEvent) => {
            e.preventDefault()
            if (buttonRef.current) {
                if (!userRegisterState && userNonRegister!.current!) {
                    history.push({
                        pathname: '/register',
                        state: {
                            phone: userPhoneRef!.current!.value,
                        },
                    })
                    return
                }
                if (validateValue()) {
                    dispatch({
                        type: 'error',
                        value: validateValue(),
                    })
                    return false
                }
                const form = loginFormRef!.current!
                const phone = form.userPhone.value
                const password = form.userPassword.value
                getUser(phone, password)
                if (loginStatusCode > 200) {
                    dispatch({
                        type: 'error',
                        value: '密码错误, 请重新输入!',
                    })
                    return false
                }
                buttonRef!.current!.disabled = true
                buttonRef!.current!.style.color = '#ccc'
                history.push('/')
            }
        },
        [state.enabled, loginStatusCode]
    )
    return (
        <>
            <Tip {...state} />
            <div className={'login-content'}>
                <i
                    className={'icon-login-close'}
                    onClick={() => setLoginStatus(false)}
                />
                <div className={'logo'} />
                <form className={'login-form'} ref={loginFormRef}>
                    <div className={'login-phone-container'}>
                        <i className={'icon-login-phone'} />
                        <input
                            type={'text'}
                            id={'login-phone'}
                            placeholder={'请输入您的手机号码'}
                            name={'userPhone'}
                            onChange={getUserRegisterInfo}
                            ref={userPhoneRef}
                        />
                    </div>
                    <div className={'login-password-container'}>
                        <i className={'icon-login-password'} />
                        <input
                            type={'password'}
                            id={'login-password'}
                            placeholder={'请输入您的密码'}
                            name={'userPassword'}
                        />
                    </div>
                    <button
                        className={'login-button'}
                        ref={buttonRef}
                        onClick={clickLogin}
                    >
                        立即登录
                    </button>
                    <span className={'login-description'}>
                        网易云音乐给您不一样的专属音乐盛宴
                    </span>
                </form>
            </div>
        </>
    )
}
