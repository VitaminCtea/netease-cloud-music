export const DURATION = 200

type Style = (initialPosition: string, targetPosition?: number | string) => any

const createDefaultStyle: Style = (initialPosition, duration = DURATION) => ({
    // 80px
    transition: `all ${duration}ms ease-in`,
    opacity: 0,
    transform: `translate3d(0, ${initialPosition}, 0)`,
})

const createTransitionStyle: Style = (initialPosition, targetPosition) => ({
    entered: {
        opacity: 1,
        transform: `translate3d(0, ${targetPosition}, 0)`,
    },
    exited: {
        opacity: 0,
        transform: `translate3d(0, ${initialPosition}, 0)`,
    },
})

export const pageDefaultStyle = createDefaultStyle('80px')
export const pageTransitionStyle = createTransitionStyle('80px', 0)

export const miniPlayerDefaultStyle: Style = (
    initialPosition,
    targetPosition
) => {
    return {
        defaultStyle: createDefaultStyle(initialPosition),
        transitionStyle: createTransitionStyle(initialPosition, targetPosition),
    }
}
