import React, { useMemo } from 'react'
import { BrowserRouter as Router, Route, Switch, NavLink, Redirect } from 'react-router-dom'
import Found from 'components/found'
import './index.sass'

export default function Header() {
    const content: string[] = useMemo(() => ['我的', '发现', '云村', '视频'], [])
    const paths: string[] = useMemo(() => ['/', '/found', '/cloudVillage', '/video'], [])
    return (
        <Router>
            <header className={ 'header' }>
                <div className={ 'container' }>
                    <div className={ 'icon-menu-container' }>
                        <span className={ 'icon-menu' } />
                    </div>
                    <div className={ 'main' }>
                        <div className={ 'header-href-container' }>
                            {
                                content.map((item, index) => (
                                    <div className={ 'href-content' } key={ index }>
                                        <NavLink exact to={ paths[index] } activeClassName={ 'defaultActive' } className={ 'link' }>{ item }</NavLink>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div className={ 'search' }>
                        <span className={ 'searchIcon' }/>
                    </div>
                </div>
            </header>
            <Switch>
                <Route exact path={ '/found' } component={ Found } />
                <Route exact path={ '/video' } component={ Video } />
                <Route exact path={ '/cloudVillage' } component={ CloudVillage } />
                <Route exact path={ '/' } component={ My } />
                <Redirect from={ '/' } to={ '/found' }/>
            </Switch>
        </Router>
    )
}

const My = () => (<div>My.........................................................................................</div>)
const Video = () => (<div>video.........................................................................................</div>)
const CloudVillage = () => (<div>CloudVillage.........................................................................................</div>)
