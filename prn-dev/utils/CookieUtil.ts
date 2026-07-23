import { NextPageContext } from 'next'
import cookieCutter from 'cookie-cutter'
import Cookies from 'cookies'
import AppUtil from './AppUtil'

/**
 * Утилита для работы с cookies
 */
export default class CookieUtil {
  /**
   * Получение
   */
  static get (ctx: NextPageContext, name: string): string {
    // Сервер
    if (!!ctx?.req) {
      const cookies = new Cookies(ctx.req, ctx.res)

      return cookies.get(name)
    }
    // Браузер

    return AppUtil.isClientSide ? cookieCutter.get(name) : ''
  }

  /**
   * Установка
   */
  static set (ctx: NextPageContext, name: string, value: string, ttlDays: number = 0): void {
    try {
      const now = new Date();
      const expireTime = now.getTime() + (ttlDays || 90) * 86400 * 1000
      now.setTime(expireTime);

      // Сервер
      if (!!ctx?.req) {
        const cookies = new Cookies(ctx.req, ctx.res)

        cookies.set(name, value, { expires: now.toUTCString(), path: '/' })
        return
      }
      // Браузер

      cookieCutter.set(name, value, { expires: now.toUTCString(), path: '/' })
    } catch (e) {

    }
  }

  /**
   * Установить один раз. Если уже установлено, то обновлять не будет
   */
  static setOnce (ctx: NextPageContext, name: string, value: string, ttlDays: number): void {
    if (!value) return

    const currentValue = CookieUtil.get(ctx, name)
    if (!currentValue) CookieUtil.set(ctx, name, value, ttlDays)
  }
}
