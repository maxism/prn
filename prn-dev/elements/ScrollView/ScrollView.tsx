import React, { Component, ReactNode, RefObject } from 'react'
import cx from 'classnames'
import { withResizeDetector } from 'react-resize-detector'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { findDOMNode } from 'react-dom'
import AppUtil from '../../utils/AppUtil'

import s from './ScrollView.module.scss'

interface IProps {
  children: ReactNode
  /**
   * Добавить отступ сверху, чтобы прижать контент вниз
   */
  padding?: boolean
  /**
   * Прокидывается только withResizeDetector
   */
  height?: number
  /**
   * Класс
   */
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
  /**
   * Показывает весь контент как есть, игнорируя данный компонент
   */
  ignoreScrollView?: boolean
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
    isFixing: true,
    scrolled: false
  }

  constructor (props) {
    super(props)
    this.ref = React.createRef()
  }

  handleScroll = ()=> {
    if (!this.state.scrolled) this.setState({ scrolled: true })
  }

  handleSync = (ps) => {
    if (ps) ps.update()
    if (!this.state.scrolled && AppUtil.isClientSide && this.ref.current) {
      // eslint-disable-next-line react/no-find-dom-node
      const domRef = findDOMNode(this.ref.current)

      const element = domRef && domRef.getElementsByClassName('active')[0]
      if (element) {
        const mainTop = domRef.getBoundingClientRect().top
        const mainHeight = domRef.getBoundingClientRect().height
        const elementTop = element.getBoundingClientRect().top

        // console.log('mainTop', mainTop)
        // console.log('mainHeight', mainHeight)
        // console.log('elementTop', elementTop)

        domRef.scrollTo(0, elementTop - mainTop - mainHeight / 2)
      } else domRef.scrollTo(0, 0)
    }
  }

  render (): JSX.Element {
    const { children, height, minHeight, maxHeight, className, ignoreScrollView } = this.props

    if (ignoreScrollView) return <>{children}</>

    return (
      <PerfectScrollbar
        ref={this.ref}
        className={cx(s.element, className)}
        style={{ maxHeight, minHeight: this.props.padding ? height : minHeight }}
        onScrollY={this.handleScroll}
        // @ts-ignore
        onSync={this.handleSync}
        options={{
          wheelPropagation: false,
          swipeEasing: true
        }}
      >
        {this.props.padding && <div className={s.padding} />}
        {children}
      </PerfectScrollbar>
    )
  }
}

const wrappedScrollView = withResizeDetector<IProps>(ScrollView)
wrappedScrollView.displayName = 'ScrollView'

export default wrappedScrollView
