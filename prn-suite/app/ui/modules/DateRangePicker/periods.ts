import moment from 'moment'

moment.locale('ru')

const getPeriods = () => {
  const periods = []
  let from: string
  let to: string
  let title: string
  let description: string

  from = moment().subtract(1, 'days').format('DD.MM.YYYY')
  to = moment().subtract(1, 'days').format('DD.MM.YYYY')
  title = 'Вчера'
  description = `${moment(from, 'DD.MM.YYYY').format('DD MMMM YYYY')}`
  periods.push({ name: 'lastDay', from, to, title, description })

  from = moment().subtract(6, 'days').format('DD.MM.YYYY')
  to = moment().format('DD.MM.YYYY')
  title = 'Последние 7 дней'
  description = `${moment(from, 'DD.MM.YYYY').format('DD MMMM YYYY')} – ${moment(to, 'DD.MM.YYYY').format('DD MMMM YYYY')}`
  periods.push({ name: 'last7Days', from, to, title, description })

  from = moment().subtract(13, 'days').format('DD.MM.YYYY')
  to = moment().format('DD.MM.YYYY')
  title = 'Последние 2 недели'
  description = `${moment(from, 'DD.MM.YYYY').format('DD MMMM YYYY')} – ${moment(to, 'DD.MM.YYYY').format('DD MMMM YYYY')}`
  periods.push({ name: 'last2Weeks', from, to, title, description })

  from = moment().subtract(15, 'days').format('DD.MM.YYYY')
  to = moment().subtract(8, 'days').format('DD.MM.YYYY')
  title = 'Предыдущие 7 дней'
  description = `${moment(from, 'DD.MM.YYYY').format('DD MMMM YYYY')} – ${moment(to, 'DD.MM.YYYY').format('DD MMMM YYYY')}`
  periods.push({ name: 'prev7Days', from, to, title, description })

  from = moment().subtract(29, 'days').format('DD.MM.YYYY')
  to = moment().format('DD.MM.YYYY')
  title = 'Последние 30 дней'
  description = `${moment(from, 'DD.MM.YYYY').format('DD MMMM YYYY')} – ${moment(to, 'DD.MM.YYYY').format('DD MMMM YYYY')}`
  periods.push({ name: 'last30Days', from, to, title, description })

  from = moment().subtract(61, 'days').format('DD.MM.YYYY')
  to = moment().subtract(31, 'days').format('DD.MM.YYYY')
  title = 'Предыдущие 30 дней'
  description = `${moment(from, 'DD.MM.YYYY').format('DD MMMM YYYY')} – ${moment(to, 'DD.MM.YYYY').format('DD MMMM YYYY')}`
  periods.push({ name: 'prev30Days', from, to, title, description })

  from = moment().subtract(1, 'week').startOf('week').format('DD.MM.YYYY')
  to = moment().subtract(1, 'week').endOf('week').format('DD.MM.YYYY')
  title = 'Последняя неделя'
  description = `${moment(from, 'DD.MM.YYYY').format('DD MMMM YYYY')} – ${moment(to, 'DD.MM.YYYY').format('DD MMMM YYYY')}`
  periods.push({ name: 'lastWeek', from, to, title, description })

  from = moment().subtract(2, 'week').startOf('week').format('DD.MM.YYYY')
  to = moment().subtract(2, 'week').endOf('week').format('DD.MM.YYYY')
  title = 'Предыдущая неделя'
  description = `${moment(from, 'DD.MM.YYYY').format('DD MMMM YYYY')} – ${moment(to, 'DD.MM.YYYY').format('DD MMMM YYYY')}`
  periods.push({ name: 'prevWeek', from, to, title, description })

  from = moment().subtract(1, 'month').startOf('month').format('DD.MM.YYYY')
  to = moment().subtract(1, 'month').endOf('month').format('DD.MM.YYYY')
  title = 'Последний месяц'
  description = `${moment(from, 'DD.MM.YYYY').format('MMMM YYYY')}`
  periods.push({ name: 'lastMonth', from, to, title, description })

  from = moment().subtract(2, 'month').startOf('month').format('DD.MM.YYYY')
  to = moment().subtract(2, 'month').endOf('month').format('DD.MM.YYYY')
  title = 'Предыдущий месяц'
  description = `${moment(from, 'DD.MM.YYYY').format('MMMM YYYY')}`
  periods.push({ name: 'prevMonth', from, to, title, description })

  from = moment().subtract(3, 'month').startOf('month').format('DD.MM.YYYY')
  to = moment().subtract(1, 'month').endOf('month').format('DD.MM.YYYY')
  title = 'Последние 3 месяца'
  description = `${moment(from, 'DD.MM.YYYY').format('DD MMMM YYYY')} – ${moment(to, 'DD.MM.YYYY').format('DD MMMM YYYY')}`
  periods.push({ name: 'last3Months', from, to, title, description })

  from = moment().subtract(1, 'quarter').startOf('quarter').format('DD.MM.YYYY')
  to = moment().subtract(1, 'quarter').endOf('quarter').format('DD.MM.YYYY')
  title = 'Последний квартал'
  description = `${moment(from, 'DD.MM.YYYY').format('MMMM YYYY')} – ${moment(to, 'DD.MM.YYYY').format('MMMM YYYY')}`
  periods.push({ name: 'lastQuarter', from, to, title, description })

  from = moment().startOf('year').format('DD.MM.YYYY')
  to = moment().format('DD.MM.YYYY')
  title = 'С начала этого года'
  description = `${moment(from, 'DD.MM.YYYY').format('DD MMMM YYYY')} – ${moment(to, 'DD.MM.YYYY').format('DD MMMM YYYY')}`
  periods.push({ name: 'currentYear', from, to, title, description })

  return periods
}

export default {
  /**
   * Получение периода по датам
   *
   * @param from
   * @param to
   * @returns {*}
   */
  getPeriodByFromTo: (from, to) => {
    const periods = getPeriods()

    const period = periods.find(period => period.from === from && period.to === to)

    if (period) return period

    const title = 'Произвольный период'
    const description = `${moment(from, 'DD.MM.YYYY').format('DD MMMM YYYY')} – ${moment(to, 'DD.MM.YYYY').format('DD MMMM YYYY')}`

    return { from, to, title, description }
  },

  /**
   * Получение периода по названию
   *
   * @param name
   * @returns {*}
   */
  getPeriodByName: (name) => {
    const periods = getPeriods()

    return periods.find(period => period.name === name)
  }
}
