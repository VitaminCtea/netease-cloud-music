import React, { useEffect, useState } from "react"
import { ScrollToSlide } from "common/ScrollToSlide"
import { request } from "helper/axios"

export default function Carousel({ type = '2' }: { type?: string }) {
    const [ state, setState ] = useState([])
    useEffect(() => {
        if (!state.length) {
            request(`/banner?type=${ type }`).then((data: any) => {
                console.log(data)
                if (data.code === 200) setState(data.banners)
            })
        }
    }, [state, type])
    return (
        <div className={ 'carousel-container' }>
            <ScrollToSlide childrenLength={ state ? state.length : 5 } interval={ 4000 }>
                {
                    state.map((item: any, index: number) => (
                        <div className={ 'slide-item' } key={ index }>
                            <img src={ `${ item.pic }` } alt={ 'banner' } />
                        </div>
                    ))
                }
            </ScrollToSlide>
        </div>
    )
}