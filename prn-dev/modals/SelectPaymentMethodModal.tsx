import React, { Component } from 'react'

import ModalPopup from '../elements/ModalPopup/ModalPopup'
import { SingletonRouter, withRouter } from 'next/router'
import { inject, observer } from 'mobx-react'
import Title from '../elements/Title/Title'
import Row from '../elements/Row/Row'
import Text from '../elements/Text/Text'
import FormRow from '../elements/Form/FormRow'
import Form from '../elements/Form/Form'
import {Stores} from '../stores/RootStore'
import RouterUtil from '../utils/RouterUtil'
import ButtonText from '../elements/ButtonText/ButtonText'
import RadioButton from '../elements/RadioButton/RadioButton'
import PlanStore from "../stores/PlanStore";
import ButtonTextGroup from '../elements/ButtonText/ButtonTextGroup'
import ProfileStore from "../stores/ProfileStore";
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
     * Название тариф
     */
    planName?: string
    /**
     * Период тарифа
     */
    planPeriod?: string
  }
}

interface IProps {
  /**
   * router
   */
  router?: IRouter
  planStore?: PlanStore
  profileStore?: ProfileStore
}

@(withRouter as any)
@inject(Stores.PLAN_STORE, Stores.PROFILE_STORE)
@observer
export default class SelectPaymentMethodModal extends Component<IProps> {
  constructor (props: IProps) {
    super(props)
  }

  handleOpen = async () => {
    const { router, planStore, profileStore } = this.props
    const { planName, planPeriod } = router.query

    planStore.planPaymentForm.setData({
      method: profileStore.userPlan.isCardAttached ? 'saved_card' : 'bank_card'
    })

    if (planName) {
      planStore.planPaymentForm.setData({
        name: planName,
        period: Number(planPeriod)
      })
    }
  }

  changePlan = async () => {
    const { router, planStore, profileStore } = this.props
    await planStore.pay()
    if (planStore.confirmationURL) {
      if (planStore.planPaymentForm.method.value === 'cp') {
        const widget = new window['cp'].CloudPayments()

        widget.pay('charge',
          {
            publicId: 'pk_e0c4772c19ef7a02fc05a53645367', // id из личного кабинета
            description: 'Оплата тарифа в сервисе КУБ', // назначение
            amount: planStore.planCost, // сумма
            currency: 'RUB', // валюта
            accountId: profileStore.profile.userID, // идентификатор плательщика (необязательно)
            invoiceId: planStore.confirmationURL, // номер заказа  (необязательно)
            email: profileStore.profile.email, //email плательщика (необязательно)
            skin: 'mini', // дизайн виджета (необязательно)
            autoClose: 3, // время в секундах до авто-закрытия виджета (необязательный)
            data: {
              CloudPayments: {
                CustomerReceipt: {
                  Items: [{
                    'label': 'Оплата тарифа в сервисе КУБ', //наименование товара
                    'price': planStore.planCost, //цена
                    'quantity': 1.00, //количество
                    'amount': planStore.planCost, //сумма
                    'vat': null, //ставка НДС
                    'method': 4, // тег-1214 признак способа расчета - признак способа расчета
                    'object': 0, // тег-1212 признак предмета расчета - признак предмета товара, работы, услуги, платежа, выплаты, иного предмета расчета
                    'measurementUnit': 'шт' //единица измерения
                  }],
                  'email': profileStore.profile.email,
                  'amounts':
                    {
                      'electronic': planStore.planCost, // Сумма оплаты электронными деньгами
                      'advancePayment': 0.00, // Сумма из предоплаты (зачетом аванса) (2 знака после запятой)
                      'credit': 0.00, // Сумма постоплатой(в кредит) (2 знака после запятой)
                      'provision': 0.00 // Сумма оплаты встречным предоставлением (сертификаты, др. мат.ценности) (2 знака после запятой)
                    }
                }
              }
            }
          },
          {
            onSuccess: function (options) { // success
              //действие при успешной оплате
              console.log('onSuccess', options)

              RouterUtil.replaceParams(router, { modal: undefined })
              YMUtil.reachGoal('payment')
              profileStore.load()
            },
            onFail: function (reason, options) { // fail
              //действие при неуспешной оплате
              console.log('onFail', reason, options)
            },
            onComplete: function (paymentResult, options) {
              //Вызывается как только виджет получает от api.cloudpayments ответ с результатом транзакции.
              //например вызов вашей аналитики Facebook Pixel
              console.log('onComplete', paymentResult, options)
            }
          }
        )
      } else {
        document.location.href = planStore.confirmationURL
      }
    } else {
      RouterUtil.replaceParams(router, { modal: 'change-plan' })
    }
  }

  render (): JSX.Element {
    const { router, planStore, profileStore } = this.props
    const planForm = planStore.planPaymentForm
    const paymentMethod = planForm.method.value

    return (
      <ModalPopup
        open={router?.query?.modal === 'select-payment-method'}
        onCloseClick={() => RouterUtil.replaceParams(router, { modal: undefined, planName: undefined, planPeriod: undefined })}
        onOpen={this.handleOpen}
      >
        <Title>Выбор способа оплаты</Title>
        <Row padding='m'/>
        <Text size='m' semibold>
          Выберите удобный способ оплаты. Далее вам нужно будет произвести оплату на сайте платежного сервиса. После оплаты вы автоматически вернётесь в свой личный кабинет КУБ.
        </Text>
        <Row padding='xl'/>
        <Form>
          {profileStore.userPlan.isCardAttached &&
              <FormRow full>
                <RadioButton
                    white
                    value='saved_card'
                    group='payment'
                    label='Привязанная карта'
                    description='Использовать привязанную карту для оплаты'
                    checked={paymentMethod === 'saved_card'}
                    onSelect={() => planForm.method.change('saved_card')}
                />
              </FormRow>
          }

          <FormRow full>
            <RadioButton
              white
              value='bank_card'
              group='payment'
              label='Карта российского банка'
              description='МИР, Visa, MasterCard'
              checked={paymentMethod === 'bank_card'}
              onSelect={() => planForm.method.change('bank_card')}
            />
          </FormRow>

          <FormRow full>
            <RadioButton
              white
              value=''
              group='payment'
              label='ЮMoney, SberPay, T-Pay'
              description='ЮMoney, SberPay, T-Pay'
              checked={paymentMethod === ''}
              onSelect={() => planForm.method.change('')}
            />
          </FormRow>

          {/*<FormRow full>*/}
          {/*  <RadioButton*/}
          {/*    white*/}
          {/*    value='paypal'*/}
          {/*    group='payment'*/}
          {/*    label='Карта банка другой страны, PayPal'*/}
          {/*    description='Visa, Mastercard, American Express, PayPal, ...'*/}
          {/*    checked={paymentMethod === 'paypal'}*/}
          {/*    onSelect={() => planForm.method.change('paypal')}*/}
          {/*  />*/}
          {/*</FormRow>*/}

          {/*<FormRow full>*/}
          {/*  <RadioButton*/}
          {/*    white*/}
          {/*    value='cp'*/}
          {/*    group='payment'*/}
          {/*    label='Карта банка другой страны'*/}
          {/*    description='Только MasterCard'*/}
          {/*    checked={paymentMethod === 'cp'}*/}
          {/*    onSelect={() => planForm.method.change('cp')}*/}
          {/*  />*/}
          {/*</FormRow>*/}

          {/*<FormRow full>*/}
          {/*  <RadioButton*/}
          {/*    white*/}
          {/*    value='enot'*/}
          {/*    group='payment'*/}
          {/*    label='Криптовалюты, Perfect Money, ЮMoney'*/}
          {/*    description='Bitcoin, Ethereum, USDT, TON, ...'*/}
          {/*    checked={paymentMethod === 'enot'}*/}
          {/*    onSelect={() => planForm.method.change('enot')}*/}
          {/*  />*/}
          {/*</FormRow>*/}

          {/*<FormRow full>
            <RadioButton
              white
              value='others'
              group='payment'
              label='Платежная система'
              description='Qiwi, Юмани, СБП, Яндекс.Pay, Сбер.Pay и другие.'
              checked={paymentMethod === 'others'}
              onSelect={() => planForm.method.change('others')}
            />
          </FormRow>

          {/*<FormRow full>
            <RadioButton
              white
              value='a1.4'
              group='payment'
              label='Банковский счёт'
              description='Оплата по реквизитам. Минимальный платеж — 5000 рублей.'
              checked={this.state.step1answer === 'a1.4'}
              onSelect={e => this.setState({ step1answer: e.target.value })}
            />
          </FormRow>

          <FormRow full>
            <RadioButton
              white
              value='a1.5'
              group='payment'
              label='Другой способ оплаты'
              description='Менее популярные варианты, например, криптовалюта.'
              checked={this.state.step1answer === 'a1.5'}
              onSelect={e => this.setState({ step1answer: e.target.value })}
            />
          </FormRow>*/}

          <Row padding='m' />
          <Row padding='xxs' />

          <Text size='m' semibold>
            Если не получается оплатить представленными способами напишите, пожалуйста, в поддержку, мы предложим другие способы оплаты.
          </Text>

          {/*<Row padding='m'/>*/}
          {/*<Text size='s' semibold>*/}
          {/*  <Icon size='s' color='red' icon='attention' /> При оплате картами зарубежных банков мы не сможем предоставить чек.*/}
          {/*</Text>*/}

          <FormRow full>
            <ButtonTextGroup full size='m'>
              <ButtonText size='l' loading={this.props.planStore.isPaying} onClick={this.changePlan}>
                Продолжить
              </ButtonText>
              <ButtonText secondary onClick={() => window['carrotWrap']().open()} size='l'>Нужна помощь</ButtonText>
            </ButtonTextGroup>
          </FormRow>
        </Form>
      </ModalPopup>
    )
  }
}
