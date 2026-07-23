import React, { Component, ReactNode } from 'react'

import './InfluencersMetricsRowGroup.scss'

interface IProps {
  children: ReactNode
}

/**
 * Элемент MetricsRowGroup.
 * Задаёт расстояние между строками таблицы
 */

class InfluencersMetricsRowGroup extends Component<IProps> {

  render (): JSX.Element {

    const { children } = this.props

    return (
      <div className='influencers-metrics-row-group'>
        {children}
      </div>
    )
  }
}

export default InfluencersMetricsRowGroup
