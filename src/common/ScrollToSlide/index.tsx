import React from "react"
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
import './index.sass'

BScroll.use(Slide)

type Props = {
    interval?: number
    refreshDelay?: number
    childrenLength?: number
    scrollX?: boolean
    scrollY?: boolean
    loop?: boolean
    momentum?: boolean
    bounce?: boolean
}
type State = { currentPageIndex: number; dotsLength: any }

export class ScrollToSlide extends React.Component<Props, State> {
    static defaultProps = {
        interval: 2000,
        refreshDelay: 200,
        scrollX: true,
        scrollY: false,
        loop: true,
        momentum: false,
        bounce: false
    }
    wrapperRef!: HTMLElement
    contentRef!: HTMLElement
    slide: any
    children: any
    playTimer!: any
    constructor(props: Props) {
        super(props)
        this.state = {
            currentPageIndex: 0,
            dotsLength: null
        }
    }
    static getDerivedStateFromProps(props: Props, state: State) {
        if (props.childrenLength !== state.dotsLength) {
            return {
                currentPageIndex: 0,
                dotsLength: props.childrenLength
            }
        }
        return null
    }
    componentDidMount(): void {
        this.setWrapperDefaultHeight()
        let id = setInterval(() => {
            if (this.isImagesComplete(this.contentRef.children)) {
                clearInterval(id)
                this.setSliderWidth()
                this.initScroll()
            }
        }, 10)
    }
    setWrapperDefaultHeight() {
        const width = this.wrapperRef.clientWidth
        const result = 148.547 / width * 100
        this.wrapperRef.style.paddingBottom = result + '%'
    }
    isImagesComplete(images: any) {
        if (!images.length) return false
        let count = 0
        for (let i: number = 0; i < images.length; i++) {
            const img = images[i].firstElementChild
            if (img.nodeType === 1 && img.nodeName === 'IMG' && img.complete) {
                count++
            }
        }
        return count === images.length
    }
    setSliderWidth() {
        this.children = this.contentRef.children
        let totalWidth = 0
        let sliderWidth = this.wrapperRef.clientWidth
        for (let i: number = 0; i < this.children.length; i++) {
            const child = this.children[i]
            child.style.width = sliderWidth + 'px'
            totalWidth += sliderWidth
        }
        totalWidth += 2 * sliderWidth
        this.contentRef.style.width = totalWidth + 'px'
        this.wrapperRef.style.paddingBottom = '0'
    }
    initScroll() {
        clearTimeout(this.playTimer)
        if (!this.wrapperRef) return
        const { scrollX, scrollY, loop, momentum, bounce } = this.props
        this.slide = new BScroll(this.wrapperRef, {
            scrollX,
            scrollY,
            slide: {
                loop,
                threshold: 100
            },
            momentum,
            bounce,
            stopPropagation: true,
            probeType: 3
        })

        this.slide.on('scrollEnd', this._onScrollEnd.bind(this))

        // user touches the slide area
        // this.slide.on('beforeScrollStart', () => {
        //     clearTimeout(this.playTimer)
        // })
        // user touched the slide done
        this.slide.on('scrollEnd', () => {
            this.autoGoNext()
        })

        this.slide.on('slideWillChange', (page: { pageX: number; pageY: number }) => {
            this.setState({
                currentPageIndex: page.pageX
            })
        })

        this.autoGoNext()
    }
    nextPage() {
        this.slide.next()
    }
    prePage() {
        this.slide.prev()
    }
    _onScrollEnd() {
        this.autoGoNext()
    }
    autoGoNext() {
        clearTimeout(this.playTimer)
        this.playTimer = setTimeout(() => {
            this.nextPage()
        }, this.props.interval)
    }
    disable() {
        this.slide && this.slide.disable()
    }
    enable() {
        this.slide && this.slide.enable()
    }
    refresh() {
        this.slide && this.slide.refresh()
    }
    scrollTo() {
        this.slide && this.slide.scrollTo.apply(this.slide, arguments)
    }
    scrollToElement() {
        this.slide && this.slide.scrollToElement.apply(this.slide, arguments)
    }
    beforeDestroy() {
        clearTimeout(this.playTimer)
        this.slide.destroy()
    }
    componentWillUnmount(): void {
        this.beforeDestroy()
    }
    render() {
        return (
            <div className={ 'slide-banner' }>
                <div className={ 'slide-banner-wrapper' } ref={ (ref: any) => this.wrapperRef = ref }>
                    <div className={ 'slide-banner-scroll' } ref={ (ref: any) => this.contentRef = ref }>
                        { this.props.children }
                    </div>
                    <div className={ 'docs-wrapper' }>
                        {
                            Array.from({ length: this.state.dotsLength }).map((item, index) => (
                                <span className={ `${ this.state.currentPageIndex === index ? 'active' : '' } dot` } key={ index } />
                            ))
                        }
                    </div>
                </div>
            </div>
        )
    }
}