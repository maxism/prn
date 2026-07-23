import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Link from '../../Link/Link'
import Icon from '../../Icon/Icon'

import './MenuProduct.scss'

class MenuProduct extends Component {
  static propTypes = {
    children: PropTypes.node,
    onClick: PropTypes.func,
    to: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    icon: PropTypes.string
  }

  render () {
    const { children, onClick, to, icon } = this.props

    return (
      <Link onClick={onClick} to={to} className='menu-product'>
        <span className='menu-product__text'>{children}</span>
        <Icon className='menu-product__logo' icon={icon} />
      </Link>
    )
  }
}

export default MenuProduct
