import React, { Component, ReactNode } from 'react'

import './HeaderControls.scss'

interface IProps {
  /**
   * Компонеты
   */
  children?: ReactNode
}

/**
 * Элемент HeaderLogo
 */
class HeaderControls extends Component<IProps> {
  render (): JSX.Element {
    const { children } = this.props

    return (
      <div className='header-controls'>
        {children}
      </div>
    )
  }
}

export default HeaderControls
