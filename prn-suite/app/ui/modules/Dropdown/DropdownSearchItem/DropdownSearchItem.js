import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Link from '../../../elements/Link/Link'
import Image from '../../../elements/Image/Image'
import Icon from '../../../elements/Icon/Icon'
import SocialInfo from '../../../views/SocialInfo/SocialInfo'

import './DropdownSearchItem.scss'

class DropdownSearchItem extends Component {
  static propTypes = {
    name: PropTypes.string,
    soctype: PropTypes.string,
    image: PropTypes.string,
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    socialTo: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    users: PropTypes.string
  }

  render () {
    const { name, soctype, image, to, users, socialTo } = this.props

    return (
      <Link className='dropdown-search-item' to={to}>
        <div className='dropdown-search-item__logo'>
          <Image
            className='dropdown-search-item__image'
            noImage={require('./img/no-picture.svg')}
            type='round'
            src={image}
          />
        </div>
        <div className='dropdown-search-item__main'>
          <p className='dropdown-search-item__name'>{name}</p>
          <div className='dropdown-search-item__info'>
            <SocialInfo social={soctype} to={socialTo} link={false} />
            <div className='dropdown-search-item__users'>
              <Icon className='dropdown-search-item__users-icon' icon='person' />
              <span className='dropdown-search-item__users-count'>{users}</span>
            </div>
          </div>
        </div>
      </Link>
    )
  }
}

export default DropdownSearchItem
