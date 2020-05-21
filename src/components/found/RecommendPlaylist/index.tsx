import React, { useCallback } from "react";
import { addChineseUnit } from "helper/index";
import { useDataApi } from "hooks/fetchData";
import AnimationImage from "common/AnimationImage";
import Recommend from "common/RecommendList";
import "./index.sass";

export default function RecommendPlayList({ quantity }: { quantity: string }) {
  const setPlayCountAddUnit = useCallback(
    (count: number) => addChineseUnit(count),
    []
  );
  const [state] = useDataApi("/personalized", [], {
    params: { limit: quantity },
  });
  return (
    <Recommend
      prefixClassName={"recommend"}
      description={"推荐歌单"}
      title={"为你精挑细选"}
      more={"查看更多"}
    >
      {state.isRender ? (
        state.data.result.map((info: any) => (
          <div className={"recommend-item"} key={`${info.name}`}>
            <div className={"recommend-playlist-media"}>
              <AnimationImage
                className={"recommend-image"}
                src={`${info.picUrl}`}
                alt={`${info.copywriter}`}
                inProp={true}
                overflow={true}
              />
              <div className={"recommend-playlist-container"}>
                <div className={"recommend-playCount"}>
                  <i className={"icon-recommend-playCount"} />
                  <span className={"count"}>
                    {setPlayCountAddUnit(info.playCount)}
                  </span>
                </div>
              </div>
            </div>
            <div className={"recommend-text"}>
              <p className={"recommend-name"}>{info.name}</p>
            </div>
          </div>
        ))
      ) : (
        <div className={"recommend-item"} />
      )}
    </Recommend>
  );
}
