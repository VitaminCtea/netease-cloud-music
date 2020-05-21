import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  NavLink,
  Redirect,
} from "react-router-dom";
import Playlist from "common/Playlist";
import "./index.sass";

type Props = {
  playlistCountInfo: number | null;
};
export default function PlaylistType({ playlistCountInfo }: Props) {
  return (
    <div className={"playlist-type-container"}>
      <div className={"playlist-type-content"}>
        <Router>
          <div className={"playlist-type-header-container"}>
            <div className={"playlist-type-header-content"}>
              <div className={"playlist-type-header-item"}>
                <NavLink exact to={"/"} className={"playlist-type-text"}>
                  创建歌单
                  <span className={"playlist-count"}>
                    {playlistCountInfo ? playlistCountInfo : 0}
                  </span>
                </NavLink>
              </div>
              <div className={"playlist-type-header-item"}>
                <NavLink
                  exact
                  to={"/collection_playlist"}
                  className={"playlist-type-text"}
                >
                  收藏歌单
                  <span className={"playlist-count"}>
                    {playlistCountInfo ? playlistCountInfo : 0}
                  </span>
                </NavLink>
              </div>
              <div className={"playlist-type-header-item"}>
                <NavLink
                  exact
                  to={"/playlist_helper"}
                  className={"playlist-type-text"}
                >
                  歌单助手
                  <span className={"playlist-count"}>beta</span>
                </NavLink>
              </div>
            </div>
            <span className={"playlist-menu"}>歌单操作 {">"}</span>
          </div>
          <Switch>
            <Route
              exact
              path={"/"}
              render={({ match }) => <Playlist data={[1]} />}
            />
            <Route
              exact
              path={"/collection_playlist"}
              render={({ match }) => (
                <div style={{ fontSize: "12px" }}>{match.path}</div>
              )}
            />
          </Switch>
        </Router>
      </div>
    </div>
  );
}
