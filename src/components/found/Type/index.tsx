import React from "react"
import Recommend from "../../../icon/Recommend"
import Playlist from "../../../icon/Playlist"
import TopList from "../../../icon/Toplist"
import Radio from "../../../icon/Radio"
import Live from "../../../icon/Live"
import './index.sass'

export default function Type() {
    const icons = [ Recommend, Playlist, TopList, Radio, Live ]
    const descriptions = ['每日推荐', '歌单', '排行榜', '电台', '直播', '歌手']
    return (
        <div className={ 'type-container' }>
            {
                icons.map((IconComponent: any, index: number) => (
                    <div className={ 'type-item' } key={ index }>
                        <div className={ 'item-content' }>
                            <IconComponent />
                            <span className={ 'description' }>{ descriptions[index] }</span>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}