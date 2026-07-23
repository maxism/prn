import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './HeaderMenu.scss'

/**
 * Элемент HeaderMenu
 */
class HeaderMenu extends Component {
  static propTypes = {
    /**
     * Содержимое элемента
     */
    children: PropTypes.node
  }

  render () {
    return (
      <div className='header-menu'>
        {this.props.children}
      </div>
    )
  }
}

export default HeaderMenu
