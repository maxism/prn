import React, { Component, MouseEventHandler } from 'react'
import cx from 'classnames'
import SVG from 'react-inlinesvg'

import icons, { IIcon } from './Icons'

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
}

/**
 * Элемент Icon
 */
class Icon extends Component<IProps> {
  render (): JSX.Element {
    const { icon, color, className, onClick } = this.props

    const classes = cx('icon', {
      [`icon-${icon}`]: icon
    }, className)

    if (icon) {
      return (
        // @ts-ignore
        <SVG className={classes} src={icons[icon]} style={{ fill: color }} onClick={onClick} />
      )
    } else {
      return null
    }
  }
}

export default Icon
