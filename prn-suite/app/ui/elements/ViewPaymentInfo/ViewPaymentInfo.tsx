import React, { Component } from 'react'

import './ViewPaymentInfo.scss'
import Icon from '../Icon/Icon'

/**
 * Блок с описанием способов оплаты на странице подписки
 */

class ViewPaymentInfo extends Component {
  render (): JSX.Element {

    return (
      <div className='view-payment-info'>
        <span className='view-payment-info__text'>
          Для юридических лиц действуют специальные тарифы — напишите нам на почту <a href='mailto:info@c-cube.ru'>info@c-cube.ru</a> или в <a href='javascript:carrotquest.open();'>чат на сайте</a>.
        </span>
        <div className='view-payment-info__icons'>
          <Icon className='view-payment-info__icon' icon='visa'/>
          <Icon className='view-payment-info__icon' icon='mastercard'/>
          <Icon className='view-payment-info__icon' icon='mir'/>
        </div>
      </div>
    )
  }
}

export default ViewPaymentInfo
