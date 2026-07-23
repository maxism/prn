import React, { Component, MouseEventHandler, ReactNode } from 'react'
import cx from 'classnames'

import Icon from '../Icon/Icon'
import Popup from '../Popup/Popup'

import './DropdownButton.scss'

interface IProps {
  name: string
  children: ReactNode
  disabled?: boolean
  onClick: MouseEventHandler
}

/**
 * Блок DropdownButton
 */
class DropdownButton extends Component<IProps> {
  render (): JSX.Element {
    const { name, children, disabled, onClick } = this.props

    const classes = cx('dropdown-button', {
      'dropdown-button--disabled': disabled
    })

    return (
      <div className={classes}>
        <button onClick={!disabled && onClick} className='dropdown-button__main'>
          <span className='dropdown-button__label'>{name}</span>
        </button>
        <div className='dropdown-button__line' />
        <Popup size='small' trigger={<button className='dropdown-button__more'><Icon icon='down' /></button>} up>
          {children}
        </Popup>
      </div>)
  }
}

export default DropdownButton
