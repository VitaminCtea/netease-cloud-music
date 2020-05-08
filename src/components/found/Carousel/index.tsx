import React from "react"
import { ScrollToSlide } from "common/ScrollToSlide"
import { useDataApi } from "hooks/fetchData"
import './index.sass'

export default function Carousel({ type = '2' }: { type?: string }) {
    const [ state ] = useDataApi('/banner', [], { params: { type } })
    return (
        <div className={ 'carousel-container' }>
            {
                state.isRender ? <ScrollToSlide
                        childrenLength={ state.data.banners.length }
                        interval={ 4000 }
                        data={ state.data.banners }
                        isNested={ true }
                >
                    {
                        state.data.banners.map((item: any, index: number) => (
                            <div className={ 'slide-item' } key={ index }>
                                <img src={`${ item.pic }`} alt={ 'banner' } />
                            </div>
                        ))
                    }
                </ScrollToSlide> : <div className={ 'stanceElements-carousel' } />
            }
        </div>
    )
}