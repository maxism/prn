/**
 * Утилита для обработки QualityScoreUtil
 */
export default class QualityScoreUtil {
  public static getName (num: number): string {
    if (num > 0.90) return 'excellent'
    if (num > 0.80) return 'very_good'
    if (num > 0.60) return 'good'
    if (num > 0.40) return 'average'
    if (num > 0.25) return 'could_be_improved'
    return 'poor'
  }

  public static getColor (num: number): string {
    const name = QualityScoreUtil.getName(num)

    if (name === 'could_be_improved') return '#FF7501'
    if (name === 'average') return '#FCCA53'
    if (name === 'good') return '#00DA00'
    if (name === 'very_good') return '#00AD00'
    if (name === 'excellent') return '#8037DC'

    return '#DE0000'
  }
}
