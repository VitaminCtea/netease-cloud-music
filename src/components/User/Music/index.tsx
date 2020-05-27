import React, { useCallback, useState, Suspense } from 'react'
import './index.sass'
import GeneralLoading from 'common/GeneralLoading'

const FavoriteMusic = React.lazy(() => import('containers/FavoriteMusic'))

export default function Music() {
    const [show, setShow] = useState(false)
    const enterDetails = useCallback(() => {
        setShow(!show)
    }, [show])
    return (
        <div className={'my-music-container'}>
            <div className={'my-music-content'}>
                <div className={'my-music-header'}>
                    <span className={'my-music-header-text'}>我的音乐</span>
                </div>
                <div className={'my-music-type-container'}>
                    <div className={'my-music-type-content'}>
                        <div className={'my-music-item'} onClick={enterDetails}>
                            <div className={'my-music-layer'}>
                                <div className={'my-music-type'}>
                                    <i className={'icon-my_music_favorite'} />
                                    <span className={'my-music-layer-text'}>
                                        我喜欢的音乐
                                    </span>
                                </div>
                                <div className={'my-music-description'}>
                                    <i className={''} />
                                    <span
                                        className={'my-music-description-text'}
                                    >
                                        心动模式
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className={'my-music-item'}>
                            <div className={'my-music-layer'}>
                                <div className={'my-music-type'}>
                                    <i className={'icon-my_fm'} />
                                    <span className={'my-music-layer-text'}>
                                        私人FM
                                    </span>
                                </div>
                                <div className={'my-music-fm-description'}>
                                    <span
                                        className={'my-music-description-text'}
                                    >
                                        最懂你的推荐
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Suspense fallback={<GeneralLoading />}>
                <FavoriteMusic setShow={setShow} show={show} />
            </Suspense>
        </div>
    )
}
