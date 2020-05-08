import React, { Component } from 'react'
import BScroll from '@better-scroll/core'
import './index.sass'

type Props = typeof Scroll.defaultProps
export class Scroll extends Component<Props, any>{
    static defaultProps = {
        direction: 'horizontal',
        scrollX: false,
        scrollY: true,
        probeType: 3,
        data: [],
        isNested: false
    }
    bs: any
    scrollWrapperRef: React.Ref<HTMLDivElement> = React.createRef()
    children: any
    componentDidMount(): void {
        this.initScroll()
    }
    initScroll() {
        this.bs = new BScroll((this.scrollWrapperRef as React.RefObject<any>)!.current, {
            scrollX: this.props.scrollX,
            scrollY: this.props.scrollY,
            startY: 0,
            probeType: this.props.probeType,
            eventPassthrough: this.props.isNested ? 'horizontal' : 'vertical'
        })
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
                { this.props.children }
            </div>
        )
    }
}