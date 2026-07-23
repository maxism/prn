import React, { Component } from 'react'
import NumeralUtil, { NumeralFormat } from '../../../../../utils/NumeralUtil'

import './PieChartTooltip.scss'

interface IProps {
  metricName: string
  metricValue: number
  format?: NumeralFormat
}

/**
 * Элемент ChartTooltip - всплывающая подсказка к графику
 */
class PieChartTooltip extends Component<IProps> {
  render (): JSX.Element {
    const { metricName, metricValue, format } = this.props

    return (
      <div className='chart-tooltip'>
        {/*<span className='chart-tooltip__name'>{DateUtil.format(date, 'L')}</span>*/}
        <span className='chart-tooltip__value'>{NumeralUtil.format(metricValue, format)}</span>
        <span className='chart-tooltip__name'>{metricName}</span>
      </div>
    )
  }
}

export default PieChartTooltip
