import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Button from '../../elements/Button/Button'

/**
 * Элемент Popup
 */
class DropdownButton extends Component {
  static propTypes = {
    /**
     * Содержимое элемента
     * */
    children: PropTypes.node,
    /**
     * Ссылка
     */
    to: PropTypes.string
  }

  render () {
    const { children, to } = this.props

    return (
      <Button wide color='light-gray' textColor='black' to={to}>{children}</Button>
    )
  }
}

export default DropdownButton
