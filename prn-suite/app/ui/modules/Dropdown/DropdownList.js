import React, { Component } from 'react'
import PropTypes from 'prop-types'

import cx from 'classnames'

/**
 * Элемент DropdownList
 */
class DropdownList extends Component {
  static propTypes = {
    /**
     * Содержимое элемента
     * */
    children: PropTypes.node,
    /**
     * Заголовок
     */
    caption: PropTypes.string,
    /**
     * Дополнительные классы
     */
    className: PropTypes.string
  }

  render () {
    const { caption, children, className } = this.props

    const classes = cx('dropdown__list', className)

    return (
      <div className={classes}>
        {caption && <h3 className='dropdown__item-title'>{caption}</h3>}
        {children}
      </div>

    )
  }
}

export default DropdownList
