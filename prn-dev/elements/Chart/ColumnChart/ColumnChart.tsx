import * as Highcharts from 'highcharts'
import React, {Component, MouseEventHandler} from 'react'
import ReactDOMServer from 'react-dom/server'
import ColumnChartTooltip from './ColumnChartTooltip'

import './ColumnChart.module.scss'
import {NumeralFormat} from "../../../utils/NumeralUtil";
import {TNoDataStyle} from "../../NoData/NoData";
import Chart from "../Chart";
import s from "../LineChart/LineChart.module.scss";
import Link from "../../Link/Link";

// Категории
interface IColumnWidgetItem {
  name: string
  value: number
  tooltipTitles?: Array<string> | string
}

interface IProps {
  /**
   * Данные для графика
   */
  data?: Array<IColumnWidgetItem>
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
  /**
   * Вид сплайнами
   */
  spline?: boolean
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

class ColumnChart extends Component<IProps> {
  static defaultProps = {
    format: '0,0'
  }

  render (): JSX.Element {
    let { data, loading, format, color, height, noDataStyle, noDataDescription, noDataMessage, spline, blocked, higherPlansList, onChangePlan } = this.props

    const series: Array<Highcharts.SeriesOptionsType> = [{
      type: spline ? 'areaspline' : 'column',
      name: 'Название графика',
      data: data?.map(item => ({
        name: item.name,
        y: item.value,
        tooltipTitles: item.tooltipTitles
      }))
    }]

    return (
      <div className='column-widget-chart'>
        <Chart
          noData={!series.length}
          noDataMessage={noDataMessage}
          noDataDescription={noDataDescription}
          height={height}
          noDataStyle={noDataStyle}
          series={series}
          color={color}
          loading={loading}
          categories={data?.map(item => item.name)}
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

export default ColumnChart
