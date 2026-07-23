import * as Highcharts from 'highcharts'
import React, { Component, MouseEventHandler } from 'react'
import ISocialType from '../../../interfaces/ISocialType'

import ArrayUtil from '../../../utils/ArrayUtil'
import Chart from '../Chart'
import ReactDOMServer from 'react-dom/server'
import ContentChartTooltip from './ContentChartTooltip'
import s from './ContentChart.module.scss'
import moment from 'moment'
import Link from '../../Link/Link'

export interface ILineItem {
  date: number | Date
  value: number
}

export interface IContentWidgetPost {
  id: string
  date: Date
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
   * Данные
   */
  data?: Array<ILineItem>
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
  /**
   * Данные заблокированы
   */
  blocked?: boolean
  onChangePlan?: MouseEventHandler
}

const gradeIcons = {
  a: require('./icons/grade_a.svg'),
  a_plus: require('./icons/grade_a+.svg'),
  b: require('./icons/grade_b.svg'),
  c: require('./icons/grade_c.svg'),
  d: require('./icons/grade_d.svg')
}

class ContentChart extends Component<IProps> {
  render (): JSX.Element {
    let { data, posts, loading, metric, color, onOpenPost, noDataDescription, noDataButtonText, noDataButtonOnClick, noDataMessage, height, blocked, onChangePlan } = this.props

    posts = ArrayUtil.arrayObjectsSort('date', posts)

    const formats = { 'er': '0.00%', 'indexGrade': '+0.00' }

    let dataSeries = []
    if (data && data.length) {
      posts = ArrayUtil.arrayObjectsSort('-indexGrade', posts)

      dataSeries = data.map(item => {
        const bestPost = posts.find(post => moment(post.date).format('DD.MM.YYYY') === moment(item.date).format('DD.MM.YYYY'))

        if (bestPost) return {
          name: '',
          y: item.value,
          x: item.date as unknown as number,
          data: bestPost,
          metricName: metric,
          format: formats[metric] ? formats[metric] : '0,0',
          postfixValue: metric === 'indexGrade' ? 'x' : '',
          marker: {
            enabled: true,
            symbol: `url(${gradeIcons[bestPost.grade || 'd']})`
          },
          events: {
            click: () => { if (onOpenPost) onOpenPost(bestPost.id) }
          }
        }

        return {
          name: '',
          y: item.value,
          x: item.date as unknown as number,
          data: item,
          metricName: metric,
          format: formats[metric] ? formats[metric] : '0,0',
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
          }
        }
      })
    } else {
      dataSeries = posts.map(post => ({
        name: '',
        y: post[metric],
        x: post.date as unknown as number,
        data: post,
        metricName: metric,
        format: formats[metric] ? formats[metric] : '0,0',
        postfixValue: metric === 'indexGrade' ? 'x' : '',
        marker: post.id ? { enabled: true, symbol: `url(${gradeIcons[post.grade || 'd']})` } : {
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
        events: {
          click: () => { if (onOpenPost) onOpenPost(post.id) }
        }
      }))
    }

    const series: Array<Highcharts.SeriesOptionsType> = [{
      type: 'areaspline',
      name: '',
      data: dataSeries
    }]

    return (
      <div className={s.element}>
        <Chart
          noData={!dataSeries.length}
          noDataMessage={noDataMessage}
          noDataDescription={noDataDescription}
          noDataButtonText={noDataButtonText}
          noDataButtonOnClick={noDataButtonOnClick}
          height={height}
          series={series}
          color={color}
          tooltip={function (): string {
            return ReactDOMServer.renderToString(
              <ContentChartTooltip
                metricValue={this?.points[0].point.y}
                postfixValue={this?.points[0].point['postfixValue']}
                format={this?.points[0].point['format']}
                metricName={this?.points[0].point['metricName']}
                data={this?.points[0].point['data']}
                color={color}
              />
            )
          }}
          loading={loading}
        />
        {blocked && (
          <div className={s.blocked}>
            {/* todo: Подключить */}
            <span className={s.blockedTitle}>Доступ к данным ограничен</span>
            <span className={s.blockedText}>Увидеть эти данные можно только на платном тарифе BASIC и выше. <Link onClick={onChangePlan}>Выбрать тарифный план</Link></span>
          </div>
        )}
      </div>
    )
  }
}

export default ContentChart
