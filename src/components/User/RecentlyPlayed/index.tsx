import React from "react";
import "./index.sass";

export default function RecentlyPlayed() {
  return (
    <div className={"recent-play-container"}>
      <div className={"recent-play-header"}>
        <span className={"recent-play-header-text"}>最近播放</span>
        <span className={"recent-play-header-more"}>更多 {">"}</span>
      </div>
      <div className={"recent-play-content"}>
        <div className={"recent-play-item"}>
          <div className={"recent-play-image-container"}>
            <img className={"recent-play-image"} />
            <i className={"recent-play-icon"}>图标</i>
          </div>
          <div className={"recent-play-description"}>
            <span className={"play-all"}>全部已播放歌曲</span>
            <span className={"play-count"}>300首</span>
          </div>
        </div>
        <div className={"recent-play-item"}>
          <div className={"recent-play-image-container"}>
            <img className={"recent-play-image"} />
            <i className={"recent-play-icon"}>图标</i>
          </div>
          <div className={"recent-video-description"}>
            <span className={"recent-video-description-text"}>
              视频: 五月微风EP5:
              施柏宇朗读徐志摩hi斯哈斯hi时候死hi上海市内斯Hi好
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
