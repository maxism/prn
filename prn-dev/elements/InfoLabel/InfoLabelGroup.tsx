import React, { Component, ReactNode } from 'react'
import cx from 'classnames'

import s from './InfoLabel.module.scss'

type TSize = 's' | 'm' | 'l'

interface IProps {
  /**
   * Содержимое элемента
   */
  children?: ReactNode
  /**
   * Размер
   */
  size?: TSize
  /**
   * Центрировать конетнт
   */
  center?: boolean
  /**
   * Большие описания
   */
  bigDescription?: boolean
  /**
   * Маленький размер метрики
   */
  small?: boolean
  /**
   * 1 колонка
   */
  oneCol?: boolean
  /**
   * 2 колонки
   */
  twoCol?: boolean
  /**
   * 4 колонки
   */
  fourCols?: boolean
}

/**
 * Группа информационных подписей
 */
export default class InfoLabelGroup extends Component<IProps> {
  static defaultProps = {
    size: 'm'
  }

  render (): JSX.Element {
    const { children, size, center, bigDescription, small, oneCol, twoCol, fourCols } = this.props

    // todo: Уменьшинный размер текста в контейнере. От чего зависит? Зависит от размера блока ил отдельная настройка?

    const classes = cx(s.groupElement, {
      [s.groupSizeS]: size === 's',
      [s.groupSizeM]: size === 'm',
      [s.groupSizeL]: size === 'l',
      [s.center]: center,
      [s.bigDescription]: bigDescription,
      [s.small]: small,
      [s.oneCol]: oneCol,
      [s.twoCol]: twoCol,
      [s.fourCols]: fourCols,
    })

    return (
      <div className={classes}>
        {children}
      </div>
    )
  }
}
