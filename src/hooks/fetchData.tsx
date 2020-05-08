import { useEffect, useReducer, useState } from 'react'
import axios from 'axios'

type State = { isLoading: boolean; isError: boolean; isRender: boolean; data: any }
type ActionKey = 'FETCH_INIT' | 'FETCH_SUCCESS' | 'FETCH_FAILURE'
type Action = { type: ActionKey; payload?: any }

const dataFetchReducer = (state: State, action: Action) => {
    switch (action.type) {
        case 'FETCH_INIT':
            return { ...state, isLoading: true, isError: false, isRender: false }
        case 'FETCH_SUCCESS':
            return { ...state, isLoading: false, isError: false, isRender: true, data: action.payload }
        case 'FETCH_FAILURE':
            return { ...state, isLoading: false, isError: true, isRender: false }
        default:
            throw new Error()
    }
}
type RequestType = 'get' | 'GET' | 'delete' | 'DELETE' | 'head' | 'HEAD' | 'options' | 'OPTIONS' | 'post' | 'POST' | 'put' | 'PUT' | 'patch' | 'PATCH' | 'link' | 'LINK' | 'unlink' | 'UNLINK'
type AxiosConfig = {
    baseURL?: string
    params?: object
    data?: object
    transformRequest?: (<T = any>(data: T, headers: object) => T)[]
    transformResponse?: (<T = any>(data: T) => T)[]
    headers?: object
    paramsSerializer?: (params: AxiosConfig['params']) => string
    timeout?: number
    withCredentials?: false
    auth?: {
        username: string
        password: string
    }
    onUploadProgress?: (progressEvent: Event) => void
    onDownloadProgress?: (progressEvent: Event) => void
}

const instance = axios.create()
instance.defaults.baseURL = '/api'

export const useDataApi = (initialUrl: string, initialData: any, config: AxiosConfig = {}, requestType: RequestType = 'get') => {
    const [ url, setUrl ] = useState(initialUrl)
    const [ state, dispatch ] = useReducer(dataFetchReducer, {
        isLoading: false,
        isError: false,
        isRender: false,
        data: initialData
    })
    useEffect(() => {
        let didCancel = false
        const requestData = async () => {
            dispatch({ type: 'FETCH_INIT' })
            try {
                // @ts-ignore
                const res = await instance[requestType.toLocaleLowerCase()](initialUrl, { method: requestType, ...config })
                if (!didCancel && res.status === 200) {
                    dispatch({ type: 'FETCH_SUCCESS', payload: res.data })
                }
            } catch (e) {
                dispatch({ type: 'FETCH_FAILURE' })
            }
        }
        requestData()
        return () => {
            didCancel = true
        }
    }, [url])
    return [ state, setUrl ] as const
}