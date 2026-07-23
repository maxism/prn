export default class AppUtil {
  /**
   * Метод задержки в ms
   *
   * @param {number} ms
   * @param {string} message
   * @returns {Promise<void>}
   */
  public static async delay (ms: number, message?: string): Promise<void> {
    if (message) console.info(message, ms)
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Конфиг приложения production
   */
  public static get isProduction (): boolean {
    return process.env.NODE_ENV === 'production'
  }

  /**
   * Серверная часть приложения
   */
  public static get isServerSide (): boolean {
    return typeof window === 'undefined'
  }

  public static get isClientSide (): boolean {
    return !this.isServerSide
  }

  public static screenBreakpoint (breakpoints: {[key: string]: number | string}, width?: number): number | string {
    if (this.isClientSide && width === undefined) width = window.innerWidth
    return breakpoints[Object.keys(breakpoints).reverse().filter(breakpoint => Number(breakpoint) <= width)[0] || '0']
  }
}
