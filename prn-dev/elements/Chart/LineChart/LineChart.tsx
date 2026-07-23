import * as Highcharts from 'highcharts'
import React, {Component, MouseEventHandler} from 'react'
import ReactDOMServer from 'react-dom/server'
import moment from 'moment'

import ArrayUtil from '../../../utils/ArrayUtil'
import { NumeralFormat } from '../../../utils/NumeralUtil'
import Chart from '../Chart'
import LineChartTooltip from './LineChartTooltip'
import { TNoDataStyle } from '../../NoData/NoData'

import s from './LineChart.module.scss'
import Link from '../../Link/Link'

export interface ILineWidgetItem {
  date: number | Date
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
  format?: NumeralFormat | string

  noDataMessage?: string
  noDataDescription?: string
  /**
   * Высота графика
   */
  height?: number
  noDataStyle?: TNoDataStyle
  /**
   * Вид колонками
   */
  column?: boolean
  /**
   * Сравнение с предыдущим периодом (разбивает данные на две части)
   */
  compare?: boolean
  /**
   * График заблокирован
   */
  blocked?: boolean
  /**
   * Тарифы для разблокировки данных
   */
  higherPlansList?: string
  /**
   * Обработчик смены тарифа
   */
  onChangePlan?: MouseEventHandler
}

class LineChart extends Component<IProps> {
  render (): JSX.Element {
    let { data, color, loading, metricName, format, height, noDataStyle, noDataDescription, noDataMessage, column, compare, blocked, higherPlansList, onChangePlan } = this.props

    data = ArrayUtil.arrayObjectsSort('date', data || [])
    const countPoints = data.length
    const dataCurrent = compare ? data.slice(countPoints / 2) : data

    const series: Array<Highcharts.SeriesOptionsType> = [{
      type: column ? 'column' : 'areaspline',
      name: 'Название графика',
      data: dataCurrent.map(item => ({
        name: '',
        metricName: metricName,
        format: format || '0,0',
        y: item.value,
        x: moment(item.date).valueOf()
      }))
    }]

    if (compare) {
      series.push({
        type: 'spline',
        name: 'Название графика',
        dashStyle: 'ShortDot',
        color: '#999999',
        marker: {
          symbol: 'circle',
          radius: 4,
          lineWidth: 0,
          fillOpacity: 0,
          width: 24,
          height: 24,
          states: {
            hover: {
              radius: 4,
              lineWidth: 2,
              fillColor: '#fff',
              lineColor: '#999999'
            }
          }
        },
        data: dataCurrent.map((item, index) => ({
          name: '',
          metricName: metricName,
          format: format || '0,0',
          y: data[index]?.value,
          x: moment(item.date).valueOf(),
          compareDate: moment(data[index]?.date).valueOf()
        }))
      })
    }

    return (
      <div className={s.element} style={{ height }}>
        <Chart
          noData={!data.length}
          noDataMessage={noDataMessage}
          noDataDescription={noDataDescription}
          height={height}
          noDataStyle={noDataStyle}
          series={series}
          color={color}
          loading={loading}
          tooltip={function (): string {
            return ReactDOMServer.renderToString(
              <LineChartTooltip
                // grade={this?.points[0].point['grade']}
                metricName={this?.points[0].point['metricName']}
                metricValue={this?.points[0].point.y}
                date={this?.points[0].point['x']}
                format={this?.points[0].point['format']}
                compare={compare}
                compareMetricValue={this?.points[1]?.point.y}
                compareDate={this?.points[1]?.point['compareDate']}
                color={color}
              />
            )}}
        />
        {blocked && (
          <div className={s.blocked}>
            <span className={s.blockedTitle}>Доступ к данным ограничен</span>
            <span className={s.blockedText}>Чтобы увидеть эти данные, перейдите на тариф {higherPlansList}. <Link onClick={onChangePlan}>Выбрать тариф</Link></span>
          </div>
        )}
      </div>
    )
  }
}

export default LineChart
