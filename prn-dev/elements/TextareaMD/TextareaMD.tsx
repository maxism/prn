import React, { ChangeEventHandler, Component, createRef, ReactNode, RefObject } from 'react'
import cx from 'classnames'
import MobileDetect from 'mobile-detect/mobile-detect'
// import keyboardKey from '../../lib/keyboardKey'
import Editor from 'react-markdown-editor-lite'
import ReactMarkdown from 'react-markdown'
import 'react-markdown-editor-lite/lib/index.css'

import s from './TextareaMD.module.scss'
import APIClient from '../../lib/APIClient'

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
   * Высота
   */
  height?: number
  /**
   * Обработчик onFocus, вызывается при установке фокуса
   */
  focus?: boolean
  /**
   * Обработчик onChange
   */
  onChange: ChangeEventHandler<HTMLInputElement>
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
   * Токен для загрузки файла
   */
  uploadToken?: string
}

interface IStates {
  focus: boolean
  height: number
}

/**
 * Элемент Textarea
 */
export default class TextareaMD extends Component<IProps, IStates> {
  private ref: RefObject<any> = null

  constructor (props) {
    super(props)
    this.ref = createRef()
  }

  static defaultProps = {
    height: 50
  }

  state = {
    focus: false,
    height: 0
  }

  // handleKeyDown = e => {
  //   if (this.props.onEnter && keyboardKey.getCode(e) === keyboardKey.Enter && !e.shiftKey) this.props.onEnter(e)
  // }
  //
  // handleOnFocus = e => {
  //   this.setState({ focus: true })
  //
  //   if (this.props.onFocus) this.props.onFocus(e)
  // }
  //
  // handleOnBlur = e => {
  //   this.setState({ focus: false })
  //
  //   if (this.props.onBlur) this.props.onBlur(e)
  // }
  //
  // updateLineHeight = () => {
  //   if (this.ref.current) {
  //     return getLineHeight(this.ref.current)
  //   }
  // }
  //
  // getHeight = (minRows, maxRows, el) => {
  //   if (el) {
  //     autosize.update(el)
  //
  //     const lineHeight = this.updateLineHeight()
  //
  //     this.setState({
  //       minHeight: lineHeight * minRows,
  //       maxHeight: lineHeight * maxRows
  //     })
  //   }
  // }

  componentDidMount (): void {
    const { focus } = this.props
    const md = new MobileDetect(window.navigator.userAgent)
    const isMobile = md.mobile() || md.phone() || md.tablet()
    if (!this.ref) return

    if (focus && !isMobile) this.ref.current?.focus()
  }

  handleChange = ({ text }, e) => {
    if (!e) e = { target: { value: '' } }

    e.target.value = text
    this.props.onChange(e)
  }

  handleImageUpload = async (file, callback) => {
    const imageUrl = await APIClient.uploadToCDN(file, this.props.uploadToken)

    callback(imageUrl)
  }

  render (): JSX.Element {
    const { value } = this.props
    const { focus } = this.state
    const classes = cx(s.element, {
      [s.focus]: focus
    })

    return (
      <div className={classes}>
        <div className={s.container}>
          <Editor
            value={value}
            style={{
              height: "500px"
            }}
            config={{
              view: {
                menu: true,
                md: true,
                html: true
              },
              imageAccept: "image/jpeg,image/png,image/gif",
              syncScrollMode: []
            }}
            onChange={this.handleChange}
            onImageUpload={this.handleImageUpload}
            renderHTML={(text) => <ReactMarkdown>{text}</ReactMarkdown>}
          />
        </div>
      </div>
    )
  }
}
