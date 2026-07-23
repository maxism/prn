import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Icon from '../Icon/Icon'
import Link from '../Link/Link'

import './IncludeButton.scss'
import cx from 'classnames'

class IncludeButton extends Component {
  static propTypes = {
    onInclude: PropTypes.func,
    disabled: PropTypes.bool
  }

  render () {
    const { onInclude, disabled } = this.props
    const classes = cx('include-button', {
      'include-button--disabled': disabled
    })

    return (
      <Link className={classes} onClick={onInclude}>
        <Icon icon='plus' />
      </Link>
    )
  }
}

export default IncludeButton
