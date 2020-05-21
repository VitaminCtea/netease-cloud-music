import React from "react";
import "./index.sass";

type RecommendProps<S = string> = {
  description: S;
  title: S;
  more: S;
};
export default function RecommendBase({
  description,
  title,
  more,
}: RecommendProps) {
  return (
    <>
      <div className={"found-content"}>
        <span className={"found-playlist"}>{description}</span>
        <div className={"found-description"}>
          <span className={"found-title"}>{title}</span>
          <span className={"found-more"}>{more}</span>
        </div>
      </div>
    </>
  );
}
