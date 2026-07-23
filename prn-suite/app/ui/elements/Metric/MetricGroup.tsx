import React, { Component, ReactNode } from 'react'

import './MerticGroup.scss'

interface IProps {
  children: ReactNode
}

/**
 * Элемент MetricGroup
 * Группа метрик
 */
class MetricGroup extends Component<IProps> {
  render (): JSX.Element {
    return (
      <div className='metric-group'>{this.props.children}</div>
    )
  }
}

export default MetricGroup
