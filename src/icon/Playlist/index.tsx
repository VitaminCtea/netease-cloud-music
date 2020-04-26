import React from "react"
import './index.sass'

const Playlist = () => (
    <div className="icon-playlist">
        <div className="icon-playlist-content">
            <div className="icon-menu">
                <span className="menu" />
                <span className="menu" />
                <span className="menu" />
            </div>
            <div className="icon-music">
                <span className="circle" />
                <span className="line" />
                <span className="tail" />
            </div>
        </div>
    </div>
)

export default Playlist