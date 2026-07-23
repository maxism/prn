import Provider from './Provider'
import Tools from './Tools'

export default {
  Provider,
  Tools,
  getLangFromPath: () => {
    let searchPath = window.location.pathname.toLowerCase()
    const locales = ['de', 'en', 'ru']

    searchPath = searchPath.concat('/')

    return locales.find(locale => searchPath.indexOf(`/${locale}`) === 0) || localStorage.getItem('locale') || 'ru'
  }
}
