import React, { Component, MouseEventHandler, ReactNode } from 'react'
import cx from 'classnames'
import { SingletonRouter, withRouter } from 'next/router'

import BaseButtonText from '../ButtonText/BaseButtonText'

import s from './ButtonNav.module.scss'
import { IIcon } from '../Icon/Icons'
import Icon from '../Icon/Icon'

interface IProps {
  router?: SingletonRouter
  /**
   * Текст кнопки
   */
  children?: ReactNode
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
   * Иконка
   */
  icon?: IIcon | string
}

/**
 * Элемент ButtonText
 * Кнопка
 */
@(withRouter as any)
class ButtonNav extends Component<IProps> {
  render (): JSX.Element {
    const { router, children, onClick, to, disabled, active, className, exact, _blank, icon } = this.props

    let navTo = String(to).replace('&scroll=false', '').replace('scroll=false', '')
    if (navTo.endsWith('?')) navTo = navTo.substring(0, navTo.length - 1)

    const uri = String(navTo).includes('?') ? navTo.split('?')[0] : navTo
    const navActive = exact ? router.asPath === uri : router.asPath.startsWith(uri)

    const classes = cx(s.element, {
      [s.active]: active || active === undefined && navActive,
      [s.disabled]: disabled,
    }, className)

    return (
      <BaseButtonText to={!disabled && to} className={classes} _blank={_blank} onClick={!disabled ? onClick : () => {}}>
        {icon && <Icon className={cx(s.icon, { [s.onlyIcon]: !children })} icon={active ? `${icon}_colored` : icon} />}
        {children}
      </BaseButtonText>
    )
  }
}

export default ButtonNav
