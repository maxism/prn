/**
 * Утилита для работы с объектом
 */
export default class ObjectUtil {
  /**
   * Метод возвращает объект без параметров со значением undefined
   *
   * @param {object} obj
   * @returns {object}
   */
  static removeUndefined<T extends object> (obj: T): Partial<T> {
    const newObject: Partial<T> = { ...obj }

    Object.keys(newObject).forEach(key => {
      if (newObject[key] === undefined) delete newObject[key]
      else if (Array.isArray(newObject[key])) {
        newObject[key] = newObject[key].map(item => {
          if (typeof item === 'object') return ObjectUtil.removeUndefined(item)
          else return item
        })
      }
    })

    return newObject
  }

  /**
   * Проверяет массив объектов и объект на null и undefined
   * @param objects
   */
  static isNullOrUndefined (objects: Array<any> | any): boolean {
    if (!Array.isArray(objects)) objects = [objects]

    return objects.some(obj => obj === null || obj === undefined)
  }
}
