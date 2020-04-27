import React, { useCallback, useEffect, useState } from "react"
import { request } from "helper/axios"
import { addChineseUnit } from "helper/index"
import { Scroll } from "common/Scroll"
import './index.sass'

export default function Recommend({ quantity }: { quantity: string }) {
    const [ recommendPlaylist, setRecommendPlaylist ] = useState([])
    const setPlayCountAddUnit = useCallback((count: number) => addChineseUnit(count), [])
    useEffect(() => {
        request(`/personalized?limit=${ quantity }`).then((res: any) => {
            console.log(res)
            if (res.code === 200) setRecommendPlaylist(res.result)
        })
    }, [quantity])
    return (
        <div className={ 'recommend-container' }>
            <span className={ 'recommend-playlist' }>推荐歌单</span>
            <div className={ 'recommend-content' }>
                <div className={ 'recommend-description' }>
                    <span className={ 'recommend-title' }>为你精挑细选</span>
                    <span className={ 'recommend-more' }>查看更多</span>
                </div>
                <Scroll>
                    <div className={ 'recommend-details' }>
                        {
                            recommendPlaylist.map((info: any, index) => (
                                <div className={ 'recommend-item' } key={ `${ info.name }`}>
                                    <img className={ 'recommend-image' } src={ `${ info.picUrl }`} alt={ `${ info.copywriter }` }/>
                                    <p className={ 'recommend-name' }>{ info.name }</p>
                                    <div className={ 'recommend-playlist-container' }>
                                        <div className={ 'recommend-playCount'}>
                                            <i className={ 'icon-recommend-play' } />
                                            <span className={ 'count' }>{ setPlayCountAddUnit(info.playCount) }</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </Scroll>
            </div>
        </div>
    )
}