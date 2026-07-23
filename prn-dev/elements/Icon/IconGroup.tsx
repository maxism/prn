import React, { Component, ReactNode } from 'react'
import cx from 'classnames'

import s from './Icon.module.scss'
import Text from '../Text/Text'

type ISize = 'xl' | 'l' | 'm' | 's' | 'xs'

interface IProps {
  className?: string
  /**
   * Иконка
   */
  children?: ReactNode
  /**
   * Размер
   */
  size?: ISize
  /**
   * Подпись
   */
  label?: string
  /**
   * На всю ширину
   */
  full?: boolean
}

/**
 * Группа иконок
 */
export default class IconGroup extends Component<IProps> {
  render (): JSX.Element {
    const { className, children, size, label, full } = this.props

    const classes = cx(s.elementGroup, {
      [s.groupSizeXS]: size === 'xs',
      [s.groupSizeS]: size === 's',
      [s.groupSizeM]: size === 'm',
      [s.groupSizeL]: size === 'l',
      [s.groupSizeXL]: size === 'xl',
      [s.full]: full
    }, className)

    return (
      <div className={classes}>
        {label && <Text className={s.label} size={size}>{label}</Text>}
        <div className={s.groupContainer}>
          {children}
        </div>
      </div>
    )
  }
}

