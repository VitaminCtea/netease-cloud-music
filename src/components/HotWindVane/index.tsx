import React, {useCallback, useEffect, useMemo, useState} from "react"
import axios from 'axios'
import RecommendBase from 'common/RecommendBase'
import TouchScroll from "common/TouchScroll"
import AnimationImage from "common/AnimationImage"
import './index.sass'

// fetch('/api/top/playlist/highquality?cat=古风&limit=10').then(res => res.json()).then(res => {
//     console.log(res)
//     return res.playlists[3].id
// }).then(id => {
//     fetch(`/api/playlist/detail?id=${id}`).then(res => res.json()).then(res => console.log(res))
// })
type Data = { [PropName: string]: any }
export default function HotWindVane() {
    const [ topList, setTopList ] = useState<Data[]>([])
    const getTopList = useCallback(() => {
        const getNewSong = () => axios.get('/api/top/list?idx=0')
        const getHotSongList = () => axios.get('/api/top/list?idx=1')
        const getOriginalList = () => axios.get('/api/top/list?idx=2')
        const getSoaringList = () => axios.get('/api/top/list?idx=3')
        const getRapList = () => axios.get('/api/top/list?idx=23')

        axios.all([getNewSong(), getHotSongList(), getOriginalList(), getSoaringList(), getRapList()])
                .then(axios.spread((...list: Data[]) => {
                    return list.map(item => {
                        item.data.playlist.tracks = item.data.playlist.tracks.slice(0, 3)
                        item.data.playlist.trackIds = item.data.playlist.trackIds.slice(0, 3)
                        return item.data.playlist
                    })
                })).then((result: any[]) => result.length && setTopList(result))
    }, [])
    const icons = useMemo(() => ['icon-new', 'icon-hot', 'icon-original', 'icon-rockets', 'icon-sing'], [])
    useEffect(() => {
        getTopList()
    }, [getTopList])
    return (
        <div className={ 'hotWindVane-container' }>
            <RecommendBase recommendPlaylist={ '排行榜速览' } recommendTitle={ '热歌风向标' } recommendMore={ '查看更多' } />
            <div className={ 'hotWindVane-content' }>
                {
                    !!topList.length && <TouchScroll>
                        <div className={ 'hotWindVane-scroll-container' }>
                            {
                                topList.map((data: any, index: number) => (
                                    <div className={ 'hotWindVane-scroll-item' } key={ index } style={{ backgroundImage: `url(${ data.coverImgUrl})` }}>
                                        <div className={ 'hotWindVane-item-title-container' }>
                                            <div className={ 'hotWindVane-item-title-icon' }>
                                                <i className={ `${ icons[index] }` }/>
                                            </div>
                                            <span className={ 'hotWindVane-item-title-description' }>{ data.name }</span>
                                        </div>
                                        <ul className={ 'hotWindVane-list' }>
                                            {
                                                data.tracks.map((track: Data, itemIndex: number) => (
                                                    <li className={ 'hotWindVane-list-item' } key={ itemIndex + 10 }>
                                                        <div className={ 'hotWindVane-image-container' }>
                                                            <AnimationImage
                                                                    inProp={ true }
                                                                    src={ `${ track.al.picUrl }` }
                                                                    alt={ `${ track.name }` }
                                                                    overflow={ true }
                                                                    scrollContainer={'.scroll_container'}
                                                                    className={ 'hotWindVane-image' }/>
                                                        </div>
                                                        <div className={ 'hotWindVane-list-item-details' }>
                                                            <div className={ 'hotWindVane-serialNumber-container'}>
                                                                <span className={ 'hotWindVane-item-serialNumber' }>{ itemIndex + 1 }</span>
                                                            </div>
                                                            <div className={ 'hotWindVane-item-text' }>
                                                                <span className={ 'hotWindVane-item-songName' }>
                                                                    { `${ track.name }${ track.alia.length ? `(${ track.alia[0] })` : '' }` }
                                                                </span>
                                                                <span className={ 'hotWindVane-horizontal-line' }>-</span>
                                                                <span className={ 'hotWindVane-item-singer' }>{ `${ track.ar[0].name }`}</span>
                                                            </div>
                                                        </div>
                                                        <div className={ 'hotWindVane-item-song-state-container' }>
                                                            <span className={ 'hotWindVane-item-song-state' }>新</span>
                                                        </div>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                ))
                            }
                        </div>
                    </TouchScroll>
                }
            </div>
        </div>
    )
}