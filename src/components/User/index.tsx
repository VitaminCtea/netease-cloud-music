import React, { useMemo } from "react";
import Placeholder from "common/Placeholder";
import Info from "./Info";
import Music from "./Music";
import UserManagement from "./UserManagement";
import RecentlyPlayed from "./RecentlyPlayed";
import PlaylistType from "./PlaylistType";
import "./index.sass";

export default function My({ userInfo }: any) {
  const defaultUserInfo = useMemo(
    () => ({
      profile: {
        avatarUrl: "",
        nickname: "xxx",
      },
      level: 0,
    }),
    []
  );
  return (
    <div className={"my-container"}>
      <Placeholder />
      <div className={"my-content"}>
        <div
          className={"user-backgroundImage"}
          style={{
            backgroundImage: `url(${
              userInfo ? userInfo.profile.backgroundUrl : ""
            })`,
          }}
        />
        <Info userInfo={userInfo ? userInfo : defaultUserInfo} />
        <UserManagement />
        <Music />
        <RecentlyPlayed />
        <PlaylistType playlistCountInfo={null} />
      </div>
    </div>
  );
}
