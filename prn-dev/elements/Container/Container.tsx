import React, { Component, ReactNode } from 'react'
import cx from 'classnames'

import s from './Container.module.scss'

interface IProps {
  /**
   * Класс
   */
  className?: string
  /**
   * Компонеты
   */
  children?: ReactNode
}

/**
 * Элемент Container
 * Основная адаптивная сетка
 */
export default class Container extends Component<IProps> {
  render (): JSX.Element {
    let { className, children } = this.props

    return (
      <div className={cx(s.element, className)}>
        {children}
      </div>)
  }
}
