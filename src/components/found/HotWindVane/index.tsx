import React, { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import FoundHeader from 'common/FoundHeader'
import TouchScroll from 'common/TouchScroll'
import AnimationImage from 'common/AnimationImage'
import { Loading } from 'common/Loading'
import './index.sass'

type Data = { [PropName: string]: any }
export default function HotWindVane() {
    const [topList, setTopList] = useState<Data[]>([])
    const getTopList = useCallback(() => {
        const baseURL = '/api/top/list'
        const getNewSong = () => axios.get(`${baseURL}?idx=0`)
        const getHotSongList = () => axios.get(`${baseURL}?idx=1`)
        const getOriginalList = () => axios.get(`${baseURL}?idx=2`)
        const getSoaringList = () => axios.get(`${baseURL}?idx=3`)
        const getRapList = () => axios.get(`${baseURL}?idx=23`)

        axios
            .all([
                getNewSong(),
                getHotSongList(),
                getOriginalList(),
                getSoaringList(),
                getRapList(),
            ])
            .then(
                axios.spread((...list: Data[]) => {
                    return list.map((item) => {
                        item.data.playlist.tracks = item.data.playlist.tracks.slice(
                            0,
                            3
                        )
                        item.data.playlist.trackIds = item.data.playlist.trackIds.slice(
                            0,
                            3
                        )
                        return item.data.playlist
                    })
                })
            )
            .then((result: any[]) => result.length && setTopList(result))
    }, [])
    const icons = useMemo(
        () => [
            'icon-top-newSong',
            'icon-top-hotSong',
            'icon-top-originalSong',
            'icon-top-rocketsSong',
            'icon-top-singSong',
        ],
        []
    )
    useEffect(() => {
        getTopList()
    }, [getTopList])
    return (
        <div className={'hotWindVane-container'}>
            <FoundHeader
                description={'排行榜速览'}
                title={'热歌风向标'}
                more={'查看更多'}
            />
            <div className={'hotWindVane-content'}>
                {!!topList.length ? (
                    <TouchScroll>
                        <div className={'hotWindVane-scroll-container'}>
                            {topList.map((data: any, index: number) => (
                                <div
                                    className={'hotWindVane-scroll-item'}
                                    key={index}
                                    style={{
                                        backgroundImage: `url(${data.coverImgUrl})`,
                                    }}
                                >
                                    <div
                                        className={
                                            'hotWindVane-item-title-container'
                                        }
                                    >
                                        <div
                                            className={
                                                'hotWindVane-item-title-icon'
                                            }
                                        >
                                            <i className={`${icons[index]}`} />
                                        </div>
                                        <span
                                            className={
                                                'hotWindVane-item-title-description'
                                            }
                                        >
                                            {data.name}
                                        </span>
                                    </div>
                                    <ul className={'hotWindVane-list'}>
                                        {data.tracks.map(
                                            (
                                                track: Data,
                                                itemIndex: number
                                            ) => (
                                                <li
                                                    className={
                                                        'hotWindVane-list-item'
                                                    }
                                                    key={itemIndex + 10}
                                                >
                                                    <div
                                                        className={
                                                            'hotWindVane-image-container'
                                                        }
                                                    >
                                                        <AnimationImage
                                                            inProp={true}
                                                            src={`${track.al.picUrl}`}
                                                            alt={`${track.name}`}
                                                            overflow={true}
                                                            className={
                                                                'hotWindVane-image'
                                                            }
                                                        />
                                                    </div>
                                                    <div
                                                        className={
                                                            'hotWindVane-list-item-details'
                                                        }
                                                    >
                                                        <div
                                                            className={
                                                                'hotWindVane-serialNumber-container'
                                                            }
                                                        >
                                                            <span
                                                                className={
                                                                    'hotWindVane-item-serialNumber'
                                                                }
                                                            >
                                                                {itemIndex + 1}
                                                            </span>
                                                        </div>
                                                        <div
                                                            className={
                                                                'hotWindVane-item-text'
                                                            }
                                                        >
                                                            <span
                                                                className={
                                                                    'hotWindVane-item-songName'
                                                                }
                                                            >
                                                                {`${
                                                                    track.name
                                                                }${
                                                                    track.alia
                                                                        .length
                                                                        ? `(${track.alia[0]})`
                                                                        : ''
                                                                }`}
                                                            </span>
                                                            <span
                                                                className={
                                                                    'hotWindVane-horizontal-line'
                                                                }
                                                            >
                                                                -
                                                            </span>
                                                            <span
                                                                className={
                                                                    'hotWindVane-item-singer'
                                                                }
                                                            >{`${track.ar[0].name}`}</span>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className={
                                                            'hotWindVane-item-song-state-container'
                                                        }
                                                    >
                                                        <span
                                                            className={
                                                                'hotWindVane-item-song-state'
                                                            }
                                                        >
                                                            新
                                                        </span>
                                                    </div>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </TouchScroll>
                ) : (
                    <Loading paddingTop={`${(250 / 398) * 100}%`} />
                )}
            </div>
        </div>
    )
}
