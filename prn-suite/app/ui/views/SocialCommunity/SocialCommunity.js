import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './SocialCommunity.scss'
import Link from '../../elements/Link/Link'
import Image from '../../elements/Image/Image'

class SocialCommunity extends Component {
  static propTypes = {
    /**
     * Иконка сообщества в соцсети
     */
    socialIcon: PropTypes.string,
    /**
     * Ссылка на сообщество в соцсети
     */
    to: PropTypes.string,
    /**
     * Название сообщества
     */
    toText: PropTypes.string
  }

  render () {
    const { socialIcon, to, toText } = this.props

    return (
      <span className='social-community'>
        <Link
          className='social-community__link'
          to={to}
          onClick={e => e.stopPropagation()}
        >
          <Image
            type='round'
            className='social-community__icon'
            src={socialIcon}
            alt='social-icon'
          />
          {toText}
        </Link>
      </span>
    )
  }
}

export default SocialCommunity
