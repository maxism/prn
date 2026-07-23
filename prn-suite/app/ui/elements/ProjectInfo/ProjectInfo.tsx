import React, { Component, MouseEventHandler } from 'react'

import './ProjectInfo.scss'

import Image from '../Image/Image'
import Icon from '../Icon/Icon'
import ICommunity from '../../../interfaces/ICommunity'
import SocialDataUtil from '../../../utils/SocialDataUtil'

interface IProps {
  image: string
  name: string
  communities: Array<ICommunity>
  onSettings?: MouseEventHandler
  description?: string
}

/**
 * Элемент ProjectInfo.
 * Информация о проекте
 */
class ProjectInfo extends Component<IProps> {
  render (): JSX.Element {
    const { image, name, communities, description, onSettings } = this.props

    return (
      <div className='project-info'>
        <Image className='project-info__image' round border src={image} noImage={require('./img/no_avatar.svg')} />
        <div className='project-info__content'>
          <div className='project-info__title'>{name}</div>

          <div className='project-info__social-icons'>
            {communities?.map(community => (
              <a key={community.communityID} href={community.url} className='project-info__social' target='_blank'>
                <Icon className='project-info__icon' icon={`${community.socialType.toLowerCase()}_colored`}/>
                {communities.length === 1 && <span className='project-info__url'>{SocialDataUtil.urlToUri(community.url)}</span>}
              </a>
            ))}
          </div>

          {description && (
            <span className='project-info__line project-info__link'>
              <span>{description}</span>
            </span>
          )}

          {/*<span className='project-info__line project-info__link' onClick={onSettings}>*/}
          {/*  <Icon className='project-info__icon' icon='gear'/>*/}
          {/*  <span>Открыть настройки проекта</span>*/}
          {/*</span>*/}
        </div>

      </div>
    )
  }
}

export default ProjectInfo
