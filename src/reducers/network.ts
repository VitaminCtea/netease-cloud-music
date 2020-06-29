import { createReducer } from './createReducer'
import * as constants from 'constants/index'
import { NetworkStatus } from 'actions/network'

export const networkStatus = createReducer(
    NetworkStatus.good,
    constants.SET_NETWORK_STATUS
)
