import React, { Component, ReactNode } from 'react'
import cx from 'classnames'

import s from './Page.module.scss'

interface IProps {
  /**
   * Компонеты
   */
  children?: ReactNode
  /**
   * Серый фон
   */
  grey?: boolean
}

/**
 * Основной элемент сраницы сайта
 * Поддерживает серый фон
 */
export default class Page extends Component<IProps> {
  render (): JSX.Element {
    let { children, grey } = this.props

    const classes = cx(s.element, {
      [s.grey]: grey
    })

    return (
      <div className={classes}>
        {children}
      </div>)
  }
}
