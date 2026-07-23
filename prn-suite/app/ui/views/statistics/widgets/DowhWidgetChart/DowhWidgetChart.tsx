import * as Highcharts from 'highcharts'
import React, { Component } from 'react'

import format from '../../../../../lib/format'
import ArrayUtil from '../../../../../utils/ArrayUtil'
import { NumeralFormat } from '../../../../../utils/NumeralUtil'
import Chart from '../../../../modules/Chart/Chart'
import ReactDOMServer from 'react-dom/server'
import DowhChartTooltip from './DowhChartTooltip'
import Loading from '../../../../elements/Loading/Loading'

import { TNoDataStyle } from '../../../../elements/NoData/NoData'

import './DowhWidgetChart.scss'

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
}

class DowhWidgetChart extends Component<IProps> {
  render (): JSX.Element {
    let { data, color, loading, metricName, format, height, noDataStyle, noDataDescription, noDataMessage } = this.props

    data = ArrayUtil.arrayObjectsSort('date', data)

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
          lineWidth: 3 * item.value / maxValue + 1
        }
      }))
    }]

    return (
      <div className='dowh-widget-chart'>
        {loading &&
          <Loading size={height} message='Строим график' />
        }
        {!loading && <Chart
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
        />}
      </div>
    )
  }
}

export default DowhWidgetChart
