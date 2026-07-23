import React, { Component } from 'react'
import './ModalPostDetails.scss'
import SocialDataUtil from '../../../utils/SocialDataUtil'
import Image from '../Image/Image'
import Icon from '../Icon/Icon'
import MetricPostGroup from '../MetricPost/MetricPostGroup'
import MetricPost from '../MetricPost/MetricPost'
import Tag from '../Tag/Tag'
import NumeralUtil, { NumeralFormat } from '../../../utils/NumeralUtil'
import DateUtil from '../../../utils/DateUtil'
import { IPost } from '../../../stores/PostsStore'

interface IProps {
  post: IPost
}

class ModalPostDetails extends Component<IProps> {
  render (): JSX.Element {
    const post = this.props.post

    const metrics = [
        { name: 'Вовлеченность', value: post.er, format: '0.00%' },
        { name: 'Реакции', value: post.interactions },
        { name: 'Просмотры', value: post.views },
        { name: 'Лайки', value: post.likes },
        { name: 'Комментарии', value: post.comments },
        { name: 'Репосты', value: post.rePosts }
    ]
    const grades = {
      'd': 'grade_d_colored',
      'c': 'grade_c_colored',
      'b': 'grade_b_colored',
      'a': 'grade_a_colored',
      'a_plus': 'grade_a_plus_colored'
    }

    return (
      <div className='modal-post-details'>
        <div className='modal-post-details__top'>
          <Image className='modal-post-details__top-image' round border src={post.image} noImage={require('./img/no_avatar.svg')}/>
          <div className='modal-post-details__top-community'>
            <span className='modal-post-details__top-name'>{post.name}</span>
            <a href={post.url} target='_blank' rel='noreferrer' className='modal-post-details__top-social'>
              <Icon className='modal-post-details__top-icon' icon={`${post.socialType.toLowerCase()}_colored`} />
              <span className='modal-post-details__top-url'>{SocialDataUtil.urlToUri(post.url)}</span>
            </a>
            <a className='modal-post-details__top-link' href={post.postUrl} target='_blank' rel='noreferrer'>Опубликовано {DateUtil.format(post.date)} в {DateUtil.format(post.date, 'HH:mm')}</a>
          </div>
        </div>
        <div className='modal-post-details__content'>
          {post.image && <Image className='modal-post-details__content-image' border src={post.postImage} noImage={require('./img/no_image.svg')}/>}
          <div className='modal-post-details__content-metrics'>
            <Icon className='modal-post-details__content-icon' icon={`${grades[post.mainGrade]}`}/>
            {post.indexGrade && <span className='modal-post-details__content-grade'>{NumeralUtil.format(post.indexGrade, '+0.00')}x</span>}
            <MetricPostGroup type='postDetails'>
              {metrics.filter(metric => metric.value !== null && metric.value !== undefined).map(metric => (
                <MetricPost
                  key={metric.name}
                  type='postDetails'
                  title={metric.name}
                  value={NumeralUtil.format(metric.value, metric.format as NumeralFormat || '0,0')}
                />
              ))}
            </MetricPostGroup>
          </div>
        </div>
        <pre className='modal-post-details__text'>
          {post.text}
        </pre>
        <div className='modal-post-details__bottom'>
          {post.tags && post.tags.map(tagName => <Tag key={tagName}>{tagName}</Tag>)}
        </div>
      </div>
    )
  }
}

export default ModalPostDetails
