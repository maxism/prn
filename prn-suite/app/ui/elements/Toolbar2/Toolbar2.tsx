import React, { Component, ReactNode } from 'react'
import cx from 'classnames'

import './Toolbar2.scss'

type Size = 'regular' | 'middle' | 'big' | 'button'

interface IProps {
  /**
   * Содержимое элемента
   */
  children: ReactNode
  /**
   * Размер отступов
   */
  size?: Size
  /**
   * Липкое закрепление
   */
  sticky?: boolean
  /**
   * Отступ липкого закрепления
   */
  stickyOffset?: number
  /**
   * Убираем лишние расстояния
   */
  stickyPadding?: boolean
  /**
   * Контент поцсентру
   */
  center?: boolean
  /**
   * Позиция z-index
   */
  zIndex?: number
}

/**
 * Элемент Toolbar2
 * Контенер для управляющих элементов. Занимает всю строчку
 */
class Toolbar2 extends Component<IProps> {
  static defaultProps = {
    size: 'regular',
    stickyOffset: 0
  }

  render (): JSX.Element {
    const { size, sticky, stickyOffset, stickyPadding, center, zIndex } = this.props

    const classes = cx('toolbar2', {
      [`toolbar2--${size}`]: size,
      'toolbar2--sticky': sticky,
      'toolbar2--center': center
    })

    return <div className={classes} style={{ top: `${sticky && 70 + stickyOffset * 10}px`, zIndex: zIndex ? zIndex : (sticky ? (999 - stickyOffset) : null), padding: stickyPadding && `10px 0 0 0` }}>{this.props.children}</div>
  }
}

export default Toolbar2
