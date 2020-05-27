export const SET_FULL_SCREEN = 'SET_FULL_SCREEN'

export const SET_PLAYING = 'SET_PLAYING'

export const SET_PLAYLIST = 'SET_PLAYLIST'

export const SET_CURRENT_INDEX = 'SET_CURRENT_INDEX'

export const SET_CURRENT_SONG = 'SET_CURRENT_SONG'

export const SET_PLAY_MODE = 'SET_PLAY_MODE'

export const SET_PLAY_MODE_ICON = 'SET_PLAY_MODE_ICON'

export const SET_SEQUENCE_LIST = 'SET_SEQUENCE_LIST'

// user constants
export const SET_USER_INFO = 'SET_USER_INFO'

export const SET_USER_PLAYLIST_COUNT = 'SET_USER_PLAYLIST_COUNT'

export const SET_USER_PLAYLIST = 'SET_USER_PLAYLIST'

export const SET_USER_REGISTER_STATE = 'SET_USER_REGISTER_STATE'

export const SET_USER_LOGIN_STATE = 'SET_USER_LOGIN_STATE'

export const SET_LOGIN_STATUS_CODE = 'SET_LOGIN_STATUS_CODE'

// Get song address

export const SET_SONG_ADDRESS = 'SET_SONG_ADDRESS'

type Obj = { [PropName: string]: any }
export type Action =
    | { type: typeof SET_FULL_SCREEN; fullScreen: boolean }
    | { type: typeof SET_PLAYING; playing: boolean }
    | { type: typeof SET_PLAYLIST; playlist: any[] }
    | { type: typeof SET_CURRENT_INDEX; currentIndex: number }
    | { type: typeof SET_CURRENT_SONG; currentSong: Obj }
    | { type: typeof SET_PLAY_MODE; playMode: number }
    | { type: typeof SET_PLAY_MODE_ICON; iconClassName: string }
    | { type: typeof SET_SEQUENCE_LIST; playlist: Obj[] }
    | { type: typeof SET_USER_INFO; userInfo: null }
    | { type: typeof SET_USER_PLAYLIST_COUNT; userPlaylistCountInfo: null }
    | { type: typeof SET_USER_PLAYLIST; userPlaylist: Obj[] }
    | { type: typeof SET_USER_REGISTER_STATE; userRegisterState: boolean }
    | { type: typeof SET_USER_LOGIN_STATE; userLoginState: boolean }
    | { type: typeof SET_LOGIN_STATUS_CODE; loginStatusCode: number }
    | { type: typeof SET_SONG_ADDRESS; songUrl: string }

export type Playlist = {
    user: {
        favoritePlaylist: Obj
        createPlaylist: any[]
    }
    collectionPlayList: any[]
}
export type Params = {
    fullScreen: boolean
    playing: boolean
    playlist: any[]
    currentIndex: number
    currentSong: { [PropName: string]: any }
    playMode: number
    iconClassName: string
    userInfo: Obj
    userPlaylistCountInfo: Obj
    userPlaylist: Playlist
    userRegisterState: boolean
    userLoginState: boolean
    loginStatusCode: number
    songUrl: string
}
