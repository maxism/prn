import React, { Component, ReactNode } from 'react'

import './PaymentInfo.scss'
import NumeralUtil from '../../../utils/NumeralUtil'
import DateUtil from '../../../utils/DateUtil'
import Icon from '../Icon/Icon'
import { IPaymentInvoice } from '../../../stores/PlanStore'

interface IProps {
  data?: IPaymentInvoice
  showDetails?: boolean
}

interface IState {
  showDetails: boolean
}

class PaymentInfo extends Component<IProps, IState> {

  public state: IState = {
    showDetails: this.props.showDetails
  }

  render () {
    const { data } = this.props
    const { showDetails } = this.state

    const date = data.dateFinish
      ? `${DateUtil.format(data.dateStart, 'DD MMMM')} – ${DateUtil.format(data.dateFinish, 'DD MMMM')}`
      : DateUtil.format(data.dateStart, 'DD MMMM')

    const statuses = { 'paid': 'Оплачено', 'pending': 'Ожидание оплаты', 'canceled': 'Отменено', 'refunded': 'Возвращено' }

    return (
      <div className='payment-info'>
        <div className='payment-info__header' onClick={() => this.setState({ showDetails: !showDetails })}>
          <div className='payment-info__left'>
            <span className='payment-info__label'>{data.dateFinish ? 'Период действия подписки' : 'Дата платежа'}</span>
            <span className='payment-info__text'>{date}</span>
          </div>
          <div className='payment-info__center'>
            <span className='payment-info__label'>Было оплачено</span>
            <div className='payment-info__price'>
              <span className='payment-info__text'>{NumeralUtil.format(data.totalCost)}</span>
              <Icon className='payment-info__rouble' icon='rouble' />
            </div>
          </div>
          <div className='payment-info__right'>
            <Icon
              className='payment-info__icon'
              icon={showDetails ? 'up' : 'down'}
            />
          </div>
        </div>
        {showDetails &&
        <div className='payment-info__content'>
          <div className='payment-info__row'>
            <span className='payment-info__content-label'>Дата</span>
            <span className='payment-info__content-label'>Номер</span>
            <span className='payment-info__content-label-full'>Что куплено</span>
            <span className='payment-info__content-label'>Стоимость</span>
          </div>
          {
            data.invoices.map((item) => {
              return (
                <div className='payment-info__row'>
                  <span className='payment-info__content-text'>{DateUtil.format(item.timeCreate, 'D MMMM')}</span>
                  <span className='payment-info__content-text'>{item.invoiceID}</span>
                  <span className='payment-info__content-text-full'>{NumeralUtil.format(item.items, '0,0', ['страница', 'страницы', 'страниц'])}</span>
                  <div className='payment-info__content-price'>
                    <span className='payment-info__content-text-big'>{NumeralUtil.format(item.cost)}</span>
                    <Icon className='payment-info__content-rouble' icon='rouble'/>
                    <span className={`payment-info__status payment-info__status-${item.status}`}>{statuses[item.status]}</span>
                  </div>
                </div>
              )
            })
          }
        </div>
        }
      </div>
    )
  }
}

export default PaymentInfo
