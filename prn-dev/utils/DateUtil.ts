import moment from 'moment'
import 'moment/locale/ru'

export type DateFormat = 'L' | 'HH:mm' | 'D MMMM'

moment.locale('ru')

const periodMonths = {
  'январь': 'января',
  'февраль': 'февраля',
  'март': 'марта',
  'апрель': 'апреля',
  'май': 'мая',
  'июнь': 'июня',
  'июль': 'июля',
  'август': 'августа',
  'сентябрь': 'сентября',
  'октябрь': 'октября',
  'ноябрь': 'ноября',
  'декабрь': 'декабря',
}

interface IDateUtilPeriod {
  currentDateFrom: string
  currentDateTo: string
  compareDateFrom: string
  compareDateTo: string
  currentShortPeriod: string
  currentShortFromTo: string
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
    if (format === 'L') return moment(date).format('LL, dd')
    if (format === 'LLL') return moment(date).format('LLL, dd')

    return moment(date).format(format)
  }

  public static period (currentDateFrom, currentDateTo, format: DateFormat | string = 'L'): IDateUtilPeriod {
    // Получим данные за прошлый аналогичный период
    const daysPeriod = moment(currentDateTo, 'DD.MM.YYYY').diff(moment(currentDateFrom, 'DD.MM.YYYY'), 'days')
    const compareDateTo = moment(currentDateFrom, 'DD.MM.YYYY').subtract(1, 'days').format('DD.MM.YYYY')
    const compareDateFrom = moment(compareDateTo, 'DD.MM.YYYY').subtract(daysPeriod, 'days').format('DD.MM.YYYY')

    let currentDateFromMonth = DateUtil.format(currentDateFrom, 'MMMM')
    let currentDateToMonth = DateUtil.format(currentDateTo, 'MMMM')

    return {
      currentDateFrom: DateUtil.format(currentDateFrom, format),
      currentDateTo: DateUtil.format(currentDateTo, format),
      compareDateFrom: DateUtil.format(compareDateFrom, format),
      compareDateTo: DateUtil.format(compareDateTo, format),
      currentShortPeriod: `${DateUtil.format(currentDateFrom, 'D')} ${periodMonths[currentDateFromMonth] !== periodMonths[currentDateToMonth] ? periodMonths[currentDateFromMonth] : ''} — ${DateUtil.format(currentDateTo, 'D')} ${periodMonths[currentDateToMonth]}`,
      currentShortFromTo: `с ${DateUtil.format(currentDateFrom, 'D')} ${periodMonths[currentDateFromMonth] !== periodMonths[currentDateToMonth] ? periodMonths[currentDateFromMonth] : ''} по ${DateUtil.format(currentDateTo, 'D')} ${periodMonths[currentDateToMonth]} ${DateUtil.format(currentDateTo, 'YYYY')}`
    }
  }
}
