import React from 'react'
import LazyImage, { checkUpdate } from 'common/LazyImage'
import { Transition } from 'react-transition-group'

const duration = 300

const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: 1,
}

type Style = { opacity: number }
type TransitionStyles<T extends Style = Style> = {
    entering: T
    entered: T
    exiting: T
    exited: T
}

const transitionStyles: TransitionStyles = {
    entering: { opacity: 0 },
    entered: { opacity: 1 },
    exiting: { opacity: 0 },
    exited: { opacity: 1 },
}

type Props = {
    src: string
    alt: string
    timeout?: number
    overflow?: boolean
    className?: string
    height?: number | string
    scrollContainer?: string
    inProp?: boolean
    placeholder?: React.ReactNode
    debounce?: number | boolean
    throttle?: number | boolean
    data?: any
}
export default function AnimationImage(props: Props) {
    const {
        src,
        className,
        alt,
        inProp = false,
        timeout = 200,
        overflow = true,
        height,
        scrollContainer,
        placeholder,
        debounce,
        throttle,
        data,
    } = props
    return (
        <LazyImage
            overflow={overflow}
            scrollContainer={scrollContainer}
            placeholder={placeholder}
            debounce={debounce}
            throttle={throttle}
            height={height}
        >
            <Transition in={inProp} timeout={timeout} appear={true}>
                {(state: keyof TransitionStyles) => (
                    <img
                        src={src}
                        style={{
                            ...defaultStyle,
                            ...transitionStyles[state],
                        }}
                        className={className}
                        alt={alt}
                    />
                )}
            </Transition>
        </LazyImage>
    )
}

export { checkUpdate }
