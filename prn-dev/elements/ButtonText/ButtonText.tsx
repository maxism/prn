import React, { Component, MouseEventHandler, ReactNode } from 'react'
import cx from 'classnames'
import { SingletonRouter, withRouter } from 'next/router'

import Icon from '../Icon/Icon'
import { IIcon } from '../Icon/Icons'
import BaseButtonText from './BaseButtonText'

import s from './ButtonText.module.scss'

type ISize = 'l' | 'm' | 's'
type IColor = 'blue' | 'grey' | 'red' | 'orange' | 'green'
type IType = 'button' | 'submit' | 'reset'

interface IProps {
  router?: SingletonRouter
  /**
   * Secondary
   */
  secondary?: boolean
  /**
   *
   */
  colorBackground?: boolean
  /**
   * Иконка
   */
  icon?: IIcon | string
  /**
   * Иконка справа
   */
  rightIcon?: boolean
  /**
   * Текст кнопки
   */
  children?: ReactNode
  /**
   * Размер
   */
  size?: ISize
  /**
   * Цвет
   */
  color?: IColor
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
  type?: IType
  /**
   * Состояние активной кнопки (нажатой)
   */
  active?: boolean
  /**
   * Дополнительные классы
   */
  className?: string
  /**
   * Точное соответствие пути для активной кнопки по url
   */
  exact?: boolean
  /**
   * Открыть ссылку в новом окне
   */
  _blank?: boolean
  /**
   * Состояние загрузки
   */
  loading?: boolean
  /**
   * Прозрачный фон
   */
  transparent?: boolean
  /**
   * Подсвечиваем текст красным
   */
  remove?: boolean
  /**
   * Добавляем стрелочку для использования в Popup
   */
  dropdown?: boolean
  /**
   * Отключение принудительного дропдауна
   */
  disableDropdown?: boolean
}

/**
 * Элемент ButtonText
 * Кнопка
 */
@(withRouter as any)
class ButtonText extends Component<IProps> {

  static defaultProps = {
    size: 'm',
    color: 'blue',
    type: 'button'
  }

  render (): JSX.Element {
    const { router, children, onClick, to, size, secondary, colorBackground, color, icon,
      rightIcon, disabled, type, active, className, exact, _blank, loading, remove, dropdown, disableDropdown } = this.props

    const classes = cx(s.element, {
      [s.secondary]: secondary,
      [s.colorBackground]: colorBackground,
      [s.sizeS]: size === 's',
      [s.sizeM]: size === 'm',
      [s.sizeL]: size === 'l',
      [s.colorBlue]: color === 'blue',
      [s.colorGrey]: color === 'grey',
      [s.colorRed]: color === 'red',
      [s.colorOrange]: color === 'orange',
      [s.active]: active || (exact ? router.asPath === to : router.asPath.startsWith(to)),
      [s.loading]: loading,
      [s.disabled]: disabled,
      [s.remove]: remove
    }, className)

    return (
      <BaseButtonText to={!disabled && to} className={classes} type={type} _blank={_blank} onClick={!disabled ? onClick : () => {}}>
        <>
          {icon && !rightIcon && <Icon className={cx(s.icon, { [s.onlyIcon]: !children })} icon={icon} />}
          {children && <span>{children}</span>}
          {icon && rightIcon && <Icon className={cx(s.icon, s.rightIcon, { [s.onlyIcon]: !children })} icon={icon} />}
          {loading && <Icon className={s.loader} icon='loading_dots' />}
          {!disableDropdown && !!dropdown && <Icon className={s.dropdown} icon='arrow_down' />}
        </>
      </BaseButtonText>
    )
  }
}

export default ButtonText
