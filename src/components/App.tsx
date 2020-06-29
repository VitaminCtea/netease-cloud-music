import React from 'react'
import { BrowserRouter as Router, useLocation } from 'react-router-dom'
import Header from './Header'
import Player from 'containers/Player'
import { routes, renderRoutes } from 'Routes/index'
import './App.css'

const Routers = () => {
    const location = useLocation()
    return <>{renderRoutes(routes, '/found', { location })}</>
}

const App = () => (
    <Router>
        <Header />
        <Routers />
        <Player />
    </Router>
)

export default App
