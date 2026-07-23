import React, { Component, ReactNode } from 'react'
import s from './Year.module.scss'
import Icon from '../Icon/Icon'

interface IProps {
  children?: ReactNode
  social: string
}

export default class YearLink extends Component<IProps> {
  render (): JSX.Element {
    const { children, social } = this.props

    return (
      <div className={s.yearLink}>
        <Icon className={s.yearLinkIcon} icon={social} />
        <span>{children}</span>
      </div>
    )
  }
}
