import React, { Component } from 'react'

import './MetricPost.scss'
import cx from 'classnames'

type Type = 'post' | 'postDetails'

interface IProps {
  /**
   * Название
   */
  title: string
  /**
   * Значение
   */
  value: string
  /**
   * Где используется метрика
   */
  type: Type
}

class MetricPost extends Component<IProps> {

  render (): JSX.Element {

    const { title, value, type } = this.props

    const classes = cx('metric-post', {
      [`metric-post--${type}`]: type
    })

    return (
      <div className={classes}>
        <span className='metric-post__title'>{title}</span>
        <span className='metric-post__value'>{value}</span>
      </div>
    )
  }
}

export default MetricPost
