import React, { useCallback } from "react"
import { addChineseUnit } from "helper/index"
import { Scroll } from "common/Scroll"
import { useDataApi } from "hooks/fetchData"
import RecommendBase from "common/RecommendBase"
import './index.sass'

fetch('/api/personalized/newsong').then(res => res.json()).then(data => console.log(data))
export default function Recommend({ quantity }: { quantity: string }) {
    const setPlayCountAddUnit = useCallback((count: number) => addChineseUnit(count), [])
    const [ state ] = useDataApi('/personalized', [], { params: { limit: quantity }})
    return (
        <div className={ 'recommend-container' }>
                <RecommendBase
                        recommendPlaylist={ '推荐歌单' }
                        recommendTitle={'为你精挑细选'}
                        recommendMore={'查看更多'}
                >
                    <Scroll>
                        <div className={ 'recommend-details' }>
                            {
                                state.isRender && state.data.result.map((info: any) => (
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
                </RecommendBase>
        </div>
    )
}