import * as Highcharts from 'highcharts'
import React, { Component } from 'react'
import Chart from '../../../../modules/Chart/Chart'
import ReactDOMServer from 'react-dom/server'
import ColumnChartTooltip from './ColumnChartTooltip'

import './ColumnWidgetChart.scss'
import { NumeralFormat } from '../../../../../utils/NumeralUtil'
import Loading from '../../../../elements/Loading/Loading'
import Segment from '../../../../elements/Segment/Segment'
import { TNoDataStyle } from '../../../../elements/NoData/NoData'
import format from '../../../../../lib/format'

// Категории
interface IColumnWidgetSerie {
  name: string
  value: number
  tooltipTitles?: Array<string> | string
}

interface IProps {
  /**
   * Данные для графика
   */
  data?: Array<IColumnWidgetSerie>
  /**
   * Цвет графика
   */
  color?: string
  /**
   * Состояние загрузки
   */
  loading?: boolean
  /**
   * Формат данных
   */
  format?: NumeralFormat

  /**
   * Интертировать стек
   */
  reversedStacks?: boolean

  noDataMessage?: string
  noDataDescription?: string
  /**
   * Высота графика
   */
  height?: number
  noDataStyle?: TNoDataStyle
}

class ColumnWidgetChart extends Component<IProps> {
  static defaultProps = {
    format: '0,0'
  }

  render (): JSX.Element {
    let { data, loading, format, color, height, noDataStyle, noDataDescription, noDataMessage } = this.props

    const series: Array<Highcharts.SeriesOptionsType> = [{
      type: 'column',
      name: 'Название графика',
      data: data.map(item => ({
        name: item.name,
        y: item.value,
        tooltipTitles: item.tooltipTitles || ''
      }))
    }]

    return (
      <div className='line-widget-chart'>
        <Segment size={2}>
          {loading &&
          <Loading size={height} message='Строим график' />
          }
          {!loading && <Chart
            noData={!series.length}
            noDataMessage={noDataMessage}
            noDataDescription={noDataDescription}
            height={height}
            noDataStyle={noDataStyle}
            series={series}
            color={color}
            categories={data.map(item => item.name)}
            percent={String(format).includes('%')}
            tooltip={function (): string {
              return ReactDOMServer.renderToString(
                <ColumnChartTooltip
                  metricValue={this?.points[0].point.y}
                  metricName={this?.points[0].point.name}
                  tooltipTitles={this?.points[0].point.options['tooltipTitles']}
                  format={format}
                />
              )
            }}
          />}
        </Segment>
      </div>
    )
  }
}

export default ColumnWidgetChart
