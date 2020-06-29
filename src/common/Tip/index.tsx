import React, { useMemo, useRef, useState, useEffect } from 'react'
import { Transition } from 'react-transition-group'
import './index.sass'

const duration = 300

const defaultStyle = {
    transition: `all ${duration}ms ease`,
    transform: 'translate3d(-50%, -100%, 0)',
    opacity: 0,
}

const transitionStyles = {
    entered: {
        transform: 'translate3d(-50%, 100%, 0)',
        opacity: 1,
    },
    exited: { transform: 'translate3d(-50%, -100%, 0)', opacity: 0 },
}

const colorStyle = {
    success: {
        backgroundColor: '#F0F9EB',
        color: '#67C23A',
    },
    warning: {
        backgroundColor: '#FDF6EC',
        color: '#E6A23C',
    },
    error: {
        backgroundColor: '#FEF0F0',
        color: '#F56C6C',
    },
}

const icons = {
    warning: 'icon-tip-warning',
    success: 'icon-tip-success',
    error: 'icon-tip-error',
}

type Props = {
    message: string
    enabled: boolean
    type?: MessageType
    closeTime?: number
}

export type MessageType = 'warning' | 'success' | 'error'
export default function Tip({
    message,
    enabled,
    type = 'warning',
    closeTime = 4000,
}: Props) {
    const timer = useRef<number | null>(null)
    const [enabledAnimation, setEnableAnimation] = useState<boolean>(enabled)
    const iconType = useMemo(() => icons[type], [type, message, enabled])

    useEffect(() => {
        const setTimer = () => {
            if (timer.current) clearTimeout(timer.current)
            setEnableAnimation(true)
            timer.current = setTimeout(() => {
                setEnableAnimation(false)
                clearTimeout(timer.current!)
                timer.current = null
            }, closeTime)
        }
        setTimer()
        return () => clearTimeout(timer.current!)
    }, [enabled, message, type])
    return (
        <Transition
            in={enabledAnimation}
            timeout={duration}
            appear
            unmountOnExit={true}
        >
            {(state: keyof typeof transitionStyles) => (
                <div
                    className={'tip-container'}
                    style={{
                        ...defaultStyle,
                        ...transitionStyles[state],
                        backgroundColor: colorStyle[type].backgroundColor,
                    }}
                >
                    <div className={'tip-content'}>
                        <i className={iconType} />
                        <span
                            className={'tip-text'}
                            style={{ color: colorStyle[type].color }}
                        >
                            {message}
                        </span>
                    </div>
                </div>
            )}
        </Transition>
    )
}
