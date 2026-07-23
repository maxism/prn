import * as Highcharts from 'highcharts'
import React, { Component, MouseEventHandler } from 'react'
import cx from 'classnames'

import BaseChart from './BaseChart'
import Icon from '../../elements/Icon/Icon'

import PolarChart from './PolarChart'
import CategoriesChart from './CategoriesChart'
import DowhChart from './DowhChart'
import NoData, { TNoDataStyle } from '../../elements/NoData/NoData'

import s from './Chart.module.scss'

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
   * График заблокирован
   */
  blocked?: boolean
}

/**
 * Модуль Chart
 * Рендеринг графиков
 */
class Chart extends Component<IProps> {
  render (): JSX.Element {
    const {
      series, tooltip, loading, noData, xTitle, yTitle, polar, dowh, color, categories,
      height, noDataMessage, noDataDescription, noDataButtonText, noDataButtonOnClick, noDataStyle, blocked
    } = this.props

    const classes = cx(s.element, {
      [s.loading]: loading,
      [s.noData]: noData
    })

    const isNullData = series.every(serie => serie['data']?.every(item => item.y === 0))
    // console.log('series', series, isNullData)

    return (
      <div className={classes}>
        <div className={s.content} style={{ height }}>
          {!blocked && !loading && !noData && !isNullData && !polar && !dowh && !categories && <BaseChart xTitle={xTitle} yTitle={yTitle} series={series} color={color} tooltip={tooltip} height={height} />}
          {!blocked && !loading && !noData && !isNullData && !polar && !dowh && categories && <CategoriesChart xTitle={xTitle} yTitle={yTitle} series={series} color={color} tooltip={tooltip} height={height} categories={categories}/>}
          {!blocked && !loading && !noData && !isNullData && polar && !dowh && !categories && <PolarChart xTitle={xTitle} yTitle={yTitle} series={series} tooltip={tooltip} height={height} />}
          {!blocked && !loading && !noData && !isNullData && !polar && dowh && !categories && <DowhChart xTitle={xTitle} yTitle={yTitle} series={series} color={color} tooltip={tooltip} height={height} />}
          {loading && (
            <div className={s.loading}>
              <Icon icon='loading_dots' />
            </div>
          )}
          {blocked && !loading && (
            <div className={s.blocked}>
              <Icon icon='locked' />
            </div>
          )}
          {!loading && (isNullData || isNullData) && <NoData style={noDataStyle} size={height} message={noDataMessage} description={noDataDescription} buttonLabel={noDataButtonText} buttonOnClick={noDataButtonOnClick} />}
        </div>
      </div>
    )
  }
}
export default Chart
