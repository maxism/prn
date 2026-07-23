import React, { Component, ReactNode } from 'react'

import './MetricPostGroup.scss'
import cx from 'classnames'

type Type = 'post' | 'postDetails'

interface IProps {
  /**
   * Содержимое элемента
   */
  children: ReactNode
  /**
   * Где используется метрика
   */
  type: Type
}

class MetricPostGroup extends Component<IProps> {

  render (): JSX.Element {

    const { children, type } = this.props

    const classes = cx('metric-post-group', {
      [`metric-post-group--${type}`]: type
    })

    return (
      <div className={classes}>
        {children}
      </div>
    )
  }
}

export default MetricPostGroup
