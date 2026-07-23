import React, { Component } from 'react'

import './RadarChartTooltip.scss'
import NumeralUtil from '../../../../../utils/NumeralUtil'

interface IProps {
  points: any
}

/**
 * Элемент RadarChartTooltip - всплывающая подсказка к графику
 */

class RadarChartTooltip extends Component<IProps> {
  render (): JSX.Element {
    const { points } = this.props

    return (
      <div className='radar-chart-tooltip'>
        <span className='radar-chart-tooltip__metric-name'>{points[0].point.options.name}</span>
        {points.map(item => (
          <div key={item.point.options.category} className='radar-chart-tooltip__metric'>
            <span className='radar-chart-tooltip__metric-value'>{NumeralUtil.format(item.point.options.value, item.point.options.format)}</span>
            <span className='radar-chart-tooltip__metric-name'>{item.point.options.category}</span>
          </div>
        ))}
      </div>
    )
  }
}

export default RadarChartTooltip
