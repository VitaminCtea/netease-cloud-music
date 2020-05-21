import React from "react";
import FoundHeader from "../FoundHeader";

type Props<T = string> = {
  children: React.ReactNode;
  prefixClassName: T;
  description: T;
  title: T;
  more: T;
};
export default function Recommend({
  prefixClassName,
  description,
  title,
  more,
  children,
}: Props) {
  return (
    <div className={`${prefixClassName}-container`}>
      <FoundHeader description={description} title={title} more={more} />
      {
        <div className={`${prefixClassName}-scroll-container`}>
          <div className={`${prefixClassName}-scroll-content`}>{children}</div>
        </div>
      }
    </div>
  );
}
