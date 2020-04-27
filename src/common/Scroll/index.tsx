import React, { Component } from 'react'
import BScroll from '@better-scroll/core'
import './index.sass'

type Props = typeof Scroll.defaultProps
export class Scroll extends Component<Props, any>{
    static defaultProps = {
        direction: 'horizontal',
        scrollX: true,
        scrollY: false,
        probeType: 3
    }
    bs: any
    scrollWrapperRef: React.Ref<HTMLDivElement> = React.createRef()
    scrollContentRef: React.Ref<HTMLDivElement> = React.createRef()
    children: any
    componentDidMount(): void {
        setTimeout(() => {
            this.setScrollContentWidth()
            this.initScroll()
        }, 500)
    }
    setScrollContentWidth() {
        this.children = (this.scrollContentRef as any).current.firstElementChild.children
        let totalWidth = 0
        console.log(this.children)
        for (let i: number = 0; i < this.children.length; i++) {
            const marginRightVal = window.getComputedStyle(this.children[i], null).getPropertyValue('margin-right')
            totalWidth += +(this.children[i].offsetWidth + parseInt(marginRightVal, 10))
        }
        (this.scrollContentRef as any).current.style.width = totalWidth + 'px'
    }
    initScroll() {
        this.bs = new BScroll((this.scrollWrapperRef as React.RefObject<any>)!.current, {
            scrollX: this.props.scrollX,
            scrollY: this.props.scrollY,
            probeType: this.props.probeType
        })
        console.log(this.bs)
        this.registerHooks(['scroll', 'scrollEnd'], (pos) => {
            console.log('done')
        })
    }
    registerHooks(hookNames: string[], handler: (...args: any) => any) {
        hookNames.forEach((name) => {
            this.bs.on(name, handler)
        })
    }
    componentWillUnmount(): void {
        this.bs.destroy()
    }
    render() {
        return (
            <div className={ `${ this.props.direction }-container` } ref={ this.scrollWrapperRef }>
                <div className={ 'scroll-content' } ref={ this.scrollContentRef }>
                    { this.props.children }
                </div>
            </div>
        )
    }
}