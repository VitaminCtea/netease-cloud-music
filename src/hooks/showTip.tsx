import React, { useReducer } from 'react'
import { MessageType } from 'common/Tip'

type Props = {
    message?: string
    enabled?: boolean
    type?: MessageType
}
const init = (props?: Props) => ({
    message: props?.message ?? '',
    enabled: props?.enabled ?? false,
    type: props?.type ?? 'warning',
})

type ReducerAction =
    | { type: MessageType; value: string }
    | { type: 'reset'; payload: Props }
function reducer(state: ReturnType<typeof init>, action: ReducerAction) {
    switch (action.type) {
        case 'success':
        case 'warning':
        case 'error':
            return { enabled: true, message: action.value, type: action.type }
        case 'reset':
            return init({ ...state, ...action.payload })
        default:
            throw new Error()
    }
}

export function useTip(props?: Props) {
    const [state, dispatch] = useReducer(reducer, props, init)
    return [state, dispatch] as const
}
