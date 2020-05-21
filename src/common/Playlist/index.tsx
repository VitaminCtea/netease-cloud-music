import React from "react";
import { v4 as uuidv4 } from "uuid";
import "./index.sass";

type Props = {
  data: any[];
};
export default function Playlist({ data }: Props) {
  return (
    <ul className={"playlist-list"}>
      {data &&
        data.map((item) => (
          <li className={"playlist-item"} key={uuidv4()}>
            <div className={"playlist-item-image-container"}>
              <img src={``} className={"playlist-item-image"} />
            </div>
            <div className={"playlist-item-description"}>
              <span className={"playlist-item-name"}>煲机音乐</span>
              <span className={"playlist-item-song-count"}>2首</span>
            </div>
          </li>
        ))}
    </ul>
  );
}
