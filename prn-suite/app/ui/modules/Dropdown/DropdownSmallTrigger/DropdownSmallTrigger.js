import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Icon from '../../../elements/Icon/Icon'

import './DropdownSmallTrigger.scss'

class DropdownSmallTrigger extends Component {
  static propTypes = {
    /**
     * Состояние открыт/закрыт
     */
    opened: PropTypes.bool,
    /**
     * Значение кнопки
     */
    name: PropTypes.string,
    /**
     * onClick
     */
    onClick: PropTypes.func
  }

  static defaultProps = {
    label: '',
    caption: ''
  }

  render () {
    const { opened, onClick, name } = this.props

    return (
      <button
        className='dropdown-small-trigger'
        onClick={onClick}
        type='button'
      >
        <div className='dropdown-small-trigger__main'>
          <div className='dropdown-small-trigger__text'>
            <p className='dropdown-small-trigger__name'>{name}</p>
          </div>
          <Icon className='dropdown-small-trigger__icon' icon={opened ? 'change_positive' : 'change_negative'} />
        </div>

      </button>
    )
  }
}

export default DropdownSmallTrigger
