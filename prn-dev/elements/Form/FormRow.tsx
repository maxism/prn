import React, { Component, ReactNode } from 'react'
import cx from 'classnames'

import s from './Form.module.scss'

interface IProps {
  /**
   * Содержимое строки формы
   */
  children: ReactNode
  /**
   * Строка с кнопками
   */
  buttons?: boolean
  /**
   * Элементы заполняют всю ширину
   */
  full?: boolean
}

/**
 * Элемент FormRow
 * Строка формы
 */
class FormRow extends Component<IProps> {
  static defaultProps = {
    padding: 'big'
  }

  render (): JSX.Element {
    const { children, buttons, full } = this.props
    const classes = cx(s.elementRow, {
      [s.buttons]: buttons,
      [s.full]: full
    })

    return (
      <div className={classes}>{children}</div>
    )
  }
}

export default FormRow
