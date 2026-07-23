import React, { Component, ReactNode } from 'react'

import s from './InlineTextList.module.scss'
import Icon from '../Icon/Icon'
import { IIcon } from '../Icon/Icons'

interface IProps {
  icon?: IIcon | string
  text?: string
  children?: ReactNode
}

/**
 * Элемент InlineTextListItem
 * Один элемент списка
 */
export default class InlineTextListItem extends Component<IProps> {
  render (): JSX.Element {

    const { icon, text, children } = this.props

    return (
      <>
        {icon && <Icon className={s.icon} icon={icon} />}
        <span className={s.text}>{children || text}</span>
      </>
    )
  }
}
