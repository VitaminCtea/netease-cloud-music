import React from "react";
import styled from "styled-components";

const NormalDescription = styled.div`
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SongPermissionsContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 0;
`;

const VipDescription = styled.span`
  font-size: 12px;
`;

const IconVip = styled.i`
  font-size: 16px;
  margin-right: 6px;
`;

type Props = {
  hasUrl: boolean;
  singer: { [propName: string]: any };
};
export default function Vip({ hasUrl, singer }: Props) {
  if (hasUrl) {
    return <NormalDescription>{singer.name}</NormalDescription>;
  }
  return (
    <SongPermissionsContainer>
      <IconVip className={"icon-song_vip"} />
      <VipDescription>{singer.name}</VipDescription>
    </SongPermissionsContainer>
  );
}
