import React from 'react'
import styled from 'styled-components'

const style: CSSStyleDeclaration = window.getComputedStyle(
    document.documentElement,
    null
)
const fontSize = style as typeof style & {
    'font-size': string
}

const RefreshContainer = styled.div`
    padding: ${30 / parseInt(fontSize['font-size'], 10)}rem 0;
`

const RefreshContent = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0;
    text-align: center;
`

const defaultStyle = (props: SpanProps) => ({
    color: props.color,
    marginRight: props.marginRight,
    fontSize: props.size,
    letterSpacing: props.letterSpacing,
})

const RefreshIcon = styled.i(defaultStyle)

const SpanBase = styled.span(defaultStyle)

type SpanProps = {
    color: string
    size?: string
    text?: string
    className?: string
    marginRight?: string
    letterSpacing?: string
}
const RefreshSpan = (props: SpanProps) => {
    const { text, ...attrs } = props
    return (
        <SpanBase {...{ ...attrs, size: '12px', letterSpacing: '1px' }}>
            {text}
        </SpanBase>
    )
}

type Props = {
    refresh: (event: React.SyntheticEvent) => void
}
export default function Refresh({ refresh }: Props) {
    return (
        <RefreshContainer>
            <RefreshContent onClick={refresh}>
                <RefreshIcon
                    color={'#4F7DAF'}
                    className={'icon-refresh'}
                    size={'16px'}
                    marginRight={'4px'}
                />
                <RefreshSpan
                    color={'#4F7DAF'}
                    text={'点击刷新'}
                    marginRight={'4px'}
                />
                <RefreshSpan color={'#999999'} text={'换一批内容'} />
            </RefreshContent>
        </RefreshContainer>
    )
}
