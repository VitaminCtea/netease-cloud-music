import * as constants from '../constants'

export const createAction = <
    T extends constants.Action['type'],
    A extends keyof constants.Params
>(
    type: T,
    ...argNames: A[]
) => (...payloads: [constants.Params[A]]): constants.Action =>
    argNames.reduce(
        (result, current, index) => {
            result[current] = payloads[index] ?? null
            return result
        },
        { type } as any
    )
