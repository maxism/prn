import axios, { AxiosPromise, CancelToken, CancelTokenSource } from 'axios'
import config from '../config'
import objectUtil from '../utils/ObjectUtil'
import qs from 'qs'

const { apiUrl, analyticsApi } = config

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

export default class APIClient {
  public static async get (method, params = {}, cancel: CancelToken = null): Promise<AxiosPromise> {
    return axios({
      url: apiUrl.concat(method),
      params: objectUtil.removeUndefined(params),
      timeout: 0,
      method: 'get',
      responseType: 'json',
      cancelToken: cancel
    })
  }

  public static async post (method, params = {}, cancel: CancelToken = null): Promise<AxiosPromise> {
    return axios({
      url: apiUrl.concat(method),
      data: objectUtil.removeUndefined(params),
      timeout: 0,
      method: 'post',
      responseType: 'json',
      cancelToken: cancel
    })
  }

  public static async postAnalytics (method, params = {}, cancel: CancelToken = null): Promise<AxiosPromise> {
    return axios({
      url: analyticsApi.concat(method),
      data: objectUtil.removeUndefined(params),
      timeout: 0,
      method: 'post',
      responseType: 'json',
      cancelToken: cancel
    })
  }

  public static async patch (method, params = {}, cancel: CancelToken = null): Promise<AxiosPromise> {
    return axios({
      url: apiUrl.concat(method),
      data: objectUtil.removeUndefined(params),
      timeout: 0,
      method: 'patch',
      responseType: 'json',
      cancelToken: cancel
    })
  }

  public static async delete (method, params = {}, cancel: CancelToken = null): Promise<AxiosPromise> {
    return axios({
      url: apiUrl.concat(method),
      data: objectUtil.removeUndefined(params),
      timeout: 0,
      method: 'delete',
      responseType: 'json',
      cancelToken: cancel
    })
  }

  public static async uploadToCDN (file, token: string, cancel: CancelToken = null): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('fileName', `f.${String(file.name).split('.').pop()}`)
    formData.append('token', token)

    try {
      const data: any = await axios({
        url: apiUrl.concat('cdn/upload'),
        data: formData,
        timeout: 0,
        method: 'post',
        responseType: 'json',
        cancelToken: cancel
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
