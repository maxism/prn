import qs from 'qs'
import { SingletonRouter } from 'next/router'

// @ts-ignore
interface IRouter<T> extends SingletonRouter {
  query: Partial<T>
}

interface IOptions {
  shallow?: boolean;
  locale?: string | false;
  scroll?: boolean;
  hash?: string
}

/**
 * Утилита для работы с роутером
 */
export default class RouterUtil {
  /**
   * Метод замены параметров
   *
   * @param router
   * @param params
   * @param options
   */
  static replaceParams<T> (router: IRouter<T>, params: Partial<T>, options: IOptions = { scroll: false, shallow: true, hash: '' }): void {
    const newParams = { ...router.query, ...params }

    router.replace(`?`.concat(qs.stringify(newParams, { encode: false })).concat(options.hash ? `#${options.hash}` : ''), undefined, options)
  }

  static getBackUrl<T> (router: IRouter<T>): string {
    return encodeURIComponent(router.asPath)
  }
}
