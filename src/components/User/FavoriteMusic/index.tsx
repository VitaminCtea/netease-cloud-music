import React from 'react'
import Playlist from 'common/Playlist'
import './index.sass'
import { FavoriteMapState } from 'containers/FavoriteMusic'
import PageTransition from 'common/PageTransition'

type Props = {
    playlist?: FavoriteMapState['playlist']
    setShow: Function
    show: boolean
}
export default function FavoriteMusic({ playlist, setShow, show }: Props) {
    if (!playlist.user) return null
    return (
        <PageTransition isShow={show} className={'favoriteList-container'}>
            <Playlist
                id={playlist.user.favoritePlaylist.id}
                setShow={setShow}
            />
        </PageTransition>
    )
}
