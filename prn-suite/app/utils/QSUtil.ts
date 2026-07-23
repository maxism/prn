import qs from 'qs'

/**
 * Утилита для работы со строкой запросов
 */
export default class QSUtil {
  /**
   * Метод возвращает объект, расшифорванный из URL-запросов адресной строки
   *
   * @param url
   */
  static parse (url: string): object {
    return qs.parse(url, {
      ignoreQueryPrefix: true,
      arrayLimit: 1000
    })
  }

  /**
   * Метод возвращает объект без параметров со значением undefined
   *
   * @param url
   * @param params
   * @param removeParams
   */
  static stringify (url: string, params: object, removeParams: Array<string> = []): string {
    if (removeParams.length) {
      for (const prop of removeParams) {
        delete params[prop]
      }
    }

    return `${url}${qs.stringify(params, {
      encodeValuesOnly: true,
      addQueryPrefix: true
    })}`
  }
}
