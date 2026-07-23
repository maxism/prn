import YM from 'react-yandex-metrika'
import AppUtil from './AppUtil'

let gTimeReachGoal = {}

/**
 * Утилита для работы с Yandex Metrika
 */
export default class YMUtil {
  static hit (url: string = ''): void {
    if (!AppUtil.isClientSide) return

    try {
      YM('hit', url || (window.location.pathname + window.location.search))
    } catch (error) {
      console.log('YM hit', error)
    }
  }

  static userParams (params: any): void {
    if (!AppUtil.isClientSide) return

    try {
      YM('userParams', params)
    } catch (error) {
      console.log('YM userParams', error)
    }
  }

  static reachGoal (target: string): void {
    if (!AppUtil.isClientSide) return
    if (gTimeReachGoal[target]) return

    gTimeReachGoal[target] = new Date()

    console.log('reachGoal', target)

    try {
      window['_tmr'].push({ id: '123', type: 'reachGoal', goal: target })
    } catch (error) {
      console.log('MT reachGoal', error)
    }

    try {
      YM('reachGoal', target)
    } catch (error) {
      console.log('YM reachGoal', error)
    }

    if (target === 'login') {
      window['carrotWrap']().track('$authorized', {})
    }

    if (target === 'registration') {
      window['carrotWrap']().track('$registered', {})

      try {
        window['VK'].Goal('complete_registration') // Отправка события в VK о регистрации пользователя
      } catch (error) {
        console.log('YM.VK reachGoal complete_registration', error)
      }

      try {
        // Отправка события в FB о регистрации пользователя
        window['fbq']('track', 'Lead')
        window['fbq']('track', 'StartTrial')
      } catch (error) {
        console.log('YM.FB event Lead', error)
      }

      try {
        window['ttq'].track('CompleteRegistration')
      } catch (error) {
        console.log('YM.TT event CompleteRegistration', error)
      }
    }

    if (target === 'checkout') {
      window['carrotWrap']().track('$order_completed', {})

      try {
        // Отправка события в FB о создании счета
        window['fbq']('track', 'InitiateCheckout')
      } catch (error) {
        console.log('YM.FB event InitiateCheckout', error)
      }

      try {
        window['ttq'].track('InitiateCheckout')
      } catch (error) {
        console.log('YM.TT event InitiateCheckout', error)
      }
    }

    if (target === 'payment') {
      window['carrotWrap']().track('$order_paid', {})

      try {
        // Отправка события в FB об оплате
        window['fbq']('track', 'Purchase', {
          value: 200.00,
          currency: 'RUB'
        })
      } catch (error) {
        console.log('YM.FB event Purchase', error)
      }

      try {
        window['ttq'].track('CompletePayment')
      } catch (error) {
        console.log('YM.TT event CompletePayment', error)
      }
    }

    try {
      window['dataLayer'].push({ event: target }) // Отправка события в GTM
    } catch (error) {
      console.log(`YM.GTM event ${target}`, error)
    }

    setTimeout(() => { delete gTimeReachGoal[target] }, 2000)
  }
}
