import React, { Component, ReactNode } from 'react'
import cx from 'classnames'

import './ButtonTextGroup.scss'

interface IProps {
  /**
   * Внутренние элементы
   */
  children: ReactNode
  /**
   * Кнопка поцентру
   */
  center?: boolean
}

/**
 * Элемент ButtonTextGroup
 * Группа кнопок
 */
class ButtonTextGroup extends Component<IProps> {
  render (): JSX.Element {
    const classes = cx('button-text-group', {
      'button-text-group--center': this.props.center
    })

    return (
      <div className={classes}>
        {this.props.children}
      </div>
    )
  }
}

export default ButtonTextGroup
