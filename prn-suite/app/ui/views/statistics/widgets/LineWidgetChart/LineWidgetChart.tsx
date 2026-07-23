import * as Highcharts from 'highcharts'
import React, { Component } from 'react'

import format from '../../../../../lib/format'
import ArrayUtil from '../../../../../utils/ArrayUtil'
import { NumeralFormat } from '../../../../../utils/NumeralUtil'
import Chart from '../../../../modules/Chart/Chart'
import ReactDOMServer from 'react-dom/server'
import LineChartTooltip from './LineChartTooltip'
import Loading from '../../../../elements/Loading/Loading'

import './LineWidgetChart.scss'
import { TNoDataStyle } from '../../../../elements/NoData/NoData'

export interface ILineWidgetItem {
  date: number
  value: number
}

interface IProps {
  /**
   * Данные
   */
  data?: Array<ILineWidgetItem>
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

class LineWidgetChart extends Component<IProps> {
  render (): JSX.Element {
    let { data, color, loading, metricName, format, height, noDataStyle, noDataDescription, noDataMessage } = this.props

    data = ArrayUtil.arrayObjectsSort('date', data)

    const series: Array<Highcharts.SeriesOptionsType> = [{
      type: 'areaspline',
      name: 'Название графика',
      data: data.map(item => ({
        name: '',
        metricName: metricName,
        format: format || '0,0',
        y: item.value,
        x: item.date
      }))
    }]

    return (
      <div className='line-widget-chart'>
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
          color={color}
          percent={String(format).includes('%')}
          tooltip={function (): string {
            return ReactDOMServer.renderToString(
              <LineChartTooltip
                // grade={this?.points[0].point['grade']}
                metricValue={this?.points[0].point.y}
                metricName={this?.points[0].point['metricName']}
                format={this?.points[0].point['format']}
                date={this?.points[0].point['x']}
              />
            )
          }
          }
        />}
      </div>
    )
  }
}

export default LineWidgetChart
