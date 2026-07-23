import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './DropdownCalendar.scss'

class DropdownCalendar extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  render () {
    const { children } = this.props

    return (
      <div className='dropdown-calendar'>
        {children}
      </div>
    )
  }
}

export default DropdownCalendar
