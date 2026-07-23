import React, { Component, MouseEventHandler } from 'react'
import cx from 'classnames'

import './SettingsButton.scss'
import Icon from '../Icon/Icon'
import { IIcon } from '../Icon/Icons'
import Switch from '../Switch/Switch'

interface IProps {
  /**
   * Подключена или нет
   */
  active?: boolean
  /**
   * в процессе изменения
   */
  loading?: boolean
  /**
   * Обработчик клика
   */
  onClick?: MouseEventHandler
  /**
   * Иконка
   */
  icon?: IIcon | string
  /**
   * Цвет иконки
   */
  iconColor?: string
  /**
   * Название
   */
  title: string
  /**
   * Описание
   */
  description: string
  /**
   * Иконка уведомления
   */
  notificationIcon?: string
  /**
   * Цвет иконки уведомления
   */
  notificationIconColor?: string
  /**
   * Вывод по 2 плашки в строку
   */
  double?: boolean
  /**
   * Ссылка
   */
  to?: string
}

/**
 * Элемент SettingsButton
 * Плашка в настройках со свитчером
 */

class SettingsButton extends Component<IProps> {
  render (): JSX.Element {

    const { active, loading, onClick, icon, iconColor, title, description, notificationIcon, notificationIconColor, double, to } = this.props

    const classes = cx('settings-button', {
      'settings-button--active': active,
      'settings-button--double': double,
      'settings-button__notification-icon__red': notificationIcon === 'disconnect',
      'settings-button__notification-icon__green': notificationIcon === 'loader'
    })

    return (
      <a className={classes} onClick={onClick} href={to}>
        <Icon className='settings-button__icon' icon={icon} color={iconColor} />
        <div className='settings-button__content'>
          <span className='settings-button__title'>
            {title}
          </span>
          <span className='settings-button__description'>
            {description}
          </span>
        </div>
        <Icon className='settings-button__notification-icon' icon={notificationIcon} color={notificationIconColor} />
        {active !== undefined && <Switch active={active} loading={loading} />}
      </a>
    )
  }
}

export default SettingsButton
