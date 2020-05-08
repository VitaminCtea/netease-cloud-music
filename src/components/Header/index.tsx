import React, { useMemo } from 'react'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
import './index.sass'

export default function Header() {
    const content: string[] = useMemo(() => ['我的', '发现', '云村', '视频'], [])
    const paths: string[] = useMemo(() => ['/', '/found', '/cloudVillage', '/video'], [])
    return (
        <Router>
            <div className={ 'container' }>
                <div className={ 'menu' }>
                    <span className={ 'menuIcon' } />
                </div>
                <div className={ 'main' }>
                    {
                        content.map((item, index) => (
                            <div className={ 'content' } key={ index }>
                                <Link to={ paths[index] } className={ index === 1 ? 'defaultActive' : 'link' }>{ item }</Link>
                            </div>
                        ))
                    }
                </div>
                <div className={ 'search' }>
                    <div className={ 'searchIcon' }/>
                </div>
            </div>
            <Switch>
                <Route path={ '/found' } component={ Found } />
            </Switch>
        </Router>
    )
}

const Found = () => (<div>found</div>)