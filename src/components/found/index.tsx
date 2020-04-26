import React from "react"
import Header from "./Header"
import Carousel from "./Carousel"
import Type from './Type'

export default () => (
    <>
        <Header />
        <Carousel type={ '2' }/>
        <Type />
    </>
)