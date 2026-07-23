import ISocialType from '../interfaces/ISocialType'

interface ICid {
  socialType: ISocialType,
  groupID: string
}

/**
 * Утилита для работы с данными (посты, комментарии, статистика)
 */
export default class SocialDataUtil {
  public static toUniq (cids: Array<string>): Array<string> {
    return cids.filter((v, i, a) => a.indexOf(v) === i)
  }

  public static toCid (socialType: ISocialType, groupID: string): string {
    return socialType + ':' + groupID
  }

  public static fromCid (cid: string): ICid {
    const data = cid.split(':')
    return {
      socialType: data[0] as ISocialType,
      groupID: data[1]
    }
  }

  public static urlToUri (url: string): string {
    let uri = url

    if (!uri) uri = ''

    if (uri.includes('www.youtube.com')) uri = uri.replace('?v=', '/')
    if (uri.includes('invite.viber.com/?g2=')) uri = uri.replace('invite.viber.com/?g2=', 'invite.viber.com/')

    if (uri.indexOf('?') !== -1) uri = uri.split('?')[0]
    if (uri.indexOf('#') !== -1) uri = uri.split('#')[0]
    if (uri.indexOf('&') !== -1) uri = uri.split('&')[0]

    if (uri.charAt(uri.length - 1) === '/') uri = uri.substring(0, uri.length - 1)

    uri = uri.replace('http://', '//')
    uri = uri.replace('https://', '//')

    uri = uri.replace('//www.facebook.com/', '')

    uri = uri.replace('//facebook.com/', '')

    uri = uri.replace('//odnoklassniki.ru/', '')

    uri = uri.replace('//ok.ru/', '')

    uri = uri.replace('//twitter.com/', '')

    uri = uri.replace('//vk.com/', '')

    uri = uri.replace('//instagram.com/', '')

    uri = uri.replace('//www.instagram.com/', '')

    uri = uri.replace('//www.pinterest.com/', '')

    uri = uri.replace('//www.youtube.com/channel/', '')
    uri = uri.replace('//www.youtube.com/', '')

    uri = uri.replace('//telegram.me/', '')
    uri = uri.replace('//t.me/', '')

    uri = uri.replace('//www.tiktok.com/', '')

    uri = uri.replace('//zen.yandex.ru/id/', '')
    uri = uri.replace('//dzen.ru/id/', '')

    uri = uri.replace('//zen.yandex.ru/', '')
    uri = uri.replace('//dzen.ru/', '')

    uri = uri.replace('//joinclubhouse.com/', '')
    uri = uri.replace('//www.joinclubhouse.com/', '')

    uri = uri.replace('//rutube.ru/metainfo/', '')
    uri = uri.replace('//rutube.ru/', '')

    uri = uri.replace('//vb.me/', '')
    uri = uri.replace('//invite.viber.com/', '')

    uri = uri.replace('//tenchat.ru/', '')

    uri = uri.replace('//vc.ru/', '')

    uri = uri.replace('//web.max.ru/', '')
    uri = uri.replace('//max.ru/', '')

    return uri
  }

  public static urlToSocialType (url: string): ISocialType {
    if (url.includes('//www.facebook.com/')) return 'FB'
    if (url.includes('//facebook.com/')) return 'FB'

    if (url.includes('//odnoklassniki.ru/')) return 'OK'
    if (url.includes('//ok.ru/')) return 'OK'

    if (url.includes('//twitter.com/')) return 'TW'

    if (url.includes('//vk.com/')) return 'VK'

    if (url.includes('//instagram.com/')) return 'INST'
    if (url.includes('//www.instagram.com/')) return 'INST'

    if (url.includes('//www.youtube.com/')) return 'YT'

    if (url.includes('//telegram.me/')) return 'TG'
    if (url.includes('//t.me/')) return 'TG'

    if (url.includes('//www.tiktok.com/')) return 'TT'

    if (url.includes('//zen.yandex.ru/')) return 'YZ'
    if (url.includes('//dzen.ru/')) return 'YZ'

    if (url.includes('//joinclubhouse.com/')) return 'CH'
    if (url.includes('//www.joinclubhouse.com/')) return 'CH'

    if (url.includes('//rutube.ru/')) return 'RT'

    if (url.includes('//vb.me/')) return 'VB'
    if (url.includes('//invite.viber.com/')) return 'VB'

    if (url.includes('//tenchat.ru/')) return 'TC'

    if (url.includes('//vc.ru/')) return 'VC'

    if (url.includes('//web.max.ru/')) return 'MX'
    if (url.includes('//max.ru/')) return 'MX'

    return null
  }

  public static getSocialTypeName (socialType: ISocialType): string {
    const socials = {
      'VK': 'ВКонтакте',
      'FB': 'Facebook*',
      'INST': 'Instagram*',
      'TW': 'Twitter',
      'OK': 'Одноклассники',
      'TT': 'TikTok',
      'TG': 'Telegram',
      'YZ': 'Яндекс.Дзен',
      'YT': 'YouTube',
      'CH': 'Clubhouse',
      'RT': 'Rutube',
      'VB': 'Viber',
      'TC': 'TenChat',
      'VC': 'VC.RU',
      'MX': 'MAX',
      'ALL': 'Все соц.сети'
    }

    return socials[socialType]
  }

  public static getAgeRangeName (ageRange: string): string {
    const agesList = {
      '0_18': 'до 18',
      '18_21': '18-21',
      '21_24': '21-24',
      '24_27': '24-27',
      '27_30': '27-30',
      '30_35': '30-35',
      '35_45': '35-45',
      '45_100': 'от 45'
    }

    return agesList[ageRange] || ''
  }
}
