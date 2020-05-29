import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import FoundHeader from 'common/FoundHeader'
import TouchScroll from 'common/TouchScroll'
import AnimationImage from 'common/AnimationImage'
import { Loading } from 'common/Loading/index'
import { random } from 'helper/index'
import { PlayerProps } from 'containers/MusicStyle'
import './index.sass'

const EXTRACT_NUMBER = 9

type Props = {
    name: string
    picUrl: string
    singer: { [propName: string]: any }
}

const Item = ({ name, picUrl, singer }: Props) => (
   <div className={'newMusic-item'}>
       <div className={'newMusic-image-container'}>
           <AnimationImage src={`${picUrl}`}
                           alt={name}
                           overflow={true}
                           inProp={true}
                           className={'newMusic-image'}
                />
       </div>
       <div className={'newMusic-right-container'}>
           <div className={'newMusic-info'}>
               <span className={'newMusic-name'}>{name}</span>
               <span className={ 'newMusic-singer' } style={{ fontSize: '12px' }}>{ singer }</span>
           </div>
           <div className={'icon-newMusic-play-container'}>
               <i className={ 'icon-musicStyle-borderPlay' } />
           </div>
       </div>
   </div>
)
type MusicStyleProps = {
    updatePlayState: PlayerProps
}

export default function MusicStyle({ updatePlayState }: MusicStyleProps) {
    const [playlist, setPlayList] = useState<{ [PropName: string]: any }>({})
    const [title, setTitle] = useState<string>('')
    const type = useRef(['华语', '古风', '欧美', '流行'])
    const description = useRef([
        [
            '你在找的好听华语歌',
            '一秒沦陷 华语精选',
            '一人一首华语经典',
            '一秒沦陷 华语精选',
            '走过华语音乐街',
            '精选华语金曲',
            '聆听华语佳曲',
        ],
        [
            '古风 唱罢人间世',
            '古风如茶 满城花城',
            '古风一曲解千愁',
            '古风 一段琴一段情',
            '一曲一唱思华年',
            '古风 赐君一场千秋梦',
        ],
        '欧美流行精选',
        '不可错过的流行单曲',
    ])
    const getPlayListDetails = useMemo(() => {
        return async function () {
            const index = random(0, 3)
            let title = description.current[index]
            if (typeof title === 'object') {
                title = title[random(0, title.length - 1)]
            }
            setTitle(title)
            const res = await axios.get(
                `/api/top/playlist/highquality?cat=${type.current[index]}&limit=10`
            )

            const lists = res.data.playlists
            const id = lists[random(0, lists.length - 1)].id
            const details = await axios.get(`/api/playlist/detail?id=${id}`)
            const songs = details.data.playlist.tracks

            const resultSongs = Array.from({ length: EXTRACT_NUMBER }).map(
                () => {
                    const index = random(0, songs.length - 1)
                    const song = songs[index]
                    songs.splice(index, 1)
                    return song
                }
            )

            details.data.playlist.tracks = resultSongs
            setPlayList(details.data.playlist)
        }
    }, [])

    const createAttrs = useCallback((item: { [PropName: string]: any }) => {
        return {
            name: item.name,
            picUrl: item.al.picUrl,
            singer: item.ar[0].name,
            key: uuidv4()
        }
    }, [])

    const transformDataGrouping = useMemo(() => {
        if (playlist.tracks) {
            const data = playlist.tracks
            const musicItems = []
            for (let i: number = 0; i < data.length; i += 3) {
                musicItems.push([
                    <Item {...createAttrs(data[i])} />,
                    <Item {...createAttrs(data[i + 1])} />,
                    <Item {...createAttrs(data[i + 2])} />,
                ])
            }
            return musicItems.map((musicItem: React.ReactChild[]) => {
                return (
                    <div className={'newMusic-group'} key={uuidv4()}>
                        {musicItem}
                    </div>
                )
            })
        }
    }, [ playlist ])

    useEffect(() => {
        if (!playlist.tracks) {
            getPlayListDetails()
        } else {
            const items = document.querySelectorAll('.newMusic-item')!
            for (let i: number = 0; i < items.length; i++) {
                let item = items[i] as HTMLElement
                while (item.className !== 'newMusic-item') item = item.parentNode as HTMLElement
                item.onclick = () => {
                    updatePlayState(playlist.tracks, i)
                }
            }
        }
    }, [playlist])

    return (
        <div className={'newMusic-container'}>
            <FoundHeader
                description={'曲风推荐'}
                title={`${title}`}
                more={'播放全部'}
            />
            {playlist.tracks ? (
                <TouchScroll>
                    <div className={'newMusic-content'}>
                        {transformDataGrouping}
                    </div>
                </TouchScroll>
            ) : (
                <Loading paddingTop={`${(244 / 382) * 100}%`} />
            )}
        </div>
    )
}
