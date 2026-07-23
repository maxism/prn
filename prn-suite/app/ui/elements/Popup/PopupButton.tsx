import React, { Component, MouseEventHandler, ReactNode } from 'react'
import cx from 'classnames'

import Icon from '../Icon/Icon'
import { IIcon } from '../Icon/Icons'

import './PopupButton.scss'
import BadgeCount from '../BadgeCount/BadgeCount'
import Tooltip from '../../modules/Tooltip/Tooltip'

interface ITooltip {
  title: string
  text: string
  button: string
  buttonOnClick: MouseEventHandler
}

interface IProps {
  /**
   * Текст
   */
  children: ReactNode
  /**
   * Подпись
   */
  description?: ReactNode
  /**
   * Иконка
   */
  icon?: IIcon | string
  /**
   * Бэйдж
   */
  badge?: string
  /**
   * Активное состояние
   */
  active?: boolean
  /**
   * Отключенное состояние
   */
  disabled?: boolean
  /**
   * Данные тултипа
   */
  tooltip?: ITooltip
  /**
   * Обработчик клика
   */
  onClick?: MouseEventHandler
  /**
   * Используется для автоматического закрытия Popup
   */
  autoClosePopup?: boolean
}

/**
 * Блок PopupButton
 */
export default class PopupButton extends Component<IProps> {

  render (): JSX.Element {
    const {
      children, icon, active, disabled, tooltip,
      onClick, badge, description
    } = this.props

    const classes = cx('popup-button', {
      'popup-button--active': active,
      'popup-button--disabled': disabled
    })

    return (
      <div className={classes} onClick={!disabled ? onClick : undefined}>
        {icon && !tooltip && <Icon className='popup-button__icon' icon={icon} />}
        {tooltip &&
          <Tooltip
            trigger={icon && <Icon className='popup-button__icon' icon={icon} color={!active ? 'D9D9D9' : undefined}/>}
            title={tooltip.title}
            text={tooltip.text}
            button={tooltip.button}
            buttonOnClick={tooltip.buttonOnClick}
          />
        }
        <span className='popup-button__text'>
          <span className='popup-button__value'>{children}</span>
          {description && <span className='popup-button__description'>{description}</span>}
        </span>
        {badge && <BadgeCount disabled={disabled}>{badge}</BadgeCount>}
      </div>)
  }
}
