import React, { Component, ReactNode } from 'react'
import cx from 'classnames'

import s from './ButtonNav.module.scss'

type ISize = 's'

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
  size?: ISize
  /**
   * На всю ширину
   */
  full?: boolean
  /**
   * Группа иконок
   */
  icons?: boolean
  /**
   * Белый фон (для сервисов и блоков с серым фоном)
   */
  white?: boolean
}

/**
 * Элемент ButtonTextGroup
 * Группа кнопок
 */
export default class ButtonNavGroup extends Component<IProps> {
  render (): JSX.Element {
    const { children, center, className, size, full, icons, white } = this.props

    const classes = cx(s.groupElement, {
      [s.groupCenter]: center,
      [s.sizeS]: size,
      [s.full]: full,
      [s.icons]: icons,
      [s.white]: white
    }, className)

    return (
      <div className={classes}>
        <div className={s.container}>
          {children}
        </div>
      </div>
    )
  }
}

