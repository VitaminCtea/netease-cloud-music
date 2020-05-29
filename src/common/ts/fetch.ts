import axios from 'axios'

export const getUserPlaylist = (playlistId: number) =>
    axios.get(`/api/playlist/detail?id=${playlistId}`)

export const checkSongUrl = (playlist: any[]) => {
    return playlist.map((item) =>
        axios.get(`/api/check/music?id=${item.id}`)
    )
}
