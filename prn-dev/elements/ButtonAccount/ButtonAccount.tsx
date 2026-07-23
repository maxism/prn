import React, { Component, MouseEventHandler, ReactNode } from 'react'
import cx from 'classnames'
import { SingletonRouter, withRouter } from 'next/router'

import Icon from '../Icon/Icon'
import BaseButtonText from '../ButtonText/BaseButtonText'
import Image from '../Image/Image'

import s from './ButtonAccount.module.scss'

interface IProps {
  router?: SingletonRouter
  /**
   * Текст кнопки
   */
  children?: ReactNode
  /**
   * Обработчик клика
   */
  onClick?: MouseEventHandler
  /**
   * Ссылка
   */
  to?: string
  /**
   * Дополнительные классы
   */
  className?: string
  /**
   * Состояние загрузки
   */
  loading?: boolean
  /**
   * Картинка
   */
  image?: string
}

/**
 * Элемент ButtonText
 * Кнопка
 */
@(withRouter as any)
class ButtonAccount extends Component<IProps> {

  static defaultProps = {
    size: 'm',
    color: 'blue',
    type: 'button'
  }

  render (): JSX.Element {
    const { children, onClick, to, className, loading, image } = this.props

    const classes = cx(s.element, {
      [s.loading]: loading,
    }, className)

    return (
      <BaseButtonText to={to} className={classes} onClick={onClick}>
        <>
          {children && <span>{children}</span>}
          {image && <Image className={s.image} src={image} border round />}
          {loading && <Icon className={cx(s.icon, s.loader)} icon='loading_dots' />}
        </>
      </BaseButtonText>
    )
  }
}

export default ButtonAccount
