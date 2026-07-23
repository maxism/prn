import React, { ChangeEventHandler, Component, ReactElement, RefObject } from 'react'
import cx from 'classnames'

import './InputText.scss'
import Icon from '../Icon/Icon'
import Tooltip from '../../modules/Tooltip/Tooltip'
import { IIcon } from '../Icon/Icons'

type Type = 'text' | 'password'

interface IProps {
  /**
   * Аттрибут name
   */
  name?: string
  /**
   * Значение
   */
  value: string
  /**
   * Ошибка
   */
  error?: string
  /**
   * Является ли поле ввода не активным
   */
  disabled?: boolean
  /**
   * Обработчик onChange, вызывается при изменении значения
   */
  onChange?: ChangeEventHandler<HTMLInputElement>
  /**
   * Обработчик onClear, вызывается при нажатии на кнопку очистки значения
   */
  onClear?: ChangeEventHandler<HTMLInputElement>
  /**
   * Обработчик onBlur, вызывается при потере фокуса
   */
  onBlur?: ChangeEventHandler<HTMLInputElement>
  /**
   * Подпись
   */
  label: string
  /**
   * Тип
   */
  type?: Type,
  /**
   * Readonly
   */
  readOnly?: boolean
  /**
   * Фокус по-умолчанию при создании
   */
  focus?: boolean
  /**
   * Элементы
   */
  children?: ReactElement
  /**
   * Большой размер
   */
  big?: boolean
  /**
   * Иконка
   */
  icon?: IIcon | string
  /**
   * Обработчик Enter
   */
  onEnter?: ChangeEventHandler<HTMLInputElement>
  /**
   * Классы
   */
  className?: string
}

/**
 * Элемент InputText
 * Поле для ввода текста
 */
class InputText extends Component<IProps> {
  private ref: RefObject<any>

  static defaultProps = {
    value: '',
    type: 'text'
  }

  state = {
    focus: this.props.focus && !this.props.disabled
  }

  constructor (props) {
    super(props)
    this.ref = React.createRef()

    this.focus()
  }

  componentDidUpdate (prevProps: Readonly<IProps>, prevState: Readonly<{}>, snapshot?: any): void {
    if (this.props.focus !== prevProps.focus) this.setState({ focus: true })

    this.focus()
  }

  focus = () => {
    setTimeout(() => {
      if (this.state.focus && !this.props.disabled) this.ref.current.focus()
    }, 100)
  }

  handleClick = () => {
    this.setState({ focus: true })
    this.focus()
  }

  handleFocus = () => {
    this.setState({ focus: true })
    this.focus()
  }

  handleBlur = (e) => {
    this.setState({ focus: false })
    if (this.props.onBlur) this.props.onBlur(e)
  }

  handleClear = (e) => {
    e.target.value = ''
    this.props.onChange(e)
    if (this.props.onClear) this.props.onClear(e)
  }

  handleKeyPress = (e) => {
    if(this.props.onEnter && e.key === 'Enter') this.props.onEnter(e)
  }

  render (): JSX.Element {
    const {
      name, type, readOnly, value, error, disabled,
      label, onChange, children,
      big, icon, className
    } = this.props
    const { focus } = this.state
    const filled = Boolean(String(value)?.length)

    const classes = cx('input-text__container', {
      'input-text--disabled': disabled,
      'input-text--focus': focus,
      'input-text--big': big,
      'input-text--error': error,
      'input-text--filled': filled,
      'input-text--icon': icon
    }, className)

    return (
      <div className='input-text'>
        <div className={classes} onClick={!disabled && this.handleClick} onKeyPress={this.handleKeyPress}>
          {icon && <Icon className='input-text__field-icon' icon={icon}/>}
          <span className='input-text__label'>{label}</span>
          <input
            className='input-text__text'
            placeholder=''
            id={name}
            name={name}
            value={String(value)}
            ref={this.ref}
            onChange={onChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            type={type}
            readOnly={readOnly}
            disabled={disabled}
            autoComplete='off'
          />
          <div className='input-text__icons'>
            {!disabled && filled && !readOnly && <Icon className='input-text__icon input-text__icon-clear' icon='control_delete' onClick={this.handleClear} />}
            {!big && error && <Tooltip red trigger={<Icon className='input-text__icon input-text__icon-error' icon='tariff_promise' />}>{error}</Tooltip>}
          </div>
        </div>
        {children}
      </div>
    )
  }
}

export default InputText
