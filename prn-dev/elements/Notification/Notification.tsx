import React, {Component, MouseEventHandler} from 'react'
import cx from 'classnames'

import s from './Notification.module.scss'
import Icon from '../Icon/Icon'
import ButtonText from '../ButtonText/ButtonText'
import Row from '../Row/Row'
import {IIcon} from '../Icon/Icons'

type Color = 'blue' | 'orange' | 'red' | 'green' | 'grey'

interface IProps {
  /**
   * Заголовок
   */
  title: string
  /**
   * Сообщение, которое будем выводить
   */
  message: string
  /**
   * Иконка уведомления
   */
  icon?: IIcon | string
  /**
   * Обработчик клика
   */
  onClick?: MouseEventHandler
  /**
   * Ссылка на кнопке
   */
  to?: string
  /**
   * Текст кнопки
   */
  buttonText?: string
  /**
   * Загрузчик на кнопке
   */
  isLoading?: boolean
  /**
   * Цвет уведомления
   */
  color?: Color
  /**
   * Маленькое уведомление
   */
  small?: boolean
  /**
   * Не 100% ширина
   */
  inline?: boolean
}

/**
 * Элемент Notification.
 * Уведомление в интерфейсе
 */

class Notification extends Component<IProps> {
  static defaultProps = {
    color: 'orange'
  }

  render (): JSX.Element {

    const { title, message, icon, onClick, to, buttonText, isLoading, color, small, inline } = this.props

    const classes = cx(s.element, {
      [s.blue]: color === 'blue',
      [s.orange]: color === 'orange',
      [s.red]: color === 'red',
      [s.green]: color === 'green',
      [s.grey]: color === 'grey',
      [s.small]: small,
      [s.inline]: inline
    })

    return (
      <div className={classes}>

        {icon && <div className={s.image}>
          <Icon className={s.icon} icon={icon} />
        </div>}

        <div className={s.container}>
          <span className={s.title}>{title}</span>
          {!small && <Row padding='xs' />}
          {small && <Row padding='xxs' />}
          <span className={s.text}>{message}</span>
        </div>

        {(onClick || to) && <ButtonText to={to} onClick={onClick} color={color} loading={isLoading}>{buttonText}</ButtonText>}
      </div>
    )
  }
}

export default Notification
