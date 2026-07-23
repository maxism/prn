import { sort } from 'fast-sort'
import { get } from 'lodash'

/**
 * Хелпер массивов
 */
export default class ArrayUtil {
  /**
   * Функция сравнивает 2 массива (старые данные и новые данные) и возвращает объект с массивами элементов:
   * toAdd: массив с новыми элементами
   * toDelete: массив с элементами для удаления
   */
  public static arrayDiffResult (prevArray = [], newArray = []): object {
    let toAdd = []
    let toDelete = prevArray

    newArray.forEach(element => {
      if (prevArray.indexOf(element) === -1) {
        toAdd.push(element)
      } else {
        toDelete.splice(prevArray.indexOf(element), 1)
      }
    })

    return {
      toAdd,
      toDelete
    }
  }

  /**
   * Метод объединения массивов
   *
   * @param array1
   * @param array2
   * @returns {Array<object>}
   */
  public static arrayMerge (array1, array2): Array<object> {
    const newArray = [...array1]

    array2.forEach(item => {
      if (newArray.indexOf(item) === -1) {
        newArray.push(item)
      }
    })

    return newArray
  }

  /**
   * Сортировка массива объектов по свойству объекта
   * field2 - опция для сортировки по 2м значениям. для случаев с пагинацией, когда каждый раз сортировка меняется, если числа равны по field
   */
  public static arrayObjectsSort<T = any> (field: string, array: Array<T>, field2 = null): Array<T> {
    if (!field) return array
    let leftDirection = 1
    let rightDirection = -1

    // Обратная сортировка -field
    if (field.includes('-')) {
      leftDirection = -1
      rightDirection = 1
      field = field.replace('-', '')
    }

    // Если field вложенный
    if (field.split('.').length >= 2) {
      array = array.map(item => ({
        ...item,
        __sort: get(item, field)
      }))
      field = '__sort'
    }

    let sortBy = []
    if (leftDirection === -1) sortBy.push({ desc: i => i[field] === undefined ? null : i[field] })
    else sortBy.push({ asc: i => i[field] })
    if (field2) {
      if (leftDirection === -1) sortBy.push({ desc: i => i[field] === undefined ? null : i[field] })
      else sortBy.push({ asc: i => i[field] })
    }

    return sort(array).by(sortBy)
  }

  /**
   * Получение последнего элемента массива
   * @param {Array<T>} array
   * @returns {T} or null
   */
  public static arrayGetLastElement<T> (array: Array<T>): T {
    if (array && array.length > 0) return array[array.length - 1]
    return null
  }
}
