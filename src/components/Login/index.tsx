import React, { useState, useCallback, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import Tip, { MessageType } from 'common/Tip'
import { ValidateForm } from 'common/ts/validateForm'
import axios from 'axios'
import './index.sass'
import { UserState } from 'containers/Login'

type Props = UserState
export default function Login({
    onIncrement,
    userRegisterState,
    setLoginStatus,
}: Props) {
    const history = useHistory()
    const [enabled, setEnabled] = useState(false)
    const [message, setMessage] = useState('请您先登录')
    const [type, setType] = useState<MessageType>('warning')
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
                setMessage('当前手机号码没有注册过，请您先注册!')
                buttonRef!.current!.innerHTML = '立即注册'
                return
            }
        }
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
                    setMessage(validateValue())
                    setEnabled(!enabled)
                    setType('error')
                    return false
                }
                buttonRef!.current!.disabled = true
                buttonRef!.current!.style.color = '#ccc'
                const form = loginFormRef!.current!
                const phone = form.userPhone.value
                const password = form.userPassword.value
                onIncrement(phone, password)
                history.push('/')
            }
        },
        [enabled]
    )
    return (
        <div className={'login-container'}>
            <Tip message={message} enabled={enabled} type={type} />
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
        </div>
    )
}
