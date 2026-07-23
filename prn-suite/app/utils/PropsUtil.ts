import { get } from 'lodash'

/**
 * Утилитный класс для работы с пропсами
 */
export default class PropsUtil {
  /**
   * Возвращает состояние изменения пропсов.
   * Если observedProps не задан, отслеживается изменение всех пропсов.
   * observedProps поддерживает указание вложенности в нотации с точкой 'a.b'
   *
   * @param prevProps
   * @param nextProps
   * @param observedProps
   */
  public static hasChanged<T> (prevProps: T, nextProps: T, observedProps: Array<string> = []): boolean {
    const props: Array<string> = observedProps.length ? observedProps : [...Object.keys(prevProps), ...Object.keys(nextProps)]

    for (const prop of props) {
      const prev = get(prevProps, prop)
      const next = get(nextProps, prop)
      // console.log('check change', prop, prev, next)
      if (prev !== next) return true
    }

    return false
  }
}
