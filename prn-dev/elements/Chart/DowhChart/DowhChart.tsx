import * as Highcharts from 'highcharts'
import React, { Component, MouseEventHandler } from 'react'
import ReactDOMServer from 'react-dom/server'

import ArrayUtil from '../../../utils/ArrayUtil'
import { NumeralFormat } from '../../../utils/NumeralUtil'
import Chart from '../Chart'
import DowhChartTooltip from './DowhChartTooltip'
// import Loading from '../../../../elements/Loading/Loading'

import { TNoDataStyle } from '../../NoData/NoData'

import s from './DowhChart.module.scss'
import Link from '../../Link/Link'

export interface IDowhWidgetItem {
  time: string
  value: number
}

interface IProps {
  /**
   * Данные
   */
  data?: Array<IDowhWidgetItem>
  /**
   * Цвет графика
   */
  color?: string
  /**
   * Состояние загрузки
   */
  loading?: boolean
  metricName?: string
  format?: NumeralFormat

  noDataMessage?: string
  noDataDescription?: string
  /**
   * Высота графика
   */
  height?: number
  noDataStyle?: TNoDataStyle
  /**
   * Данные заблокированы
   */
  blocked?: boolean
  onChangePlan?: MouseEventHandler
}

class DowhChart extends Component<IProps> {
  render (): JSX.Element {
    let { data, color, loading, metricName, format, height, noDataStyle, noDataDescription, noDataMessage, blocked, onChangePlan } = this.props

    data = ArrayUtil.arrayObjectsSort('date', data) || []

    const maxValue = Math.max(...data.map(item => item.value || 0))

    const series: Array<Highcharts.SeriesOptionsType> = [{
      type: 'bubble',
      name: 'Название графика',
      data: data.map(item => ({
        name: '',
        metricName: metricName,
        format: format || '0,0',
        x: Number(item.time.split('_')[1]),
        y: Number(item.time.split('_')[0]),
        z: item.value || 0,
        marker: {
          lineWidth: 3 * item.value/maxValue + 1
        }
      }))
    }]

    return (
      <div className={s.element}>
        <Chart
          noData={!data.length}
          noDataMessage={noDataMessage}
          noDataDescription={noDataDescription}
          height={height}
          noDataStyle={noDataStyle}
          series={series}
          dowh
          color={color}
          tooltip={function (): string {
            return this?.point && ReactDOMServer.renderToString(
              <DowhChartTooltip
                // grade={this?.points[0].point['grade']}
                metricValue={this?.point?.['z']}
                metricName={this?.point['metricName']}
                format={this?.point['format']}
                hour={this?.point?.['x']}
                dayOfWeek={this?.point?.['y']}
              />
            )
          }
          }
          loading={loading}
        />
        {blocked && (
          <div className={s.blocked}>
            {/* todo: Подключить */}
            <span className={s.blockedTitle}>Доступ к данным ограничен</span>
            <span className={s.blockedText}>Увидеть эти данные можно только на платном тарифе BASIC и выше. <Link onClick={onChangePlan}>Выбрать тарифный план</Link></span>
          </div>
        )}
      </div>
    )
  }
}

export default DowhChart
