import React from "react"
import Carousel from "./Carousel"
import Type from './Type'
import Recommend from "./RecommendPlaylist"
import RecommendNewMusic from "./RecommendNewMusic"
import HotWindVane from "../HotWindVane"
import './index.sass'

export default () => (
    <div className={ 'found-scroll-container' }>
        <div className={ 'found-scroll-content' }>
            <div className={ 'container-padding' }>
                <Carousel type={ '2' }/>
                <Type />
            </div>
            <div className={ 'recommend-container-padding' }>
                <Recommend quantity={ '6' }/>
                <RecommendNewMusic />
                <HotWindVane />
            </div>
        </div>
    </div>
)