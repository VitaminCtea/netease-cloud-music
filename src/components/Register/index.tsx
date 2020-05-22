import React, {
    useCallback,
    useRef,
    useState,
    useEffect,
    useMemo,
    Suspense,
} from 'react'
import { useHistory } from 'react-router-dom'
import GeneralLoading from 'common/GeneralLoading'
import './index.sass'

const FillPhoneForward = React.lazy(() => import('./FillPhone'))
const ValidatePhone = React.lazy(() => import('./ValidatePhone'))
const NickName = React.lazy(() => import('containers/NickName'))

export default function Register() {
    const history = useHistory()
    const [count, setCount] = useState(0)
    const [flag, setFlag] = useState(false)
    const [code, setVerificationCode] = useState('')

    const savedPhone = useRef('')
    const fillPhone: React.RefObject<any> = useRef(null)

    const back = useCallback(() => {
        if (count < 1) history.push('/login')
        setCount((count) => count - 1)
    }, [count, flag])

    const pageComponent = useMemo(() => {
        return [
            <FillPhoneForward
                setCallback={setCount}
                setFlag={setFlag}
                ref={fillPhone}
            />,
            <ValidatePhone
                setCallback={setCount}
                value={savedPhone.current}
                setVerificationCode={setVerificationCode}
            />,
            <NickName phone={savedPhone.current} captcha={code} />,
        ]
    }, [count])

    useEffect(() => {
        if (fillPhone.current) {
            savedPhone.current = fillPhone.current.value
        }
    }, [flag, count])

    return (
        <div className={'register-container'}>
            <div className={'register-content'}>
                <div className={'register-header'}>
                    <i className={'icon-register_back'} onClick={back} />
                    <span className={'register-header-text'}>
                        网易云账号注册
                    </span>
                </div>
                <Suspense fallback={<GeneralLoading />}>
                    {pageComponent[count]}
                </Suspense>
            </div>
        </div>
    )
}
