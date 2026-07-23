import React, { ChangeEventHandler, Component, createRef, MouseEventHandler, ReactNode, RefObject } from 'react'
import cx from 'classnames'
import autosize from 'autosize'
import getLineHeight from 'line-height'
import MobileDetect from 'mobile-detect/mobile-detect'

import keyboardKey from '../../../lib/keyboardKey'

import './Textarea.scss'
import ScrollView from '../ScrollView/ScrollView'

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
}

interface IStates {
  focus: boolean
  height: number
  minHeight: number
  maxHeight: number
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
    height: 0,
    minHeight: 0,
    maxHeight: 0
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

      this.setState({
        minHeight: lineHeight * minRows,
        maxHeight: lineHeight * maxRows
      })
    }
  }

  componentDidMount (): void {
    const { focus, minRows, maxRows } = this.props
    const md = new MobileDetect(window.navigator.userAgent)
    const isMobile = md.mobile() || md.phone() || md.tablet()
    if (!this.ref) return

    if (focus && !isMobile) this.ref.current.focus()
    setTimeout(
      () => this.ref.current && autosize(this.ref.current)
    )
    this.getHeight(minRows, maxRows, this.ref.current)
  }

  componentDidUpdate (): void {
    this.ref.current && autosize.update(this.ref.current)
  }

  render (): JSX.Element {
    const { value, placeholder, name, children } = this.props
    const { focus, minHeight, maxHeight } = this.state
    const classes = cx('textarea', {
      'textarea--focus': focus
    })

    return (
      <div className={classes} onClick={() => this.ref.current.focus()}>
        <div className='textarea__container'>
          <ScrollView minHeight={minHeight} maxHeight={maxHeight}>
            <textarea
              onKeyDown={this.handleKeyDown}
              rows={1}
              name={name}
              onFocus={this.handleOnFocus}
              onBlur={this.handleOnBlur}
              ref={this.ref}
              className='textarea__text'
              placeholder={placeholder}
              onChange={this.handleChange}
              value={value}
            />
          </ScrollView>
          {children}
        </div>
      </div>
    )
  }
}
