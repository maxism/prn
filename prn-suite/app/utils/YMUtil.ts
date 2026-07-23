import YM from 'react-yandex-metrika'

let gTimeReachGoal = {}

/**
 * Утилита для работы с Yandex Metrika
 */
export default class YMUtil {
  static hit(url: string = ''): void {
    try {
      YM('hit', url || (window.location.pathname + window.location.search))
    } catch (error) {
      // console.log('YM hit', error)
    }
  }

  static userParams (params: any): void {
    try {
      YM('userParams', params)
    } catch (error) {
      // console.log('YM userParams', error)
    }
  }

  static reachGoal (target: string): void {
    if (gTimeReachGoal[target]) return

    gTimeReachGoal[target] = new Date()

    // console.log('reachGoal', target)

    try {
      window['_tmr'].push({ id: '123', type: 'reachGoal', goal: target })
    } catch (error) {
      // console.log('MT reachGoal', error)
    }

    try {
      YM('reachGoal', target)
    } catch (error) {
      // console.log('YM reachGoal', error)
    }

    if (target === 'login') {
      try {
        window['carrotquest'].track('$authorized', {})
      } catch (e) {
        //
      }
    }

    if (target === 'registration') {
      try {
        window['carrotquest'].track('$registered', {})
      } catch (e) {
        //
      }

      try {
        window['VK'].Goal('complete_registration') // Отправка события в VK о регистрации пользователя
      } catch (error) {
        // console.log('YM.VK reachGoal complete_registration', error)
      }

      // try {
      //   // Отправка события в FB о регистрации пользователя
      //   window['fbq']('track', 'Lead')
      //   window['fbq']('track', 'StartTrial')
      // } catch (error) {
      //   // console.log('YM.FB event Lead', error)
      // }
    }

    if (target === 'checkout') {
      try {
        window['carrotquest'].track('$order_completed', {})
      } catch (e) {
        //
      }

      // try {
      //   // Отправка события в FB о создании счета
      //   window['fbq']('track', 'InitiateCheckout')
      // } catch (error) {
      //   // console.log('YM.FB event InitiateCheckout', error)
      // }
    }

    if (target === 'payment') {
      try {
        window['carrotquest'].track('$order_paid', {})
      } catch (e) {
        //
      }

      // try {
      //   // Отправка события в FB об оплате
      //   window['fbq']('track', 'Purchase', {
      //     value: 200.00,
      //     currency: 'RUB'
      //   })
      // } catch (error) {
      //   // console.log('YM.FB event Purchase', error)
      // }
    }

    try {
      window['dataLayer'].push({ event: target }) // Отправка события в GTM
    } catch (error) {
      // console.log(`YM.GTM event ${target}`, error)
    }

    setTimeout(() => { delete gTimeReachGoal[target] }, 2000)
  }
}
