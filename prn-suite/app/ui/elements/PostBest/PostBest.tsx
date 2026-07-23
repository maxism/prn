import React, { Component, MouseEventHandler } from 'react'

import './PostBest.scss'
import DateUtil from '../../../utils/DateUtil'
import NumeralUtil, { NumeralFormat } from '../../../utils/NumeralUtil'
import Image from '../Image/Image'
import Icon from '../Icon/Icon'
import MetricPost from '../MetricPost/MetricPost'

interface IMetric {
  name: string
  value: number
  format?: NumeralFormat
}

interface IProps {
  image: string
  grade: string
  indexGrade: number
  text: string
  date: string
  url: string
  /**
   * Метрики
   */
  metrics: Array<IMetric>
  /**
   * Обработчик клика
   */
  onClick?: MouseEventHandler
}

class PostBest extends Component<IProps> {
  render (): JSX.Element {
    const { image, grade, indexGrade, text, date, url, metrics, onClick } = this.props

    let icon = ''
    let name = ''
    let description = ''

    if (grade === 'd') {
      icon = 'grade_d_colored'
      name = 'Один из самых неудачных постов на странице'
      description = 'Худший пост'
    }

    if (grade === 'c') {
      icon = 'grade_c_colored'
      name = 'Хуже чем обычный контент на странице'
      description = 'Плохой пост'
    }

    if (grade === 'b') {
      icon = 'grade_b_colored'
      name = 'Большинство постов на странице именно такие'
      description = 'Обычный пост'
    }

    if (grade === 'a') {
      icon = 'grade_a_colored'
      name = 'Лучше чем обычный контент на странице'
      description = 'Хороший пост'
    }

    if (grade === 'a_plus') {
      icon = 'grade_a_plus_colored'
      name = 'Гораздо лучше чем то, что публикуется обычно'
      description = 'Лучший пост'
    }

    return (
      <div className='post-best'>
        {image && <Image className='post-best__image' border src={image} noImage={require('./img/no_image.svg')} onClick={onClick} />}

        <div className='post-best__center'>
          <div className='post-best__grade'>
            <Icon className='post-best__icon' icon={icon} />
            <div className='post-best__grade-block'>
              <span className='post-best__grade-name'>{name}</span>
              <span className='post-best__grade-description'>{description} | {NumeralUtil.format(indexGrade, '+0.00')}x</span>
            </div>
          </div>
          <pre className='post-best__text' onClick={onClick}>
            {text}
          </pre>
          <a href={url} target='_blank' className='post-best__date'>{DateUtil.format(date)} в {DateUtil.format(date, 'HH:mm')}</a>
        </div>
        <div className='post-best__right'>
          {metrics.filter(metric => metric.value !== null).map(metric => (
            <div className='post-best__metric' key={metric.name}>
              <span className='post-best__label'>{metric.name}</span>
              <span className='post-best__value'>{NumeralUtil.format(metric.value, metric.format || '0,0')}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default PostBest
