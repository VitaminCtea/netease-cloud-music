import React from 'react'
import User from 'containers/User'
import Register from 'components/Register'
import Found from 'containers/Found'
import Login from 'containers/Login'
import FavoriteMusic from 'components/User/FavoriteMusic'

const Video = () => (
    <div>
        video.........................................................................................
    </div>
)
const CloudVillage = () => (
    <div>
        CloudVillage.........................................................................................
    </div>
)

export const DEFAULT_HOME_TRANSITION_ANIMATION = {
    enter: 'from-right',
    exit: 'to-right',
}

const DEFAULT_OTHER_PAGE_TRANSITION_ANIMATION = {
    enter: 'from-bottom',
    exit: 'to-bottom',
}

export type RouteInterface = {
    path: string
    component: React.ReactNode
    meta?: {
        index: number
    }
    animation?: typeof DEFAULT_HOME_TRANSITION_ANIMATION
    key?: number | string
    exact?: boolean
    strict?: boolean
    render?: (...args: any[]) => React.ReactNode
    routes?: RouteInterface[]
}

export type RoutesInterface = RouteInterface[]

export const routes: RoutesInterface = [
    {
        path: '/login',
        component: Login,
        animation: DEFAULT_OTHER_PAGE_TRANSITION_ANIMATION,
        meta: {
            index: 5,
        },
    },
    {
        path: '/register',
        component: Register,
        animation: DEFAULT_OTHER_PAGE_TRANSITION_ANIMATION,
        meta: {
            index: 6,
        },
    },
    {
        path: '/found',
        component: Found,
        animation: DEFAULT_HOME_TRANSITION_ANIMATION,
        meta: {
            index: 2,
        },
    },
    {
        path: '/cloudVillage',
        component: CloudVillage,
        animation: DEFAULT_HOME_TRANSITION_ANIMATION,
        meta: {
            index: 3,
        },
    },
    {
        path: '/video',
        component: Video,
        animation: DEFAULT_HOME_TRANSITION_ANIMATION,
        meta: {
            index: 4,
        },
    },
    {
        path: '/',
        component: User,
        animation: DEFAULT_HOME_TRANSITION_ANIMATION,
        meta: {
            index: 1,
        },
        routes: [
            {
                path: '/favorite_playlist/:id',
                component: FavoriteMusic,
                animation: DEFAULT_OTHER_PAGE_TRANSITION_ANIMATION,
                exact: true,
                meta: {
                    index: 5,
                },
            },
        ],
    },
]
