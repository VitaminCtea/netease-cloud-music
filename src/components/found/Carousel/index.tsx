import React, { useEffect, useState } from "react"
import { ScrollToSlide } from "common/Scroll"
import { request } from "../../../api/axios"

export default function Carousel({ type = '2' }: { type?: string }) {
    const [ state, setState ] = useState([])
    useEffect(() => {
        if (!state.length) {
            request(`/banner?type=${ type }`).then((data: any) => {
                if (data.code === 200) setState(data.banners)
            })
        }
    }, [state, type])
    return (
        <div>
            <ScrollToSlide childrenLength={ state ? state.length : 5 }>
                {
                    state.map((item: any, index: number) => (
                        <div className={ 'slide-item' } key={ index }>
                            <img src={ `${ item.pic }` } alt={ 'nima' } />
                        </div>
                    ))
                }
            </ScrollToSlide>
        </div>
    )
}