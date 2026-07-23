import React, { Component } from 'react'
import Icon from '../Icon/Icon'

import './Loading.scss'

interface IProps {
  /**
   * Высота блока
   */
  size?: number

  /**
   * Надпись, если нужна
   */
  message?: string

  style?: React.CSSProperties
}

/**
 * Элемент Loading
 * Заглушка на время, пока загружаются данные.
 */
class Loading extends Component<IProps> {

  static defaultProps = {
    size: '50',
    style: {}
  }

  render (): JSX.Element {

    const { size, message, style } = this.props

    return (
      <div className='loading' style={{ height: `${size}px`, flex: `0 0 ${size}px`, ...style }}>
        <Icon className='loading__icon' icon='loading_dots_square' />
        <span className='loading__text'>{message}</span>
      </div>
    )
  }
}

export default Loading
