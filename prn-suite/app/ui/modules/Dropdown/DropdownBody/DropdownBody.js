import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './DropdownBody.scss'

class DropdownBody extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  render () {
    const { children } = this.props

    return (
      <div className='dropdown-body' onClick={e => e.stopPropagation()}>
        {children}
      </div>
    )
  }
}

export default DropdownBody
