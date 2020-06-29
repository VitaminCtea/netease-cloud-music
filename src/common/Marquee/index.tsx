import React from 'react'
import styled from 'styled-components'

const INLINE_BLOCK = 'inline-block'

type ContentProps = {
    style: { [PropName: string]: any }
}
const Content = styled.div(
    (props: ContentProps): Partial<{ [PropName: string]: any }> => ({
        display: 'inline-block',
        fontSize: 0,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        ...props.style,
    })
)

type MarqueeInterface<N extends number = number> = {
    timer: N | null
    requestAnimationFrameId: N | null
    step: N
    stopCount: N
    baseInterval: N
    speed: N
    parentLeft: N
    interval: N
    firstElementWidth: N
    parent: HTMLElement | null
    firstElement: Node | null
    lastElement: HTMLSpanElement | null
    isEnableIntermittentPause: boolean
    useMarquee: boolean
    isBeyondParentWith: boolean
    innerStyle: { [PropName: string]: any } | null
    contentRef: React.RefObject<HTMLDivElement> | null
    init(): void
    update(): void
    covertTagNode(content: HTMLElement): void
    createElement(
        node: HTMLElement,
        tag: string,
        className: string,
        style?: { [PropName: string]: any }
    ): HTMLElement
    animation(): void
}

type Props = {
    children: React.ReactNode
    nodeKey: string | number
    speed?: number
    isEnableIntermittentPause?: boolean
    spaceRight?: number
    interval?: number
    innerStyle?: { [PropName: string]: any }
} & ContentProps
export default class Marquee extends React.PureComponent<Props, {}>
    implements MarqueeInterface {
    timer: number | null = 0
    requestAnimationFrameId: number | null = 0
    step = 0
    stopCount = 0
    baseInterval = 1000 / 60
    speed = 0
    parentLeft = 0
    interval = 0
    firstElementWidth = 0
    parent: HTMLElement | null = null
    firstElement: HTMLElement | null = null
    lastElement: HTMLElement | null = null
    isEnableIntermittentPause = true
    useMarquee = true
    isBeyondParentWith = false
    innerStyle: { [PropName: string]: any } | null = null
    contentRef: React.RefObject<HTMLDivElement> | null

    constructor(props: Props) {
        super(props)
        this.contentRef = React.createRef()
    }

    componentDidMount() {
        this.init()
    }

    componentDidUpdate(prevProps: any) {
        if (React.isValidElement(this.props.children)) {
            if (this.props.nodeKey !== prevProps.nodeKey) {
                this.update()
            }
        } else {
            if (this.props.children !== prevProps.children) {
                this.update()
            }
        }
    }

    componentWillUnmount() {
        window.cancelAnimationFrame(this.requestAnimationFrameId!)
    }

    init() {
        const {
            speed = 5,
            spaceRight = 20,
            interval = 2000,
            isEnableIntermittentPause = true,
        } = this.props
        const content = this.contentRef!.current!

        this.parent = content.parentNode! as HTMLElement

        this.speed = speed / this.baseInterval
        this.interval = interval

        this.parentLeft = ~~this.parent!.getBoundingClientRect().left

        if (content.firstChild!.nodeType === 3) {
            this.covertTagNode(content)
        }

        this.isBeyondParentWith =
            (content.firstElementChild! as HTMLElement).offsetWidth -
                content.offsetWidth >
            0

        this.firstElement = content.firstElementChild! as HTMLElement
        this.firstElementWidth = this.firstElement.offsetWidth
        this.firstElement.style.marginRight = spaceRight + 'px'

        if (content.children.length === 2) {
            content.removeChild(content.lastElementChild!)
        }

        if (
            this.isBeyondParentWith &&
            this.firstElement.nodeType === 1 &&
            content.children.length < 2
        ) {
            let cloneNode: HTMLElement = this.firstElement.cloneNode(
                true
            ) as HTMLElement
            const firstElementStyle = window.getComputedStyle(
                this.firstElement,
                null
            )
            const val = firstElementStyle.getPropertyValue('display')
            if (val && val !== INLINE_BLOCK) {
                this.firstElement.style.display = INLINE_BLOCK
                cloneNode.style.display = INLINE_BLOCK
                cloneNode.style.marginRight = '0px'
            }
            content.appendChild(cloneNode)
        }

        this.lastElement = content.lastElementChild! as HTMLElement

        this.isEnableIntermittentPause = isEnableIntermittentPause
        if (this.isBeyondParentWith && content.children.length > 1) {
            this.animation()
        } else {
            this.firstElement.style.transform = 'translateX(0px)'
        }
    }

    update() {
        if (typeof this.requestAnimationFrameId === 'number') {
            window.cancelAnimationFrame(this.requestAnimationFrameId!)
            this.requestAnimationFrameId = null
        }

        this.firstElement!.style.transform = `translateX(0px)`
        this.lastElement!.style.transform = `translateX(${this.firstElementWidth}px)`
        this.step = 0
        this.stopCount = 0
        this.speed = 0

        this.init()
    }

    covertTagNode(content: HTMLElement) {
        const node = content.firstChild! as HTMLElement
        content.removeChild(node)
        content.appendChild(
            this.createElement(
                node,
                'span',
                'moveText',
                this.props.innerStyle
                    ? { ...this.props.innerStyle, display: INLINE_BLOCK }
                    : {
                          display: 'inline-block',
                          fontSize: `13px`,
                      }
            )
        )
    }

    createElement(
        node: HTMLElement,
        tag: string,
        className: string,
        style?: { [PropName: string]: any }
    ) {
        let el = document.createElement(tag)

        el.className = className
        el.innerHTML = node.textContent ?? ''

        Object.entries(style!).forEach(([key, val]) => {
            el.style[key as any] = val
        })

        return el
    }

    animation() {
        const { left } = this.lastElement?.getBoundingClientRect()!

        this.step -= this.speed

        this.requestAnimationFrameId = window.requestAnimationFrame(
            this.animation.bind(this)
        )

        if (this.isEnableIntermittentPause) {
            if (this.stopCount > 0 && (this.stopCount & 1) === 0) {
                window.cancelAnimationFrame(this.requestAnimationFrameId!)
                this.timer = setTimeout(() => {
                    clearTimeout(this.timer!)
                    this.timer = null
                    this.stopCount = 0
                    this.requestAnimationFrameId = window.requestAnimationFrame(
                        this.animation.bind(this)
                    )
                }, this.interval)
            }
        }

        if (~~left === this.parentLeft) {
            this.firstElement!.style.transform = `translateX(0px)`
            this.lastElement!.style.transform = `translateX(${this.firstElementWidth}px)`
            this.step = 0
            this.stopCount++
            return
        }

        this.firstElement!.style.transform = `translateX(${this.step}px)`
        this.lastElement!.style.transform = `translateX(${this.step}px)`
    }

    render() {
        return (
            <Content
                ref={this.contentRef}
                style={this.props.style ? this.props.style : {}}
            >
                {this.props.children}
            </Content>
        )
    }
}
