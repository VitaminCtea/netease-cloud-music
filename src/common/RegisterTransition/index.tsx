import React from 'react'
import { Transition } from 'react-transition-group'

const DURATION = 50

const defaultStyle = {
    transition: 'opacity .5s ease-in-out',
    opacity: 0,
}

const transitionStyle = {
    entered: {
        opacity: 1,
    },
    exited: {
        opacity: 0,
    },
}

export default function TransitionPage({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <Transition in={true} timeout={DURATION} unmountOnExit appear>
            {(state: keyof typeof transitionStyle) => (
                <div style={{ ...defaultStyle, ...transitionStyle[state] }}>
                    {children}
                </div>
            )}
        </Transition>
    )
}
