import React from 'react'
import './index.sass'

type RecommendProps = {
    recommendPlaylist: string;
    recommendTitle: string;
    recommendMore: string;
}
export default function RecommendBase({ recommendPlaylist, recommendTitle, recommendMore }: RecommendProps) {
    return (
        <>
            <div className={ 'found-content' }>
                <span className={ 'found-playlist' }>{ recommendPlaylist }</span>
                <div className={ 'found-description' }>
                    <span className={ 'found-title' }>{ recommendTitle }</span>
                    <span className={ 'found-more' }>{ recommendMore }</span>
                </div>
            </div>
        </>
    )
}