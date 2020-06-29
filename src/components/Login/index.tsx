import React, { useCallback, useRef, useState, useEffect } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import Tip from 'common/Tip'
import { ValidateForm } from 'common/ts/validateForm'
import { UserState } from 'containers/Login'
import { useTip } from 'hooks/showTip'
import LoginLoading from 'common/loading/LoginLoading'
import { NetworkStatus } from 'actions/network'
import './index.sass'

const LOGIN_SUCCESS_CODE = 200
const TIMEOUT = 4000

enum ErrorMessage {
    phone_non_empty = '手机号码不能为空',
    phone_min_length = '手机号码不能少于11位',
    isMobile = '手机号码格式不正确',
    password_non_empty = '密码不能为空',
    password_min_length = '密码长度不能少于6位',
}

enum TipMessage {
    no_login = '请您先登录',
    no_register = '当前手机号码没有注册过，请您先注册!',
    network_error = '网络开小差啦, 请检查您的网络~~',
    Logging = '正在登录, 请稍等!',
    phone_or_password_error = '用户名或密码错误!',
    try_again = '操作太频繁, 请稍后再试!',
}

type Props = UserState
export default function Login({
    getUser,
    userRegisterState,
    updateRegisterStatus,
    updateNetworkStatus,
}: Props) {
    const history = useHistory()
    const [state, dispatch] = useTip({
        message: TipMessage.no_login,
        enabled: false,
        type: 'warning',
    })

    const [showLoading, setShowLoading] = useState(false)

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
                    errorMsg: ErrorMessage.phone_non_empty,
                },
                {
                    strategy: 'minLength:11',
                    errorMsg: ErrorMessage.phone_min_length,
                },
                {
                    strategy: 'isMobile',
                    errorMsg: ErrorMessage.isMobile,
                },
            ])
            validator.addRule(form.userPassword, [
                {
                    strategy: 'isNonEmpty',
                    errorMsg: ErrorMessage.password_non_empty,
                },
                {
                    strategy: 'minLength:6',
                    errorMsg: ErrorMessage.password_min_length,
                },
            ])

            return validator.check()
        }
    }, [])

    const getUserRegisterInfo = useCallback(async (e: React.SyntheticEvent) => {
        const target = e.target as HTMLInputElement
        const val = target.value
        if (val && val.length === 11 && /^1[358][0-9]{9}$/.test(val)) {
            const info = await axios.get(
                `/api/cellphone/existence/check?phone=${val}`
            )
            const data = info.data
            if (data.exist === -1) {
                userNonRegister!.current! = true
                updateRegisterStatus(false)
                dispatch({
                    type: 'warning',
                    value: TipMessage.no_register,
                })
                buttonRef!.current!.innerHTML = '立即注册'
                return false
            }
            updateRegisterStatus(true)
        }
        buttonRef!.current!.innerHTML = '立即登录'
    }, [])

    const goHome = useCallback(() => {
        history.push('/')
    }, [])

    const clickLogin = useCallback((e: React.SyntheticEvent) => {
        e.preventDefault()
        dispatch({
            type: 'reset',
            payload: {
                enabled: false,
            },
        })

        if (!window.navigator.onLine) {
            setShowLoading(false)
            dispatch({
                type: 'error',
                value: TipMessage.network_error,
            })
            updateNetworkStatus(NetworkStatus.error)
            return false
        } else {
            updateNetworkStatus(NetworkStatus.good)
        }

        if (buttonRef.current) {
            if (!userRegisterState && userNonRegister!.current!) {
                updateRegisterStatus(false)
                history.push({
                    pathname: '/register',
                    state: {
                        phone: userPhoneRef!.current!.value,
                    },
                })
                return false
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

            setShowLoading(true)
            axios
                .get(`/api/login/cellphone?phone=${phone}&password=${password}`)
                .then((res) => {
                    const code = res.data.code
                    if (code === LOGIN_SUCCESS_CODE) {
                        dispatch({
                            type: 'success',
                            value: TipMessage.Logging,
                        })
                        setTimeout(() => {
                            const userId = res.data.profile.userId
                            getUser(userId)
                            buttonRef!.current!.disabled = true
                            buttonRef!.current!.style.color = '#ccc'
                            history.push('/')
                        }, TIMEOUT)
                    } else {
                        setShowLoading(false)
                        dispatch({
                            type: 'error',
                            value: TipMessage.phone_or_password_error,
                        })
                    }
                })
                .catch((e) => {
                    setShowLoading(false)
                    dispatch({
                        type: 'error',
                        value: TipMessage.try_again,
                    })
                })
        }
    }, [])
    return (
        <div className={'login-container'}>
            <Tip {...state} />
            {showLoading && <LoginLoading />}
            <div className={'login-content'}>
                <i className={'icon-login-close'} onClick={goHome} />
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
        </div>
    )
}
