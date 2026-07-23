import React, { Children, Component, ReactNode } from 'react'
import cx from 'classnames'

import s from './InlineTextList.module.scss'

interface IProps {
  className?: string
  children: ReactNode
  semibold?: boolean
  noDots?: boolean
  hide?: boolean
}

/**
 * Элемент InlineTextList
 * Выводит текстовый список, разделенный точкой
 */
export default class InlineTextList extends Component<IProps> {
  render (): JSX.Element {
    const { className, children, semibold, noDots, hide } = this.props

    const classes = cx(s.element, {
      [s.semibold]: semibold,
      [s.noDots]: noDots,
      [s.mobileHidden]: hide
    }, className)

    return (
      <span className={classes}>
        <span className={s.container}>
          {Children.toArray(children).filter(child => child).map((child, index) => (
            <span key={index} className={s.item}>{child}</span>
          ))}
        </span>
      </span>
    )
  }
}
