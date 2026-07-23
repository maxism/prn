import React, { Component, ReactNode, RefObject } from 'react'
import cx from 'classnames'

import ReactResizeDetector, { withResizeDetector } from 'react-resize-detector'

import s from './FocusedImage.module.scss'

interface IProps {
  /**
   * Внутренние объяекты
   */
  children?: ReactNode
  /**
   * Адрес
   */
  src: string
  /**
   * Дополнительные классы
   */
  className?: string
  /**
   * Настройки фокуса
   * Ширина картинки, Высота картинки, Фокус слева, Фокус сверху, Шина фокуса, Высота фокуса, Горизонтальная позиция, Вертикальная позиция
   */
  focused: string
  /**
   * Прокидывается height из withResizeDetector
   */
  height?: number
  /**
   * Прокидывается width из withResizeDetector
   */
  width?: number
  /**
   * Минимальная высотка фокусной картинки
   */
  minHeight: number
  /**
   * Максимальная высотка фокусной картинки
   */
  maxHeight?: number
}

interface IStates {
  backgroundTop: number
  backgroundLeft: number
}

/**
 * Картинка с заднным фокусом, который всегда вписывается в доступное место
 */
class FocusedImage extends Component<IProps, IStates> {
  private ref: RefObject<any>
  private backgroundRef: RefObject<any>

  state: IStates = {
    backgroundTop: 0,
    backgroundLeft: 0
  }

  constructor (props) {
    super(props)
    this.ref = React.createRef()
    this.backgroundRef = React.createRef()
  }

  handleResizeBackground = () => {
    const rectRef = this.ref?.current?.getBoundingClientRect()
    const rectBackgroundRef = this.backgroundRef?.current?.getBoundingClientRect()
    const deltaTop = rectRef?.top - rectBackgroundRef?.top
    const deltaLeft = rectRef?.left - rectBackgroundRef?.left

    // console.log('deltaTop', deltaTop)
    // console.log('deltaLeft', deltaLeft)
    // console.log('rectRef', rectRef)
    // console.log('rectBackgroundRef', rectBackgroundRef)

    this.setState({ backgroundLeft: deltaLeft /*bW - this.props.width*/, backgroundTop: deltaTop /*bH - this.props.height*/ })
  }

  render (): JSX.Element {
    let { children, src, focused, height, width, minHeight, maxHeight, className } = this.props

    const splitted = focused.split(' ')

    const W = (splitted[0] || 0) as number
    const H = (splitted[1] || 0) as number
    const l = (splitted[2] || 0) as number
    const t = (splitted[3] || 0) as number
    const w = (splitted[4] || 0) as number
    const h = (splitted[5] || 0) as number
    const leftPosition = (splitted[6] || 'center') as string
    const topPosition = (splitted[7] || 'center') as string

    let leftOffset = 0
    let topOffset = 0

    const ratio = Math.min(width / w, height / h)

    if (leftPosition === 'left') leftOffset = 0
    if (leftPosition === 'center') leftOffset = (width - w * ratio) / 2
    if (leftPosition === 'right') leftOffset = width - w * ratio
    if (topPosition === 'top') topOffset = 0
    if (topPosition === 'center') topOffset = (height - h * ratio) / 2
    if (topPosition === 'bottom') topOffset = height - h * ratio

    return (
      <div
        className={cx(s.element, 'overflowBlockFocusedImage', className)}
        style={{
          minHeight: `${minHeight}px`,
          maxHeight: `${maxHeight}px`
        }}
        ref={this.ref}
      >
        {children}
        <ReactResizeDetector onResize={this.handleResizeBackground}>
          <div
            className={cx(s.elementBackground)}
            style={{
              backgroundImage: `url(${src})`,
              backgroundPosition: `${this.state.backgroundLeft + -l * ratio + leftOffset}px ${this.state.backgroundTop + -t * ratio + topOffset}px`,
              backgroundSize: `${W * ratio}px ${H * ratio}px`,
              backgroundRepeat: 'no-repeat'
            }}
            ref={this.backgroundRef}
          />
        </ReactResizeDetector>
      </div>
    )
  }
}

const wrappedFocusedImage = withResizeDetector(FocusedImage)
wrappedFocusedImage.displayName = 'FocusedImage'

export default wrappedFocusedImage
