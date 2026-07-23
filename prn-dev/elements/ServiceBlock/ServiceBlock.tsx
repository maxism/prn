import React, {Component, MouseEventHandler, ReactNode} from 'react'
import cx from 'classnames'
import Link from 'next/link'

import s from './ServiceBlock.module.scss'

type ISize = 2 | 3 | 4 | 6 | 8 | 12

interface IProps {
  /**
   * Содержимое элемента
   */
  children?: ReactNode
  /**
   * Размер блока
   */
  size?: ISize
  /**
   * Класс
   */
  className?: string
  /**
   * Режим слайда
   */
  slide?: boolean
  /**
   * Основной цвет фона
   */
  color?: string
  /**
   * Ссылка
   */
  to?: string
  /**
   * Открыть в новом окне
   */
  _blank?: boolean
  /**
   * Обработчик клика
   */
  onClick?: MouseEventHandler
  /**
   * Обработчик нажатия кнопки мыши
   */
  onMouseDown?: MouseEventHandler
  /**
   * Белый фон блока для серого фора (сервисов)
   */
  white?: boolean
  transparent?: boolean
  border?: boolean
  /**
   * Если мы используем элемент в качестве сетки, чтобы вертикальные расстояния были верными
   */
  grid?: boolean
}

/**
 * Блок
 * Размер задает количество занимаемых колонок
 */
export default class ServiceBlock extends Component<IProps> {
  static defaultProps = {
    size: 12
  }

  renderBlock (): JSX.Element {
    const { className, size, slide, color, to, _blank, onClick, onMouseDown, white, children, transparent, border, grid } = this.props

    const classes = cx(s.element, {
      [s.link]: to || onClick,
      [s.size2]: size === 2,
      [s.size3]: size === 3,
      [s.size4]: size === 4,
      [s.size6]: size === 6,
      [s.size8]: size === 8,
      [s.size12]: size === 12,
      [s.slide]: slide,
      [s.white]: white,
      [s.transparent]: transparent,
      [s.border]: border,
      [s.grid]: grid,
    }, className)

    return React.createElement(to ? 'a' : 'div', {
      className: classes,
      style: { '--color': color || '#F6F6F6' },
      onClick: onClick,
      onMouseDown: onMouseDown,
      target: _blank ? '_blank' : ''
    }, children)
  }

  render (): JSX.Element {
    const { to } = this.props

    if (to) return (<Link href={to}>{this.renderBlock()}</Link>)

    return this.renderBlock()
  }
}
