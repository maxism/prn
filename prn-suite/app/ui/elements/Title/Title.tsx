import React, { Component, ReactNode } from 'react'
import cx from 'classnames'

import './Title.scss'

//               20          26         34       48         60          120
type Size = 'superSmall' | 'small' | 'middle' | 'big' | 'superBig' | 'awesome'

interface IProps {
  /**
   * Текст
   */
  text?: ReactNode
  /**
   * Компонеты
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
   * Зелёным цветом
   */
  green?: boolean
  /**
   * Заголовок с иконкой справа
   */
  controls?: boolean
}

/**
 * Элемент Title
 */
class Title extends Component<IProps> {
  static defaultProps = {
    size: 'big'
  }

  render (): JSX.Element {
    let { size, children, id, green, text, controls } = this.props

    if (!text) {
      text = children
      children = ''
    }

    const classes = cx('title', {
      [`title--${size}`]: size,
      'title--green': green,
      'title--controls': controls
    })

    return (
      <div className={classes}>
        {size === 'superSmall' && <h4 id={id} className={classes}>{text}</h4>}
        {size === 'small' && <h3 id={id} className={classes}>{text}</h3>}
        {size === 'middle' && <h2 id={id} className={classes}>{text}</h2>}
        {size === 'big' && <h1 id={id} className={classes}>{text}</h1>}
        {size === 'superBig' && <h1 id={id} className={classes}>{text}</h1>}
        {size === 'awesome' && <span id={id} className={classes}>{text}</span>}
        {children}
      </div>)
  }
}

export default Title
