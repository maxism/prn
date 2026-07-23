import React, { Component, ReactNode } from 'react'
import s from './Year.module.scss'

interface IProps {
  children?: ReactNode
}

export default class YearBadge extends Component<IProps> {
  render (): JSX.Element {
    const { children } = this.props

    return (
      <div className={s.yearBadge}>
        <span>{children}</span>
      </div>
    )
  }
}
