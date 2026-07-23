import * as Highcharts from 'highcharts'
import React, { Component } from 'react'
import Chart from '../../../../modules/Chart/Chart'
import ReactDOMServer from 'react-dom/server'
import PieChartTooltip from './PieChartTooltip'

import { NumeralFormat } from '../../../../../utils/NumeralUtil'
import Loading from '../../../../elements/Loading/Loading'
import Segment from '../../../../elements/Segment/Segment'
import { TNoDataStyle } from '../../../../elements/NoData/NoData'

import './PieWidgetChart.scss'

// Категории
interface IPieWidgetSerie {
  name: string
  value: number
  color?: string
}

interface IProps {
  /**
   * Данные для графика
   */
  data?: Array<IPieWidgetSerie>
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

class PieWidgetChart extends Component<IProps> {
  static defaultProps = {
    format: '0,0'
  }

  render (): JSX.Element {
    let { data, loading, format, color, height, noDataStyle, noDataDescription, noDataMessage } = this.props

    const series: Array<Highcharts.SeriesOptionsType> = [{
      type: 'pie',
      name: 'Название графика',
      data: data.map(item => ({
        name: item.name,
        y: item.value,
        color: item.color
      }))
    }]

    return (
      <div className='pie-widget-chart'>
        <Segment size={2}>
          {loading &&
              <Loading size={height} message='Строим график' />
          }
          {!loading && <Chart
              pie
              noData={!series.length}
              noDataMessage={noDataMessage}
              noDataDescription={noDataDescription}
              height={height}
              noDataStyle={noDataStyle}
              series={series}
              color={color}
              categories={data.map(item => item.name)}
              tooltip={function (): string {
                return ReactDOMServer.renderToString(
                  <PieChartTooltip
                    metricValue={this.y}
                    metricName={String(this.key)}
                    // color={this?.color}
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

export default PieWidgetChart
