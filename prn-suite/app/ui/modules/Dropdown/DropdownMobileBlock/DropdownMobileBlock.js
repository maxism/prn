import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './DropdownMobileBlock.scss'

class DropdownMobileBlock extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  render () {
    const { children } = this.props

    return (
      <div className='dropdown-mobile-block'>
        {children}
      </div>
    )
  }
}

export default DropdownMobileBlock
