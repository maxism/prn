import axios, { AxiosPromise, CancelTokenSource } from 'axios'
import config from '../config'
import objectUtil from '../utils/ObjectUtil'
import qs from 'qs'
import moment from 'moment'

let { apiUrl, analyticsApi } = config

axios.interceptors.request.use((response) => {
  response.paramsSerializer = params => {
    params = qs.stringify(params, {
      encodeValuesOnly: true
    })
    return params
  }

  return response
}, (error) => {
  return Promise.reject(error)
})

axios.interceptors.response.use((response) => {
  return response
}, (error) => {
  return Promise.reject(error)
})

let cancelSources: Map<string, CancelTokenSource> = new Map<string, CancelTokenSource>()

export default class APIClient {
  public static async get (method, params = {}, cancel: string = null): Promise<AxiosPromise> {
    // @ts-ignore
    if (!params?.cid && params?.token === '%21%21%21') return
    const time = String(moment().unix() + Math.random())
    console.time(time)
    console.timeLog(time, method, params)
    if (cancel) {
      if (cancelSources.get(cancel)) cancelSources.get(cancel).cancel()
      cancelSources.set(cancel, APIClient.cancelSource())
    }

    console.log(apiUrl.concat(method))
    const ret = await axios({
      url: apiUrl.concat(method),
      params: objectUtil.removeUndefined(params),
      timeout: 0,
      method: 'get',
      responseType: 'json',
      cancelToken: cancel ? cancelSources.get(cancel).token : null
    })

    console.timeEnd(time)

    return ret
  }

  public static async post (method, params = {}, cancel: string = null): Promise<AxiosPromise> {
    if (cancel) {
      if (cancelSources.get(cancel)) cancelSources.get(cancel).cancel()
      cancelSources.set(cancel, APIClient.cancelSource())
    }

    return axios({
      url: apiUrl.concat(method),
      data: objectUtil.removeUndefined(params),
      timeout: 0,
      method: 'post',
      responseType: 'json',
      cancelToken: cancel ? cancelSources.get(cancel).token : null
    })
  }

  public static async getAnalytics (method, params = {}, cancel: string = null): Promise<AxiosPromise> {
    if (cancel) {
      if (cancelSources.get(cancel)) cancelSources.get(cancel).cancel()
      cancelSources.set(cancel, APIClient.cancelSource())
    }

    return axios({
      url: analyticsApi.concat(method),
      params: objectUtil.removeUndefined(params),
      timeout: 0,
      method: 'get',
      responseType: 'json',
      cancelToken: cancel ? cancelSources.get(cancel).token : null
    })
  }

  public static async postAnalytics (method, params = {}, cancel: string = null): Promise<AxiosPromise> {
    if (cancel) {
      if (cancelSources.get(cancel)) cancelSources.get(cancel).cancel()
      cancelSources.set(cancel, APIClient.cancelSource())
    }

    return axios({
      url: analyticsApi.concat(method),
      data: objectUtil.removeUndefined(params),
      timeout: 0,
      method: 'post',
      responseType: 'json',
      cancelToken: cancel ? cancelSources.get(cancel).token : null
    })
  }

  public static async patch (method, params = {}, cancel: string = null): Promise<AxiosPromise> {
    if (cancel) {
      if (cancelSources.get(cancel)) cancelSources.get(cancel).cancel()
      cancelSources.set(cancel, APIClient.cancelSource())
    }

    return axios({
      url: apiUrl.concat(method),
      data: objectUtil.removeUndefined(params),
      timeout: 0,
      method: 'patch',
      responseType: 'json',
      cancelToken: cancel ? cancelSources.get(cancel).token : null
    })
  }

  public static async delete (method, params = {}, cancel: string = null): Promise<AxiosPromise> {
    if (cancel) {
      if (cancelSources.get(cancel)) cancelSources.get(cancel).cancel()
      cancelSources.set(cancel, APIClient.cancelSource())
    }

    return axios({
      url: apiUrl.concat(method),
      data: objectUtil.removeUndefined(params),
      timeout: 0,
      method: 'delete',
      responseType: 'json',
      cancelToken: cancel ? cancelSources.get(cancel).token : null
    })
  }

  public static async uploadToCDN (file: any, token: string, cancel: string = null): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('fileName', `f.${String(file.name).split('.').pop()}`)
    formData.append('token', token)

    if (cancel) {
      if (cancelSources.get(cancel)) cancelSources.get(cancel).cancel()
      cancelSources.set(cancel, APIClient.cancelSource())
    }

    try {
      const data: any = await axios({
        url: apiUrl.concat('cdn/upload'),
        data: formData,
        timeout: 0,
        method: 'post',
        responseType: 'json',
        cancelToken: cancel ? cancelSources.get(cancel).token : null
      })

      return data.data.data.url
    } catch (e) {
      return ''
    }
  }

  public static cancelSource (): CancelTokenSource {
    const CancelToken = axios.CancelToken
    return CancelToken.source()
  }
}
