import * as constants from 'constants/index'
import { PlayMode, playModeIconClassNames } from 'actions/player'
import { createReducer } from './createReducer'

export const fullScreen = createReducer(false, constants.SET_FULL_SCREEN)

export const playing = createReducer(false, constants.SET_PLAYING)

export const playlist = createReducer([], constants.SET_PLAYLIST)

export const sequenceList = createReducer([], constants.SET_SEQUENCE_LIST)

export const currentIndex = createReducer(-1, constants.SET_CURRENT_INDEX)

export const currentSong = createReducer(null, constants.SET_CURRENT_SONG)

export const playMode = createReducer(
    PlayMode.listCirculation,
    constants.SET_PLAY_MODE
)

export const playModeIconClassName = createReducer(
    playModeIconClassNames[0],
    constants.SET_PLAY_MODE_ICON
)
