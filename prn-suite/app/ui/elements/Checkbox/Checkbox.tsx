import React, { ChangeEventHandler, Component, MouseEventHandler } from 'react'
import uuid from '../../behaviors/Uuid/Uuid'
import cx from 'classnames'

import './Checkbox.scss'

interface IProps {
  id?: string
  label?: string
  name?: string

  disabled?: boolean
  checked?: boolean
  onChange?: ChangeEventHandler<HTMLInputElement>

  third?: boolean
  big?: boolean
}

/**
 * Компонент Checkbox
 */
class Checkbox extends Component<IProps> {

  state = {
    uuid: uuid()
  }

  handleClick = (e) => {
    const { third, checked, onChange } = this.props
    let value = checked
    if (third) {
      if (checked === false) {
        value = undefined
      } else if (checked === undefined) {
        value = true
      } else if (checked === true) {
        value = false
      }
    } else {
      if (checked === undefined) value = false
      else value = Boolean(!value)
    }
    e.target.value = value

    if (onChange) onChange(e)
    e.stopPropagation()
  }

  render (): JSX.Element {
    const { id, name, label, disabled, checked, third, big } = this.props

    const classes = cx('checkbox', {
      'checkbox--big': big,
      'checkbox--disabled': disabled,
      'checkbox--third': third && checked === undefined
    })

    return (
      <div className={classes}>
        <input
          type='checkbox'
          className='checkbox__input'
          id={id || this.state.uuid}
          name={name}
          disabled={disabled}
          checked={Boolean(checked)}
          onClick={e => { e.stopPropagation() }}
          readOnly
        />

        <label htmlFor={id || this.state.uuid} onClick={!disabled ? this.handleClick : undefined}>
          {label && <span className='checkbox__text'>{label}</span>}
        </label>

      </div>
    )
  }
}

export default Checkbox
