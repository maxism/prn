import React, { Component, MouseEventHandler, ReactNode } from 'react'
import cx from 'classnames'

import Link from '../Link/Link'

interface IProps {
  /**
   * Внутренние элементы
   */
  children: ReactNode
  /**
   * Обработчик клика
   */
  onClick: MouseEventHandler
  /**
   * Активное состояние
   */
  active: boolean
}

/**
 * Элемент PageMenuItem
 * Элементы меню страницы
 */
class PageMenuItem extends Component<IProps> {
  render (): JSX.Element {
    const { children, onClick, active } = this.props

    const classes = cx('page-menu__item', {
      ['page-menu__item--active']: active
    })

    return (
      <button className={classes} onClick={onClick}>
        {children}
      </button>
    )
  }
}

export default PageMenuItem
