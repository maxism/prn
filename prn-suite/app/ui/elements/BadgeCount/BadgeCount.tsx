import React, { Component, ReactNode } from 'react'
import cx from 'classnames'

import './BadgeCount.scss'

interface IProps {
  children: ReactNode
  disabled?: boolean
  className?: string
}

/**
 * Элемент Badge Count.
 * Бэйдж на котором показано количество
 */

class BadgeCount extends Component<IProps> {
  render (): JSX.Element {

    const { children, disabled, className } = this.props

    const classes = cx('badge-count', {
      'badge-count--disabled': disabled
    }, className)

    return (
      <div className={classes}>
        <span className='badge-count__value'>
          {children}
        </span>
      </div>
    )
  }
}

export default BadgeCount
