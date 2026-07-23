import React, { Component, ReactNode } from 'react'
import cx from 'classnames'

import './InputGroup.scss'

interface IProps {
  children: ReactNode
  big?: boolean
  column?: 1 | 2
}

/**
 * Элемент InputGroup.
 * Группа для Radio и Checkbox селекторов, а также для поле ввода
 */

class InputGroup extends Component<IProps> {

  static defaultProps = {
    column: 1
  }

  render (): JSX.Element {

    const { big, column } = this.props

    const classes = cx('input-group', {
      'input-group--big': big,
      [`input-group--column${column}`]: column
    })

    return (
      <div className={classes}>{this.props.children}</div>
    )
  }
}

export default InputGroup
