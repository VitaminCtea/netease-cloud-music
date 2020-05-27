import React from 'react'
import { Transition } from 'react-transition-group'
import {
    pageDefaultStyle,
    pageTransitionStyle,
    DURATION,
} from 'common/ts/pageTransitionStyle'

type Props = {
    isShow: boolean
    children: React.ReactNode
    className: string
    timeout?: number
    styles?: { [PropName: string]: string | number }
}
export default function PageTransition({
    isShow,
    timeout = DURATION,
    children,
    styles,
    className,
}: Props) {
    return (
        <Transition in={isShow} timeout={timeout} appear unmountOnExit>
            {(state: keyof typeof pageTransitionStyle) => (
                <div
                    className={className}
                    style={{
                        ...pageDefaultStyle,
                        ...pageTransitionStyle[state],
                        ...styles,
                    }}
                >
                    {children}
                </div>
            )}
        </Transition>
    )
}
