import React, { useState, useCallback, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import Tip from 'common/Tip'
import { ValidateForm } from 'common/ts/validateForm'
import TransitionPage from 'common/RegisterTransition'
import NextStep from 'common/NextStep'
import { NickNameProps } from 'containers/NickName'
import { transformUrl } from 'helper/index'
import { useTip } from 'hooks/showTip'

type NickProps = {
    phone: string
    captcha: string
} & NickNameProps
export default function NickName({
    phone,
    captcha,
    changeRegister,
}: NickProps) {
    const history = useHistory()
    const [isComplete, updateState] = useState(false)
    const formRef: React.RefObject<HTMLFormElement> = useRef(null)
    const [state, dispatch] = useTip()

    const checkInputValue = useCallback((e: React.SyntheticEvent) => {
        const target = e.currentTarget as HTMLFormElement
        if (target.userPassword.value && target.userNickName.value) {
            updateState(true)
        } else {
            updateState(false)
        }
    }, [])
    const validatePassword = useCallback((form: HTMLFormElement) => {
        const validate = new ValidateForm()
        validate.addRule(form.userPassword, [
            {
                strategy: 'isNonEmpty',
                errorMsg: '密码不能为空',
            },
            {
                strategy: 'minLength:8',
                errorMsg: '密码长度不能小于8位',
            },
            {
                strategy: 'isCorrectFormat',
                errorMsg: '密码必须以字母开头(不区分大小写)',
            },
        ])
        const errorMsg = validate.check()
        return errorMsg
    }, [])

    const setRegister = useCallback(() => {
        dispatch({
            type: 'reset',
            payload: {
                enabled: false,
            },
        })
        const form = formRef!.current!
        const password = form.userPassword.value
        const nickName = form.userNickName.value
        if (password && nickName) {
            const error = validatePassword(form)
            if (error) {
                dispatch({
                    type: 'error',
                    value: error,
                })
                return false
            }
            const url = transformUrl('/api/register/cellphone', {
                phone,
                password,
                captcha,
                nickName,
            })
            axios
                .get(`${url}`)
                .then((res) => {
                    dispatch({
                        type: 'success',
                        value: '注册成功',
                    })
                    // 注册成功状态
                    changeRegister(true)
                    history.push({
                        pathname: '/login',
                        state: {
                            phone,
                            password,
                        },
                    })
                })
                .catch(() => {
                    dispatch({
                        type: 'error',
                        value: '注册失败, 服务器出小差啦~~',
                    })
                    changeRegister(false)
                })
        }
    }, [captcha, phone, state.message, state.enabled])
    return (
        <TransitionPage>
            <div className={'nickName-container'}>
                {state.enabled && <Tip {...state} />}
                <form
                    className={'nickName-content'}
                    ref={formRef}
                    onInput={checkInputValue}
                >
                    <span className={'nickName-description'}>
                        后续登录将使用的密码
                    </span>
                    <label htmlFor={'user-password'}>
                        设置密码:
                        <input
                            type={'text'}
                            placeholder={'设置您登录的密码'}
                            className={'user-password'}
                            id={'user-password'}
                            name={'userPassword'}
                            required
                            autoComplete={'off'}
                        />
                    </label>
                    <label htmlFor={'user-nickName'}>
                        设置昵称:
                        <input
                            type={'text'}
                            placeholder={'给自己起个名字吧'}
                            className={'user-nickName'}
                            id={'user-nickName'}
                            name={'userNickName'}
                            required
                            autoComplete={'off'}
                        />
                    </label>
                    <NextStep
                        setCallback={setRegister}
                        isComplete={isComplete}
                        isRegister={true}
                    >
                        注册
                    </NextStep>
                </form>
            </div>
        </TransitionPage>
    )
}
