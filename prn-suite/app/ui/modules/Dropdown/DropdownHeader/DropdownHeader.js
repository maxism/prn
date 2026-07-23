import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './DropdownHeader.scss'

class DropdownHeader extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  render () {
    const { children } = this.props

    return (
      <div className='dropdown-header' onClick={e => e.stopPropagation()}>
        {children}
      </div>
    )
  }
}

export default DropdownHeader
