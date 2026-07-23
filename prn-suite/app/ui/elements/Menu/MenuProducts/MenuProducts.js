import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Link from '../../Link/Link'
import Icon from '../../Icon/Icon'

import './MenuProducts.scss'

class MenuProducts extends Component {
  static propTypes = {
    children: PropTypes.node,
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  }

  render () {
    const { children, to } = this.props

    return (
      <div className='menu-products'>
        <Link to={to} className='menu-products__link'>
          <Icon icon='logo_sign' className='menu-products__logo' />
        </Link>
        {children}
      </div>
    )
  }
}

export default MenuProducts
