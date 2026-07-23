import React, { Component } from 'react'
import NumeralUtil, { NumeralFormat } from '../../../../../utils/NumeralUtil'

import './DowhChartTooltip.scss'
import DateUtil from '../../../../../utils/DateUtil'

interface IProps {
  metricName: string
  metricValue: number
  hour: number
  dayOfWeek: number
  format?: NumeralFormat
}

/**
 * Элемент ChartTooltip - всплывающая подсказка к графику
 */
class DowhChartTooltip extends Component<IProps> {
  render (): JSX.Element {
    const { metricName, metricValue, hour, dayOfWeek, format } = this.props

    return (
      <div className='chart-tooltip'>
          <span className='chart-tooltip__name'>{metricName}</span>
          <span className='chart-tooltip__value'>{metricValue > 1 ? NumeralUtil.format(metricValue, format) : NumeralUtil.format(metricValue, '0.00')}</span>
        <span className='chart-tooltip__date'>{['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'][dayOfWeek - 1]}, с {hour}:00 до {hour + 1}:00</span>
      </div>
    )
  }
}

export default DowhChartTooltip
