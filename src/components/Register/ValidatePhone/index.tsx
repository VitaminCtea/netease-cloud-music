import React, { useState, useCallback, useEffect, useRef } from 'react'
import axios from 'axios'
import Tip from 'common/Tip'
import { useInterval } from 'hooks/interval'
import TransitionPage from 'common/RegisterTransition'
import { padZero } from 'helper/index'
import { isNumber } from '../FillPhone'
import { useTip } from 'hooks/showTip'

type ValidatePhoneProps = {
    setCallback: Function
    value: string
    setVerificationCode: Function
}
export default function ValidatePhone({
    setCallback,
    value,
    setVerificationCode,
}: ValidatePhoneProps) {
    const phoneNumberRef: React.RefObject<HTMLSpanElement> = useRef(null)
    const [seconds, setSeconds] = useState<number | string>(60)
    const [delay, setDelay] = useState<number | null>(1000)
    const sendSecondsRef: React.RefObject<HTMLButtonElement> = useRef(null)

    const [state, dispatch] = useTip()

    const formatPhoneNumber = useCallback(
        (phoneNumber: string) =>
            phoneNumber.replace(
                /(?<=1[358]\d)([0-9]{4})(?=[0-9]{4})/,
                (match: string, current: string) => '*'.repeat(current.length)
            ),
        [value]
    )

    const setWidth = useCallback(
        (el: HTMLElement, value: string) =>
            ((el.firstElementChild! as HTMLElement).style.width = value),
        []
    )

    const getVerificationCode = useCallback(async (phoneNumber: string) => {
        axios.get(`/api/captcha/sent?phone=${phoneNumber}`)
    }, [])

    const regainVerificationCode = useCallback(() => {
        getVerificationCode(value)
        setDelay(1000)
        setSeconds(60)
        sendSecondsRef!.current!.style.color = '#9C9C9C'
        sendSecondsRef!.current!.disabled = true
    }, [])

    const reset = useCallback((validateItems: HTMLCollection) => {
        for (let i: number = 0; i < validateItems.length; i++) {
            const itemChild = validateItems[i]! as HTMLElement
            ;(itemChild.firstChild! as Text).data = ''
            setWidth(itemChild, '0')
        }
    }, [])

    useInterval(() => {
        setSeconds((seconds: number | string) => {
            if (seconds === 0) {
                setDelay(null)
                sendSecondsRef!.current!.style.color = '#557CAA'
                sendSecondsRef!.current!.disabled = false
                return '重新获取'
            }
            return (seconds as number) - 1
        })
    }, delay)

    useEffect(() => {
        let index = 0
        let captcha = ''
        const validateItems = document.getElementsByClassName(
            'validate-item'
        )! as any
        const setCode = (e: Event) => {
            const code = (e as KeyboardEvent).keyCode
            if (isNumber(code)) return
            if (code === 8) {
                if (index <= 0) return
                index--
                setWidth(validateItems[index], '0')
                validateItems[index].firstChild.data = ''
                return
            }
            if (index === validateItems.length) return
            setWidth(validateItems[index], '100%')
            validateItems[index].insertAdjacentText(
                'afterbegin',
                String.fromCharCode(code)!
            )
            captcha += String.fromCharCode(code)
            if (index === 3) {
                dispatch({
                    type: 'reset',
                    payload: {
                        enabled: false,
                    },
                })
                axios
                    .get(
                        `/api/captcha/verify?phone=${value}&captcha=${captcha}`
                    )
                    .then((res) => {
                        if (res.data.code === 200) {
                            setVerificationCode(captcha)
                        }
                        setCallback((count: number) => count + 1)
                    })
                    .catch((e) => {
                        dispatch({
                            type: 'error',
                            value: '验证码错误',
                        })
                        reset(validateItems)
                        index = 0
                        captcha = ''
                    })
                return
            }
            index++
        }

        document.addEventListener('keydown', setCode, false)

        getVerificationCode(value)

        return () => {
            document.removeEventListener('keydown', setCode)
        }
    }, [])

    return (
        <TransitionPage>
            <div className={'validate-container'}>
                {state.enabled && <Tip {...state} />}
                <div className={'validate-content'}>
                    <div className={'validate-top'}>
                        <div className={'validate-send'}>
                            <span className={'send-phone'}>验证码已发送至</span>
                            <span
                                className={'phone-number'}
                                ref={phoneNumberRef}
                            >
                                +86 {formatPhoneNumber(value)}
                            </span>
                        </div>
                        <button
                            className={'send-seconds'}
                            ref={sendSecondsRef}
                            onClick={regainVerificationCode}
                        >
                            {`${
                                typeof seconds === 'number'
                                    ? padZero(seconds) + 's'
                                    : seconds
                            }`}
                        </button>
                    </div>
                    <div className={'validate-bottom'}>
                        <div className={'validate-item'}>
                            <span className={'span-active'} />
                        </div>
                        <div className={'validate-item'}>
                            <span className={'span-active'} />
                        </div>
                        <div className={'validate-item'}>
                            <span className={'span-active'} />
                        </div>
                        <div className={'validate-item'}>
                            <span className={'span-active'} />
                        </div>
                    </div>
                </div>
            </div>
        </TransitionPage>
    )
}
