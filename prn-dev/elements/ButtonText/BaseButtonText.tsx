import React, { Component, MouseEventHandler, ReactNode } from 'react'
import Link from '../Link/Link'

type IType = 'button' | 'submit' | 'reset'

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
  type?: IType
  /**
   * Открыть ссылку в новом окне
   */
  _blank?: boolean
}

/**
 * Элемент BaseButtonText
 * Кнопка
 */
class BaseButtonText extends Component<IProps> {
  render (): JSX.Element {
    const { children, onClick, className, type, _blank } = this.props
    let { to } = this.props

    // if (to && (to.includes('http://') || to.includes('https://'))) return <a href={to} onClick={onClick} className={className}>{children}</a>
    if (to) return <Link to={to} className={className} newTab={_blank}>{children}</Link>
    return <button className={className} type={type} onClick={onClick}>{children}</button>
  }
}

export default BaseButtonText
