import * as Highcharts from 'highcharts'
import React, { Component, MouseEventHandler } from 'react'
import cx from 'classnames'

import BaseChart from './BaseChart'
import Icon from '../../elements/Icon/Icon'

import './Chart.scss'
import PolarChart from './PolarChart'
import NoData, { TNoDataStyle } from '../../elements/NoData/NoData'
import CategoriesChart from './CategoriesChart'
import DowhChart from './DowhChart'
import PieChart from './PieChart'

interface IProps {
  /**
   * Подписи оси Y
   */
  yTitle?: string
  /**
   * Подписи оси X
   */
  xTitle?: string
  /**
   * Массив серий
   */
  series: Array<Highcharts.SeriesOptionsType>
  /**
   * Функция форматирования tooltip
   */
  tooltip: Highcharts.TooltipFormatterCallbackFunction
  /**
   * Состояние загрузки
   */
  loading?: boolean
  /**
   * Данные для графика отсутствуют
   */
  noData?: boolean
  /**
   * Полярный график
   */
  polar?: boolean
  /**
   * График активности по дням недели и времени суток
   */
  dowh?: boolean
  /**
   * График пирогом
   */
  pie?: boolean
  /**
   * Категории
   */
  categories?: Array<string>
  /**
   * Цвет графика
   */
  color?: string

  noDataMessage?: string
  noDataDescription?: string
  noDataButtonText?: string
  noDataButtonOnClick?: MouseEventHandler
  /**
   * Высота графика
   */
  height?: number
  noDataStyle?: TNoDataStyle
  /**
   * Процентный график
   */
  percent?: boolean
}

/**
 * Модуль Chart
 * Рендеринг графиков
 */
class Chart extends Component<IProps> {
  render (): JSX.Element {
    let {
      series, tooltip, loading, noData, xTitle, yTitle, polar, dowh, pie, color, categories,
      height, noDataMessage, noDataDescription, noDataButtonText, noDataButtonOnClick, noDataStyle,
      percent
    } = this.props

    const classes = cx('chart', {
      'chart--loading': loading,
      'chart--no-data': noData
    })

    const isNullData = series.every(serie => serie['data'].every(item => item.y === 0 || item.y === null || item.y === undefined))

    return (
      <div className={classes}>
        <div className='chart__content'>
          {!loading && !noData && !isNullData && !polar && !dowh && !categories && !pie && <BaseChart xTitle={xTitle} yTitle={yTitle} series={series} color={color} tooltip={tooltip} height={height} percent={percent} />}
          {!loading && !noData && !isNullData && !polar && !dowh && categories && !pie && <CategoriesChart xTitle={xTitle} yTitle={yTitle} series={series} color={color} tooltip={tooltip} height={height} categories={categories} percent={percent} />}
          {!loading && !noData && !isNullData && polar && !dowh && !categories && !pie && <PolarChart xTitle={xTitle} yTitle={yTitle} series={series} tooltip={tooltip} height={height} />}
          {!loading && !noData && !isNullData && !polar && dowh && !categories && !pie && <DowhChart xTitle={xTitle} yTitle={yTitle} series={series} color={color} tooltip={tooltip} height={height} />}
          {!loading && !noData && !isNullData && !polar && !dowh && categories && pie && <PieChart xTitle={xTitle} yTitle={yTitle} series={series} color={color} tooltip={tooltip} height={height} />}
          {loading && <Icon icon='loader' />}
          {!loading && isNullData && <NoData style={noDataStyle} size={height} message={noDataMessage} description={noDataDescription} buttonLabel={noDataButtonText} buttonOnClick={noDataButtonOnClick} />}
        </div>
      </div>
    )
  }
}
export default Chart
