import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import Icon from '../Icon/Icon'

import './HeaderLogo.scss'

/**
 * Элемент HeaderLogo
 */
class HeaderLogo extends Component {
  render (): JSX.Element {

    return (
      <div className='header-logo'>
        <a href='https://prn.c-cube.ru'>
          <Icon icon='logo_sign' className='header-logo__logo' />
        </a>
        <NavLink to='/'>
          <Icon icon='logo_text' className='header-logo__name' />
        </NavLink>
      </div>
    )
  }
}

export default HeaderLogo
