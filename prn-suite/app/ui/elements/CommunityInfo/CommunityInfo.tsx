import React, { Component, MouseEventHandler } from 'react'
import cx from 'classnames'
import CommunityStatus from '../../../types/CommunityStatus'

import DateUtil from '../../../utils/DateUtil'
import NumeralUtil from '../../../utils/NumeralUtil'
import SocialDataUtil from '../../../utils/SocialDataUtil'
import Image from '../Image/Image'
import Icon from '../Icon/Icon'
import ICommunity from '../../../interfaces/ICommunity'

import './CommunityInfo.scss'

interface IProps {
  community: ICommunity
  small?: boolean
  onSettings?: MouseEventHandler
}

/**
 * Элемент CommunityInfo.
 * Информация о сообществе
 */

class CommunityInfo extends Component<IProps> {
  render (): JSX.Element {

    const { community, small, onSettings } = this.props
    const { name, image, url, timeAdd, usersCount, socialType } = community
    const classes = cx('community-info', {
      'community-info--small': small
    })

    return (
      <div className={classes}>
        <Image className='community-info__image' round border src={image} noImage={require('./img/no_avatar.svg')} />
        <div className='community-info__content'>
          {!small &&
          <div className='community-info__badge'>
            {community.isInsights && <span className='community-info__badge-blue'>Администратор</span>}
            {!community.isPaid && <span className='community-info__badge-red'>Страница не оплачена</span>}
            {community.isBlocked && <span className='community-info__badge-red'>Страница заблокирована</span>}
            {community.isClosed && <span className='community-info__badge-red'>Страница закрыта</span>}
            {community.communityStatus === CommunityStatus.COLLECTING && <span className='community-info__badge-green'>Страница анализируется</span>}
          </div>
          }
          <div className='community-info__title'>{name}</div>
          <a href={url} className='community-info__line community-info__url' target='_blank'>
            <Icon className='community-info__icon' icon={`${SocialDataUtil.urlToSocialType(url).toLowerCase()}_colored`}/>
            <span>{SocialDataUtil.urlToUri(url)}</span>
          </a>
          {/*{small && (*/}
          {/*<span onClick={onSettings} className='community-info__line community-info__link'>*/}
          {/*  <Icon className='community-info__icon' icon='gear'/>*/}
          {/*  <span>Открыть настройки страницы</span>*/}
          {/*</span>*/}
          {/*)}*/}
          {!small && (
          <div className='community-info__line'>
            <Icon className='community-info__icon' icon='d_calendar'/>
            <span>Добавлено в проект {DateUtil.format(timeAdd)}</span>
          </div>
          )}
          {!small && (
          <div className='community-info__line'>
            <Icon className='community-info__icon' icon='person'/>
            <span>{NumeralUtil.format(usersCount, '0,0')}</span>
          </div>
          )}
        </div>

      </div>
    )
  }
}

export default CommunityInfo
