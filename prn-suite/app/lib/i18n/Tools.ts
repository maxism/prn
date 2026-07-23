import Jed from 'jed'

export default class Tools {
  public jed
  public locale

  constructor ({ localeData, locale }) {
    this.jed = new Jed(localeData)
    this.locale = locale
  }

  l = (text, params = {}) => {
    let translation
    try {
      translation = this.jed.gettext(text)
    } catch (e) {
      console.log(e)
      translation = text
    }

    Object.keys(params).map(key => {
      translation = translation.replace(`%{${key}}`, params[key])
    })

    return translation
  }

  ln = (singular, plural, amount, params = {}) => {
    let translation
    try {
      translation = this.jed.ngettext(singular, plural, Number(amount))
    } catch (e) {
      console.log(e)
      translation = `${singular} ${plural}, ${amount}`
    }

    Object.keys(params).map(key => {
      translation = translation.replace(`%{${key}}`, params[key])
    })

    return translation
  }

  lc = (context, text, params = {}) => {
    let translation
    try {
      translation = this.jed.pgettext(context, text)
    } catch (e) {
      console.log(e)
      translation = `${context}, ${text}`
    }
    Object.keys(params).map(key => {
      translation = translation.replace(`%{${key}}`, params[key])
    })

    return translation
  }

  lnc = (context, singular, plural, amount, params = {}) => {
    let translation
    try {
      translation = this.jed.npgettext(context, singular, plural, Number(amount))
    } catch (e) {
      console.log(e)
      translation = `${context} ${singular} ${plural}, ${amount}`
    }
    Object.keys(params).map(key => {
      translation = translation.replace(`%{${key}}`, params[key])
    })

    return translation
  }
}
