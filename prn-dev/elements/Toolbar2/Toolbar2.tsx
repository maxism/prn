import React, { Component, ReactNode } from 'react'
import cx from 'classnames'

import s from './Toolbar2.module.scss'

type Size = 'regular' | 'big'

interface IProps {
  /**
   * Содержимое элемента
   */
  children: ReactNode
  /**
   * Размер отступов
   */
  size?: Size
}

/**
 * Элемент Toolbar2
 * Контенер для управляющих элементов. Занимает всю строчку
 */
class Toolbar2 extends Component<IProps> {
  static defaultProps = {
    size: 'regular'
  }

  render (): JSX.Element {
    const { size } = this.props

    const classes = cx(s.element, {
      [s.regular]: size === 'regular',
      [s.big]: size === 'big'
    })

    return <div className={classes}>{this.props.children}</div>
  }
}

export default Toolbar2
