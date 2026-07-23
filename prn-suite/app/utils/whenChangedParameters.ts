/**
 * Декоратор метода запускает метод первый раз, последующие при изменении параметров
 *
 * @param target
 * @param propertyKey
 * @param descriptor
 */
export default function whenChangedParameters (target: any, propertyKey: string, descriptor: PropertyDescriptor): any {
  const originalMethod = descriptor.value
  const parametersKey = `__${propertyKey}__prevParameters`

  descriptor.value = function (...args: Array<any>): any {
    let isChanged = false

    const parameters = this[parametersKey] || ''

    if (parameters !== JSON.stringify(args)) isChanged = true

    this[parametersKey] = JSON.stringify(args)

    if (!isChanged) return

    return originalMethod.apply(this, args)
  }
}
