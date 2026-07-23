import React, { Component, ReactNode } from 'react'
import cx from 'classnames'

import s from './Col.module.scss'

type ISize = 2 | 3 | 4 | 6 | 8 | 10 | 12

interface IProps {
  /**
   * Компонеты
   */
  children?: ReactNode
  /**
   * Размер колонки
   */
  size?: ISize
  /**
   * Контант центрирован
   */
  center?: boolean
  /**
   * Контант поднять вверх
   */
  top?: boolean
}

/**
 * Элемент Col
 * Колонка в строке в которой вписаны компоненты
 * Задается ширина по сетке
 */
export default class Col extends Component<IProps> {
  static defaultProps = {
    size: 12
  }

  render (): JSX.Element {
    let { children, size, center, top } = this.props

    const classes = cx(s.element, {
      [s.size2]: size === 2,
      [s.size3]: size === 3,
      [s.size4]: size === 4,
      [s.size6]: size === 6,
      [s.size8]: size === 8,
      [s.size10]: size === 10,
      [s.size12]: size === 12,
      [s.center]: center,
      [s.top]: top,
    })

    return (
      <div className={classes}>
        {children}
      </div>)
  }
}
