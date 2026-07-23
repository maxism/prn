import React, { Component, ReactNode } from 'react'
import cx from 'classnames'

type Size = 'regular' | 'middle' | 'big'

interface IProps {
  /**
   * Содержимое элемента
   */
  children: ReactNode
  /**
   * Элементы прижаты к правому краю
   */
  right?: boolean
  /**
   * Элемент заполняет все свободное пространство
   */
  fill?: boolean
  /**
   * Размер отступов
   */
  size?: Size
  alignBottom?: boolean
}

/**
 * Элемент Toolbar2Group
 * Контейнер для группировки элементов Toolbar
 */

class Toolbar2Group extends Component<IProps> {
  render (): JSX.Element {
    const { children, right, fill, size, alignBottom } = this.props

    const classes = cx('toolbar2__group', {
      'toolbar2__group--right': right,
      'toolbar2__group--fill': fill,
      [`toolbar2__group--${size}`]: size,
      'toolbar2__group--align-bottom': alignBottom
    })

    return <div className={classes}>{children}</div>
  }
}

export default Toolbar2Group
