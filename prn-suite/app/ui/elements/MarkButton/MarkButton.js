import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import Link from '../../elements/Link/Link'

import './MarkButton.scss'

/**
 * Элемент MarkButton
 */
class MarkButton extends Component {
    static propTypes = {
      /**
       * Цвет
       */
      color: PropTypes.string,
      /**
       * Обработчик клика
       */
      onClick: PropTypes.func,
      /**
       * Активный элемент
       */
      active: PropTypes.bool
    }

    render () {
      const { color, onClick, active } = this.props
      const classes = cx('mark-button', { 'mark-button--active': active })

      return <Link className={classes} style={{ backgroundColor: color }} onClick={onClick} />
    }
}

export default MarkButton
