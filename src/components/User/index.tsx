import React, { useMemo, useState, Suspense } from 'react'
import { Transition } from 'react-transition-group'
import { pageDefaultStyle, pageTransitionStyle } from 'common/ts/pageAnimation'
import Placeholder from 'common/Placeholder'
import Info from './Info'
import Music from './Music'
import UserManagement from './UserManagement'
import RecentlyPlayed from './RecentlyPlayed'
import PlaylistType from './PlaylistType'
import GeneralLoading from 'common/GeneralLoading'
import './index.sass'

const Login = React.lazy(() => import('containers/Login'))

export default function My({ userInfo }: any) {
    const [loginStatus, setLoginStatus] = useState(false)
    const defaultUserInfo = useMemo(
        () => ({
            profile: {
                avatarUrl: '',
                nickname: 'xxx',
            },
            level: 0,
        }),
        []
    )
    return (
        <>
            <div className={'my-container'}>
                <Placeholder />
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
                        userInfo={userInfo ? userInfo : defaultUserInfo}
                        setLoginStatus={setLoginStatus}
                    />
                    <UserManagement />
                    <Music />
                    <RecentlyPlayed />
                    <PlaylistType playlistCountInfo={null} />
                </div>
            </div>
            <Suspense fallback={<GeneralLoading />}>
                <Transition in={loginStatus} appear unmountOnExit timeout={200}>
                    {(state: keyof typeof pageTransitionStyle) => (
                        <div
                            style={{
                                ...pageDefaultStyle,
                                ...pageTransitionStyle[state],
                                position: 'fixed',
                                left: 0,
                                right: 0,
                                top: 0,
                                bottom: 0,
                                zIndex: 22,
                            }}
                        >
                            <Login setLoginStatus={setLoginStatus} />
                        </div>
                    )}
                </Transition>
            </Suspense>
        </>
    )
}
