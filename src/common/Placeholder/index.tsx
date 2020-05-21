import React from "react";
import styled from "styled-components";

const style = window.getComputedStyle(document.documentElement, null);
const fontSize = (rect: number) =>
  rect / parseInt(style.getPropertyValue("font-size"), 10);

type Props = {
  rect?: number;
};
const Container = styled.div`
  height: ${(props: Props) => fontSize(props.rect!)}rem;
  overflow: hidden;
`;

export default function Placeholder({ rect = 55 }: Props) {
  return <Container rect={rect} />;
}
