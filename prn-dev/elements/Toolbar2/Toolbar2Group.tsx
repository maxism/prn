import React, { Component, ReactNode } from 'react'
import cx from 'classnames'

import s from './Toolbar2.module.scss'

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
}

/**
 * Элемент Toolbar2Group
 * Контейнер для группировки элементов Toolbar
 */
class Toolbar2Group extends Component<IProps> {
  render (): JSX.Element {
    const { children, right, fill } = this.props

    const classes = cx(s.groupElement, {
      [s.right]: right,
      [s.fill]: fill
    })

    return <div className={classes}>{children}</div>
  }
}

export default Toolbar2Group
