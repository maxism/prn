import React, { Component, ReactNode } from 'react'
import cx from 'classnames'

import s from './Image.module.scss'

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
   * Рамка для статей
   */
  article?: boolean
  /**
   * Эмоджи в модалках
   */
   emoji?: boolean
  /**
   * На всю ширину
   */
  full?: boolean
  /**
   * Элементы
   */
  children?: ReactNode
  /**
   * Соотношение картинки 50% - 8/16
   */
  ratio?: string
}

/**
 * Элемент Image
 */
export default class Image extends Component<IProps> {
  static defaultProps = {
    alt: '',
    src: '',
    srcSet: '',
    noImage: require('../../public/images/no_image.svg')
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
    let { src, srcSet, alt, className, round, border, article, emoji, noImage, children, full, ratio } = this.props
    const { isError } = this.state

    if (src) src = src.replace('http://', 'https://')

    const classes = cx(s.element, {
      [s.round]: round,
      [s.border]: border,
      [s.article]: article,
      [s.emoji]: emoji,
      [s.error]: isError,
      [s.full]: full
    }, className)

    return (
      // @ts-ignore
      <div className={classes} style={{ '--ratio': ratio }}>
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
