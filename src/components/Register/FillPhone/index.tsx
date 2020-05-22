import React, {
    useState,
    useRef,
    useCallback,
    useImperativeHandle,
    useEffect,
    forwardRef,
} from 'react'
import { useLocation } from 'react-router-dom'
import TransitionPage from 'common/RegisterTransition'
import NextStep from 'common/NextStep'

const LENGTH = 11

export const isNumber = (code: number) =>
    !(code >= 48 && code <= 57) && code !== 8

const useComplete = () => {
    const [complete, setComplete] = useState(false)
    const updateState = useCallback(
        (index: number, length: number) => {
            if (index === length) {
                setComplete(true)
            } else {
                setComplete(false)
            }
        },
        [complete]
    )
    return [complete, updateState] as const
}

const FillPhone = (props: any, ref: any) => {
    const location = useLocation<{ phone: string }>()
    const inputRef: React.RefObject<HTMLInputElement> = useRef(null)
    const [hasInputVal, setInputValState] = useState(false)
    const [isComplete, updateState] = useComplete()
    const inputValue = useRef<string>('')

    const disableInput = useCallback(
        (e: React.SyntheticEvent) => {
            const target = e.target as HTMLInputElement
            const code = target.value.charCodeAt(target.value.length - 1)
            if (isNumber(code)) {
                target.value = target.value.substring(
                    0,
                    target.value.length - 1
                )
                return false
            }
            if (target.value) setInputValState(true)
            else setInputValState(false)
            if (target.value.length >= LENGTH) {
                target.value = target.value.substring(0, LENGTH)
                const check = /^1[358][0-9]{9}$/.test(target.value)
                if (!check) return false
                inputValue.current = target.value
                props.setFlag((flag: boolean) => !flag)
            }
            updateState(target.value.length, LENGTH)
        },
        [hasInputVal]
    )

    const clearInput = useCallback(() => {
        if (inputRef.current && inputRef!.current.value) {
            inputRef.current.value = ''
            inputRef.current.focus()
            setInputValState(false)
        }
    }, [])

    useImperativeHandle(
        ref,
        () => ({
            value: inputValue.current
                ? inputValue.current
                : location.state.phone,
        }),
        [inputValue.current]
    )

    useEffect(() => {
        updateState(inputRef.current!.value.length, LENGTH)
    }, [])

    return (
        <TransitionPage>
            <form className={'input-container'}>
                <span className={'register-instructions'}>
                    未注册的手机号登录后将自动创建账号
                </span>
                <div className={'input-content'}>
                    <input
                        type={'text'}
                        defaultValue={
                            (location.state as { phone: string }).phone
                        }
                        placeholder={'请输入手机号'}
                        onInput={disableInput}
                        autoFocus
                        ref={inputRef}
                    />
                    {hasInputVal && (
                        <i className={'icon-clear'} onClick={clearInput} />
                    )}
                </div>
                <NextStep
                    setCallback={props.setCallback}
                    isComplete={isComplete}
                    isRegister={false}
                >
                    下一步
                </NextStep>
            </form>
        </TransitionPage>
    )
}

export default forwardRef(FillPhone)
