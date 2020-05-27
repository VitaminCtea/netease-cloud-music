import React from 'react'

type Props = { children: React.ReactNode }
type State = { currentIndex: number }
export default class TouchScroll extends React.Component<Props, State> {
    startX: number = 0
    startY: number = 0
    deltaX: number = 0
    defaultDistanceX: number = 50
    defaultTime: number = 200
    containerRef: any = React.createRef()
    children!: React.ReactNode & { length: number }
    scrollContainer!: HTMLElement
    scrollItemWidth: number = 0
    scrollItem!: HTMLElement
    x: number = 0
    isMoved: boolean = false
    startTime: number = 0
    directionX: number = 0
    lastTime: number = 0
    scrollDistanceX: number = 0
    marginRight: number = 0
    distanceXAbs: number = 0
    maxScrollX: number = 0
    wrapperWidth: number = 0
    paddingLeft: number = 0
    isTouch: boolean = false
    isScrolling: number = 0
    componentDidMount() {
        this.init()
    }
    init() {
        this.children = this.props.children as React.ReactNode & {
            length: number
        }
        this.scrollContainer = this.containerRef!.current
            .firstElementChild as HTMLElement
        this.scrollItem = this.scrollContainer!
            .firstElementChild! as HTMLElement
        this.setWidth()
        this.scrollItemWidth = this.scrollItem.clientWidth
        this.scrollDistanceX =
            this.scrollContainer.children[0].clientWidth -
            this.scrollContainer.clientWidth
        if (this.paddingLeft !== 0) {
            this.maxScrollX = this.scrollDistanceX + this.paddingLeft
        } else if (this.marginRight !== 0) {
            this.maxScrollX =
                this.scrollDistanceX +
                2 * this.marginRight -
                this.marginRight / 2
        } else {
            this.maxScrollX = this.scrollDistanceX
        }
        this.bindEvent()
    }
    getCSSAttribute(
        el: HTMLElement & { currentStyle: CSSStyleDeclaration },
        attr: string
    ) {
        if (el.currentStyle) {
            return el.currentStyle[attr as any]
        }
        return window.getComputedStyle(el, null).getPropertyValue(attr)
    }
    setWidth() {
        this.wrapperWidth = this.containerRef!.current.clientWidth
        this.marginRight = parseInt(
            this.getCSSAttribute(this.scrollItem as any, 'margin-right'),
            10
        )
        this.paddingLeft = parseInt(
            this.getCSSAttribute(this.scrollItem as any, 'padding-left'),
            10
        )
        let totalWidth = 0
        for (let i: number = 0; i < this.scrollContainer.children.length; i++) {
            const child = this.scrollContainer.children[i] as HTMLElement
            const paddingL = parseInt(
                this.getCSSAttribute(child as any, 'padding-left'),
                10
            )
            const paddingR = parseInt(
                this.getCSSAttribute(child as any, 'padding-right'),
                10
            )
            let totalPadding = 0
            if (paddingL && paddingR) {
                totalPadding = paddingL + paddingR
            } else if (paddingL) {
                totalPadding = paddingL
            } else if (paddingR) {
                totalPadding = paddingL
            }
            if (this.marginRight) {
                totalPadding += this.marginRight / 2 + this.marginRight
            }
            child.style.width = this.wrapperWidth - totalPadding + 'px'
            if (
                i === this.scrollContainer.children.length - 1 &&
                paddingL === 0 &&
                paddingR === 0
            ) {
                child.style.width = this.wrapperWidth - this.marginRight + 'px'
            }
            totalWidth += child.clientWidth
        }
        this.scrollContainer.style.width =
            totalWidth +
            this.marginRight * this.scrollContainer.children.length +
            'px'
    }
    bindEvent() {
        this.containerRef!.current.ontouchstart = this.start.bind(this)
        this.containerRef!.current.ontouchmove = this.move.bind(this)
        this.containerRef!.current.ontouchend = this.end.bind(this)
    }
    start(e: TouchEvent) {
        this.scrollContainer.style.transition = 'none'
        this.startX = e.touches[0].pageX
        this.startY = e.touches[0].pageY
        this.startTime = Date.now()
        this.isMoved = false
        this.isTouch = true
    }
    setTransition() {
        this.scrollContainer.style.transition = 'transform 200ms'
    }
    move(e: TouchEvent) {
        if (!this.isTouch) return
        this.isMoved = true
        this.deltaX = e.touches[0].pageX - this.startX
        const deltaY = e.touches[0].pageY - this.startY
        this.isScrolling = Math.abs(this.deltaX) > Math.abs(deltaY) ? 1 : -1
        if (this.isScrolling < 0) {
            this.isMoved = false
            this.startX = 0
            this.startY = 0
            this.startTime = 0
            this.isTouch = false
            this.deltaX = 0
            this.isScrolling = 0
            return
        }
        this.distanceXAbs = Math.abs(this.deltaX)
        this.directionX = this.deltaX > 0 ? -1 : this.deltaX < 0 ? 1 : 0
        this.lastTime = Date.now()
        let translateDistanceX = 0
        let moveDistanceX = this.x + this.deltaX
        const preventDistanceX = this.distanceXAbs > this.wrapperWidth / 2
        if (moveDistanceX > 0) {
            if (preventDistanceX) {
                this.setTransition()
                this.translate(translateDistanceX)
                return
            }
            translateDistanceX = translateDistanceX + this.deltaX / 4
        } else if (moveDistanceX < this.maxScrollX) {
            if (preventDistanceX) {
                this.setTransition()
                this.translate(this.maxScrollX)
                return
            }
            translateDistanceX = this.maxScrollX + this.deltaX / 4
        } else {
            translateDistanceX = this.x + this.deltaX
        }
        this.translate(translateDistanceX)
    }
    end(e: Event) {
        if (!this.isMoved) return
        this.scrollContainer.style.transition = 'transform 200ms'
        const isTouchDistanceX = this.distanceXAbs >= this.defaultDistanceX
        if (this.directionX < 0 && isTouchDistanceX)
            this.x += this.scrollItemWidth + this.marginRight
        if (this.directionX > 0 && isTouchDistanceX)
            this.x -= this.scrollItemWidth + this.marginRight
        if (this.x >= 0 || this.x <= this.scrollDistanceX) {
            this.resetPos()
            return
        }
        if (
            (this.lastTime - this.startTime < this.defaultTime &&
                this.distanceXAbs >= this.defaultDistanceX - 30) ||
            this.distanceXAbs >= this.defaultDistanceX
        ) {
            this.translate(this.x)
        } else {
            this.resetPos()
        }
        this.isTouch = false
    }
    translate(x: number) {
        this.scrollContainer.style.transform = `translate3d(${x}px, 0, 0)`
    }
    resetPos() {
        const resetX =
            this.x >= 0
                ? 0
                : this.x <= this.scrollDistanceX
                ? this.scrollDistanceX
                : this.x
        if (resetX === 0) {
            this.x = 0
        }
        if (resetX === this.scrollDistanceX) {
            this.x = this.maxScrollX
        }
        this.translate(this.x)
    }
    render() {
        return (
            <div
                className={'scroll_container'}
                ref={this.containerRef}
                style={{ overflow: 'hidden' }}
                data-istransform={'transform'}
            >
                {this.props.children}
            </div>
        )
    }
}
