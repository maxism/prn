import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Link from '../../../elements/Link/Link'
import Icon from '../../Icon/Icon'

import './MenuLogo.scss'

class MenuLogo extends Component {
  static propTypes = {
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  }

  render () {
    const { to } = this.props

    return (
      <Link to={to} className='menu-logo'>
        <Icon icon='logo_sign' className='menu-logo__logo-sign' />
        <Icon icon='suite_logo' className='menu-logo__logo-text' />
      </Link>
    )
  }
}

export default MenuLogo
