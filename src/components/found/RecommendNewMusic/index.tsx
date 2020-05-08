import React, { useEffect, useMemo, useState } from 'react'
import RecommendBase from "common/RecommendBase"
import TouchScroll from "common/TouchScroll"
import AnimationImage from "common/AnimationImage"
import axios from 'axios'
import { random } from "helper/index"
import './index.sass'

fetch('/api/personalized/djprogram').then(res => res.json()).then(res => {
    console.log(res)
    const id = res.result[2].program.mainSong.id
    fetch(`/api/song/url?id=${ id }`).then(res => res.json()).then(res => console.log(res))
})
type Props = {
    name: string
    picUrl: string
    singer: { [propName: string]: any }
}
const Item = ({ name, picUrl, singer }: Props) => (
    <div className={ 'newMusic-item' }>
        <div className={ 'newMusic-image-container' }>
            <AnimationImage
                    src={ `${ picUrl }` }
                    alt={ name }
                    overflow={ true }
                    inProp={ true }
                    className={ 'newMusic-image'}/>
        </div>
        <div className={ 'newMusic-right-container' }>
            <div className={ 'newMusic-info' }>
                <span className={ 'newMusic-name'}>{ name }</span>
                <span className={ 'newMusic-description'}>{ singer.name }</span>
            </div>
            <div className={ 'icon-newMusic-play-container' }>
                <span className={ 'icon-official-color-play' } />
            </div>
        </div>
    </div>
)

export default function RecommendNewMusic() {
    const [ playlist, setPlayList ] = useState<{ [PropName: string]: any }>({})
    const [ title, setTitle ] = useState<string>('')
    const type = useMemo(() => ['华语', '古风', '欧美', '流行'], [])
    const description = useMemo(() => [
            ['你在找的好听华语歌', '一秒沦陷 华语精选', '一人一首华语经典', '一秒沦陷 华语精选', '走过华语音乐街', '精选华语金曲', '聆听华语佳曲'],
            ['古风 唱罢人间世', '古风如茶 满城花城', '古风一曲解千愁', '古风 一段琴一段情', '一曲一唱思华年', '古风 赐君一场千秋梦'],
            '欧美流行精选',
            '不可错过的流行单曲'
    ], [])
    const getPlayListDetails = useMemo(() => {
        return async function () {
            const index = random(0, 3)
            let title = description[index]
            if (typeof title === 'object') {
                title = title[random(0, title.length - 1)]
            }
            setTitle(title)
            const res = await axios.get(`/api/top/playlist/highquality?cat=${ type[index] }&limit=10`)
            const lists = res.data.playlists
            const id = lists[random(0, lists.length - 1)].id
            const details = await axios.get(`/api/playlist/detail?id=${ id }`)
            const songs = details.data.playlist.tracks
            const convertSongs: typeof songs[0] = []
            const length = songs.length
            for (let i: number = 0; i < 12; i++) {
                const index = random(0, length - 2)
                const item = songs[index]
                if (item === undefined) {
                    i--
                    continue
                }
                // 获取不重复数据(排除相同歌手和相同歌曲的名字)
                convertSongs.push(item)
                songs.splice(index, 1)
            }
            details.data.playlist.tracks = convertSongs
            setPlayList(details.data.playlist)
        }
    }, [])
    const transformDataGrouping = useMemo(() => {
        if (playlist.tracks) {
            const data = playlist.tracks
            const arr = []
            for (let i: number = 0; i < data.length; i += 3) {
                arr.push([
                    <Item name={ data[i].name } picUrl={ data[i].al.picUrl } singer={ data[i].ar[0] } key={ data[i].id + 1 } />,
                    <Item name={ data[i + 1].name} picUrl={ data[i + 1].al.picUrl  } singer={ data[i + 1].ar[0] } key={ data[i + 1].id + 2 } />,
                    <Item name={ data[i + 2].name } picUrl={ data[i + 2].al.picUrl  } singer={ data[i + 2].ar[0] } key={ data[i + 2].id + 3 } />
                ])
            }
            return arr.map((reactChildren: React.ReactChild[], index: number) => {
                return (
                    <div className={ 'newMusic-group' } key={ index }>
                        {
                            reactChildren.map((Child: React.ReactNode) => Child)
                        }
                    </div>
                )
            })
        }
    }, [playlist])
    useEffect(() => {
        getPlayListDetails()
    }, [])
    return (
        <div className={ 'newMusic-container' }>
            <RecommendBase recommendPlaylist={ '曲风推荐' }
                       recommendTitle={ `${ title }` }
                       recommendMore={ '播放全部' }/>
            {
                playlist.tracks ? <TouchScroll>
                    <div className={ 'newMusic-content' }>
                        { transformDataGrouping }
                    </div>
                </TouchScroll> : <div className={ 'newMusic-placeholder'} />
            }
        </div>
    )
}