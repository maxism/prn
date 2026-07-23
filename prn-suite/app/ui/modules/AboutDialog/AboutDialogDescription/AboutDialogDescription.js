import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Icon from '../../../elements/Icon/Icon'
import SocialInfo from '../../../views/SocialInfo/SocialInfo'
import Link from '../../../elements/Link/Link'

import './AboutDialogDescription.scss'

/**
 * Вид AboutDialogDescription - расширенное описание диалога удаления
 */
class AboutDialogDescription extends Component {
  static propTypes = {
    /**
     * Название
     */
    name: PropTypes.string,
    /**
     * Ссылка
     */
    link: PropTypes.string,
    /**
     * Тип соцсети
     */
    socialType: PropTypes.string,
    /**
     * Иконка в случае админских прав
     */
    isInsights: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    /**
     * Ретроспектива
     */
    retro: PropTypes.string,
    /**
     * Количество сообществ имеющих данный тег
     */
    communitiesCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * Количество подписчиков
     */
    usersCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
     * Функция изменения элемента
     */
    onChange: PropTypes.func
  }

  render () {
    const { name, link, usersCount, communitiesCount, retro, isInsights, socialType, onChange } = this.props
    return (
      <div className='about-dialog-description'>
        <div className='about-dialog-description__top about-dialog-description__field'>
          {name && <p className='about-dialog-description__name'>{name}</p>}
          {isInsights && <Icon className='about-dialog-description__admin' icon='admin' />}
          {onChange && <Link className='about-dialog-description__btn' onClick={onChange}><Icon icon='gear' /></Link>}
        </div>
        {(socialType || usersCount) &&
          <p className='about-dialog-description__info about-dialog-description__field'>
            {socialType && <SocialInfo to={link} social={socialType} />}
            {Boolean(usersCount) &&
              <span className='about-dialog-description__users'>
                <Icon className='about-dialog-description__users-icon' icon='person' />
                <span className='about-dialog-description__users-count'>{usersCount}</span>
              </span>}
          </p>}
        {communitiesCount && <p className='about-dialog-description__field'>{communitiesCount}</p>}
        {retro && <p className='about-dialog-description__field about-dialog-description__retro'>{retro}</p>}
      </div>
    )
  }
}

export default AboutDialogDescription
