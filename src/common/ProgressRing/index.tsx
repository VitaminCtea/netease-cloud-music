import React, { useMemo, useState } from "react";
import styled from "styled-components";

const ProgressContainer = styled.div`
  position: relative;
  width: 32px;
  height: 32px;
`;

const Circle = styled.circle`
  stroke-width: 4px;
  transform-origin: center;
  &.progress_circle {
    transform: scale(0.9) rotate(-90deg);
    stroke: #ff1d11;
  }
`;

type Props = {
  children: React.ReactNode;
  percent: number;
  miniPlayerControlsPlay: (e: any) => void;
};

export default function ProgressRing({
  children,
  percent = 314,
  miniPlayerControlsPlay,
}: Props) {
  const [perimeter] = useState<number>(Math.PI * 100);
  const dashArray = useMemo(() => (1 - percent) * perimeter, [percent]);
  return (
    <ProgressContainer className={"progress_container"}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        width={"32"}
        height={"32"}
        viewBox={"0 0 100 100"}
      >
        <Circle
          cx="50"
          cy="50"
          r="50"
          fill="transparent"
          className={"progress_circle"}
          strokeDasharray={`${perimeter}`}
          strokeDashoffset={`${isNaN(dashArray) ? perimeter : dashArray}`}
          onClick={miniPlayerControlsPlay}
        />
      </svg>
      {children}
    </ProgressContainer>
  );
}
