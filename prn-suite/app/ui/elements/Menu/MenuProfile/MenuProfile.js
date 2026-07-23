import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './MenuProfile.scss'

/**
 * Элемент MenuMain
 */
export default class MenuProfile extends Component {
  static propTypes = {

    /**
     * Содержимое элемента
     */
    children: PropTypes.node
  }

  render () {
    return (
      <div className='menu-profile'>
        {this.props.children}
      </div>
    )
  }
}
