import React, { Component, ReactNode } from 'react'
import cx from 'classnames'

import s from './ButtonText.module.scss'

type Size = 's' | 'm' | 'l'


interface IProps {
  /**
   * Внутренние элементы
   */
  children: ReactNode
  /**
   * На всю ширину
   */
  full?: boolean
  /**
   * Кастомный тступ между кнопками
   */
  size?: Size
}

/**
 * Элемент ButtonTextGroup
 * Группа кнопок
 */
class ButtonTextGroup extends Component<IProps> {
  render (): JSX.Element {
    const { full, size } = this.props

    const classes = cx(s.groupElement, {
      [s.full]: full,
      [s.groupSizeS]: size === 's',
      [s.groupSizeM]: size === 'm',
      [s.groupSizeL]: size === 'l'
    })

    return (
      <div className={classes}>
        {this.props.children}
      </div>
    )
  }
}

export default ButtonTextGroup
