import React, { Suspense } from 'react'
import PageTransition from 'common/PageTransition'
import { FavoriteMapState } from 'containers/FavoriteMusic'
import GeneralLoading from 'common/GeneralLoading'
import './index.sass'

type Props = {
    playlist: FavoriteMapState['playlist']
    setShow: Function
    show: boolean
    updatePlayState: Function
}

const Playlist = React.lazy(() => import('common/Playlist'))

export default function FavoriteMusic({ playlist, setShow, show, updatePlayState }: Props) {
    if (!playlist) return null
    return (
        <PageTransition isShow={show} className={'favoriteList-container'}>
            <Suspense fallback={ <GeneralLoading /> }>
                <Playlist
                        id={ playlist.id }
                        setShow={ setShow }
                        updatePlayState={ updatePlayState }
                />
            </Suspense>
        </PageTransition>
    )
}
