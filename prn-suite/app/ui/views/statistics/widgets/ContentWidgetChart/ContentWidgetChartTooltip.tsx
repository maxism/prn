import React, { Component } from 'react'
import NumeralUtil, { NumeralFormat } from '../../../../../utils/NumeralUtil'
import DateUtil from '../../../../../utils/DateUtil'
import Image from '../../../../elements/Image/Image'
import { IContentWidgetPost } from './ContentWidgetChart'

import './ContentWidgetChartTooltip.scss'

interface IProps {
  metricName: string
  metricValue: number
  postfixValue?: string
  format: NumeralFormat
  data: IContentWidgetPost
}

/**
 * Элемент ContentWidgetChartTooltip - всплывающая подсказка к графику
 */
class ContentWidgetChartTooltip extends Component<IProps> {
  render (): JSX.Element {
    const { metricName, metricValue, postfixValue, format, data } = this.props

    const metricNames = {
      interactions: 'Реакции',
      likes: 'Лайки',
      comments: 'Комментарии',
      rePosts: 'Репосты',
      views: 'Просмотры',
      er: 'Вовлеченность',
      usersCount: 'Подписчики'
    }

    return (
      <div className='content-widget-chart-tooltip'>
        <div className='content-widget-chart-tooltip__top'>
          {data.grade === 'a_plus' && <Image className='content-widget-chart-tooltip__grade' src={'/assets/img/icons/tooltip/grade_a+.svg'} />}
          {data.grade === 'a' && <Image className='content-widget-chart-tooltip__grade' src={'/assets/img/icons/tooltip/grade_a.svg'} />}
          {data.grade === 'b' && <Image className='content-widget-chart-tooltip__grade' src={'/assets/img/icons/tooltip/grade_b.svg'} />}
          {data.grade === 'c' && <Image className='content-widget-chart-tooltip__grade' src={'/assets/img/icons/tooltip/grade_c.svg'} />}
          {data.grade === 'd' && <Image className='content-widget-chart-tooltip__grade' src={'/assets/img/icons/tooltip/grade_d.svg'} />}
          <div className='content-widget-chart-tooltip__metric'>
            <span className='content-widget-chart-tooltip__name'>{metricNames[metricName]}</span>
            <span className='content-widget-chart-tooltip__value'>{NumeralUtil.format(metricValue, format)}{postfixValue}</span>
          </div>
          <span className='content-widget-chart-tooltip__date'>{DateUtil.format(data.date)}</span>
        </div>

        <div className='content-widget-chart-tooltip__main'>
          {data.postImage && <Image className='content-widget-chart-tooltip__image' src={data.postImage} noImage={'/assets/img/icons/tooltip/no_image.svg'} />}
          <div className='content-widget-chart-tooltip__text'>
            <pre>
              {data.text}
            </pre>
          </div>
        </div>
      </div>
    )
  }
}

export default ContentWidgetChartTooltip
