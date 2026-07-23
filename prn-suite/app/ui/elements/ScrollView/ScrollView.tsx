import React, {Children, Component, ReactNode, RefObject} from 'react'
import { findDOMNode } from 'react-dom'
import ScrollArea from 'react-scrollbar'
import cx from 'classnames'
import { throttle } from 'lodash'
import { withResizeDetector } from 'react-resize-detector'

import './ScrollView.scss'

interface IProps {
  children: ReactNode
  horizontal?: boolean
  padding?: boolean
  /**
   * Прокидывается только withResizeDetector
   */
  height?: number
  className?: string
  /**
   * Минимальная высота, но не менее чем контент
   */
  minHeight?: number
  /**
   * Максимальная высота, но не более чем контент
   */
  maxHeight?: number
  /**
   * Автоматическая прокрутка вконец списка
   */
  autoScrolling?: boolean
}

/**
 * Компонент ScrollView
 */
class ScrollView extends Component<IProps> {
  private ref: RefObject<any>

  static defaultProps = {
    horizontal: false,
    padding: false
  }

  state = {
    children: null,
    isFixing: true,
    contentHeight: 0
  }

  constructor (props) {
    super(props)
    this.ref = React.createRef()
  }

  componentDidUpdate (prevProps): void {
    if (prevProps.children !== this.props.children || prevProps.height !== this.props.height) {
      if (this.state.isFixing) {
        this.handleRefresh()
      }

      if (this.ref.current) {
        const domRef = findDOMNode(this.ref.current)
        // @ts-ignore
        const element = domRef && domRef.getElementsByClassName('active')[0]
        if (element) {
          const mainTop = element.parentNode.getBoundingClientRect().top
          const mainHeight = element.parentNode.parentNode.getBoundingClientRect().height
          const elementTop = element.getBoundingClientRect().top

          setTimeout(() => {
            if (prevProps.height !== this.props.height) {
              this.ref.current && this.ref.current.scrollArea.scrollYTo(elementTop - mainTop - mainHeight / 2)
            }
          }, 0)
        }
      }
    }
  }

  handleRefresh = () => {
    if (this.props.autoScrolling && this.state.isFixing) {
      setTimeout(() => {
        this.ref.current.scrollArea.scrollYTo(this.state.contentHeight + 1000)
        this.setState({ isFixing: true })
      }, 0)
    }
  }

  handleScroll = value => {
    const isFixing = Boolean(value.realHeight - value.topPosition <= value.containerHeight)
    const contentHeight = value.realHeight || this.state.contentHeight
    if (this.state.isFixing !== isFixing || this.state.contentHeight !== contentHeight) {
      this.setState({ isFixing, contentHeight })
    }
  }

  getHeight = () => {
    const { minHeight, maxHeight } = this.props
    if (!minHeight && !maxHeight) return 'auto'

    let height = this.state.contentHeight
    if (minHeight) height = Math.max(minHeight, height)
    if (maxHeight) height = Math.min(maxHeight, height)

    return `${height}px`
  }

  render (): JSX.Element {
    const { children, horizontal, height, className } = this.props

    if (this.ref.current && this.ref.current.focusContent) this.ref.current.focusContent = () => { /**/ }

    return (
      <ScrollArea
        onClick={this.handleRefresh}
        ref={this.ref}
        className={cx('scroll-view', className)}
        contentClassName={cx('scroll-view__content', { 'scroll-view__content--full-width': !horizontal })}
        horizontal={horizontal}
        stopScrollPropagation
        onScroll={throttle(this.handleScroll, 100)}
        style={{ height: this.getHeight() }}
        contentStyle={{ minHeight: this.props.padding ? height : 0 }}
      >
        {this.props.padding && <div className='scroll-view__padding' />}
        {children}
      </ScrollArea>
    )
  }
}

const wrappedScrollView = withResizeDetector(ScrollView)
wrappedScrollView.displayName = 'ScrollView'

export default wrappedScrollView
