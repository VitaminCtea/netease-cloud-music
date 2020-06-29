import React, { useCallback, useEffect, useRef, useState } from 'react'
import Carousel from './Carousel'
import Type from './Type'
import Recommend from 'components/found/RecommendPlaylist'
import MusicStyle from 'containers/MusicStyle'
import HotWindVane from './HotWindVane'
import Radio from './Radio'
import Refresh from './Refresh'
import './index.sass'

type Props = {
    isCurrentSong: boolean
}
export default ({ isCurrentSong }: Props) => {
    const [refresh, setRefresh] = useState<number>(0)
    const scrollContent: React.RefObject<HTMLDivElement> = useRef(null)
    let update: any = useCallback(() => {
        document.querySelector('.found-scroll-container')!.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
        })
        setTimeout(() => {
            setRefresh((refresh) => refresh + 1)
        }, 800)
    }, [])
    useEffect(() => {
        if (!isCurrentSong) {
            scrollContent!.current!.style.paddingBottom = '0'
        } else {
            scrollContent!.current!.style.paddingBottom = '56px'
        }
        return () => {
            update = null
        }
    }, [isCurrentSong, refresh])

    return (
        <div className={'found-scroll-container'} key={refresh}>
            <div className={'found-scroll-content'} ref={scrollContent}>
                <div className={'container-padding'}>
                    <Carousel type={'2'} />
                    <Type />
                </div>
                <div className={'recommend-container-padding'}>
                    <Recommend />
                    <MusicStyle />
                    <HotWindVane />
                    <Radio />
                </div>
                <Refresh refresh={update} />
            </div>
        </div>
    )
}
