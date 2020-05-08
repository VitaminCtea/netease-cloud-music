import React, { useCallback } from "react"
import { addChineseUnit } from "helper/index"
import { useDataApi } from "hooks/fetchData"
import RecommendBase from "common/RecommendBase"
import AnimationImage from "common/AnimationImage"
import './index.sass'

export default function Recommend({ quantity }: { quantity: string }) {
    const setPlayCountAddUnit = useCallback((count: number) => addChineseUnit(count), [])
    const [ state ] = useDataApi('/personalized', [], { params: { limit: quantity }})
    return (
        <div className={ 'recommend-container' }>
            <RecommendBase
                        recommendPlaylist={ '推荐歌单' }
                        recommendTitle={'为你精挑细选'}
                        recommendMore={'查看更多'}/>
            {
                <div className={ 'recommend-scroll-container' }>
                    <div className={ 'recommend-details' }>
                        {
                            state.isRender ? state.data.result.map((info: any) => (
                                <div className={ 'recommend-item' } key={ `${ info.name }`}>
                                    <div className={ 'recommend-playlist-media' }>
                                        <AnimationImage
                                                className={ 'recommend-image' }
                                                src={ `${ info.picUrl }` }
                                                alt={ `${ info.copywriter }` }
                                                inProp={ true }
                                                overflow={ true }/>
                                        <div className={ 'recommend-playlist-container' }>
                                            <div className={ 'recommend-playCount'}>
                                                <i className={ 'icon-play' } />
                                                <span className={ 'count' }>{ setPlayCountAddUnit(info.playCount) }</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={ 'recommend-text' }>
                                        <p className={ 'recommend-name' }>{ info.name }</p>
                                    </div>
                                </div>
                            )) : <div className={ 'recommend-item' }/>
                        }
                    </div>
                </div>
            }
        </div>
    )
}
