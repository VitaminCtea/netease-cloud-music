import React, { useRef, useEffect } from "react";

export function useInterval(
  callback: Function = () => {},
  delay: number | null
) {
  const savedCallback = useRef<typeof callback>(() => {});
  useEffect(() => {
    savedCallback.current = callback;
    const tick = () => savedCallback.current();
    if (delay != null) {
      let timer = setInterval(tick, delay);
      return () => clearInterval(timer);
    }
  }, [delay]);
}
