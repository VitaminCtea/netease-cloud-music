import React from "react"
import ReactDom from 'react-dom'
import styled, { ThemeProvider, keyframes } from 'styled-components'
import { debounce, on, throttle, off, isString } from "helper/index"

type PlaceholderProps = {
    height?: number | string
    theme?: {
        bgColor: string
    }
    borderRadius?: string
    objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
}
const Placeholder = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: ${ (props: PlaceholderProps) => typeof props.height === 'number' ? props.height + 'px' : '100%' };
    object-fit: ${ (props: PlaceholderProps) => props.objectFit ? props.objectFit : 'cover' };
    border-radius: ${ (props: PlaceholderProps) => props.borderRadius ? props.borderRadius : '8px' };
    background-color: ${ (props: PlaceholderProps) => props.theme ? props.theme.bgColor : 'cornflowerblue' };
`

const TimeLineItem = styled.div`
    background-color: burlywood;
    border: 1px solid;
    border-color: #e5e6e9 #dfe0e4 #d0d1d5;
    border-radius: 8px;
`

const placeHolderShimmer = keyframes`
    0% {
        background-position: -468px 0;
    }
    100% {
        background-position: 468px 0;
    }
`

const AnimatedBackground = styled.div`
    animation-duration: 1s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-name: ${ placeHolderShimmer };
    animation-timing-function: linear;
    background-color: burlywood;
    background-image: linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%);
    background-size: 800px 104px;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
`

let listeners: LazyImage[] = []
let pending: LazyImage[] = []
const LISTEN_FLAG = 'data-lazy-listened'

const overflowRegex = /(scroll|auto)/
const defaultBoundingClientRect = { top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 }

const getScrollParent = (node: HTMLElement) => {
    if (!(node instanceof HTMLElement)) return document.documentElement
    let parent: any = node
    while (parent) {
        if (!parent.parentNode) return node.ownerDocument || document.documentElement
        const style: any = window.getComputedStyle(parent)
        const overflow = style.overflow
        const overflowX = style['overflow-x']
        const overflowY = style['overflow-y']
        if (overflowRegex.test(overflow) && overflowRegex.test(overflowX) && overflowRegex.test(overflowY)) return parent
        parent = parent.parentNode
    }
    return node.ownerDocument || document.documentElement
}

const getTransformParent = (node: HTMLElement) => {
    let parent: any = node
    while (parent !== null && parent.nodeType === 1) {
        const transform = parent.dataset.istransform
        if (transform && transform === 'transform') return parent
        parent = parent.parentNode
    }
    return document.documentElement
}

let passiveEventSupported = false

try {
    const options = Object.defineProperty({}, 'passive', {
        get() {
            return (passiveEventSupported = true)
        }
    })
    window.addEventListener('test', () => {}, options)
} catch (e) {}

const passiveEvent = passiveEventSupported ? { capture: false, passive: true } : false

const checkOverflowVisible = (component: LazyImage, parent: HTMLElement) => {
    const node = ReactDom.findDOMNode(component) as HTMLElement
    let parentTop
    let parentLeft
    let parentWidth
    let parentHeight

    try {
        ({ top: parentTop, left: parentLeft, width: parentWidth, height: parentHeight } = parent.getBoundingClientRect())
    } catch (e) {
        ({ top: parentTop, left: parentLeft, width: parentWidth, height: parentHeight } = defaultBoundingClientRect)
    }

    const windowInnerHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowInnerWidth = window.innerWidth || document.documentElement.clientWidth;

    const intersectionTop = Math.max(parentTop, 0)
    const intersectionLeft = Math.max(parentLeft, 0)
    const intersectionHeight = Math.min(windowInnerHeight, parentTop + parentHeight) - intersectionTop
    const intersectionWidth = Math.min(windowInnerWidth, parentLeft + parentWidth) - intersectionLeft

    let top
    let left
    let width
    let height

    try {
        ({ top, left, width, height } = node?.getBoundingClientRect())
    } catch (e) {
        ({ top, left, width, height } = defaultBoundingClientRect)
    }

    const offsetTop = top - intersectionTop
    const offsetLeft = left - intersectionLeft

    return offsetTop <= intersectionHeight &&
        offsetTop + height >= 0 &&
        offsetLeft <= intersectionWidth &&
        offsetLeft + width >= 0
}

const checkNormalVisible = (component: LazyImage) => {
    const node = ReactDom.findDOMNode(component) as HTMLElement
    if (!(node.offsetWidth || node.offsetHeight || node.getClientRects().length)) return false
    let top
    let elementHeight
    try {
        ({ top, height: elementHeight } = node.getBoundingClientRect())
    } catch (e) {
        ({ top, height: elementHeight } = defaultBoundingClientRect)
    }
    const windowInnerHeight = window.innerHeight || document.documentElement.clientHeight
    return top <= windowInnerHeight && top + elementHeight >= 0
}

const checkVisible = (component: LazyImage) => {
    const node = ReactDom.findDOMNode(component) as HTMLElement
    if (!(node instanceof HTMLElement)) return
    let parent = getTransformParent(node)
    if (parent.nodeName === 'HTML') {
        parent = getScrollParent(node)
    }
    const isOverflow = component.props.overflow &&
            parent !== node.ownerDocument &&
            parent !== document &&
            parent !== document.documentElement

    const visible = isOverflow ? checkOverflowVisible(component, parent) : checkNormalVisible(component)

    if (visible) {
        if (!component.visible) {
            if (component.props.once) {
                pending.push(component)
            }
            component.visible = true
            component.forceUpdate()
        }
    } else if (!(component.props.once && component.visible)) {
        component.visible = false
        if (component.props.unmountIfInvisible) {
            component.forceUpdate()
        }
    }
}

const purgePending = () => {
    pending.forEach((component) => {
        const index = listeners.indexOf(component)
        if (index !== -1) {
            listeners.splice(index, 1)
        }
    })
    pending = []
}

const lazyLoadHandler = (scrollPort: HTMLElement, innerScrollPort: HTMLElement, isTransform: boolean) => {
    if (scrollPort.scrollTop + scrollPort.clientHeight >= scrollPort.firstElementChild!.scrollHeight) {
        scrollPort.removeEventListener('scroll', finalLazyLoadHandler, passiveEvent)
    }

    const firstElement = innerScrollPort.firstElementChild
    let lastElementLeft

    ({ left: lastElementLeft } = firstElement!.lastElementChild!.getBoundingClientRect())

    if (lastElementLeft <= innerScrollPort.clientWidth) {
        if (isTransform) {
            innerScrollPort.removeEventListener('touchmove', finalLazyLoadHandler, passiveEvent)
        } else {
            innerScrollPort.removeEventListener('scroll', finalLazyLoadHandler, passiveEvent)
        }
    }

    for (let i: number = 0; i < listeners.length; i++) {
        const listener = listeners[i]
        checkVisible(listener)
    }
    purgePending()
}

let delayType: undefined | string
let finalLazyLoadHandler: any

type Props = {
    children: React.ReactNode
    once?: boolean
    height?: number | string
    overflow?: boolean
    resize?: boolean
    scroll?: boolean
    throttle?: number | boolean
    debounce?: number | boolean
    placeholder?: React.ReactNode
    scrollContainer?: string
    unmountIfInvisible?: boolean
} & typeof LazyImage.defaultProps
export default class LazyImage extends React.Component<Props, {}> {
    static defaultProps = {
        once: false,
        overflow: false,
        resize: false,
        scroll: true,
        unmountIfInvisible: false
    }
    visible: boolean = false
    scrollPort: HTMLElement | Element = document.documentElement
    innerScrollPort: HTMLElement | Element | null = null
    componentDidMount() {
        const style = window.getComputedStyle(document.documentElement, null)
        const height = parseInt(style.height, 10)
        if (height === window.innerHeight) {
            let root = document.getElementById('root')!.firstElementChild
            while (root) {
                if (root.childElementCount > 1 && !(this.scrollPort as any)._isFind) {
                    this.scrollPort = root.lastElementChild!
                    ;(this.scrollPort as any)._isFind = true
                    break
                }
                root = root.nextElementSibling
            }
        }
        if (this.props.scrollContainer) {
            if (isString(this.props.scrollContainer)) {
                this.innerScrollPort = document.querySelector(this.props.scrollContainer)!
            }
        }

        const needResetFinalLazyLoadHandler = (this.props.debounce !== undefined && delayType === 'throttle')
                || (delayType === 'debounce' && this.props.debounce === undefined)

        if (needResetFinalLazyLoadHandler) {
            off(this.innerScrollPort, 'scroll', finalLazyLoadHandler, passiveEvent)
            off(window, 'resize', finalLazyLoadHandler, passiveEvent)
            finalLazyLoadHandler = null
        }

        let isTransform = false
        if (this.props.overflow) {
            this.innerScrollPort = getTransformParent(ReactDom.findDOMNode(this) as HTMLElement)
            if (this.innerScrollPort!.nodeName !== 'HTML') {
                isTransform = true
            } else {
                this.innerScrollPort = getScrollParent(ReactDom.findDOMNode(this) as HTMLElement)
            }
        }

        if (!finalLazyLoadHandler) {
            if (this.props.debounce !== undefined) {
                finalLazyLoadHandler = debounce(
                    lazyLoadHandler.bind(null, this.scrollPort as HTMLElement, this.innerScrollPort as HTMLElement, isTransform),
                    typeof this.props.debounce === 'number' ? this.props.debounce : 300
                )
                delayType = 'debounce'
            } else if (this.props.throttle !== undefined) {
                finalLazyLoadHandler = throttle(
                    lazyLoadHandler.bind(null, this.scrollPort as HTMLElement, this.innerScrollPort as HTMLElement, isTransform),
                    typeof this.props.throttle === 'number' ? this.props.debounce : 300
                )
                delayType = 'throttle'
            } else {
                finalLazyLoadHandler = lazyLoadHandler.bind(null, this.scrollPort as HTMLElement, this.innerScrollPort as HTMLElement, isTransform)
            }
        }

        if (this.props.overflow) {
            if (this.innerScrollPort && typeof this.innerScrollPort!.getAttribute === 'function') {
                const listenerCount = 1 + (+this.innerScrollPort!.getAttribute(LISTEN_FLAG)!)
                if (listenerCount === 1) {
                    if (isTransform) {
                        this.innerScrollPort!.addEventListener('touchmove', finalLazyLoadHandler, passiveEvent)
                    } else {
                        this.innerScrollPort!.addEventListener('scroll', finalLazyLoadHandler, passiveEvent)
                    }
                }
                this.innerScrollPort!.setAttribute(LISTEN_FLAG, listenerCount + '')
            }
        }

        const { scroll, resize } = this.props
        if (scroll) {
            on(this.scrollPort, 'scroll', finalLazyLoadHandler, passiveEvent)
        }
        if (resize) {
            on(window, 'resize', finalLazyLoadHandler, passiveEvent)
        }

        listeners.push(this)
        checkVisible(this)
    }
    componentWillUnmount() {
        if (this.props.overflow) {
            let parent = getTransformParent(ReactDom.findDOMNode(this) as HTMLElement)
            if (parent.nodeName === 'HTML') {
                parent = getScrollParent(ReactDom.findDOMNode(this) as HTMLElement)
            }
            if (parent && typeof parent.getAttribute === 'function') {
                const listenerCount = (+parent.getAttribute(LISTEN_FLAG)) - 1
                if (listenerCount === 0) {
                    parent.removeEventListener('scroll', finalLazyLoadHandler, passiveEvent)
                    parent.removeAttribute(LISTEN_FLAG)
                } else {
                    parent.setAttribute(LISTEN_FLAG, listenerCount + '')
                }
            }
        }
        const index = listeners.indexOf(this)
        if (index !== -1) {
            listeners.splice(index, 1)
        }
        if (listeners.length === 0 && typeof window !== 'undefined' && this.scrollPort.nodeName !== 'HTML') {
            off(window, 'resize', finalLazyLoadHandler, passiveEvent)
            off(window, 'scroll', finalLazyLoadHandler, passiveEvent)
            off(this.scrollPort, 'scroll', finalLazyLoadHandler, passiveEvent)
        }
    }
    render() {
        return this.visible ?
            this.props.children :
                this.props.placeholder ?
                    this.props.placeholder :
                        <ThemeProvider theme={{ bgColor: 'burlywood' }}>
                            <Placeholder className="lazyImage-placeholder">
                                <TimeLineItem>
                                    <AnimatedBackground />
                                </TimeLineItem>
                            </Placeholder>
                        </ThemeProvider>
    }
}