import { createAction } from './createAction'
import * as constants from 'constants/index'

export enum NetworkStatus {
    good = 'good',
    error = 'error',
}

export const setNetworkStatus = createAction(
    constants.SET_NETWORK_STATUS,
    'networkStatus'
)
