import React, { ChangeEventHandler, Component } from 'react'

import cx from 'classnames'
import Uuid from '../Uuid/Uuid'

import s from './RadioButton.module.scss'

type ISize = 'm' | 's'

interface IProps {
  /**
   * Текст
   */
  label?: string
  /**
   * Описание
   */
  description?: string
  /**
   * Размер
   */
  size?: ISize
  /**
   * Если элемент используется на сером фоне (в сервисе, сам элемент становится белым)
   */
  white?: boolean
  /**
   * Неактивное состояние
   */
  disabled?: boolean
  /**
   * Значение
   */
  value: string
  /**
   * Выбранное состояние
   */
  checked?: boolean
  /**
   * Группа
   */
  group?: string
  /**
   * Обработчик выбора
   */
  onSelect?: ChangeEventHandler<HTMLInputElement>
}

/**
 * Элемент RadioButton
 * Радио-кнопка
 */
class RadioButton extends Component<IProps> {
  static defaultProps = {
    size: 'm'
  }

  render (): JSX.Element {
    const { label, description, size, white, disabled, value, checked, group, onSelect } = this.props

    const classes = cx(s.element, {
      [s.sizeM]: size === 'm',
      [s.sizeS]: size === 's',
      [s.checked]: checked,
      [s.disabled]: disabled,
      [s.white]: white
    })

    const id = Uuid()

    return (
      <div className={classes}>
        <input
          className={s.input}
          type='radio'
          id={id}
          name={group}
          value={value}
          checked={checked}
          disabled={disabled}
          onClick={onSelect as any}
          readOnly
        />

        <label htmlFor={id}>
          {label && <>
            <span className={s.text}>{label}</span>
            {description && <span className={s.description}>{description}</span>}
          </>}
        </label>
      </div>
    )
  }
}

export default RadioButton
