import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './DropdownGroup.scss'

class DropdownGroup extends Component {
  static propTypes = {
    children: PropTypes.node,
    title: PropTypes.string
  }

  render () {
    const { children, title } = this.props

    return (
      <div className='dropdown-group'>
        <p className='dropdown-group__title'>{title}</p>
        <div className='dropdown-group__content'>
          {children}
        </div>
      </div>
    )
  }
}

export default DropdownGroup
