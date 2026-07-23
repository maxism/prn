import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import './MenuMain.scss'

/**
 * Элемент MenuMain
 */
export default class MenuMain extends Component {
  static propTypes = {

    /**
     * Содержимое элемента
     */
    children: PropTypes.node,
    halign: PropTypes.string
  }

  render () {
    const { children, halign } = this.props

    const classes = cx('menu-main', {
      [`menu-main--h-${halign}`]: halign
    })

    return (
      <div className={classes}>
        {children}
      </div>
    )
  }
}
