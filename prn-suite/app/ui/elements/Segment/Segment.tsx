import React, { Component, ReactNode } from 'react'
import cx from 'classnames'

import './Segment.scss'

interface IProps {
  /**
   * ID элемента
   */
  id?: string
  /**
   * Содержимое элемента
   */
  children?: ReactNode,
  /**
   * Размер отступа
   */
  size?: number
  /**
   * На всю ширину и высоту
   */
  full?: boolean
  /**
   * Контент поцентру
   */
  center?: boolean
  maxWidth?: number
}

/**
 * Элемент Segment
 */
export default class Segment extends Component<IProps> {
  static defaultProps = {
    size: 1
  }

  render (): JSX.Element {
    const { id, size, full, center, maxWidth } = this.props

    const classes = cx('segment', {
      'segment--full': full,
      'segment--center': center
    })

    return (
      <section
        id={id}
        className={classes}
        style={{ paddingTop: `${size * 10}px`, maxWidth: maxWidth ? `${maxWidth}px` : `auto` }}
      >
        {this.props.children}
      </section>
    )
  }
}
