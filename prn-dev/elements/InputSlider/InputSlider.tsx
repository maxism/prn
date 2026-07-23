import React, { Component } from 'react'
import cx from 'classnames'
import { Range, getTrackBackground  } from 'react-range'

import s from './InputSlider.module.scss'
import NumeralUtil, {NumeralFormat} from '../../utils/NumeralUtil'

interface IProps {
  /**
   * Подпись
   */
  label?: string
  /**
   * Минимальное значение
   */
  minValue?: number
  /**
   * Максимальное значение
   */
  maxValue?: number
  /**
   * Шаг значения
   */
  step?: number | Array<number>
  /**
   * Значение
   */
  value?: [number, number]
  /**
   * Обработчик выбора
   */
  onChange: (value: [number, number]) => void
  /**
   * Отключен
   */
  disabled?: boolean
  /**
   * Формат числа
   */
  format?: NumeralFormat | string
  /**
   * Формат От
   */
  fromFormat?: string
  /**
   * Формат До
   */
  toFormat?: string
  /**
   * Формат Любая
   */
  anyFormat?: string
  /**
   * Показывать Любое значение
   */
  anyValue?: boolean
}

interface IStates {
  trackValue?: [number, number] | false
}

/**
 * Слайдер выбора диапазона значений
 */
class InputSlider extends Component<IProps, any> {
  static defaultProps = {
    minValue: 0,
    maxValue: 100,
    step: 1,
    format: '0,0',
    fromFormat: 'От %{1}',
    toFormat: 'До %{1}',
    anyFormat: 'Любая'
  }

  state: IStates = {
    trackValue: false
  }

  handleTrackChange = (value) => {
    const { step } = this.props
    if (Array.isArray(step)) {
      value[0] = step[value[0]]
      value[1] = step[value[1]]
    }

    // console.log('handleTrackChange', value)

    if (value[0] !== value[1]) this.setState({ trackValue: value })
  }

  handleChange = (value) => {
    const { step, onChange } = this.props
    if (Array.isArray(step)) {
      value[0] = step[value[0]]
      value[1] = step[value[1]]
    }

    // console.log('onChange', value)

    if (value[0] !== value[1]) onChange(value)
  }

  render (): JSX.Element {
    let { value, minValue, maxValue, step, label, format, fromFormat, toFormat, anyFormat, anyValue, disabled } = this.props
    const { trackValue } = this.state

    value = [Number(value[0]), Number(value[1])]

    if (trackValue) value = [Number(trackValue[0]), Number(trackValue[1])]

    const classes = cx(s.element, {
      [s.disabled]: disabled
    })

    let selectedStep = step as number
    let selectedMinValue = minValue
    let selectedMaxValue = maxValue
    let selectedValue = [value[0], value[1]]

    if (Array.isArray(step)) {
      selectedStep = 1
      selectedMinValue = 0
      selectedMaxValue = step.length - 1

      selectedValue[0] = Math.max(0, step.findIndex(item => item === value[0]))
      selectedValue[1] = Math.max(0, step.findIndex(item => item === value[1]))
    }

    // console.log('step', step)
    // console.log('value', value)
    // console.log('selectedMinValue', selectedMinValue)
    // console.log('selectedMaxValue', selectedMaxValue)
    // console.log('selectedValue', selectedValue)

    const leftValue = NumeralUtil.format(value[0], format)
    const rightValue = NumeralUtil.format(value[1], format)

    // console.log('leftValue', leftValue)
    // console.log('rightValue', rightValue)

    let textValue = `${leftValue} — ${rightValue}`
    if (anyValue) {
      if (selectedValue[0] === selectedMinValue) textValue = toFormat.replace('%{1}', rightValue)
      if (selectedValue[1] === selectedMaxValue) textValue = fromFormat.replace('%{1}', leftValue)
      if (selectedValue[0] === selectedMinValue && selectedValue[1] === selectedMaxValue) textValue = anyFormat
    }

    return (
      <div className={classes}>
        <div className={s.main}>
          <span className={s.label}>{label}</span>
          <span className={s.value}>{textValue}</span>
        </div>
        <div className={s.container}>
          <Range
            min={selectedMinValue}
            max={selectedMaxValue}
            step={selectedStep}
            values={selectedValue}
            onChange={this.handleTrackChange}
            onFinalChange={this.handleChange}
            disabled={disabled}
            renderTrack={({ props, children }) => (
              <div
                {...props}
                className={s.range}
                style={{
                  ...props.style
                }}
              >
                <div
                  className={s.track}
                  style={{
                    background: getTrackBackground({
                      values: selectedValue,
                      colors: ['var(--trackBackground)', 'var(--trackColor)', 'var(--trackBackground)'],
                      min: selectedMinValue,
                      max: selectedMaxValue,
                    })
                  }}
                />
                {children}
              </div>
            )}
            renderThumb={({ props, index }) => (
              <div
                {...props}
                className={cx(s.thumb, { [s.leftThumb]: index === 0, [s.rightThumb]: index === 1 })}
                style={{
                  ...props.style
                }}
              />
            )}
          />
        </div>
      </div>)
  }
}

export default InputSlider
