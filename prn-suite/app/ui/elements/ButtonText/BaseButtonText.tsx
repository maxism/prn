import React, { Component, MouseEventHandler, ReactNode } from 'react'
import { Link } from 'react-router-dom'

import './ButtonText.scss'

type Size = 'button' | 'submit'

interface IProps {
  /**
   * Класс
   */
  className?: string
  /**
   * Обработчик клика
   */
  onClick?: MouseEventHandler
  /**
   * Ссылка
   */
  to?: string
  /**
   * Элементы
   */
  children: ReactNode
  /**
   * Тип кнопки
   */
  type?: Size
}

/**
 * Элемент BaseButtonText
 * Кнопка
 */
class BaseButtonText extends Component<IProps> {
  render (): JSX.Element {
    const { children, onClick, className, type } = this.props
    let { to } = this.props

    if (to) return <Link to={to} className={className}>{children}</Link>
    return <button className={className} type={type} onClick={onClick}>{children}</button>
  }
}

export default BaseButtonText
