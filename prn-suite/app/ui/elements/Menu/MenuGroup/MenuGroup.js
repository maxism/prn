import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import './MenuGroup.scss'

/**
 * Элемент MenuGroup
 */
export default class MenuGroup extends Component {
  static propTypes = {

    /**
     * Содержимое элемента
     */
    children: PropTypes.node,
    /**
     * Дополнительные классы
     */
    className: PropTypes.string
  }

  render () {
    const { className, children } = this.props

    const classes = cx('menu__group', className)

    return (
      <div className={classes}>
        {children}
      </div>
    )
  }
}
