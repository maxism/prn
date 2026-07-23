import React, { Component, ReactNode } from 'react'
import cx from 'classnames'

import s from './ButtonTag.module.scss'

type ISize = 'm' | 's'

interface IProps {
  /**
   * Внутренние элементы
   */
  children: ReactNode
  /**
   * Центрировать кнопки
   */
  center?: boolean
  /**
   * Класс
   */
  className?: string
  /**
   * Размер
   */
  size: ISize
  /**
   * На всю ширину
   */
  full?: boolean
}

/**
 * Элемент ButtonTextGroup
 * Группа кнопок
 */
class ButtonTagGroup extends Component<IProps> {

  static defaultProps = {
    size: 'm'
  }

  render (): JSX.Element {
    const { children, center, className, size, full } = this.props

    const classes = cx(s.groupElement, {
      [s.groupCenter]: center,
      [s.groupSizeM]: size === 'm',
      [s.groupSizeS]: size === 's',
      [s.full]: full,
    }, className)

    return (
      <div className={classes}>
        {children}
      </div>
    )
  }
}

export default ButtonTagGroup
