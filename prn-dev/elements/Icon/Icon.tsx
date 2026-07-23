import React, { Component, MouseEventHandler } from 'react'
import cx from 'classnames'
import SVG from 'react-inlinesvg'

import icons, { IIcon } from './Icons'
import s from './Icon.module.scss'

type ISize = 'xl' | 'l' | 'm' | 's' | 'xs'

interface IProps {
  /**
   * Иконка
   */
  icon: IIcon | string
  /**
   * Цвет
   */
  color?: string
  /**
   * Дополнительные классы
   */
  className?: string
  /**
   * Обработчик клика
   */
  onClick?: MouseEventHandler
  /**
   * Размер
   */
  size?: ISize
}

/**
 * Элемент Icon
 */
class Icon extends Component<IProps> {
  render (): JSX.Element {
    const { icon, color, className, onClick, size } = this.props

    const classes = cx(s.element, {
      [s.sizeXS]: size === 'xs',
      [s.sizeS]: size === 's',
      [s.sizeM]: size === 'm',
      [s.sizeL]: size === 'l',
      [s.sizeXL]: size === 'xl'
    }, className)

    if (icon) {
      return icons[icon] && (<SVG className={classes} src={icons[icon]} style={{ fill: color }} onClick={onClick} />) || null
    } else {
      return null
    }
  }
}

export default Icon
