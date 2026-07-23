import React, { Component, MouseEventHandler, ReactNode } from 'react'
import cx from 'classnames'

import './Image.scss'

interface IProps {
  /**
   * Адрес
   */
  src?: string
  /**
   * Адрес для retina
   */
  srcSet?: string
  /**
   * Альтернативный текст
   */
  alt?: string
  /**
   * Дополнительные классы
   */
  className?: string
  /**
   * Плейсхолдер в случае ошибки загрузки
   */
  noImage?: string
  /**
   * Круглая картинка
   */
  round?: boolean
  /**
   * Рамка вокруг картинки
   */
  border?: boolean
  /**
   * Скругление углов 10px
   */
  bigRadius?: boolean
  /**
   * Элементы
   */
  children?: ReactNode
  /**
   * Обработчик клика
   */
  onClick?: MouseEventHandler
}

/**
 * Элемент Image
 */
class Image extends Component<IProps> {
  static defaultProps = {
    alt: '',
    src: '',
    srcSet: ''
  }

  state = {
    isError: false
  }

  onError = (e) => {
    e.target.onerror = null
    e.target.src = this.props.noImage
    this.setState({
      isError: true
    })
  }

  render (): JSX.Element {
    const { src, srcSet, alt, className, round, border, bigRadius, noImage, children, onClick } = this.props
    const { isError } = this.state

    const classes = cx('image', className, {
      'image--round': round,
      'image--border': border,
      'image--error': isError,
      'image--bigRadius': bigRadius
    })

    return (
      <div className={classes} onClick={onClick}>
        <img
          src={src ? String(src) : noImage}
          srcSet={srcSet}
          onError={noImage && this.onError}
          alt={alt}
        />
        {children}
      </div>
    )
  }
}

export default Image
