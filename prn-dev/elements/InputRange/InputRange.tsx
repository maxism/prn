import React, { Component } from 'react'
import cx from 'classnames'

import { NumeralFormat } from '../../utils/NumeralUtil'

import s from './InputRange.module.scss'

interface IProps {
  /**
   * Подпись
   */
  label?: string
  /**
   * Значение
   */
  value?: [string, string]
  /**
   * Обработчик выбора
   */
  onChange: (value: [string, string]) => void
  /**
   * Отключен
   */
  disabled?: boolean
  /**
   * Формат числа
   */
  format?: NumeralFormat | string}

interface IStates {
  localValue?: [string, string]
}

/**
 * Слайдер выбора диапазона значений
 */
class InputRange extends Component<IProps, IStates> {
  static defaultProps = {
    format: '0,0',
    fromFormat: 'От %{1}',
    toFormat: 'До %{1}',
    anyFormat: 'Любая'
  }

  state: IStates = {
    localValue: this.props.value
  }

  componentDidUpdate (prevProps: Readonly<IProps>): void {
    if (prevProps.value[0] !== this.props.value[0] || prevProps.value[1] !== this.props.value[1]) {
      this.setState({ localValue: this.props.value })
    }
  }

  handleChange = () => {
    const { onChange } = this.props

    const left = String(Number(this.state.localValue[0].replace(/[^0-9.,]/g, "").replace(/,/g, ".")) || '')
    const right = String(Number(this.state.localValue[1].replace(/[^0-9.,]/g, "").replace(/,/g, ".")) || '')

    onChange([left, right])
  }

  render (): JSX.Element {
    let { value, label, disabled } = this.props

    const classes = cx(s.element, {
      [s.disabled]: disabled
    })

    return (
      <div className={classes}>
        <div className={s.main}>
          <div className={s.content}>
            <span className={s.label}>{label}</span>
            <div className={s.container}>
              <span>от</span>
              <input
                value={this.state.localValue[0] || ''}
                onChange={e => this.setState({ localValue: [e.target.value, value[1] || ''] })}
                onBlur={() => this.handleChange()}
              />
              <span>до</span>
              <input
                value={this.state.localValue[1] || ''}
                onChange={e => this.setState({ localValue: [value[0] || '', e.target.value] })}
                onBlur={() => this.handleChange()}
              />
            </div>
          </div>
        </div>
      </div>)
  }
}

export default InputRange
