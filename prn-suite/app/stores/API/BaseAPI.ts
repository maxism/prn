import axios, { AxiosPromise, CancelToken, CancelTokenSource } from 'axios'
import config from '../../config'
import objectUtil from '../../utils/ObjectUtil'
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

export default class BaseAPI {
  async get (method, params = {}, cancel: CancelToken = null): Promise<AxiosPromise> {
    return axios({
      url: apiUrl.concat(method),
      params: objectUtil.removeUndefined(params),
      timeout: 0,
      method: 'get',
      responseType: 'json',
      cancelToken: cancel
    })
  }

  async post (method, params = {}, cancel: CancelToken = null): Promise<AxiosPromise> {
    return axios({
      url: apiUrl.concat(method),
      data: objectUtil.removeUndefined(params),
      timeout: 0,
      method: 'post',
      responseType: 'json',
      cancelToken: cancel
    })
  }

  async postAnalytics (method, params = {}, cancel: CancelToken = null): Promise<AxiosPromise> {
    return axios({
      url: analyticsApi.concat(method),
      data: objectUtil.removeUndefined(params),
      timeout: 0,
      method: 'post',
      responseType: 'json',
      cancelToken: cancel
    })
  }

  async patch (method, params = {}, cancel: CancelToken = null): Promise<AxiosPromise> {
    return axios({
      url: apiUrl.concat(method),
      data: objectUtil.removeUndefined(params),
      timeout: 0,
      method: 'patch',
      responseType: 'json',
      cancelToken: cancel
    })
  }

  async delete (method, params = {}, cancel: CancelToken = null): Promise<AxiosPromise> {
    return axios({
      url: apiUrl.concat(method),
      data: objectUtil.removeUndefined(params),
      timeout: 0,
      method: 'delete',
      responseType: 'json',
      cancelToken: cancel
    })
  }

  public static cancelSource (): CancelTokenSource {
    const CancelToken = axios.CancelToken
    return CancelToken.source()
  }
}
