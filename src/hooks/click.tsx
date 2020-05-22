import React, { useCallback } from 'react'

export const useClick = (dispatch: (...args: any[]) => any, params: any[]) => {
    let selectItem = useCallback(
        (e: React.SyntheticEvent) => {
            const target = e.target as HTMLElement
            const items = Array.from(target.children)
            for (let i: number = 0; i < items.length; i++) {
                dispatch(params, items.indexOf(items[i]))
            }
        },
        [params]
    )
    return selectItem
}
