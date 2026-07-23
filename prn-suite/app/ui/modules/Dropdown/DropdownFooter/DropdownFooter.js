import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './DropdownFooter.scss'

class DropdownFooter extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  render () {
    const { children } = this.props

    return (
      <footer className='dropdown-footer' onClick={e => e.stopPropagation()}>
        {children}
      </footer>
    )
  }
}

export default DropdownFooter
