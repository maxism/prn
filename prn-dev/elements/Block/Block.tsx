import React, { Component, MouseEventHandler, ReactNode, RefObject } from 'react'
import cx from 'classnames'

import s from './Block.module.scss'
import FocusedImage from '../FocusedImage/FocusedImage'
import {IIcon} from '../Icon/Icons'
import Icon from '../Icon/Icon'
import Link from 'next/link'
import eventStack from '../../lib/eventStack'
import { toBlob } from 'html-to-image'
import { saveAs } from 'file-saver'

type ISize = 2 | 3 | 4 | 6 | 8 | 12

interface IProps {
  /**
   * Содержимое элемента
   */
  children?: ReactNode,
  /**
   * Размер блока
   */
  size?: ISize
  /**
   * Класс
   */
  className?: string
  /**
   * Иконка
   */
  icon?: IIcon | string
  /**
   * Картинка
   */
  image?: string
  /**
   * Фоновая картинка
   */
  background?: string
  /**
   * Картинка справа
   */
  rightImage?: boolean
  /**
   * Режим слайда
   */
  slide?: boolean
  /**
   * Основной цвет фона
   */
  color?: string
  /**
   * Второй цвет для градиента
   */
  gradientColor?: string
  /**
   * Блок без фона
   */
  transparent?: boolean
  /**
   * Блок c белым фоном
   */
  white?: boolean
  /**
   * Ссылка
   */
  to?: string
  /**
   * Открыть в новом окне
   */
  _blank?: boolean
  /**
   * Обработчик клика
   */
  onClick?: MouseEventHandler
  /**
   * Обработчик нажатия кнопки мыши
   */
  onMouseDown?: MouseEventHandler
  /**
   * Возможность сохранения блока в файл
   */
  save?: boolean
  /**
   * Квадратный блок
   */
  square?: boolean
}

interface IStates {
  htmlToImage: boolean
}

/**
 * Блок
 * Размер задает количество занимаемых колонок
 */
export default class Block extends Component<IProps> {
  static defaultProps = {
    size: 12
  }

  state: IStates = {
    htmlToImage: false
  }

  private ref: RefObject<any>

  constructor (props) {
    super(props)
    this.ref = React.createRef()

    eventStack.sub('htmlToImage', (value) => this.setState({ htmlToImage: value }))
  }

  saveToPng = () => {
    if (this.ref.current) {
      eventStack.emit('htmlToImage', true)

      toBlob(this.ref.current, { cacheBust: true })
        .then(function (blob) {
          // saveAs(blob, `${this.props.saveToFileName || 'screen'}.png`)
          saveAs(blob, 'screen.png')

          eventStack.emit('htmlToImage', false)
        })
        .catch(() => {
          alert('При создании картинки произошла ошибка')
        })
    }
  }

  renderBlock (): JSX.Element {
    const { size, className, icon, image, background, rightImage, slide, color,
      gradientColor, transparent, white, to, _blank, onClick, onMouseDown, save, square } = this.props

    const classes = cx(s.element, {
      [s.link]: to || onClick,
      [s.size2]: size === 2,
      [s.size3]: size === 3,
      [s.size4]: size === 4,
      [s.size6]: size === 6,
      [s.size8]: size === 8,
      [s.size12]: size === 12,
      [s.rightImage]: rightImage,
      [s.slide]: slide,
      [s.gradient]: gradientColor,
      [s.transparent]: transparent,
      [s.white]: white,
      [s.square]: square,
      [s.downdloadImage]: this.state.htmlToImage
    }, className)

    return React.createElement(to ? 'a' : 'div', {
      className: classes,
      style: { '--color': color || '#F6F6F6', '--gradientColor': gradientColor || color },
      onClick: onClick,
      onMouseDown: onMouseDown,
      ref: this.ref,
      target: _blank ? '_blank' : ''
    }, (
      <>
        {background && <img className={s.backgroundImage} src={background} />}
        {!this.state.htmlToImage && save && <div className={s.saveButton} onClick={() => this.saveToPng()}>Save</div>}
        {icon && <div className={s.icon}><Icon icon={icon} size='l' /></div>}
        <div className={s.container}>
          {this.props.children}
        </div>
        {image && (
          <div className={s.image}>
            <FocusedImage src={image} focused='1380 1380 360 360 660 660 center center'>
              <img className={s.imageSize} src={require('./img/transparent.png')} />
            </FocusedImage>
          </div>
        )}
      </>
    ))
  }

  render (): JSX.Element {
    const { to } = this.props

    if (to) return (<Link href={to}>{this.renderBlock()}</Link>)

    return this.renderBlock()
  }
}
