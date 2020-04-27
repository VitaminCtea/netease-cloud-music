import React from "react"
import Header from "./Header"
import Carousel from "./Carousel"
import Type from './Type'
import Recommend from "./Recommend"

export default () => (
    <>
        <Header />
        <Carousel type={ '2' }/>
        <Type />
        <Recommend quantity={ '6' }/>
    </>
)