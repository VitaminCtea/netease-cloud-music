import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import FoundHeader from "common/FoundHeader";
import TouchScroll from "common/TouchScroll";
import AnimationImage from "common/AnimationImage";
import { Loading } from "common/Loading/index";
import { random } from "helper/index";
import { PlayerProps } from "containers/MusicStyle";
import Vip from "common/Vip";
import "./index.sass";

const EXTRACT_NUMBER = 12;

type Props = {
  name: string;
  picUrl: string;
  singer: { [propName: string]: any };
  hasUrl: boolean;
};
const Item = ({ name, picUrl, singer, hasUrl }: Props) => (
  <div className={"newMusic-item"}>
    <div className={"newMusic-image-container"}>
      <AnimationImage
        src={`${picUrl}`}
        alt={name}
        overflow={true}
        inProp={true}
        className={"newMusic-image"}
      />
    </div>
    <div className={"newMusic-right-container"}>
      <div className={"newMusic-info"}>
        <span className={"newMusic-name"}>{name}</span>
        <Vip hasUrl={hasUrl} singer={singer} />
      </div>
      <div className={"icon-newMusic-play-container"}>
        <i
          className={`${
            hasUrl ? "icon-musicStyle-borderPlay" : "icon-musicStyle-disable"
          }`}
        />
      </div>
    </div>
  </div>
);

type MusicStyleProps = {
  updatePlayState: PlayerProps;
};

export default function MusicStyle({ updatePlayState }: MusicStyleProps) {
  const [playlist, setPlayList] = useState<{ [PropName: string]: any }>({});
  const [title, setTitle] = useState<string>("");
  const type = useMemo(() => ["华语", "古风", "欧美", "流行"], []);
  const description = useMemo(
    () => [
      [
        "你在找的好听华语歌",
        "一秒沦陷 华语精选",
        "一人一首华语经典",
        "一秒沦陷 华语精选",
        "走过华语音乐街",
        "精选华语金曲",
        "聆听华语佳曲",
      ],
      [
        "古风 唱罢人间世",
        "古风如茶 满城花城",
        "古风一曲解千愁",
        "古风 一段琴一段情",
        "一曲一唱思华年",
        "古风 赐君一场千秋梦",
      ],
      "欧美流行精选",
      "不可错过的流行单曲",
    ],
    []
  );
  const getPlayListDetails = useMemo(() => {
    return async function () {
      const index = random(0, 3);
      let title = description[index];
      if (typeof title === "object") {
        title = title[random(0, title.length - 1)];
      }
      setTitle(title);
      const res = await axios.get(
        `/api/top/playlist/highquality?cat=${type[index]}&limit=10`
      );
      const lists = res.data.playlists;
      const id = lists[random(0, lists.length - 1)].id;
      const details = await axios.get(`/api/playlist/detail?id=${id}`);
      let songs = details.data.playlist.tracks.filter(Boolean);
      const resultSongs: typeof songs[0] = [];
      for (let i: number = 0; i < EXTRACT_NUMBER; i++) {
        const index = random(0, songs.length - 1);
        resultSongs.push(songs[index]);
        songs.splice(index, 1);
      }
      const promises = resultSongs.map((item: typeof resultSongs[0]) => {
        return axios.get(`/api/song/url?id=${item.id}`);
      });
      axios.all(promises).then(
        axios.spread((...promises: any[]) => {
          const urls = promises.map((item) => item.data.data[0].url);
          const playlist = resultSongs.map(
            (item: typeof resultSongs[0], index: number) => ({
              ...item,
              url: urls[index],
              hasUrl: !!urls[index],
            })
          );
          details.data.playlist.tracks = playlist;
          setPlayList(details.data.playlist);
        })
      );
    };
  }, [title]);
  const transformDataGrouping = useMemo(() => {
    if (playlist.tracks) {
      const data = playlist.tracks;
      const musicItems = [];
      for (let i: number = 0; i < data.length; i += 3) {
        musicItems.push([
          <Item
            name={data[i].name}
            picUrl={data[i].al.picUrl}
            singer={data[i].ar[0]}
            hasUrl={data[i].hasUrl}
            key={uuidv4()}
          />,

          <Item
            name={data[i + 1].name}
            picUrl={data[i + 1].al.picUrl}
            singer={data[i + 1].ar[0]}
            hasUrl={data[i + 1].hasUrl}
            key={uuidv4()}
          />,

          <Item
            name={data[i + 2].name}
            picUrl={data[i + 2].al.picUrl}
            singer={data[i + 2].ar[0]}
            hasUrl={data[i + 2].hasUrl}
            key={uuidv4()}
          />,
        ]);
      }
      return musicItems.map((musicItem: React.ReactChild[]) => {
        return (
          <div className={"newMusic-group"} key={uuidv4()}>
            {musicItem.map((Child: React.ReactNode) => Child)}
          </div>
        );
      });
    }
  }, [playlist]);
  useEffect(() => {
    if (!playlist.tracks) {
      getPlayListDetails();
    } else {
      const items = document.querySelectorAll(".newMusic-item")!;
      for (let i: number = 0; i < items.length; i++) {
        (items[i] as HTMLElement).onclick = () => {
          updatePlayState(playlist.tracks, i);
        };
      }
    }
  }, [playlist]);
  return (
    <div className={"newMusic-container"}>
      <FoundHeader
        description={"曲风推荐"}
        title={`${title}`}
        more={"播放全部"}
      />
      {playlist.tracks ? (
        <TouchScroll>
          <div className={"newMusic-content"}>{transformDataGrouping}</div>
        </TouchScroll>
      ) : (
        <Loading paddingTop={`${(244 / 382) * 100}%`} />
      )}
    </div>
  );
}
