import React, { Component, ReactNode } from 'react'
import cx from 'classnames'

import s from './Title.module.scss'

type Size = 'xs' | 's' | 'm' | 'l' | 'xl' | 'heavy'

interface IProps {
  /**
   * Текст
   */
  children?: ReactNode
  /**
   *  Размер
   */
  size?: Size
  /**
   * ID заголовка для якоря
   */
  id?: string
  /**
   * Текст поцентру
   */
  center?: boolean
  /**
   * Текст справа
   */
  right?: boolean
  /**
   * Представление в html тегом. По-молчанию зависит от размера
   */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span'
  /**
   * Класс
   */
  className?: string
  /**
   * Заголовок подсказки
   */
  tooltipTitle?: string
  /**
   * Текст подсказки
   */
  tooltipText?: ReactNode
  /**
   * Описание подсказки
   */
  tooltipDescription?: ReactNode
  /**
   * Управляющие элементы справа от заголовка
   */
  controls?: ReactNode
}

/**
 * Элемент Title
 */
class Title extends Component<IProps> {
  static defaultProps = {
    size: 'm'
  }

  render (): JSX.Element {
    let { size, children, id, center, right, as, className, controls } = this.props

    const classes = cx(s.element, {
      [s.controls]: controls
    })

    const titleClasses = cx(s.title, {
      [s.xs]: size === 'xs',
      [s.s]: size === 's',
      [s.m]: size === 'm',
      [s.l]: size === 'l',
      [s.xl]: size === 'xl',
      [s.heavy]: size === 'heavy',
      [s.center]: center,
      [s.right]: right
    }, className)

    if (!as) {
      switch (size) {
        case 'heavy': as = 'span'; break
        case 'xl': as = 'h1'; break
        case 'l': as = 'h2'; break
        case 'm': as = 'h3'; break
        case 's': as = 'h4'; break
        case 'xs': as = 'h5'; break
        default: as = 'span'; break
      }
    }

    return (
      <div className={classes}>
        {React.createElement(as, {
          className: titleClasses
        }, (
          <>
            {id && <a id={id} className={s.anchor} />}
            {children}
          </>
          ))}
        {controls && <div className={s.controlsContainer}>{controls}</div>}
      </div>
    )
  }
}

export default Title
