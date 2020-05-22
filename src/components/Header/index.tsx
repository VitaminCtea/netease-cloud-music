import React, { useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import './index.sass'

export default function Header() {
    const content: string[] = useMemo(
        () => ['我的', '发现', '云村', '视频'],
        []
    )
    const paths: string[] = useMemo(
        () => ['/', '/found', '/cloudVillage', '/video'],
        []
    )
    return (
        <header className={'header'}>
            <div className={'container'}>
                <div className={'icon-menu-container'}>
                    <span className={'icon-menu'} />
                </div>
                <div className={'main'}>
                    <div className={'header-href-container'}>
                        {content.map((item, index) => (
                            <div className={'href-content'} key={index}>
                                <NavLink
                                    exact
                                    to={paths[index]}
                                    activeClassName={'defaultActive'}
                                    className={'link'}
                                >
                                    {item}
                                </NavLink>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={'search'}>
                    <span className={'searchIcon'} />
                </div>
            </div>
        </header>
    )
}
