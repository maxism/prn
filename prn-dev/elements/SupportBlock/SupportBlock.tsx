import React, { Component, ReactNode } from 'react'

import s from './SupportBlock.module.scss'

interface IProps {
  /**
   * Содержимое элемента
   */
  children?: ReactNode
}

/**
 * Блок со списком статей в разеделе поддержки
 */
export default class SupportBlock extends Component<IProps> {

  render (): JSX.Element {
    const { children } = this.props

    return (
      <div className={s.element}>
        {children}
      </div>
    )
  }
}
