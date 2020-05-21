import React from "react";
import styled, { keyframes } from "styled-components";

type StyledProps = { width?: string; height?: string; paddingTop?: string };
const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center
    width: ${(props: StyledProps) => (props.width ? props.width : "100%")};
    height: ${(props: StyledProps) => (props.height ? props.height : "auto")};
    position: relative;
    &:after {
        content: '';
        display: inline-block;
        padding-top: ${(props: StyledProps) =>
          props.paddingTop ? props.paddingTop : 0};
    }
`;

const LoadingContent = styled.div`
  display: inline-block;
  font-size: 0;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const LoadingGif = styled.div`
  display: inline-block;
  height: 36px;
  vertical-align: middle;
`;

const load = keyframes`
    0%, 40%, 100% {
        transform: scaleY(0.4);
    }  
    20% {
        transform: scaleY(1.0);
    }
`;

const Span = styled.span`
  display: inline-block;
  margin-right: 4px;
  width: 2px;
  height: 100%;
  background-color: #ff1d11;
  border-radius: 20px;
  animation: ${load} 1.2s ease-in-out infinite;
  &:nth-child(2) {
    animation-delay: -1.1s;
  }
  &:nth-child(3) {
    animation-delay: -1s;
  }
  &:nth-child(4) {
    animation-delay: -0.9s;
  }
  &:nth-child(5) {
    animation-delay: -0.8s;
  }
`;

const TextSpan = styled.span`
  display: inline-block;
  font-size: 12px;
  line-height: 36px;
  vertical-align: middle;
  padding-left: 4px;
`;

type Props = StyledProps;
export const Loading = ({ height, width, paddingTop }: Props) => (
  <LoadingContainer height={height} width={width} paddingTop={paddingTop}>
    <LoadingContent>
      <LoadingGif>
        {Array.from({ length: 5 }).map((item, index: number) => (
          <Span key={index} />
        ))}
      </LoadingGif>
      <TextSpan>努力加载中...</TextSpan>
    </LoadingContent>
  </LoadingContainer>
);
