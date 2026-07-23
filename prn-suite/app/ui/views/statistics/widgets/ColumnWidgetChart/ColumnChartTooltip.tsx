import React, { Component } from 'react'
import NumeralUtil, { NumeralFormat } from '../../../../../utils/NumeralUtil'

import './ColumnChartTooltip.scss'

interface IProps {
  metricName: string
  metricValue: number
  tooltipTitles?: Array<string> | string
  format?: NumeralFormat
}

/**
 * Элемент ChartTooltip - всплывающая подсказка к графику
 */
class ColumnChartTooltip extends Component<IProps> {
  render (): JSX.Element {
    const { metricName, metricValue, tooltipTitles, format } = this.props

    return (
      <div className='chart-tooltip'>
        {/*<span className='chart-tooltip__name'>{DateUtil.format(date, 'L')}</span>*/}
        <span className='chart-tooltip__value'>{(Array.isArray(tooltipTitles)) ? NumeralUtil.format(metricValue, format, tooltipTitles) : NumeralUtil.format(metricValue, format) + tooltipTitles}</span>
        <span className='chart-tooltip__name'>{metricName}</span>
      </div>
    )
  }
}

export default ColumnChartTooltip
