import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import Icon from '../Icon/Icon'
import Link from '../Link/Link'

import './ExcludeButton.scss'

class ExcludeButton extends Component {
  static propTypes = {
    onExclude: PropTypes.func,
    disabled: PropTypes.bool
  }

  render () {
    const { onExclude, disabled } = this.props
    const classes = cx('exclude-button', {
      'exclude-button--disabled': disabled
    })

    return (
      <Link className={classes} onClick={!disabled ? onExclude : undefined}>
        <Icon icon='minus' />
      </Link>
    )
  }
}

export default ExcludeButton
