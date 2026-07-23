import React, { Component } from 'react'

import s from './ColumnChartTooltip.module.scss'
import NumeralUtil, {NumeralFormat} from "../../../utils/NumeralUtil"

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
      <div className={s.element}>
        <span className={s.value}>{(Array.isArray(tooltipTitles)) ? NumeralUtil.format(metricValue, format, tooltipTitles) : NumeralUtil.format(metricValue, format) + tooltipTitles}</span>
        <span className={s.name}>{metricName}</span>
      </div>
    )
  }
}

export default ColumnChartTooltip
