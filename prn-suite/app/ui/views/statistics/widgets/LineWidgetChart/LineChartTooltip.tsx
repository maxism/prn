import React, { Component } from 'react'
import DateUtil from '../../../../../utils/DateUtil'
import NumeralUtil, { NumeralFormat } from '../../../../../utils/NumeralUtil'

import './LineChartTooltip.scss'

interface IProps {
  metricName: string
  metricValue: number
  date: string | number
  format?: NumeralFormat
}

/**
 * Элемент ChartTooltip - всплывающая подсказка к графику
 */
class LineChartTooltip extends Component<IProps> {
  render (): JSX.Element {
    const { metricName, metricValue, date, format } = this.props

    return (
      <div className='chart-tooltip'>
          <span className='chart-tooltip__name'>{metricName}</span>
          <span className='chart-tooltip__value'>{NumeralUtil.format(metricValue, format)}</span>
        <span className='chart-tooltip__date'>{DateUtil.format(date, 'L')}</span>
      </div>
    )
  }
}

export default LineChartTooltip
