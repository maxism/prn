import React, { Component, MouseEventHandler, RefObject } from 'react'
import NumeralUtil, { NumeralFormat } from '../../../utils/NumeralUtil'
import DateUtil from '../../../utils/DateUtil'
import SocialDataUtil from '../../../utils/SocialDataUtil'
import handleViewport from 'react-in-viewport'

import Image from '../Image/Image'
import Icon from '../Icon/Icon'
import Tag from '../Tag/Tag'

import MetricPostGroup from '../MetricPost/MetricPostGroup'
import MetricPost from '../MetricPost/MetricPost'

import './Post.scss'
import NoData from '../NoData/NoData'
import {IPostMention} from '../../../stores/PostsStore'

interface IMetric {
  name: string
  value: number
  format?: NumeralFormat
}

interface IProps {
  /**
   * Картинка сообщетва
   */
  communityImage: string
  /**
   * Название сообщества
   */
  communityName: string
  /**
   * Социальная сеть
   */
  socialType: string
  /**
   * Ссылка на сообщество
   */
  communityUrl: string
  /**
   * Ссылка на пост
   */
  postUrl: string
  /**
   * Дата поста
   */
  date: string
  /**
   * Картинка
   */
  image: string
  /**
   * Текст
   */
  text: string
  /**
   * Рекламный пост
   */
  isAd?: boolean
  /**
   * Пост удален
   */
  isDeleted?: boolean
  /**
   * Теги
   */
  tags?: Array<string>
  /**
   * Текстовая эффективность поста
   */
  mainGrade?: string
  /**
   * Эффективность поста
   */
  indexGrade?: number
  /**
   * Метрики
   */
  metrics: Array<IMetric>
  /**
   * Обработчик клика
   */
  onClick: MouseEventHandler
  /**
   * Обработчик клика
   */
  onAddMentionUrl?: (url: string) => void
  /**
   * Упоминания
   */
  mentions?: Array<IPostMention>
}

/**
 * Элемент Post
 * Пост
 */

class Post extends Component<IProps> {
  render (): JSX.Element {
    const { communityImage, communityName, socialType, communityUrl,
      postUrl, date, image, text, tags, mainGrade,
      indexGrade, metrics, onClick, isAd, isDeleted,
      mentions, onAddMentionUrl
    } = this.props

    return (
      <div className='post'>
        <div className='post__top'>
          <a className='post__community-url' href={communityUrl} target='_blank' rel='noreferrer'>
            <Image className='post__community-image' round border src={communityImage} noImage={require('./img/no_avatar.svg')} />
            <span className='post__community-name'>{communityName}</span>
          </a>

          {/*<div className='post__community-main'>*/}
          {/*  <span className='post__community-name'>{communityName}</span>*/}
          {/*  <a href={communityUrl} target='_blank' rel='noreferrer' className='post__community-description post__community-url'>*/}
          {/*    <Icon className='post__community-socialType' icon={`${socialType.toLowerCase()}_colored`} />*/}
          {/*    <span className='post__community-url'>{SocialDataUtil.urlToUri(communityUrl)}</span>*/}
          {/*  </a>*/}
          {/*</div>*/}

          <div className='post__community-right'>
            <a className='post__date' href={postUrl} target='_blank' rel='noreferrer'>Опубликовано {DateUtil.format(date)} в {DateUtil.format(date, 'HH:mm')}</a>
            {/*<Icon className='post__favorite' icon='star' />*/}
          </div>
        </div>
        <div className='post__main'>
          {image && <Image className='post__image' border src={image} noImage={require('./img/no_image.svg')} onClick={onClick} />}
          <pre className='post__text' onClick={onClick}>{text}</pre>

          <MetricPostGroup type='post'>
            {metrics.filter(metric => metric.value !== null && metric.value !== undefined).map(metric => (
              <MetricPost
                key={metric.name}
                type='post'
                title={metric.name}
                value={NumeralUtil.format(metric.value, metric.format || '0,0')}
              />
            ))}
          </MetricPostGroup>

        </div>
        <div className='post__bottom'>
          {indexGrade && <Tag indexGrade={indexGrade}>{mainGrade}</Tag>}
          {isDeleted && <Tag>deleted</Tag>}
          {isAd && <Tag>ad</Tag>}
          {mentions && mentions.map(mention => (
            <Tag
              key={`${mention.cid}`}
              image={mention.image}
              onClick={() => onAddMentionUrl(mention.url)}
            >{mention.name}</Tag>
          ))}
          {tags && tags.map(tagName => <Tag key={`${tagName}`}>{tagName}</Tag>)}
        </div>
      </div>)
  }
}

export default Post
