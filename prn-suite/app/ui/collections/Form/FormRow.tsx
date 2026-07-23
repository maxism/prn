import React, { Component, ReactNode } from 'react'
import cx from 'classnames'

import './FormRow.scss'

type Padding = 'small' | 'big'

interface IProps {
  /**
   * Содержимое строки формы
   */
  children: ReactNode
  /**
   * Горизонтальные отступы между содержимым
   */
  padding: Padding
}

/**
 * Коллекция FormRow
 */
class FormRow extends Component<IProps> {

  static defaultProps = {
    padding: 'big'
  }

  render (): JSX.Element {
    const { children, padding } = this.props
    const classes = cx('form-row', {
      [`form-row--padding-${padding}`]: true
    })

    return (
      <div className={classes}>{children}</div>
    )
  }
}

export default FormRow
