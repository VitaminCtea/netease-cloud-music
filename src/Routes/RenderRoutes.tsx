import React from 'react'
import { Switch, Route, SwitchProps, Redirect } from 'react-router-dom'
import { RoutesInterface } from './config'

type Props = { [PropName: string]: any }
type OtherProps = { key?: string } & Props

const renderRoutes = (
    routes: RoutesInterface,
    redirect: string | undefined,
    switchProps: SwitchProps = {},
    otherProps: OtherProps = {}
) => {
    return routes && Array.isArray(routes) && routes.length ? (
        <Switch {...switchProps}>
            {routes.map((route, index) => (
                <Route
                    key={route.key || index}
                    path={route.path}
                    exact={route.exact}
                    strict={route.strict}
                    render={(props) => {
                        const Component = route.component as any
                        return (
                            <Component
                                {...props}
                                {...otherProps}
                                route={route}
                            />
                        )
                    }}
                />
            ))}
            {redirect && <Redirect to={redirect} />}
        </Switch>
    ) : null
}

export default renderRoutes
