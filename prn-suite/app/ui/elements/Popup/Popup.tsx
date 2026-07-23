import React, {
  Component,
  cloneElement,
  Children,
  ReactNode,
  MouseEventHandler,
  RefObject,
  ReactElement, isValidElement
} from 'react'
import cx from 'classnames'
import { throttle } from 'lodash'
import eventStack from '../../../lib/eventStack'
import uuid from '../../behaviors/Uuid/Uuid'
import ScrollView from '../ScrollView/ScrollView'

import './Popup.scss'

type Sizes = 'auto' | 'superSmall' | 'small' | 'middle' | 'big'

interface IProps {
  /**
   * Триггер
   */
  trigger?: ReactElement
  /**
   * children
   */
  children?: ReactNode
  /**
   * Фиксированный children
   */
  fixedChildren?: ReactNode
  /**
   * Открывается вверх
   */
  up?: boolean
  /**
   * Открывается справа
   */
  right?: boolean
  /**
   * Состояние открытия
   */
  open?: boolean
  /**
   * Размер
   */
  size?: Sizes
  /**
   * Обработчик открытия
   */
  onOpen?: MouseEventHandler
  /**
   * Обработчик закрытия
   */
  onClose?: MouseEventHandler
  /**
   * Прокручивающийся
   */
  scrolling?: boolean
  /**
   * Максимальная высота попапа
   */
  maxHeight?: number
  /**
   * Максимальная ширина попапа
   */
  maxWidth?: number
  /**
   * Заблокированный
   */
  disabled?: boolean
}

interface IState {
  isOpen?: boolean
  isUp?: boolean
  height?: number
}

/**
 * Блок Popup
 */
export default class Popup extends Component<IProps, IState> {
  private uuid: string
  private _throttleHandleUpdate: Function
  private containerEl: RefObject<any>
  private listEl: RefObject<any>

  static defaultProps = {
    size: 'middle'
  }

  state = {
    isOpen: false,
    isUp: this.props.up,
    height: 450
  }

  constructor (props) {
    super(props)
    this.uuid = uuid()
    this.containerEl = React.createRef()
    this.listEl = React.createRef()

    this._throttleHandleUpdate = throttle(this.handleUpdate, 100)

    eventStack.sub('mousedown', this.checkForOuterAction, 'Popup', this.uuid)
    eventStack.sub('touchstart', this.checkForOuterAction, 'Popup', this.uuid)
    eventStack.sub('scroll', this._throttleHandleUpdate, 'Popup', this.uuid)
    eventStack.sub('resize', this._throttleHandleUpdate, 'Popup', this.uuid)
  }

  static getDerivedStateFromProps (nextProps: IProps, prevState: IState): IState {
    if (nextProps.open !== undefined && nextProps.open !== prevState.isOpen) {
      return {
        isOpen: nextProps.open,
        height: 0
      }
    }

    return null
  }

  componentWillUnmount (): void {
    eventStack.unsub('mousedown', this.checkForOuterAction, 'Popup', this.uuid)
    eventStack.unsub('touchstart', this.checkForOuterAction, 'Popup', this.uuid)
    eventStack.unsub('scroll', this._throttleHandleUpdate, 'Popup', this.uuid)
    eventStack.unsub('resize', this._throttleHandleUpdate, 'Popup', this.uuid)
  }

  componentDidUpdate (prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {
    if (prevState.isOpen !== this.state.isOpen) this.handleUpdate()
  }

  handleToggle = (e) => {
    if (this.props.disabled) return

    this.setState({ isOpen: !this.state.isOpen })
    if (!this.state.isOpen && this.props.onOpen) this.props.onOpen(e)
    if (this.state.isOpen && this.props.onClose) this.props.onClose(e)
  }

  /**
   * Проверка эвента за пределами попапа и закрытие попапа
   * @param event
   */
  checkForOuterAction = event => {
    // console.log('this.containerEl.current', this.containerEl.current, this.containerEl.current.contains(event.target))
    // console.log('this.listEl.current', this.listEl.current, this.listEl.current.contains(event.target))
    const isOuterAction = !this.containerEl.current || !this.containerEl.current.contains(event.target) && !this.listEl.current.contains(event.target)
    // console.log('this.state.isOpen', this.state.isOpen)
    // console.log('isOuterAction', isOuterAction)
    if (this.state.isOpen && isOuterAction) {
      if (this.props.onClose) this.props.onClose(event)
      else this.setState({ isOpen: false })
    }
  }

  handleUpdate = () => {
    if (this.state.isOpen) {
      const triggerRect = this.containerEl.current.getBoundingClientRect()

      let topSpace = triggerRect.top - 60 - 10 - 60 - 10
      let bottomSpace = window.innerHeight - triggerRect.top - triggerRect.height - 30 - 10

      let isUp = topSpace > bottomSpace
      let height = Math.max(topSpace, bottomSpace)

      if (this.state.height !== height || this.state.isUp !== isUp) {
        this.setState({ height, isUp })
      }
    }
  }

  /**
   * Обертка для добавления автоматического закрытия Popup
   * Для элементов необходимо добавить параметр autoClosePopup
   *
   * @param children
   */

  wrapAutoClose = (children) => {
    return Children.map(children, child => {
      let childProps = {
        children: undefined,
        onClick: undefined
      }

      if (!child) return

      if (isValidElement(child)) {
        childProps.onClick = e => {
          // @ts-ignore
          if (child.props.autoClosePopup) {
            if (this.props.onClose) this.props.onClose(e)
            else this.setState({ isOpen: false })
          }
          // @ts-ignore
          if (child.props.onClick) child.props.onClick(e)
        }
      }
      if (child.props) {
        childProps.children = this.wrapAutoClose(child.props.children)

        return cloneElement(child, childProps)
      }

      return child
    })
  }

  render (): JSX.Element {
    let {
      trigger, children, fixedChildren, size, scrolling,
      maxHeight, maxWidth, right
    } = this.props
    const { isOpen } = this.state

    const classes = cx('popup__list', {
      'popup__list--open': isOpen,
      'popup__list--right': right,
      'popup__list--up': this.state.isUp,
      [`popup__list--${size}`]: true
    })

    return (
      <div className='popup' ref={this.containerEl}>
        {trigger && cloneElement(trigger, { onClick: this.handleToggle })}
        <div className={classes} ref={this.listEl} style={{ maxHeight: scrolling && (Math.min(this.state.height, maxHeight) || maxHeight), maxWidth }}>
          {fixedChildren}
          {scrolling && <ScrollView maxHeight={maxHeight}>{this.wrapAutoClose(children)}</ScrollView>}
          {!scrolling && this.wrapAutoClose(children)}
        </div>
      </div>)
  }
}
