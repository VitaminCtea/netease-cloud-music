const strategies = {
    isNonEmpty: (value: string, errorMsg: string) => {
        if (!value.length) return errorMsg
    },
    minLength: (value: string, length: number, errorMsg: string) => {
        if (value.length < length) return errorMsg
    },
    isMobile: (value: string, errorMsg: string) => {
        if (!/^1[358][0-9]{9}$/.test(value)) return errorMsg
    },
    isCorrectFormat: (value: string, errorMsg: string) => {
        if (!/^[A-Za-z]\w{7}$/.test(value)) return errorMsg
    },
}

export class ValidateForm {
    cache: any[] = []

    addRule(
        dom: HTMLInputElement,
        rules: { strategy: string; errorMsg: string }[]
    ) {
        for (let i: number = 0, rule; (rule = rules[i++]); ) {
            const strategyAry = rule.strategy.split(':')
            const errorMsg = rule.errorMsg
            this.cache.push(function () {
                const strategy = strategyAry.shift() as keyof typeof strategies
                strategyAry.unshift(dom.value)
                strategyAry.push(errorMsg)
                return (strategies[strategy] as any).apply(dom, strategyAry)
            })
        }
    }

    check() {
        for (let i: number = 0, checkFunc; (checkFunc = this.cache[i++]); ) {
            const errorMsg = checkFunc()
            if (errorMsg) return errorMsg
        }
    }
}
