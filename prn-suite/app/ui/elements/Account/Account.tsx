import React, { Component, MouseEventHandler } from 'react'

import Image from '../Image/Image'
import Icon from '../Icon/Icon'

import './Account.scss'
import cx from 'classnames'

interface IProps {
  /**
   * Название
   */
  name: string
  /**
   * Картинка
   */
  image: string
  /**
   * Описание
   */
  description: string
  /**
   * Активный или нет
   */
  active?: boolean
  /**
   * Привлечение внимания
   */
  attention?: boolean
  /**
   * Обработчик клика
   */
  onClick?: MouseEventHandler
  /**
   * Обработчик клика на иконку настроек
   */
  onSettings?: MouseEventHandler
  /**
   * Обработчик клика на иконку удаления
   */
  onRemove?: MouseEventHandler
  /**
   * Для автоматического закрытия в Popup
   */
  autoClosePopup?: boolean
}

/**
 * Элемент Account
 */
export default class Account extends Component<IProps> {
  render (): JSX.Element {
    const { name, image, description, active, attention, onClick, onSettings, onRemove } = this.props

    const classes = cx('account', {
      'account--active': active,
      'active': active
    })

    return (
      <div className={classes} onClick={onClick}>
        <Image className='account__image' round border src={image} noImage={require('./img/person.svg')} />
        <div className='account__main'>
          <span className='account__name'>{name}</span>
          <div className='account__description-line'>
            { attention && <Icon icon='paid' className='account__description-icon'/> }
            <span className='account__description'>{description}</span>
          </div>
        </div>
        {onSettings && <Icon onClick={(e) => { onSettings(e); e.stopPropagation() }} className='account__icon' icon='gear' />}
        {onRemove && <Icon onClick={(e) => { onRemove(e); e.stopPropagation() }} className='account__icon account__icon-red' icon='trash' />}
      </div>
    )
  }
}
