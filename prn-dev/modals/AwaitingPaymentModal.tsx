import React, { Component } from 'react'
import ModalPopup from '../elements/ModalPopup/ModalPopup'
import { SingletonRouter, withRouter } from 'next/router'
import { inject, observer } from 'mobx-react'
import Title from '../elements/Title/Title'
import Row from '../elements/Row/Row'
import Text from '../elements/Text/Text'
import {Stores} from '../stores/RootStore'
import RouterUtil from '../utils/RouterUtil'
import ButtonText from '../elements/ButtonText/ButtonText'
import Image from '../elements/Image/Image'
import ButtonTagGroup from '../elements/ButtonTag/ButtonTagGroup'
import AppUtil from '../utils/AppUtil'
import PlanStore from '../stores/PlanStore'
import YMUtil from '../utils/YMUtil'

interface IRouter extends SingletonRouter {
  /**
   * query
   */
  query: {
    /**
     * Название модалки
     */
    modal: string
    /**
     * ID платежа
     */
    invoiceID: string
  }
}

interface IProps {
  /**
   * router
   */
  router?: IRouter
  planStore?: PlanStore
}


@(withRouter as any)
@inject(Stores.PLAN_STORE)
@observer
export default class AwaitingPaymentModal extends Component<IProps> {
  private _invoiceID: string
  private _timeout: NodeJS.Timeout

  constructor (props: IProps) {
    super(props)
  }

  componentWillUnmount() {
    this.clearTimeout()
  }

  handleOpen = async () => {
    const { router, planStore } = this.props
    this._invoiceID = router.query.invoiceID
    await planStore.loadInvoices()
    if (this._invoiceID && AppUtil.isClientSide && !this._timeout) {
      this._timeout = setInterval(() => planStore.loadInvoices(), 10000)
      RouterUtil.replaceParams(router, { invoiceID: undefined })
    }
  }

  handleClose = () => {
    RouterUtil.replaceParams(this.props.router, { modal: undefined })
    this.clearTimeout()
  }

  clearTimeout = () => {
    if (this._timeout) {
      clearInterval(this._timeout)
      this._timeout = null
    }
  }

  render (): JSX.Element {
    const { router, planStore } = this.props
    const invoice = planStore.getInvoiceByInvoiceID(this._invoiceID)

    const status = invoice?.status
    if (['paid', 'canceled'].includes(status)) {
      this.clearTimeout()
    }

    if (status === 'paid') YMUtil.reachGoal('payment')

    return (
      <ModalPopup
        open={router?.query?.modal === 'awaiting-payment'}
        onCloseClick={this.handleClose}
        onOpen={this.handleOpen}
      >
        {status === 'pending' && (
          <>
            <Image src={require('../public/images/emoji_sand_clock.png')} emoji />
            <Row padding='l'/>
            <Title>Ожидание оплаты</Title>
            <Row padding='m'/>
            <Text size='m' semibold>
              Сейчас мы ждём, пока платежная система пришлет нам информацию о платеже — обычно это занимает пару минут. Как только платеж подтвердится, все оплаченные функции сразу станут доступны.
            </Text>
            <Row padding='xs' />
            <Row padding='l'/>
            <ButtonTagGroup>
              <ButtonText size='l' onClick={this.handleClose}>Всё понятно</ButtonText>
            </ButtonTagGroup>
          </>
          )}

        {status === 'paid' && (
          <>
            <Image src={require('../public/images/emoji_confetti.png')} emoji />
            <Row padding='l'/>
            <Title>Успешная оплата</Title>
            <Row padding='m'/>
            <Text size='m' semibold>
              Супер, нам сообщили, что оплата прошла успешно и все оплаченные услуги уже доступны. Приятного использования сервисов КУБ!
            </Text>
            <Row padding='xs' />
            <Row padding='l'/>
            <ButtonTagGroup>
              <ButtonText size='l' onClick={this.handleClose}>Круто, поехали!</ButtonText>
            </ButtonTagGroup>
          </>
        )}

        {status === 'canceled' && (
          <>
            <Image src={require('../public/images/emoji_sad_crying.png')} emoji />
            <Row padding='l'/>
            <Title>Неудачная оплата</Title>
            <Row padding='m'/>
            <Text size='m' semibold>
              Нам сообщили, что ваша оплата не подтвердилась. Попробуйте оплатить ещё раз, а если возникли вопросы — обратитесь в поддержку.
            </Text>
            <Row padding='xs' />
            <Row padding='l'/>
            <ButtonTagGroup>
              <ButtonText size='l' onClick={() => RouterUtil.replaceParams(router, { modal: 'select-payment-method' }) }>Выбрать способ оплаты</ButtonText>
              <ButtonText size='l' secondary onClick={() => window['carrotWrap']().open()}>Обратиться в поддержку</ButtonText>
            </ButtonTagGroup>
          </>
        )}
      </ModalPopup>
    )
  }
}
