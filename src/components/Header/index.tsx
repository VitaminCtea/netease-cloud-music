import React, { useRef } from 'react'
import { NavLink } from 'react-router-dom'
import Placeholder from 'common/Placeholder'
import './index.sass'

export default function Header() {
    const content = useRef(['我的', '发现', '云村', '视频'])
    const paths = useRef(['/', '/found', '/cloudVillage', '/video'])
    return (
        <header className={'header'}>
            <Placeholder />
            <div className={'container'}>
                <div className={'icon-menu-container'}>
                    <span className={'icon-menu'} />
                </div>
                <div className={'main'}>
                    <div className={'header-href-container'}>
                        {content.current.map((item, index) => (
                            <div className={'href-content'} key={index}>
                                <NavLink
                                    exact
                                    to={paths.current[index]}
                                    className={'link'}
                                    activeStyle={{
                                        fontWeight: 'bold',
                                        fontSize: '16px',
                                        color: '#000',
                                    }}
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
