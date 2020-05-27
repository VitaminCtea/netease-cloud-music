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
    const [phone, setPhone] = useState('')

    const back = useCallback(() => {
        if (count < 1) history.push('/')
        setCount((count) => count - 1)
    }, [count, flag])

    const pageComponent = useMemo(() => {
        return [
            <FillPhoneForward
                setCount={setCount}
                setFlag={setFlag}
                setPhone={setPhone}
            />,
            <ValidatePhone
                setCallback={setCount}
                value={phone}
                setVerificationCode={setVerificationCode}
            />,
            <NickName phone={phone} captcha={code} />,
        ]
    }, [count])

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
