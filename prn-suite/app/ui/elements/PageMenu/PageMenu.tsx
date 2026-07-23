import React, { Component, ReactNode } from 'react'

import './PageMenu.scss'

interface IProps {
  /**
   * Внутренние элементы
   */
  children: ReactNode
}

/**
 * Элемент PageMenu
 * Контенер меню страницы
 */
class PageMenu extends Component<IProps> {
  render (): JSX.Element {
    return (
      <div className='page-menu'>
        {this.props.children}
      </div>
    )
  }
}

export default PageMenu
