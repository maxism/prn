/**
 * Утилита для работы с объектом
 */
export default class shortNameUtil {
  /**
   * Метод возвращает объект без параметров со значением undefined
   *
   * @returns {string}
   * @param {string} name
   * @param {string} defaultName
   */
  static getName (name, defaultName = 'N') {
    if (!name) return defaultName
    const words = String(name).split(/\s+/g).filter(word => word.length)
    if (words.length > 0) {
      return `${words
        .map(item => {
          return item[0].toUpperCase()
        })
        .slice(0, 2)
        .join('')
      }`
    }

    if (words.length === 1) {
      return name[0]
    }
  }
}
