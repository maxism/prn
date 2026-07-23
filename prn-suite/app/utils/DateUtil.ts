import moment from 'moment'

export type DateFormat = 'L' | 'HH:mm' | 'D MMMM'

interface IDateUtilPeriod {
  currentDateFrom: string
  currentDateTo: string
  compareDateFrom: string
  compareDateTo: string
}

export default class DateUtil {
  /**
   * Форматирует дату
   *
   * @param date
   * @param format
   */
  public static format (date: string | number | Date, format: DateFormat | string = 'L'): string {
    if (moment(date, 'DD.MM.YYYY').format('DD.MM.YYYY') === date) date = moment(date, 'DD.MM.YYYY').toDate()
    if (format === 'L') return moment(date).format('LL')
    if (format === 'TT') return moment(date).format('DD.MM.YYYY HH:mm:SS')

    return moment(date).format(format)
  }

  public static period (currentDateFrom, currentDateTo, format: DateFormat | string = 'L'): IDateUtilPeriod {
    // Получим данные за прошлый аналогичный период
    const daysPeriod = moment(currentDateTo, 'DD.MM.YYYY').diff(moment(currentDateFrom, 'DD.MM.YYYY'), 'days')
    const compareDateTo = moment(currentDateFrom, 'DD.MM.YYYY').subtract(1, 'days').format('DD.MM.YYYY')
    const compareDateFrom = moment(compareDateTo, 'DD.MM.YYYY').subtract(daysPeriod, 'days').format('DD.MM.YYYY')

    return {
      currentDateFrom: DateUtil.format(currentDateFrom, format),
      currentDateTo: DateUtil.format(currentDateTo, format),
      compareDateFrom: DateUtil.format(compareDateFrom, format),
      compareDateTo: DateUtil.format(compareDateTo, format)
    }
  }
}
