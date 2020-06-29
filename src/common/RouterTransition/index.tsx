import React, { Suspense } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import PageTransition from 'common/PageTransition'
import GeneralLoading from 'common/loading/GeneralLoading'

const rootRoutes = [
    '/login',
    '/register',
    '/found',
    '/cloudVillage',
    '/video',
    '/',
]

export function RouterTransition({
    className,
    children,
}: {
    className: string
    children: React.ReactNode
}) {
    const history = useHistory()
    return (
        <PageTransition
            isShow={!rootRoutes.includes(history.location.pathname)}
            className={className}
        >
            <Suspense fallback={<GeneralLoading />}>{children}</Suspense>
        </PageTransition>
    )
}

export function RouterChildTransition({
    children,
}: {
    children: React.ReactNode
}) {
    const location = useLocation()
    return (
        <TransitionGroup component={null}>
            <CSSTransition key={location.pathname} timeout={300} unmountOnExit>
                {children}
            </CSSTransition>
        </TransitionGroup>
    )
}
