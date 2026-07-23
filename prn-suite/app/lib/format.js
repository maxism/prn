import numeral from 'numeral'
import moment from 'moment'

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

  numeral.register('locale', 'de', {
    delimiters: {
      thousands: ' ',
      decimal: '.'
    },
    abbreviations: {
      thousand: 'K',
      million: 'M',
      billion: 'B',
      trillion: 'T'
    }
  })
} catch (e) {
  //
}

// Форматы чисел
// format A - 0 - 999 99 k 99 m
// format P2 - 1.23%
// format P0 - 15%
// format +A +9k

export default {
  number: (number, format = 'A') => {
    numeral.locale(window.i18n.locale)

    if (number === null) return '-'
    // Округляем, если не процент
    if (!format.includes('P')) number = Math.round(number * 100) / 100
    let sign
    let is_sign = false
    if (format.includes('+')) {
      format = format.replace('+', '')
      is_sign = number !== 0
      sign = number > 0 ? '+ ' : '- '
      number = Math.abs(number)
    }

    if (format === 'A') return `${is_sign ? sign : ''}${numeral(number).format('0.[0a]')}`
    if (format === 'AA') return `${is_sign ? sign : ''}${numeral(number).format('0,0')}`
    if (format === 'A2') return `${is_sign ? sign : ''}${numeral(number).format('0.00')}`
    if (format === 'P0') return `${is_sign ? sign : ''}${numeral(number).format('0%')}`
    if (format === 'P2') return `${is_sign ? sign : ''}${numeral(number).format('0.00%')}`
  },

  numberD: (number, format = 'A') => {
    numeral.locale(window.i18n.locale)

    if (number === null) return '0'
    // Округляем, если не процент
    if (!format.includes('P')) number = Math.round(number * 100) / 100
    let sign
    let is_sign = false
    if (format.includes('+')) {
      format = format.replace('+', '')
      is_sign = number !== 0
      sign = number > 0 ? '+ ' : '- '
      number = Math.abs(number)
    }

    if (format === 'A') return `${is_sign ? sign : ''}${numeral(number).format('0.[0a]')}`
    if (format === 'AA') return `${is_sign ? sign : ''}${numeral(number).format('0,0')}`
    if (format === 'A2') return `${is_sign ? sign : ''}${numeral(number).format('0.00')}`
    if (format === 'P0') return `${is_sign ? sign : ''}${numeral(number).format('0%')}`
    if (format === 'P2') return `${is_sign ? sign : ''}${numeral(number).format('0.00%')}`
  },

  date: (time, format = 'L') => {
    const locale = window.i18n.locale || 'ru'
    moment.locale(locale)

    return moment(time).format(format)
  },

  time: (time, format = 'LTS') => {
    moment.locale(window.i18n.locale)

    return moment(time).format(format)
  },

  /**
   * Формат Дата в Время
   *
   * 21 мая 2018 в 00:15
   *
   * @param date
   * @param format
   */
  dateTime: (date, format = 'DD MMMM YYYY [at] HH:mm') => {
    const { l } = window.i18n
    moment.locale(window.i18n.locale)
    return moment(date).format(format).replace('at', `${l('at')}`)
  },

  /**
   * Выводят в относительном формате
   * Сегодня - 11:14
   * Вчера - Вчера
   * 19.10.2020
   *
   * @param date
   * @returns {string}
   */
  dateTime3: (date) => {
    const { l } = window.i18n
    moment.locale(window.i18n.locale)

    if (moment(date) > moment().startOf('day')) return l('Today')
    if (moment(date) > moment().subtract(1, 'day').startOf('day')) return l('Yesterday')
    return moment(date).format('DD.MM.YYYY')
  },

  /**
   * Выводят в относительном формате
   * Сегодня - Сегодня
   * Вчера - Вчера
   * 19.10.2020
   *
   * @param date
   * @returns {string}
   */
  dateTime2: (date) => {
    const { l } = window.i18n
    moment.locale(window.i18n.locale)

    if (moment(date) > moment().startOf('day')) return moment(date).format('HH:mm')
    if (moment(date) > moment().subtract(1, 'day').startOf('day')) return l('Yesterday')
    return moment(date).format('DD.MM.YYYY')
  },

  /**
   * Формат Дата в Время (UTC)
   *
   * 21 мая 2018 в 00:15
   *
   * @param date
   * @param format
   */
  dateTimeUtc: (date, format = 'DD MMMM YYYY [at] HH:mm') => {
    const { l } = window.i18n
    moment.locale(window.i18n.locale)
    return moment.utc(date).format(format).replace('at', `${l('at')}`)
  },

  /**
   *
   * Форматы:
   *  F - 1d 12h 2m
   *  S - 1d
   *  +S - + 1h
   *
   * @param time
   * @param format
   * @returns {string}
   */
  duration: (time, format = 'F') => {
    const { locale, l } = window.i18n

    moment.locale(locale)

    const sign = time >= 0 ? '+' : '-'
    const mtime = moment.duration(Math.abs(time))

    if (!time) return '–'

    const is_sign = format.includes('+')
    const is_full = format.includes('F')

    if (is_full) {
      return `${is_sign ? sign : ''}
    ${Math.floor(mtime.asDays()) ? Math.floor(mtime.asDays()) + l('d') : ''}
     ${mtime.hours() ? mtime.hours() + l('h') : ''} 
     ${mtime.minutes() ? mtime.minutes() + l('min') : mtime.seconds() + l('sec')}
    `
    } else {
      if (Math.floor(mtime.asDays())) return `${Math.floor(mtime.asDays())}d`
      if (mtime.hours()) return `${mtime.hours()}${l('h')}`
      if (mtime.minutes()) return `${mtime.minutes()}${l('min')}`
    }
  },

  daysTo: (time) => {
    moment.locale(window.i18n.locale)
    const formatTime = moment(time).format('DD.MM.YYYY')
    return moment(formatTime, 'DD.MM.YYYY').diff(moment(), 'days') + 1
  },

  grade: mark => {
    const { l } = window.i18n
    if (mark === 100) {
      return {
        id: 'a+',
        icon: 'a_plus',
        description: l('Better than any other post')
      }
    }
    if (mark >= 90 && mark < 100) {
      return {
        id: 'a',
        icon: 'a',
        description: l('Better than 90% of other posts')
      }
    }
    if (mark >= 75 && mark < 90) {
      return {
        id: 'b',
        icon: 'b',
        description: l('Better than 75% of other posts')
      }
    }
    if (mark >= 50 && mark < 75) {
      return {
        id: 'c',
        icon: 'c',
        description: l('Better than 50% of other posts')
      }
    }
    if (mark < 50) {
      return {
        id: 'd',
        icon: 'd',
        description: l('Worse than 50% of other posts')
      }
    }
    return {
      id: 'd',
      icon: 'd',
      description: l('Worse than 50% of other posts')
    }
  },
  period: (period) => {
    const { locale, l } = window.i18n

    let start, end, title, text

    moment.locale(locale)

    switch (period) {
      case 'last_day': {
        start = moment().subtract(1, 'days').format('DD.MM.YYYY')
        end = moment().subtract(1, 'days').format('DD.MM.YYYY')
        text = `${moment(start, 'DD.MM.YYYY').format('DD MMMM YYYY')}`
        title = l('Last day')
        break
      }
      case 'last_7_days' : {
        start = moment().subtract(7, 'days').format('DD.MM.YYYY')
        end = moment().format('DD.MM.YYYY')
        text = `${moment(start, 'DD.MM.YYYY').format('DD MMMM YYYY')} – ${moment(end, 'DD.MM.YYYY').format('DD MMMM YYYY')}`
        title = l('Last 7 days')
        break
      }
      // case 'prev_7_days' : {
      //   start = moment().subtract(16, 'days').format('DD.MM.YYYY')
      //   end = moment().subtract(9, 'days').format('DD.MM.YYYY')
      //   text = `${start} – ${end}`
      //   title = l('Previous 7 days')
      //   break
      // }
      case 'last_30_days': {
        start = moment().subtract(30, 'days').format('DD.MM.YYYY')
        end = moment().format('DD.MM.YYYY')
        text = `${moment(start, 'DD.MM.YYYY').format('DD MMMM YYYY')} – ${moment(end, 'DD.MM.YYYY').format('DD MMMM YYYY')}`
        title = l('Last 30 days')
        break
      }
      // case 'prev_30_days': {
      //   start = moment().subtract(62, 'days').format('DD.MM.YYYY')
      //   end = moment().subtract(32, 'days').format('DD.MM.YYYY')
      //   text = `${start} – ${end}`
      //   title = l('Previous 30 days')
      //   break
      // }
      case 'last_week': {
        start = moment().subtract(1, 'week').startOf('week').format('DD.MM.YYYY')
        end = moment().subtract(1, 'week').endOf('week').format('DD.MM.YYYY')
        text = `${moment(start, 'DD.MM.YYYY').format('DD MMMM YYYY')} – ${moment(end, 'DD.MM.YYYY').format('DD MMMM YYYY')}`
        title = l('Last week')
        break
      }
      // case 'prev_week': {
      //   start = moment().subtract(2, 'week').startOf('week').format('DD.MM.YYYY')
      //   end = moment().subtract(2, 'week').endOf('week').format('DD.MM.YYYY')
      //   text = `${start} – ${end}`
      //   title = l('Previous week')
      //   break
      // }
      case 'last_month': {
        start = moment().subtract(1, 'month').startOf('month').format('DD.MM.YYYY')
        end = moment().subtract(1, 'month').endOf('month').format('DD.MM.YYYY')
        text = `${moment(start, 'DD.MM.YYYY').format('MMMM YYYY')}`
        title = l('Last month')
        break
      }
      case 'last_3_months': {
        start = moment().subtract(3, 'month').startOf('month').format('DD.MM.YYYY')
        end = moment().subtract(1, 'month').endOf('month').format('DD.MM.YYYY')
        text = `${moment(start, 'DD.MM.YYYY').format('DD MMMM YYYY')} – ${moment(end, 'DD.MM.YYYY').format('DD MMMM YYYY')}`
        title = l('Last 3 months')
        break
      }
      case 'last_quarter': {
        start = moment().subtract(1, 'quarter').startOf('quarter').format('DD.MM.YYYY')
        end = moment().subtract(1, 'quarter').endOf('quarter').format('DD.MM.YYYY')
        text = `${moment(start, 'DD.MM.YYYY').format('MMMM YYYY')} – ${moment(end, 'DD.MM.YYYY').format('MMMM YYYY')}`
        title = l('Last quarter')
        break
      }
      // case 'month_before': {
      //   start = moment(currentDateFrom, 'DD.MM.YYYY').subtract(1, 'month').startOf('month').format('DD.MM.YYYY')
      //   end = moment(currentDateFrom, 'DD.MM.YYYY').subtract(1, 'month').endOf('month').format('DD.MM.YYYY')
      //   break
      // }
      case 'prev_month': {
        start = moment().subtract(2, 'month').startOf('month').format('DD.MM.YYYY')
        end = moment().subtract(2, 'month').endOf('month').format('DD.MM.YYYY')
        text = `${moment(start, 'DD.MM.YYYY').format('MMMM YYYY')}`
        title = l('Previous month')
        break
      }
      // case 'current_period': {
      //   start = currentDateFrom
      //   end = currentDateTo
      //   text = `${start} – ${end}`
      //   title = l('Current period')
      //   break
      // }
      // case 'prev_period': {
      //   start = fullMonth
      //     ? moment(currentDateFrom, 'DD.MM.YYYY').subtract(1, 'month').startOf('month').format('DD.MM.YYYY')
      //     : moment(currentDateFrom, 'DD.MM.YYYY').subtract(duration + 1, 'days').format('DD.MM.YYYY')
      //   end = fullMonth
      //     ? moment(currentDateFrom, 'DD.MM.YYYY').subtract(1, 'month').endOf('month').format('DD.MM.YYYY')
      //     : moment(currentDateFrom, 'DD.MM.YYYY').subtract(1, 'days').format('DD.MM.YYYY')
      //   text = `${start} – ${end}`
      //   title = l('Previous period')
      //   break
      // }
    }

    return {
      start,
      end,
      title,
      text
    }
  },

  card (value) {
    const v = value.replace(/\s+/g, '').replace(/[^0-9*]/gi, '')
    const matches = v.match(/.{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return value
    }
  },

  mask: (string, replaceTo = '*', elemsHide = 8, sliceFromback = 4) => {
    const result = string.match(/^(\(?\+?\d{1,2}\)? ?\(?\d{1,3}\)? ?\d+-? ?\d+-? ?\d+)$/)
    if (result !== null) {
      // тут мы выдергиваем n элементов после среза x
      const regex = new RegExp(`((\\(? ?-?\\d ?-?\\)?){${elemsHide}})(( ?-?\\d ?-?){${sliceFromback}}$)`, 'gm')

      let m
      while ((m = regex.exec(string)) !== null) {
        if (m.index === regex.lastIndex) {
          regex.lastIndex++
        }

        const forRex = m[1]
        const str = m[1].replace(/(\d)/gm, replaceTo)
        const lasts = m[3]
        const noBack = string.slice(0, -lasts.length).slice(0, -forRex.length)
        return noBack + '' + str + '' + lasts
      }
      return string
    } else {
      return string
    }
  }
}
