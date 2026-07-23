import numeral from 'numeral'

try {
  numeral.register('locale', 'ru', {
    delimiters: {
      thousands: ' ',
      decimal: '.'
    },
    abbreviations: {
      thousand: 'К',
      million: 'М',
      billion: 'Б',
      trillion: 'Т'
    }
  })
} catch (e) {
  //
}

numeral.locale('ru')

export type NumeralFormat = '+0.[0a]' | '+0,0' | '+0.00' | '+0%' | '+0,0%' | '+0.00%' | '0.[0a]' | '0,0' | '+0.0' | '0.00' | '0%' | '0,0%' | '0.00%' | '0.000%' | '0'

export default class NumeralUtil {
  /**
   * Форматирует текст
   * @param num
   * @param format
   * @param declinationTitles Массив склонений чеслительного
   */
  public static format (num: number, format: NumeralFormat = '0,0', declinationTitles: Array<string> = []): string {
    if (num === null || num === undefined) return ''

    num = Math.round(num * 10000) / 10000

    let isSign = false
    let sign = ''
    if (format.includes('+')) {
      isSign = num !== 0
      format = format.replace('+', '') as NumeralFormat
      sign = num > 0 ? '+ ' : '- '
    }
    // Округляем до 2х знаков для обычных чисел
    if (!format.includes('%')) num = Math.round(num * 100) / 100

    if (num < 0) {
      isSign = true
      sign = '- '
      num = Math.abs(num)
    }

    return `${isSign ? sign : ''}${numeral(num).format(format)}${declinationTitles.length ? ` ${NumeralUtil.declination(num, declinationTitles)}` : ''}`
  }

  /**
   * Вовращает склонение чеслительного
   *
   * @param num
   * @param titles
   */
  public static declination (num: number, titles: Array<string>): string {
    const cases = [2, 0, 1, 1, 1, 2]
    return titles[ (num % 100 > 4 && num % 100 < 20) ? 2 : cases[(num % 10 < 5) ? num % 10 : 5] ]
  }

  public static fromString (text: string): number {
    return Number(String(text).trim().replace(',', '.').replace('%', '').replace(' ', ''))
  }
}
