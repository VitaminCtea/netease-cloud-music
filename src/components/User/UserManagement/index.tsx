import React, { useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import './index.sass'

export default function UserManagement() {
    const management = useMemo(() => {
        return {
            'icon-localMusic': '本地音乐',
            'icon-downloadManager': '下载管理',
            'icon-my_radio': '我的电台',
            'icon-my_collection': '我的收藏',
            'icon-focus_newSong': '关注新歌',
        }
    }, [])
    return (
        <div className={'user-management'}>
            {Object.entries(management).map(([key, val]) => (
                <div className={'management-item'} key={uuidv4()}>
                    <i className={`${key}`} />
                    <span className={'management-item-text'}>{val}</span>
                </div>
            ))}
        </div>
    )
}
