import React, {ChangeEventHandler, Component, ReactNode} from 'react'

import cx from 'classnames'
import Uuid from '../Uuid/Uuid'

import s from './Checkbox.module.scss'

type ISize = 'm' | 's'

interface IProps {
  /**
   * Текст
   */
  children?: ReactNode
  /**
   * Текст
   */
  label?: ReactNode | string
  /**
   * Группа
   */
  group?: string
  /**
   * Если элемент используется на сером фоне (в сервисе, сам элемент становится белым)
   */
  white?: boolean
  /**
   * Неактивное состояние
   */
  disabled?: boolean
  /**
   * Выбранное состояние
   */
  checked?: boolean
  /**
   * Обработка выбора
   */
  onChange?: ChangeEventHandler<HTMLInputElement>

  third?: boolean
  /**
   * Размер чекбокса
   */
  size?: ISize
}

/**
 * Компонент Checkbox
 */
class Checkbox extends Component<IProps> {

  static defaultProps = {
    size: 'm'
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
    const { children, group, white, label, disabled, checked, third, size } = this.props

    const classes = cx(s.element, {
      [s.sizeM]: size === 'm',
      [s.sizeS]: size === 's',
      [s.checked]: checked,
      [s.disabled]: disabled,
      [s.white]: white,
      [s.third]: third && checked === undefined
    })

    const id = Uuid()

    return (
      <div className={classes}>
        <input
          type='input'
          className={s.input}
          id={id}
          name={group}
          disabled={disabled}
          checked={Boolean(checked)}
          onClick={e => { e.stopPropagation() }}
          readOnly
        />

        <label htmlFor={id} onClick={!disabled ? this.handleClick : undefined}>
          {(children || label) && <span className={s.text}>{children || label}</span>}
        </label>
      </div>
    )
  }
}

export default Checkbox
