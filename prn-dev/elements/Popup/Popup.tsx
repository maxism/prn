import React, {
  Component,
  cloneElement,
  Children,
  ReactNode,
  MouseEventHandler,
  RefObject,
  ReactElement,
  isValidElement
} from 'react'
import cx from 'classnames'
import { throttle } from 'lodash'
import eventStack from '../../lib/eventStack'
import uuid from '../Uuid/Uuid'
import ScrollView from '../ScrollView/ScrollView'

import s from './Popup.module.scss'
import Loader from '../Loader/Loader'
import PopupButton from './PopupButton'
import PopupDivider from './PopupDivider'

type Sizes = 'auto' | 'superSmall' | 's' | 'm' | 'l'

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
   * Открывается вверх
   */
  up?: boolean
  /**
   * Открыть посередине
   */
  center?: boolean
  /**
   * Открывается справа
   */
  right?: boolean
  /**
   * Заполнить всю высоту триггера
   */
  triggerFillHeight?: boolean
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
  maxWidth?: number | boolean
  /**
   * Заблокированный
   */
  disabled?: boolean
  /**
   * Состояние загрузки
   */
  loading?: boolean
  /**
   * Встраивается в текст
   */
  inline?: boolean
  /**
   * Разворачивать на полный экран для мобильного
   */
  mobileFull?: boolean
  /**
   * Показывать шапку
   */
  header?: boolean
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
    size: 'auto'
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

  componentDidUpdate (_, prevState: Readonly<IState>, __): void {
    if (prevState.isOpen !== this.state.isOpen) this.handleUpdate()
  }

  handleToggle = (e) => {
    if (this.props.disabled) return

    this.setState({ isOpen: !this.state.isOpen })
    if (!this.state.isOpen && this.props.onOpen) this.props.onOpen(e)
    if (this.state.isOpen && this.props.onClose) this.props.onClose(e)

    e.stopPropagation()
    e.preventDefault()
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
      const triggerRect = this.containerEl.current?.getBoundingClientRect()
      if (!triggerRect) return

      let topSpace = triggerRect.top - 60 - 10
      let bottomSpace = window.innerHeight - triggerRect.top - triggerRect.height - 30 - 10

      let isUp = topSpace > bottomSpace
      let height = Math.max(topSpace, bottomSpace)

      if (this.state.height !== height || this.state.isUp !== isUp) {
        this.setState({ height, isUp })
      }
      // if (this.props.mobileFull) document.body.classList.add('no-scroll')
    } else {
      // if (this.props.mobileFull) document.body.classList.remove('no-scroll')
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
    let { trigger, children, size, center, right, triggerFillHeight, scrolling, maxHeight, maxWidth, loading, inline, mobileFull, header } = this.props
    const { isOpen } = this.state

    const classes = cx(s.element, {
      [s.fillHeight]: triggerFillHeight,
      [s.inline]: inline
    })

    const listClasses = cx(s.list, {
      [s.open]: isOpen,
      [s.mobileFull]: mobileFull,
      [s.header]: header,
      [s.up]: this.state.isUp,
      [s.auto]: size === 'auto',
      [s.s]: size === 's',
      [s.m]: size === 'm',
      [s.l]: size === 'l',
      [s.center]: center,
      [s.right]: right
    })

    // @ts-ignore Для триггера с одним элементом возвращаем триггер и прокидываем прямо на него события
    if (Children.toArray(children).length === 1 && Children.toArray(children)[0].type.toString() !== ScrollView.toString()) {
      // @ts-ignore Проверка на вложенность в Fragment и раскрытие
      if (Children.toArray(children)[0].type.toString() === React.Fragment.toString()) children = Children.toArray(Children.toArray(children)[0].props.children)

      // @ts-ignore
      const childProps = Children.toArray(children)[0].props
      return cloneElement(trigger, { to:childProps.to, onClick: childProps.onClick })
    }

    return (
      <div
        className={classes}
        ref={this.containerEl}
        style={{ width: maxWidth === true ? '100%' : 'auto' }}
      >
        {trigger && cloneElement(trigger, { onClick: this.handleToggle, dropdown: true, active: isOpen })}
        <div
          className={listClasses}
          ref={this.listEl}
          style={{ maxHeight: scrolling && (Math.min(this.state.height, maxHeight) || maxHeight), maxWidth: Number(maxWidth) || undefined }}
        >
          {mobileFull && !header && <div className={s.backButton}>
            <PopupButton onClick={this.handleToggle} icon='arrow_left'>Назад</PopupButton>
            <PopupDivider />
          </div>}
          {loading && <Loader />}
          {/* @ts-ignore */}
          {!loading && scrolling && <ScrollView maxHeight={maxHeight}>{this.wrapAutoClose(children)}</ScrollView>}
          {!loading && !scrolling && this.wrapAutoClose(children)}
        </div>
      </div>)
  }
}
