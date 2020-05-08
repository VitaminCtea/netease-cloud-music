import React from "react"
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
import './index.sass'

BScroll.use(Slide)

type Props = typeof ScrollToSlide.defaultProps
type State = { currentPageIndex: number; dotsLength: any; data: null | any[] }
export class ScrollToSlide extends React.PureComponent<Props, State> {
    static defaultProps = {
        interval: 2000,
        refreshDelay: 200,
        scrollX: true,
        scrollY: false,
        loop: true,
        momentum: false,
        bounce: false,
        childrenLength: 5,
        isShowCircle: true,
        data: null,
        isNested: false
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
            dotsLength: null,
            data: null
        }
    }
    componentDidMount(): void {
        if (this.props.loop) {
            let id = setInterval(() => {
                if (this.isImagesComplete(this.contentRef.children)) {
                    clearInterval(id)
                    this.setSliderWidth()
                    this.initScroll()
                }
            }, 10)
        } else {
            setTimeout(() => {
                this.setSliderWidth()
                this.initScroll()
            }, 20)
        }
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
    setItemWidth(el: string) {
        const slideItems = document.getElementsByClassName(el)
        for (let i: number = 0; i < slideItems.length; i++) {
            ;(slideItems[i] as HTMLElement).style.width = slideItems[i].clientWidth + 'px'
        }
    }
    setSliderWidth() {
        this.setItemWidth('slide-item')
        this.setItemWidth('newMusic-group')
        this.children = this.contentRef.children
        let totalWidth = 0
        let sliderWidth = this.wrapperRef.clientWidth
        for (let i: number = 0; i < this.children.length; i++) {
            totalWidth += sliderWidth
        }
        this.props.loop && (totalWidth += 2 * sliderWidth)
        this.contentRef.style.width = totalWidth + 'px'
    }
    initScroll() {
        clearTimeout(this.playTimer)
        if (!this.wrapperRef) return
        this.slide = new BScroll(this.wrapperRef, {
            scrollX: this.props.scrollX,
            scrollY: this.props.scrollY,
            slide: {
                loop: this.props.loop,
                threshold: 100
            },
            useTransition: true,
            momentum: this.props.momentum,
            bounce: this.props.bounce,
            stopPropagation: true,
            probeType: 1,
            eventPassthrough: this.props.isNested ? 'vertical' : 'horizontal'
        })

        this.slide.on('scrollEnd', this._onScrollEnd.bind(this))

        // user touches the slide area
        this.slide.on('beforeScrollStart', () => {
            clearTimeout(this.playTimer)
        })
        // user touched the slide done
        const bodyWidth = document.body.clientWidth
        this.slide.on('scrollEnd', (page: { x: number; y: number }) => {
            this.setState({
                currentPageIndex: Math.floor(Math.abs(page.x) / bodyWidth)
            })
            this.props.loop && this.autoGoNext()
        })

        this.slide.on('slideWillChange', (page: { pageX: number; pageY: number }) => {
            // this.setState({
            //     currentPageIndex: page.pageX
            // })
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
        this.props.loop && (this.playTimer = setTimeout(() => {
            this.nextPage()
        }, this.props.interval))
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
                    {
                        this.props.isShowCircle && <div className={ 'docs-wrapper' }>
                            {
                                Array.from({ length: this.props.childrenLength }).map((item, index) => (
                                    <span className={ `dot ${ this.state.currentPageIndex === index ? 'active' : '' }` } key={ index } />
                                ))
                            }
                        </div>
                    }
                </div>
            </div>
        )
    }
}