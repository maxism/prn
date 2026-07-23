import React, { Component, ReactNode } from 'react'
import cx from 'classnames'

import s from './Row.module.scss'

type IPadding = 'xxl' | 'xl' | 'l' | 'm' | 's' | 'xs' | 'xxs' | 'z'

interface IProps {
  /**
   * Компонеты
   */
  children?: ReactNode
  /**
   * Отступ сверху
   */
  padding?: IPadding

  left?: boolean
  right?: boolean
}

/**
 * Элемент Row
 * Строчка внутри контейнера
 * Задаются отступы сверху и снизу до других строчек
 */
export default class Row extends Component<IProps> {
  render (): JSX.Element {
    let { children, padding, left, right } = this.props

    const classes = cx(s.rowElement, {
      [s.paddingXXL]: padding === 'xxl',
      [s.paddingXL]: padding === 'xl',
      [s.paddingL]: padding === 'l',
      [s.paddingM]: padding === 'm',
      [s.paddingS]: padding === 's',
      [s.paddingXS]: padding === 'xs',
      [s.paddingXXS]: padding === 'xxs',
      [s.paddingZ]: padding === 'z',
      [s.left]: left,
      [s.right]: right
    })

    return (
      <div className={classes}>
        {children}
      </div>)
  }
}
