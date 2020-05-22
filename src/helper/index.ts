export function padZero(num: number, digits: number = 2) {
    const convertString = num + ''
    return '0000'.substr(0, digits - convertString.length) + convertString
}

/**
 * @param digital {number} - 待转换为带中文单位的数字
 * @param decimalDigit {number} - 保留几位小数(默认保留2位)
 * @param isFloor {boolean} - 是否要进行向下取整
 * @return 转换为带中文单位表示的字符串
 *
 * @example
 * addChineseUnit(12345) //= 1.23万
 * addChineseUnit(12345567) //= 1234.56万
 * addChineseUnit(123456780) //= 1.23亿
 * addChineseUnit(1234567800) //= 12.35亿
 *
 * @description
 * 1.拿到数字之后, 通过不断除以10, 得到数字的位数
 * 2.通过判断位数是不是大于3, 因为位数大于3是万以上的数. 位数小于3的话, 那么直接返回原数!
 * 3.如果得到的位数大于3, 说明是万以上的数字, 那么需要其判断是不是亿(通过除以8, 来判断是不是亿, 大于0, 则是亿, 否则亿以下的数字, 那么单位为万(万 -- 亿之间都是万为单位))
 * 4.计算的过程原理是: 如果是亿以下的话, 那么需其拿到数字的位数, 然后对8进行取余, 取余的结果不能大于等于5, 如果大于等于的话, 将其重置为4
 * 然后用原数字/(10的第(remainder + multiple - decimalDigit)次方), 再进行除以10的(保留小数位数的次方)
 * 如: 10000000(1千万) -> 100000(10万) -> 1000 -> 结果为1000万
 * 如果数字是亿为单位的话(通过位数除以8判断), 需其判断是几亿(通过位数除以8之后, 如果是8的倍数的话, 需要用原数字除以(10的8乘以8的倍数次方), 即可得到是几亿),
 * 拿到这些的东西, 再对这个几亿进行查看位数, 如果位数小于3, 和前面的过程一样
 * 如: 100000000(1亿) -> 1000000(1百万) -> 100 -> 结果为1亿
 * */
export function addChineseUnit(
    digital: number,
    isFloor: boolean = true,
    decimalDigit: number = 2
) {
    const integer = Math.floor(digital)
    const digit = getDigits(integer)
    const UNIT = '亿'
    let result = ''
    if (digit > 3) {
        const multiple = Math.floor(digit / 8)
        if (multiple >= 1) {
            const temp = Math.round(integer / Math.pow(10, 8 * multiple))
            result += addUnit(
                temp,
                digital,
                isFloor,
                8 * multiple,
                decimalDigit
            )
            isFloor && (result = Math.floor(+result) + '')
            for (let i: number = 0; i < multiple; i++) {
                result += UNIT
            }
            return result
        } else {
            return addUnit(integer, digital, isFloor, 0, decimalDigit)
        }
    } else {
        return digital + ''
    }
}

function addUnit(
    integer: number,
    number: number,
    isFloor: boolean,
    multiple: number,
    decimalDigit: number
) {
    const digit = getDigits(integer)
    const UNIT = '万'
    if (digit > 3) {
        let remainder = digit % 8
        if (remainder >= 5) remainder = 4
        const result =
            Math.round(
                number / Math.pow(10, remainder + multiple - decimalDigit)
            ) / Math.pow(10, decimalDigit)
        return isFloor ? Math.floor(result) + UNIT : result + UNIT
    } else {
        const result =
            Math.round(number / Math.pow(10, multiple - decimalDigit)) /
            Math.pow(10, decimalDigit)
        return isFloor ? Math.floor(result) : result
    }
}

function getDigits(integer: number) {
    let digit = -1
    while (integer >= 1) {
        digit++
        integer /= 10
    }
    return digit
}

export function on(
    el: any,
    eventName: string,
    callback: (e: Event) => void,
    opts: { capture: boolean; passive: boolean } | boolean = false
) {
    if (el.addEventListener) {
        el.addEventListener(eventName, callback, opts)
    } else if (el.attachEvent) {
        el.attachEvent(`on${eventName}`, (e: Event) => {
            callback.call(el, e || window.event)
        })
    }
}

export function off(
    el: any,
    eventName: string,
    callback: (e: Event) => void,
    opts: { capture: boolean; passive: boolean } | boolean = false
) {
    if (el.removeEventListener) {
        el.removeEventListener(eventName, callback, opts)
    } else if (el.detachEvent) {
        el.detachEvent(`on${eventName}`, callback)
    }
}

export function throttle(
    fn: (...args: any) => any,
    threshold: number = 250,
    context?: any
) {
    let last: number
    let deferTimer: number
    return function (this: null) {
        context = context || this
        let now = +new Date()
        let args = arguments
        if (last && now < last + threshold) {
            clearTimeout(deferTimer)
            deferTimer = setTimeout(() => {
                last = now
                fn.apply(context, args as any)
            }, threshold)
        } else {
            last = now
            fn.apply(context, args as any)
        }
    }
}

export function debounce(
    func: (...args: any[]) => any,
    wait: number,
    immediate?: boolean
) {
    let timeout: number | null
    let args: any
    let context: any
    let timestamp: number
    let result: any
    const later = function later() {
        const last = +new Date() - timestamp
        if (last < wait && last >= 0) {
            timeout = setTimeout(later, wait - last)
        } else {
            timeout = null
            if (!immediate) {
                result = func.apply(context, args)
                if (!timeout) {
                    context = null
                    args = null
                }
            }
        }
    }
    return function debounced(this: null) {
        context = this
        args = arguments
        timestamp = +new Date()
        const callNow = immediate && !timeout
        if (!timeout) timeout = setTimeout(later, wait)
        if (callNow) {
            result = func.apply(context, args)
            context = null
            args = null
        }
        return result
    }
}

export const isString = (str: any): str is string => typeof str === 'string'

export const random = (start: number, end: number) =>
    Math.floor(Math.random() * (end - start + 1) + start)

export function hasClassName(el: HTMLElement, className: string) {
    const classNameRegex = new RegExp('(^|\\s+)' + className + '(\\s+|$)', 'g')
    return classNameRegex.test(el.className)
}

export function addClassName(el: HTMLElement, className: string) {
    if (hasClassName(el, className)) return
    const elementClassName = el.className
    const classNames = elementClassName.split(' ')
    classNames.push(className)
    el.className = classNames.join(' ')
}

export function removeClassName(el: HTMLElement, className: string) {
    if (!hasClassName(el, className)) return
    const classNames = el.className.split(' ')
    const index = classNames.findIndex((name: string) => name === className)
    if (index !== -1) {
        classNames.splice(index, 1)
    }
    el.className = classNames.join(' ')
}

function swap(index1: number, index2: number, list: any[]) {
    ;[list[index1], list[index2]] = [list[index2], list[index1]]
}

export function shuffle(arr: any[]) {
    const list = arr.slice()
    for (let i: number = 0; i < list.length; i++) {
        const randomIndex = random(0, i)
        swap(i, randomIndex, list)
    }
    return list
}

type LyricResultArray = { time: number; txt: string }[]
export function parsingLyrics(lyric: string) {
    if (lyric == null || !lyric.length) return []
    const arr = lyric.split(/[\n\r]/)
    const timeRegex = /\[(\d{2}):(\d{2})(?:\.\d+)?\]/
    return arr
        .reduce((result: LyricResultArray, current: string) => {
            const matchingTime = timeRegex.exec(current)
            if (matchingTime) {
                const txt = current.replace(timeRegex, '').trim()
                if (txt) {
                    result.push({
                        time: (matchingTime[1] as any) * 60 + +matchingTime[2],
                        txt,
                    })
                }
            }
            return result
        }, [])
        .sort((a, b) => a.time - b.time)
}

export const hasOwnProperty = <O, K extends string>(obj: O, key: K) =>
    Object.prototype.hasOwnProperty.call(obj, key)

export function transformUrl(url: string, obj: { [PropName: string]: any }) {
    let result: string[] = []
    url = url.indexOf('?') === -1 ? url + '?' : url
    for (let key in obj) {
        if (hasOwnProperty(obj, key)) {
            result.push(
                encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])
            )
        }
    }
    return url + result.join('&')
}
