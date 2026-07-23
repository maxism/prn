import React, { ErrorInfo } from 'react'
import App, { AppContext, AppInitialProps, AppProps } from 'next/app'
import { Provider } from 'mobx-react'
import { initializeStore } from '../stores/RootStore'
import CookieUtil from '../utils/CookieUtil'
import AnalyticsDemoModal from '../modals/AnalyticsDemoModal'
import AppUtil from '../utils/AppUtil'
import CreateProjectModal from '../modals/CreateProjectModal'
import AddCommunityModal from '../modals/AddCommunityModal'
import ChangePlanModal from '../modals/ChangePlanModal'
import ResetPasswordModal from '../modals/ResetPasswordModal'
import SelectPaymentMethodModal from '../modals/SelectPaymentMethodModal'
import AwaitingPaymentModal from '../modals/AwaitingPaymentModal'
import ConfirmEmailModal from '../modals/ConfirmEmailModal'
import LoginModal from '../modals/LoginModal'
import RegistrationModal from '../modals/RegistrationModal'
import { YMInitializer } from 'react-yandex-metrika'
import { SingletonRouter, withRouter } from 'next/router'
import YMUtil from '../utils/YMUtil'

import '../styles/style.scss'
import RouterUtil from '../utils/RouterUtil'
import ChangePasswordModal from "../modals/ChangePasswordModal";

interface IProps extends AppInitialProps {
  router?: SingletonRouter
  initialState: any
}

/**
 * Класс Application
 */
@(withRouter as any)
export default class Application extends App<IProps & AppProps> {
  private readonly store: any

  constructor (props: IProps & AppProps) {
    super(props)
    this.store = AppUtil.isServerSide ? props.initialState : initializeStore(props.initialState)
  }

  componentDidMount() {
    this.props.router.events.on('routeChangeStart', () => {
      if (AppUtil.isClientSide) document.body.classList.add('global-loading')
    })
    this.props.router.events.on('routeChangeComplete', () => {
      if (AppUtil.isClientSide) document.body.classList.remove('global-loading')
      YMUtil.hit()
    })
  }

  /**
   * getInitialProps
   *
   * @param appContext
   */
  static async getInitialProps (appContext: AppContext): Promise<IProps> {
    const store = initializeStore(appContext.ctx)
    // @ts-ignore
    appContext.ctx.store = store

    /**
     * Устанавливаем токен из query или cookie
     */

    await store.profileStore.setToken(String(appContext.ctx.query?.token || '') || CookieUtil.get(appContext.ctx, 's_token') || '', String(appContext.ctx.query?.accountID || '') || CookieUtil.get(appContext.ctx, 'c_accountId') || '')
    const initialProps = await App.getInitialProps(appContext as any)

    return {
      ...initialProps,
      initialState: store
    }
  }

  /**
   * Метод жизненного цикла componentDidCatch
   *
   * @param error
   * @param errorInfo
   */
  componentDidCatch (error: Error, errorInfo: ErrorInfo): void {
    console.log('CUSTOM ERROR HANDLING', error)
    super.componentDidCatch(error, errorInfo)
  }

  render (): JSX.Element {
    const { Component, pageProps, router } = this.props

    const promoCode = String(router.query?.promoCode || '')
    // Установка промо-кода и партнерского кода в cookie
    if (promoCode) CookieUtil.set(null, 'promoCode', promoCode)
    CookieUtil.setOnce(null, 'partnerCode', String(router.query?.partnerCode || ''), 30)

    if (AppUtil.isClientSide && router.query?.token) {
      CookieUtil.set(null, 's_token', String(router.query?.token || ''))
      RouterUtil.replaceParams(router, { token: undefined })
    }

    return (
      <Provider {...this.store}>
        <Component {...pageProps} />
        <LoginModal />
        <RegistrationModal />
        <AnalyticsDemoModal />
        <CreateProjectModal />
        <AddCommunityModal />
        <ChangePlanModal />
        <ResetPasswordModal />
        <SelectPaymentMethodModal />
        <AwaitingPaymentModal />
        <ConfirmEmailModal />
        <ChangePasswordModal />

        <YMInitializer accounts={[123]} options={{ clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: true, trackHash: true }} version='2' />
      </Provider>
    )
  }
}
