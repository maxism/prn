import React, { ChangeEventHandler, Component } from 'react'
import uuid from '../../behaviors/Uuid/Uuid'
import cx from 'classnames'

import './Radio.scss'

interface IProps {
  id?: string
  label?: string
  name?: string
  value: string

  checked?: boolean
  disabled?: boolean
  onChange?: ChangeEventHandler<HTMLInputElement>

  big?: boolean
}

/**
 * Элемент Radio
 */

class Radio extends Component<IProps> {

  state = {
    uuid: uuid()
  }

  render (): JSX.Element {

    const { id, label, name, value, checked, disabled, onChange, big } = this.props

    const classes = cx('radio', {
      'radio--big': big
    })

    return (
      <div className={classes}>

        <input
          type='radio'
          className='radio__input'
          id={id || this.state.uuid}
          name={name}
          value={value}
          disabled={disabled}
          checked={checked}
          onChange={onChange}
        />

        <label htmlFor={id || this.state.uuid}>
          {label && <span className='radio__text'>{label}</span>}
        </label>

      </div>
    )
  }
}

export default Radio
