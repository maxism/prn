/**
 * Утилита для работы с временной зоной
 */
export default class ShortTimezone {
  static getName (timezone) {
    if (!timezone) return ''
    const timezoneHour = timezone.split(':')[0]

    if (timezoneHour[1] === '0') {
      return timezoneHour.replace('0', '')
    }
    return timezoneHour
  }
}
