import React, { Component } from 'react'
import SocialDataUtil from '../../../utils/SocialDataUtil'
import Icon from '../../elements/Icon/Icon'

import './CommunityUrl.scss'

interface IProps {
  /**
   * Ссылка на сообщество
   */
  to: string
}

/**
 * Вид SocialInfo - иконка соцсети с краткой ссылкой на сообщество
 */
class CommunityUrl extends Component<IProps> {
  render (): JSX.Element {
    const { to } = this.props

    return (
      <a
        href={to}
        target='_blank'
        rel='noopener noreferrer'
        className='community-url'
      >
        <Icon
          className='community-url__icon'
          icon={`${SocialDataUtil.urlToSocialType(to).toLowerCase()}_colored`}
        />
        <span className='community-url__text'>
          {SocialDataUtil.urlToUri(to)}
        </span>
      </a>
    )
  }
}

export default CommunityUrl
