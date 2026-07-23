import React, { Component } from 'react'

import './ProductMenu.scss'
import Icon from '../Icon/Icon'

interface IProps {
  product?: string
  onChangeProduct?: (product: string) => void
}

/**
 * Элемент ProductMenu.
 * Меню выбора продуктов при наведении мыши на логотип
 */
export default class ProductMenu extends Component<IProps> {
  render (): JSX.Element {
    const { product, onChangeProduct } = this.props

    return (
      <div className='product-menu'>
        <div className='product-menu__border'>
        <div className='product-menu__group'>

          {product !== 'statistics' && <div className='product-menu__section' onClick={() => onChangeProduct('statistics')}>
            <div className='product-menu__logo'>
              <Icon className='product-menu__logo-icon' icon='logo_sign' />
              <Icon className='product-menu__logo-messenger' icon='logo_statistics_en' />
            </div>
            <span className='product-menu__text'>
              Статистика страниц в соцсетях, анализ конкурентов, оценка эффективности постов.
            </span>
          </div>}

          {/* product !== 'messenger' && <div className='product-menu__section' onClick={() => onChangeProduct('messenger')}>
            <div className='product-menu__logo'>
              <Icon className='product-menu__logo-icon' icon='logo_sign' />
              <Icon className='product-menu__logo-messenger' icon='logo_messenger_en' />
            </div>
            <span className='product-menu__text'>
              Отвечайте на входящие комментарии и личные сообщения из всех соцсетей в одном окне.
            </span>
          </div>*/}

          <div className='product-menu__section' onClick={() => window.open('https://prn.c-cube.ru/rating', '_blank')}>
            <div className='product-menu__logo'>
              <Icon className='product-menu__logo-icon' icon='logo_sign' />
              <Icon className='product-menu__logo-rating' icon='logo_rating_en' />
            </div>
            <span className='product-menu__text'>
              Постоянно пополняемый рейтинг самых популярных страниц в социальных сетях.
            </span>
          </div>

          <div className='product-menu__section' onClick={() => window.open('https://prna.c-cube.ru/ru', '_blank')}>
            <div className='product-menu__logo'>
              <Icon className='product-menu__logo-icon' icon='logo_sign' />
              <Icon className='product-menu__logo-analytics' icon='logo_analytics_en' />
            </div>
            <span className='product-menu__text'>
              Профессиональный инструмент анализа социальных сетей для брендов и агентств.
            </span>
          </div>

        </div>
        </div>
      </div>
    )
  }
}
