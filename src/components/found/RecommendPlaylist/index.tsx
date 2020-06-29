import React, { useCallback, useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { addChineseUnit } from 'helper/index'
import Recommend from 'common/RecommendList'
import AnimationImage, { checkUpdate } from 'common/AnimationImage'
import './index.sass'

const CancelToken = axios.CancelToken

export default function RecommendPlayList() {
    const [data, setData] = useState<{ [PropName: string]: any } | null>(null)
    const setPlayCountAddUnit = useCallback(
        (count: number) => addChineseUnit(count),
        []
    )

    const cancel = useRef<any>(null)

    useEffect(() => {
        if (!data) {
            axios
                .get(`/api/personalized?limit=6`, {
                    cancelToken: new CancelToken(function executor(c) {
                        cancel.current = c
                    }),
                })
                .then((res) => {
                    if (res.data.code === 200) {
                        setData(res.data.result)
                    }
                })
        } else {
            checkUpdate()
        }
        return () => {
            if (cancel.current) {
                cancel.current()
            }
        }
    })
    return (
        <Recommend
            prefixClassName={'recommend'}
            description={'推荐歌单'}
            title={'为你精挑细选'}
            more={'查看更多'}
        >
            {data?.map((info: any) => (
                <div className={'recommend-item'} key={`${info.name}`}>
                    <div className={'recommend-playlist-media'}>
                        <AnimationImage
                            inProp={true}
                            overflow={true}
                            src={`${info.picUrl}`}
                            alt={`${info.copywriter}`}
                            className={'recommend-image'}
                        />
                        <div className={'recommend-playlist-container'}>
                            <div className={'recommend-playCount'}>
                                <i className={'icon-recommend-playCount'} />
                                <span className={'count'}>
                                    {setPlayCountAddUnit(info.playCount)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className={'recommend-text'}>
                        <p className={'recommend-name'}>{info.name}</p>
                    </div>
                </div>
            ))}
        </Recommend>
    )
}
