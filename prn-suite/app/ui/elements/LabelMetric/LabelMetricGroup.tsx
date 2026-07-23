import React, { Component, ReactNode } from 'react'

import './LabelMerticGroup.scss'

interface IProps {
  children: ReactNode
}

/**
 * Элемент LabelMetricGroup
 * Группа метрик
 */
class LabelMetricGroup extends Component<IProps> {
  render (): JSX.Element {
    return (
      <div className='label-metric-group'>{this.props.children}</div>
    )
  }
}

export default LabelMetricGroup
