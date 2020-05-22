import React, { useRef, useEffect, useCallback } from 'react'
import styled from 'styled-components'

const Button = styled.button`
    width: 100%;
    border: none;
    outline: none;
    border-radius: 20px;
    background-color: #ccc;
    padding: 10px 16px;
    color: #fff;
`

type Props = {
    setCallback: Function
    isComplete: boolean
    children: React.ReactNode
    isRegister: boolean
}

export default function NextStep({
    setCallback,
    isComplete,
    isRegister = false,
    children,
}: Props) {
    const buttonRef: React.RefObject<HTMLButtonElement> = useRef(null)
    const nextStep = useCallback((e: Event) => {
        e.preventDefault()
        if (isRegister) {
            setCallback()
        } else {
            setCallback((count: number) => count + 1)
        }
    }, [])
    useEffect(() => {
        buttonRef!.current!.style.backgroundColor = '#ccc'
        if (isComplete) {
            buttonRef!.current!.disabled = false
            buttonRef!.current!.style.backgroundColor = '#FF1D11'
            buttonRef!.current!.addEventListener('click', nextStep, false)
        }
        return () => {
            buttonRef!.current!.removeEventListener('click', nextStep)
        }
    }, [isComplete])
    return (
        <Button disabled ref={buttonRef}>
            {children}
        </Button>
    )
}
