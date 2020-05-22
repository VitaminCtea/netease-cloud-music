import React, { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import { random } from 'helper/index'
import AnimationImage from 'common/AnimationImage'
import Recommend from 'common/RecommendList'
import './index.sass'

// fetch('/api/dj/catelist').then(res => res.json()).then(res => { // 电台类别
//     console.log(res)
//     const id = res.categories[4].id
//     fetch(`/api/dj/recommend/type?type=${id}`).then(res => res.json()).then(res => {    // 某一个电台
//         console.log(res)
//         const rid = res.djRadios[0].id
//         fetch(`/api/dj/program?rid=${rid}&limit=40`).then(res => res.json()).then(res => {  // 电台类别详情
//             console.log(res) // 5
//             fetch(`/api/song/url?id=${res.programs[0].mainSong.id}`).then(res => res.json()).then(res => console.log(res))  // 电台URL
//         })
//     })
// })

export default function Radio() {
    const [radioList, setRadioList] = useState<any[]>([])
    const getRadioList = useMemo(() => {
        return async function (limit: string = '1') {
            const radioTypeRes = await axios.get('/api/dj/catelist')
            const typeIndex = random(0, radioTypeRes.data.categories.length - 1)
            const djId = radioTypeRes.data.categories[typeIndex].id
            const radioItemRes = await axios.get(
                `/api/dj/recommend/type?type=${djId}`
            )
            const descriptionList: { text: string }[] = []
            const requestList = radioItemRes.data.djRadios
                .slice(0, 6)
                .map((item: any) => {
                    descriptionList.push({
                        text:
                            item.rcmdtext && item.rcmdtext.length > 2
                                ? item.rcmdtext
                                : item.name,
                    })
                    const radioItemId = item.id
                    return axios.get(
                        `/api/dj/program?rid=${radioItemId}&limit=${limit}`
                    )
                })
            axios.all(requestList).then(
                axios.spread((...requests: any[]) => {
                    const list = requests.map((item, index) => {
                        return {
                            ...item.data.programs[0],
                            descriptionObj: descriptionList[index],
                        }
                    })
                    setRadioList(list)
                })
            )
            // 获取电台链接地址
            // const radioURLId = radioDetailsRes.data.programs[0].mainSong.id
            // const radioSongDetailsRes = await axios.get(`/api/song/url?id=${ radioURLId }`)
            // console.log(radioSongDetailsRes.data)
        }
    }, [])
    useEffect(() => {
        getRadioList()
    }, [])
    return (
        <Recommend
            prefixClassName={'radio'}
            description={'电台推荐'}
            title={'优质的电台供您收听'}
            more={'查看更多'}
        >
            {!!radioList.length ? (
                radioList.map((item) => (
                    <div className={'radio-item'} key={item.id}>
                        <div className={'radio-image-container'}>
                            <AnimationImage
                                src={`${item.coverUrl}`}
                                alt={`${item.name}`}
                                overflow={true}
                                className={'radio-image'}
                            />
                            <i className={'icon'} />
                        </div>
                        <div className={'radio-item-text-container'}>
                            <span className={'radio-item-text-title'}>
                                {item.name}
                            </span>
                            <span className={'radio-item-text-description'}>
                                {item.descriptionObj.text}
                            </span>
                        </div>
                    </div>
                ))
            ) : (
                <div className={'radio-placeholder'} />
            )}
        </Recommend>
    )
}
