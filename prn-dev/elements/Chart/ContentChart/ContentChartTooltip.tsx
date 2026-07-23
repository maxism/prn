import React, { Component } from 'react'
import NumeralUtil, { NumeralFormat } from '../../../utils/NumeralUtil'
import cx from 'classnames'
import DateUtil from '../../../utils/DateUtil'
import Image from '../../Image/Image'
import { IContentWidgetPost } from './ContentChart'

import s from './ContentChartTooltip.module.scss'

interface IProps {
  metricName: string
  metricValue: number
  postfixValue?: string
  format: NumeralFormat
  data: IContentWidgetPost
  color?: string
}

/**
 * Элемент ContentWidgetChartTooltip - всплывающая подсказка к графику
 */
class ContentChartTooltip extends Component<IProps> {
  render (): JSX.Element {
    const { metricName, metricValue, postfixValue, format, data, color } = this.props

    const metricNames = {
      interactions: 'Реакции',
      likes: 'Лайки',
      comments: 'Комментарии',
      rePosts: 'Репосты',
      views: 'Просмотры',
      er: 'Вовлеченность',
      usersCount: 'Подписчики'
    }

    const classes = cx(s.element, {
      [s.post]: data.id,
      [s.noText]: !data.text
    })

    return (
      <div className={classes}>
        <div className={s.top}>
          {data.grade === 'a_plus' && <Image className={s.grade} src='/images/grade_a+.svg' />}
          {data.grade === 'a' && <Image className={s.grade} src='/images/grade_a.svg' />}
          {data.grade === 'b' && <Image className={s.grade} src='/images/grade_b.svg' />}
          {data.grade === 'c' && <Image className={s.grade} src='/images/grade_c.svg' />}
          {data.grade === 'd' && <Image className={s.grade} src='/images/grade_d.svg' />}
          {!data.grade && <Image className={s.grade} src='/images/grade_d.svg' />}
          <div className={s.metric}>
            <span className={s.name}>{metricNames[metricName]}</span>
            <span className={s.value}>{NumeralUtil.format(metricValue, format)}{postfixValue}</span>
          </div>
          {!data.id && <div className={s.dateContainer}>
            <div className={s.round} style={{backgroundColor: color}}/>
            <span className={s.date}>{DateUtil.format(data.date, 'L')}</span>
          </div>}
        </div>

        <div className={s.content}>
          {data.postImage && <Image className={s.image} src={data.postImage} noImage='/images/no_image.svg' />}
          {data.text && <div className={s.text}>
             <pre>{data.text}</pre>
          </div>}
        </div>

        {data.id && <div className={s.dateContainer}>
          <div className={s.round} style={{backgroundColor: color}}/>
          <span className={s.date}>{DateUtil.format(data.date, 'L')}</span>
        </div>}
      </div>
    )
  }
}

export default ContentChartTooltip
