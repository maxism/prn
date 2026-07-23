import React, { ChangeEventHandler, Component, createRef, ReactNode, RefObject } from 'react'
import cx from 'classnames'
import autosize from 'autosize'
import getLineHeight from 'line-height'
import MobileDetect from 'mobile-detect/mobile-detect'
import keyboardKey from '../../lib/keyboardKey'
import ScrollView from '../ScrollView/ScrollView'

import s from './Textarea.module.scss'

interface IProps {
  /**
   * Текст
   */
  value?: string
  /**
   * Аттрибут Name
   */
  name?: string
  /**
   * Плейсхолдер
   */
  placeholder?: string
  /**
   * Минимальное количество строк в поле
   */
  minRows?: number
  /*
   * Максимальное количество строк в поле
   */
  maxRows?: number
  /**
   * Обработчик onFocus, вызывается при установке фокуса
   */
  focus?: boolean
  /**
   * Обработчик onChange
   */
  onChange?: ChangeEventHandler<HTMLInputElement>
  /**
   * Обработчик onBlur, вызывается при потере фокуса
   */
  onBlur?: ChangeEventHandler<HTMLInputElement>
  /**
   * Обработчик onFocus, вызывается при установке фокуса
   */
  onFocus?: ChangeEventHandler<HTMLInputElement>
  /**
   * Обработчик onEnter, вызывается при нажатии на Enter
   */
  onEnter?: ChangeEventHandler<HTMLInputElement>
  /**
   * children
   */
  children?: ReactNode
  /**
   * Если элемент на сером фоне
   */
  white?: ReactNode
  /**
   * Является ли поле ввода не активным
   */
  disabled?: boolean
}

interface IStates {
  focus: boolean
  height: number
  contentHeight: number
  minHeight?: number
  maxHeight?: number
}

/**
 * Элемент Textarea
 */
export default class Textarea extends Component<IProps, IStates> {
  private ref: RefObject<any> = null

  constructor (props) {
    super(props)
    this.ref = createRef()
  }

  static defaultProps = {
    maxRows: 5,
    minRows: 1
  }

  state = {
    focus: false,
    height: this.props.minRows * 24,
    contentHeight: this.props.minRows * 24
  }

  handleKeyDown = e => {
    if (this.props.onEnter && keyboardKey.getCode(e) === keyboardKey.Enter && !e.shiftKey) this.props.onEnter(e)
  }

  handleOnFocus = e => {
    this.setState({ focus: true })

    if (this.props.onFocus) this.props.onFocus(e)
  }

  handleOnBlur = e => {
    this.setState({ focus: false })

    if (this.props.onBlur) this.props.onBlur(e)
  }

  handleChange = e => {
    const { onChange, minRows, maxRows } = this.props
    onChange(e)
    this.getHeight(minRows, maxRows, e.target)
  }

  updateLineHeight = () => {
    if (this.ref.current) {
      return getLineHeight(this.ref.current)
    }
  }

  getHeight = (minRows, maxRows, el) => {
    if (el) {
      autosize.update(el)

      const lineHeight = this.updateLineHeight()

      const minHeight = lineHeight * minRows
      const maxHeight = lineHeight * maxRows

      let contentHeight = this.ref.current.scrollHeight
      let height = contentHeight

      if (contentHeight < minHeight) height = minHeight
      if (contentHeight > maxHeight) height = maxHeight

      if (this.state.height !== height) this.setState({ height, contentHeight })
    }
  }

  componentDidMount (): void {
    const { focus, minRows, maxRows } = this.props
    const md = new MobileDetect(window.navigator.userAgent)
    const isMobile = md.mobile() || md.phone() || md.tablet()
    if (!this.ref) return

    if (focus && !isMobile) this.ref.current?.focus()
    setTimeout(
      () => this.ref.current && autosize(this.ref.current)
    )
    this.getHeight(minRows, maxRows, this.ref.current)
  }

  componentDidUpdate (): void {
    this.ref.current && autosize.update(this.ref.current)
  }

  render (): JSX.Element {

    const { value, placeholder, name, children, white, disabled } = this.props
    const { focus, height, contentHeight } = this.state
    const classes = cx(s.element, {
      [s.focus]: focus,
      [s.white]: white
    })

    return (
      <div className={classes} onClick={() => this.ref.current?.focus()}>
        <div className={s.container}>
          <ScrollView minHeight={height} maxHeight={height}>
            <textarea
              onKeyDown={this.handleKeyDown}
              rows={1}
              name={name}
              onFocus={this.handleOnFocus}
              onBlur={this.handleOnBlur}
              ref={this.ref}
              className={s.text}
              placeholder={placeholder}
              onChange={this.handleChange}
              value={value}
              style={{ height: contentHeight }}
              disabled={disabled}
            />
          </ScrollView>
          {children}
        </div>
      </div>
    )
  }
}
