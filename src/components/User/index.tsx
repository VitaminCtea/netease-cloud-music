import React, { useMemo, useState, Suspense } from 'react'
import Placeholder from 'common/Placeholder'
import Info from './Info'
import Music from './Music'
import UserManagement from './UserManagement'
import RecentlyPlayed from './RecentlyPlayed'
import PlaylistType from './PlaylistType'
import GeneralLoading from 'common/GeneralLoading'
import { MapStateToProps } from 'containers/User'
import PageTransition from 'common/PageTransition'
import './index.sass'

const Login = React.lazy(() => import('containers/Login'))

export default function My({
    userInfo,
    userRegisterState,
    userLoginState,
}: MapStateToProps) {
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
                <PageTransition
                    isShow={loginStatus && !userLoginState}
                    timeout={200}
                    className={'login-container'}
                >
                    <Login setLoginStatus={setLoginStatus} />
                </PageTransition>
            </Suspense>
        </>
    )
}
