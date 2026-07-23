import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './Header.scss'

/**
 * Элемент Header
 */
class Header extends Component {
  static propTypes = {
    /**
     * Содержимое элемента
     */
    children: PropTypes.node
  }

  render () {
    return (
      <header className='header'>
        <div className='header__container'>
          {this.props.children}
        </div>
      </header>
    )
  }
}

export default Header
