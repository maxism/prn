import React, { Component } from 'react'
import cx from 'classnames'
import DateUtil from '../../../utils/DateUtil'
import NumeralUtil, { NumeralFormat } from '../../../utils/NumeralUtil'

import s from './LineChartTooltip.module.scss'

interface IProps {
  metricName: string
  metricValue: number
  date: string | number
  format?: NumeralFormat
  compare?: boolean
  compareMetricValue?: number
  compareDate?: string | number
  color?: string
}

/**
 * Элемент ChartTooltip - всплывающая подсказка к графику
 */
class LineChartTooltip extends Component<IProps> {
  render (): JSX.Element {
    const { metricName, metricValue, date, format, compare, compareMetricValue, compareDate, color } = this.props

    const classes = cx(s.element, {
      [s.multiMetric]: compare
    })

    return (
      <div className={classes}>
        {metricName && <span className={s.name}>{metricName}</span>}
        <div className={s.container}>
          <span className={s.value}>{NumeralUtil.format(metricValue, format)}</span>
          <div className={s.dateContainer}>
            <div className={s.round} style={{backgroundColor: color}}/>
            <span className={s.date}>{DateUtil.format(date, 'L')}</span>
          </div>
        </div>
        {compare &&
          <div className={s.container}>
            <span className={s.value}>{NumeralUtil.format(compareMetricValue, format)}</span>
            {compare &&
              <div className={s.dateContainer}>
                <div className={s.round} />
                <span className={s.date}>{DateUtil.format(compareDate, 'L')}</span>
              </div>}
          </div>
        }
      </div>
    )
  }
}

export default LineChartTooltip
