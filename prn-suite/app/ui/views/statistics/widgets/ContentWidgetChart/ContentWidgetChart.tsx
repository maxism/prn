import * as Highcharts from 'highcharts'
import React, { Component, MouseEventHandler } from 'react'
import ISocialType from '../../../../../interfaces/ISocialType'

import format from '../../../../../lib/format'
import ArrayUtil from '../../../../../utils/ArrayUtil'
import Chart from '../../../../modules/Chart/Chart'
import ReactDOMServer from 'react-dom/server'
import ContentWidgetChartTooltip from './ContentWidgetChartTooltip'

import './ContentWidgetChart.scss'
import Loading from '../../../../elements/Loading/Loading'
import { TNoDataStyle } from '../../../../elements/NoData/NoData'

export interface IContentWidgetPost {
  id: string
  date: number
  socialType: ISocialType
  grade: string
  indexGrade: number
  usersCount: number
  postImage: string
  text: string
  interactions: number
  likes: number
  comments: number
  rePosts: number
  views: number
  er: number
}

type OnOpenPostFunction = (postID: string) => void

interface IProps {
  /**
   * Список постов
   */
  posts?: Array<IContentWidgetPost>
  /**
   * Состояние загрузки
   */
  loading?: boolean
  /**
   * Метрика для визуализации
   */
  metric?: string
  /**
   * Цвет графика
   */
  color?: string
  /**
   * Обработчик открытия поста
   */
  onOpenPost?: OnOpenPostFunction

  noDataMessage?: string
  noDataDescription?: string
  noDataButtonText?: string
  noDataButtonOnClick?: MouseEventHandler
  /**
   * Высота графика
   */
  height?: number
  noDataStyle?: TNoDataStyle
}

const gradeIcons = {
  a: require('./icons/grade_a.svg'),
  a_plus: require('./icons/grade_a+.svg'),
  b: require('./icons/grade_b.svg'),
  c: require('./icons/grade_c.svg'),
  d: require('./icons/grade_d.svg'),
  none: require('./icons/none.svg'),
}

class ContentWidgetChart extends Component<IProps> {
  render (): JSX.Element {
    let { posts, loading, metric, color, onOpenPost, noDataDescription, noDataButtonText, noDataButtonOnClick, noDataMessage, height, noDataStyle } = this.props

    const socialTypes = [...new Set(posts.map(post => post.socialType))]

    // console.log(socialTypes)

    posts = ArrayUtil.arrayObjectsSort('date', posts)

    const formats = { 'er': '0.00%', 'indexGrade': '+0.00' }

    const series: Array<Highcharts.SeriesOptionsType> = socialTypes.map(socialType => ({
      type: 'areaspline',
      name: socialType,
      data: posts.filter(post => post.socialType === socialType).map(post => ({
        name: '',
        y: post[metric],
        x: post.date,
        data: post,
        metricName: metric,
        format: formats[metric] ? formats[metric] : '0,0',
        postfixValue: metric === 'indexGrade' ? 'x' : '',
        marker: {
          enabled: true,
          symbol: `url(${gradeIcons[post.grade || 'none']})`
        },
        events: {
          click: () => onOpenPost(post.id)
        }
      }))
    }))

    // console.log(posts)

    return (
      <div className='content-widget-chart'>
        {loading &&
          <Loading size={420} message='Строим график постов' />
        }
        {!loading && <Chart
          noData={!posts.length}
          noDataMessage={noDataMessage}
          noDataDescription={noDataDescription}
          noDataButtonText={noDataButtonText}
          noDataButtonOnClick={noDataButtonOnClick}
          height={height}
          noDataStyle={noDataStyle}
          series={series}
          color={color}
          percent={String(format).includes('%')}
          tooltip={function (): string {
            return ReactDOMServer.renderToString(
              <ContentWidgetChartTooltip
                metricValue={this?.points[0].point.y}
                postfixValue={this?.points[0].point['postfixValue']}
                format={this?.points[0].point['format']}
                metricName={this?.points[0].point['metricName']}
                data={this?.points[0].point['data']}
              />
            )
          }}
        />}
      </div>
    )
  }
}

export default ContentWidgetChart
