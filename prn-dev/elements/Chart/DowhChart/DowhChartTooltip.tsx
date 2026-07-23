import React, { Component } from 'react'
import NumeralUtil, { NumeralFormat } from '../../../utils/NumeralUtil'

import s from './DowhChartTooltip.module.scss'

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
      <div className={s.element}>
        {metricName && <span className={s.name}>{metricName}</span>}
        <div className={s.container}>
          <span className={s.value}>{metricValue > 1 ? NumeralUtil.format(metricValue, format) : NumeralUtil.format(metricValue, '0.00')}</span>
          <div className={s.dateContainer}>
            <span className={s.date}>{['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'][dayOfWeek - 1]} с {hour}:00 до {hour + 1}:00</span>
          </div>
        </div>
      </div>
    )
  }
}

export default DowhChartTooltip
