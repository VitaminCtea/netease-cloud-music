import React from 'react'
import { RouterTransition } from 'common/RouterTransition'
import './index.sass'

const Playlist = React.lazy(() => import('containers/Playlist'))

// function flow(steps: Function[], done: Function) {
//     function factory() {
//         let used = false
//         return function next() {
//             if (used) return
//             used = true
//             let step = steps.shift()
//             if (step && typeof step === 'function') {
//                 const args = Array.from(arguments)
//                 const err = args.shift()
//                 if (err) {
//                     done(err)
//                     return
//                 }
//                 args.push(factory())
//                 step.apply(null, args)
//             } else {
//                 done.apply(null, arguments)
//             }
//         }
//     }
//     const start = factory()
//     return start()
// }
//
// const one = (next: Function) => next('', 2)
// const second = (res: number, next: Function) => next('', res * 2)
// const third = (res: number, next: Function) => next('', res * 34)
//
// flow([one, second, third], (err: any, res: any) => {
//     if (err) throw err
//     console.log(res)
// })

export default function FavoriteMusic() {
    return (
        <RouterTransition className={'favoriteList-container'}>
            <Playlist />
        </RouterTransition>
    )
}
