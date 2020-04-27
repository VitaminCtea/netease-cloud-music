import axios from 'axios'

const instance = axios.create()
const baseURL = '/api'

instance.defaults.baseURL = baseURL
instance.defaults.timeout = 2500

export function request(url: string, requestFunc?: (...args: any[]) => any, responseFunc?: (...args: any[]) => any) {
    instance.interceptors.request.use(function (config) {
        if (requestFunc) requestFunc(config)
        return config
    }, function (error) {
        return Promise.reject(error)
    })
    return new Promise(async function (resolve) {
        const result = await axios.get(`${ baseURL }${ url }`)
        resolve(result.data)
    })
}
