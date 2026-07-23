import * as Highcharts from 'highcharts'
import React, { Component } from 'react'

import { NumeralFormat } from '../../../../../utils/NumeralUtil'
import Chart from '../../../../modules/Chart/Chart'
import ReactDOMServer from 'react-dom/server'
import RadarChartTooltip from './RadarChartTooltip'

interface IMetric {
  name: string
  score: number
  value: number
  formatValue: NumeralFormat
}

export interface IRadarData {
  name: string
  metrics: Array<IMetric>
  color: string
  avg?: boolean
}

interface IProps {
  /**
   * Список постов
   */
  data?: Array<IRadarData>
}

class RadarChart extends Component<IProps> {
  render (): JSX.Element {
    const { data } = this.props

    const series: Array<Highcharts.SeriesOptionsType> = data.map(item => ({
      type: 'areaspline',
      name: item.name,
      fillOpacity: 0.5,
      lineWidth: 4,
      color: item.color,
      data: item.metrics.map(metric => ({
        name: metric.name,
        y: metric.score * 100,
        value: metric.value,
        format: metric.formatValue || '0,0',
        category: item.name,
        marker: {
          ...(item.avg && {
            enabled: false,
            radius: 0,
            states: {
              hover: {
                enabled: false
              }
            }
          }),
          lineColor: item.color
        }}))
    }))

    return (
      <>
        <Chart
          noData={!data.length}
          series={series}
          tooltip={function (): string {
            return ReactDOMServer.renderToString(
              <RadarChartTooltip
                points={this?.points}
              />
            )
          }}
          polar
        />
      </>
    )
  }
}

export default RadarChart
