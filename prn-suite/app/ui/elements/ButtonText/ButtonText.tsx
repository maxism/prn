import React, { Component, MouseEventHandler, ReactNode } from 'react'
import cx from 'classnames'

import Icon from '../Icon/Icon'
import { IIcon } from '../Icon/Icons'
import BaseButtonText from './BaseButtonText'

import './ButtonText.scss'

type Size = 'small' | 'middle' | 'big' | 'awesome'
type Color = 'grey' | 'blue' | 'red' | 'transparent' | 'new'
type Type = 'button' | 'submit'

interface IProps {
  /**
   * Иконка
   */
  icon?: IIcon
  /**
   * Цвет иконки
   */
  iconColor?: string
  /**
   * Текст кнопки
   */
  children?: ReactNode
  /**
   * Размер
   */
  size?: Size
  /**
   * Цвет
   */
  color?: Color
  /**
   * Активна ли кнопка
   */
  disabled?: boolean
  /**
   * Обработчик клика
   */
  onClick?: MouseEventHandler
  /**
   * Ссылка
   */
  to?: string
  /**
   * Тип кнопки
   */
  type?: Type
  /**
   * Состояние активной кнопки (нажатой)
   */
  active?: boolean
  /**
   * Если нужна круглая кнопка
   */
  round?: boolean
  /**
   * Состояние загрузки
   */
  loading?: boolean
  unsubscribe?: boolean
  className?: string
}

/**
 * Элемент ButtonText
 * Кнопка
 */
class ButtonText extends Component<IProps> {

  static defaultProps = {
    loading: false,
    size: 'big',
    color: 'grey',
    type: 'button'
  }

  render (): JSX.Element {
    const { children, onClick, to, size, color, icon, iconColor, disabled, type, active, round, loading, unsubscribe, className } = this.props

    const classes = cx('button-text', {
      [`button-text--${size}`]: size,
      [`button-text--${color}`]: color,
      'button-text--active': active,
      'button-text--disabled': disabled,
      'button-text--round': round,
      'button-text--loading': loading,
      'button-text--unsubscribe': unsubscribe
    }, className)

    return (
      <BaseButtonText to={to} className={classes} type={type} onClick={!disabled ? onClick : undefined}>
        {icon && <Icon className='button-text__icon' icon={icon} color={iconColor} />}
        {children && <span className='button-text__children'>{children}</span>}
      </BaseButtonText>
    )
  }
}

export default ButtonText
