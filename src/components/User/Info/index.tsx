import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import "./index.sass";

type Props = {
  userInfo: {
    profile: {
      avatarUrl: string;
      nickname: string;
    };
    level: number;
  };
};

export default function Info({ userInfo }: Props) {
  const history = useHistory();
  const jump = useCallback(() => history.push("/login"), []);
  return (
    <div className={"user-info-container"}>
      <div className={"user-info-content"}>
        <div className={"user-details"}>
          <div className={"user-avatar-container"}>
            <img
              className={"user-avatar"}
              src={`${userInfo.profile.avatarUrl}`}
            />
          </div>
          <div className={"user-description"}>
            {userInfo.profile && userInfo.level ? (
              <>
                <span className={"user-name"}>{userInfo.profile.nickname}</span>
                <div className={"user-exclusive"}>
                  <div className={"vinyl-container"}>
                    <span className={"vinyl"}>黑胶VIP</span>
                  </div>
                  <div className={"user-level-container"}>
                    <span
                      className={"user-level"}
                    >{`LV.${userInfo.level}`}</span>
                  </div>
                </div>
              </>
            ) : (
              <span className={"notLogin"}>登录立享手机电脑多端同步</span>
            )}
          </div>
        </div>
        {userInfo.profile && userInfo.level ? (
          <span className={"open-vip"}>开通黑胶VIP {">"}</span>
        ) : (
          <span className={"loginImmediately"} onClick={jump}>
            立即登录
          </span>
        )}
      </div>
    </div>
  );
}
