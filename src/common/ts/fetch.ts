import axios from 'axios'

export const getUserPlaylist = (playlistId: number) =>
    axios.get(`/api/playlist/detail?id=${playlistId}`)

export const getSongUrl = (
    result: { [PropName: string]: any },
    playlist: any[],
    setPlayList: Function
) => {
    const promises = playlist.map((item) =>
        axios.get(`/api/song/url?id=${item.id}`)
    )

    axios.all(promises).then(
        axios.spread((...urls: any[]) => {
            const list = playlist.map(
                (item: typeof playlist[0], index: number) => {
                    const url = urls[index].data.data[0].url
                    return {
                        ...item,
                        url,
                        hasUrl: !!url,
                    }
                }
            )
            result.data.playlist.tracks = list
            setPlayList(result.data.playlist)
        })
    )
}

export const getSongListReview = (playlistId: number) =>
    axios.get(`/api/comment/playlist?id=${playlistId}`)
