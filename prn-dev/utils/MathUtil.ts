import { linearInterpolation } from 'simple-linear-interpolation'

/**
 * Статический класс с полезными математическими и утилитными методами.
 */
export default class MathUtil {
  /**
   * Возрващает относительное значение расположения заданного значения в заданном диапазоне.
   * Пример: value=15, lower=10, upper=20 => 0.5
   */
  public static lerp (value: number, lower: number, upper: number, fractionDigits: number = 2): number {
    if (value === upper) return 1
    if (value === lower) return 0
    if (upper === lower || lower > upper) return -1
    const delta = (value - lower) / (upper - lower)
    return this.toFractionDigits(delta, fractionDigits)
  }

  /**
   * Обрезает заданное количество знаков после запятой у заданного числа
   */
  public static toFractionDigits (value: number, fractionDigits: number): number {
    let n = 1
    for (let i = 0; i < fractionDigits; i++) n *= 10
    return Math.round(value * n) / n
  }

  /**
   * Возвращает случайное целочисленное число из заданного диапазона.
   *
   * @param min Меньшее значание в диапазоне.
   * @param max Большее значание в диапазоне.
   * @return Случайное целочисленное число из заданного диапазона.
   */
  public static randomRange (min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  /**
   * Возвращает число большее нуля или 0
   * @param num
   */
  public static gteZero (num: number): number {
    return num >= 0 ? num : 0
  }

  /**
   * Возвращает score по заданному значению от 0 до 1 по шкале значений с равным шагом
   *
   * @param scoreList
   * @param value
   */
  public static score (scoreList: Array<number>, value: number, minScore: number = 0, maxScore: number = 1): number {
    if (!value) return minScore
    if (value <= scoreList[0]) return minScore
    if (value >= scoreList[scoreList.length - 1]) return maxScore

    const step = 1 / (scoreList.length - 1)

    let points = scoreList.map((x, i) => ({ x, y: step * i }))

    const interpolator = linearInterpolation(points)

    return interpolator({ x: value }) * maxScore
  }
}
