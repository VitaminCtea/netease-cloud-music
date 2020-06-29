import React, { useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { RouterChildTransition } from 'common/RouterTransition'
import Info from './Info'
import Music from './Music'
import UserManagement from './UserManagement'
import RecentlyPlayed from './RecentlyPlayed'
import PlaylistType from './PlaylistType'
import { MapStateToProps } from 'containers/User'
import renderRoutes from 'Routes/RenderRoutes'
import './index.sass'

export default function My({
    userInfo,
    userPlaylist,
    route,
}: MapStateToProps & any) {
    const location = useLocation()
    const defaultUserInfo = useRef({
        profile: {
            avatarUrl: '',
            nickname: '去登录',
        },
        level: 0,
    })
    return (
        <div className={'my-container'}>
            <div className={'my-content'}>
                <div
                    className={'user-backgroundImage'}
                    style={{
                        backgroundImage: `url(${
                            userInfo ? userInfo.profile.backgroundUrl : ''
                        })`,
                    }}
                />
                <Info
                    userInfo={userInfo ? userInfo : defaultUserInfo.current}
                />
                <UserManagement />
                <Music
                    playlistId={
                        userPlaylist ? userPlaylist.user.favoritePlaylist.id : 0
                    }
                />
                <RecentlyPlayed />
                <PlaylistType playlistCountInfo={null} />
                <RouterChildTransition>
                    {renderRoutes(route.routes, undefined, { location })}
                </RouterChildTransition>
            </div>
        </div>
    )
}
