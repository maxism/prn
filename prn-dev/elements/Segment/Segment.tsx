import React, { Component, ReactNode, RefObject } from 'react'
import cx from 'classnames'
import handleViewport from 'react-in-viewport'
import { toPng } from 'html-to-image'
import download from 'downloadjs'

import s from './Segment.module.scss'
import eventStack from '../../lib/eventStack'

interface IProps {
  /**
   * Компонеты
   */
  children?: ReactNode
  /**
   * Фоновый цвет сегмента
   */
  color?: string
  /**
   * Занимать минимально высоту всего экрана
   */
  full?: boolean
  /**
   * Представление тегом в html
   */
  as?: string
  /**
   * Html класс
   */
  className?: string
  /**
   * Круги на фоне
   */
  background?: 'top' | 'analytics' | 'influence' | 'grey' | boolean
  /**
   * Прижать контент вверх
   */
  top?: boolean
  /**
   * Фон для темной темы
   */
  dark?: boolean
}

/**
 * Элемент Segment
 * Разделяет страницу на логические блоки
 * Занимает всю ширину страницы.
 * Можно задать фоновый цвет и минимальную высоту на весь экран
 */
class Segment extends Component<IProps> {
  private ref: RefObject<any>

  static defaultProps = {
    as: 'section'
  }

  constructor (props) {
    super(props)
    this.ref = React.createRef()
  }

  saveToPng = () => {
    if (this.ref.current) {
      eventStack.emit('htmlToImage', true)

      toPng(this.ref.current, { cacheBust: true })
        .then(function (dataUrl) {
          download(dataUrl, 'screen.png')

          eventStack.emit('htmlToImage', false)
        })
        .catch(() => {
          alert('При создании картинки произошла ошибка')
        })
    }
  }

  render (): JSX.Element {
    let { children, color, full, as, className, background, top, dark } = this.props

    const classes = cx(s.element, {
      [s.full]: full,
      [s.background]: background,
      [s.backgroundTop]: background === 'top',
      [s.backgroundAnalytics]: background === 'analytics',
      [s.backgroundInfluence]: background === 'influence',
      [s.backgroundGrey]: background === 'grey',
      [s.dark]: dark,
      [s.top]: top
    }, className)

    return React.createElement(as, {
      className: classes,
      style: { background: color },
      ref: this.ref
    }, (
      <>
        {/*<span onClick={this.saveToPng}>print</span>*/}
        {background && <div className={s.bgBlur}></div>}
        {background && <div className={s.circle1}></div>}
        {background && <div className={s.circle2}></div>}
        {children}
      </>
    ))
  }
}

export default handleViewport<IProps>(Segment, { rootMargin: '0px' }, { disconnectOnLeave: false })
