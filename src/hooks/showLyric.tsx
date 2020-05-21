import React, { useEffect, useState, useMemo } from "react";

type LyricProps = {
  currentSong: { [PropName: string]: any };
  time: number;
};
export function useLyric(
  currentSong: LyricProps["currentSong"],
  time: LyricProps["time"]
) {
  const [lyrics, setLyrics] = useState<string>("");
  useEffect(() => {
    if (currentSong) {
      setLyrics(currentSong!.ar[0].name);
    }
  }, [currentSong]);
  const lyric = useMemo(() => {
    if (currentSong?.lyric?.length) {
      for (let i: number = 0; i < currentSong.lyric.length; i++) {
        if (Math.floor(time) === currentSong!.lyric[i].time) {
          setLyrics(currentSong!.lyric[i].txt);
          return currentSong!.lyric[i].txt;
        }
      }
      return false;
    }
  }, [time, currentSong, lyrics]);
  return lyric ? lyric : lyrics;
}
