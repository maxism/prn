import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import Link from '../../elements/Link/Link'

/**
 * Элемент DropdownLink
 */
class DropdownLink extends Component {
  static propTypes = {
    /**
     * Содержимое элемента
     * */
    children: PropTypes.node,
    /**
     * Обработчик onClick, вызывается при клике по пункту
     */
    onClick: PropTypes.func,
    back: PropTypes.bool
  }

  render () {
    const { children, onClick, back } = this.props
    const classes = cx('dropdown__link', {
      'dropdown__link--back': back
    })

    return (
      <Link className={classes} onClick={onClick}>{children}</Link>
    )
  }
}

export default DropdownLink
