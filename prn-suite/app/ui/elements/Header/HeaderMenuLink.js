import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

import './HeaderMenuLink.scss'

/**
 * Элемент HeaderMenuLink
 */
class HeaderMenuLink extends Component {
  static propTypes = {
    /**
     * Ссылка
     */
    to: PropTypes.string,
    /**
     * Текст
     */
    children: PropTypes.node
  }

  render () {
    const { children } = this.props
    let { to } = this.props

    return <NavLink className='header-menu-link' activeClassName='header-menu-link--active' to={to} onClick={() => window.scrollTo(0, 0)}>{children}</NavLink>
  }
}

export default HeaderMenuLink
