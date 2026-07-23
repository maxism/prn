import React, { ChangeEventHandler, Component, MouseEventHandler, ReactElement, ReactNode, RefObject } from 'react'
import cx from 'classnames'

import Icon from '../Icon/Icon'
import Tooltip from '../Tooltip/Tooltip'

import s from './InputText.module.scss'
import keyboardKey from '../../lib/keyboardKey'
import {IIcon} from '../Icon/Icons'

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
   * Завершено, подтверждено
   */
  complete?: string | boolean
  /**
   * Предупреждение
   */
  warning?: string | boolean
  /**
   * Ошибка
   */
  error?: string | boolean
  /**
   * Является ли поле ввода не активным
   */
  disabled?: boolean
  /**
   * Обработчик onChange, вызывается при изменении значения
   */
  onChange?: ChangeEventHandler<HTMLInputElement>
  /**
   * Обработчик onFocus, вызывается при установке фокуса
   */
  onFocus?: ChangeEventHandler<HTMLInputElement>
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
   * Маленький размер
   */
  small?: boolean
  /**
   * Иконка
   */
  icon?: IIcon | string
  /**
   * Кнопка поиска
   */
  onSubmit?: MouseEventHandler
  /**
   * Обработчик Enter
   */
  onKeyEnter?: MouseEventHandler
  /**
   * Состояние загрузки
   */
  loading?: boolean
  /**
   * Фокус при изменении поиска
   */
  changingFocus?: boolean
  /**
   * Белое поле ввода с обводкой для лендинга
   */
  landing?: boolean
  /**
   * Белое поле ввода без обводки (для серых фонов / сервисов)
   */
  white?: boolean
  /**
   * Кастомный стиль
   */
  className?: ReactNode
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

  componentDidUpdate (prevProps: Readonly<IProps>): void {
    if (this.props.changingFocus && (this.props.value !== prevProps.value)) this.focus()
  }

  focus = () => {
    setTimeout(() => {
      if ((this.props.changingFocus || this.state.focus) && !this.props.disabled && this.ref.current) this.ref.current.focus()
    }, 100)
  }

  handleClick = (e) => {
    this.setState({ focus: true })
    this.focus()
    if (this.props.onFocus) this.props.onFocus(e)
  }

  handleChange = (e) => {
    this.props.onChange(e)
  }

  handleFocus = () => {
    this.setState({ focus: true })
    this.focus()
  }

  handleBlur = (e) => {
    this.setState({ focus: false })
    if (this.props.onBlur) {
      setTimeout(() => { this.props.onBlur(e) }, 100)
    }
  }

  handleClear = (e) => {
    e.target.value = ''
    this.props.onChange(e)
  }

  handleSubmit = (e) => {
    if (this.props.onSubmit ) this.props.onSubmit(e)
    e.stopPropagation()
  }

  handleKeyDown = (e) => {
    if (this.props.onKeyEnter && keyboardKey.getCode(e) === keyboardKey.Enter) {
      this.props.onKeyEnter(e)
      e.stopPropagation()
    }
    if (this.props.onSubmit && keyboardKey.getCode(e) === keyboardKey.Enter) {
      this.handleSubmit(e)
      e.stopPropagation()
    }
  }

  render (): JSX.Element {
    const {
      name, type, readOnly, value, complete, warning, error, disabled, label, children, big, small, icon, loading, onSubmit, landing, white, className
    } = this.props
    const { focus } = this.state
    const filled = Boolean(String(value)?.length)

    const classes = cx(s.container, {
      [s.disabled]: disabled,
      [s.focus]: focus,
      [s.small]: small,
      [s.big]: big,
      [s.complete]: complete,
      [s.warning]: warning,
      [s.error]: error,
      [s.filled]: filled,
      [s.landing]: landing,
      [s.white]: white
    }, className)

    return (
      <div className={s.element}>
        <div className={classes} onClick={e => !disabled ? this.handleClick(e) : {}}>

          {icon && <Icon className={s.icon} icon={loading ? 'loader' : icon}/>}

          <div className={s.input}>
            <span className={s.label}>{label}</span>
            <input
              className={s.text}
              placeholder=''
              id={name}
              name={name}
              value={String(value)}
              ref={this.ref}
              onChange={this.handleChange}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              readOnly={readOnly}
              disabled={disabled}
              autoComplete='off'
              onKeyDown={this.handleKeyDown}
              type={type}
            />
          </div>

          <div className={s.icons}>
            {!big && complete && !warning && !error && <Icon className={s.iconStatus} icon='complete' />}
            {!big && warning && !error && <Tooltip trigger={<Icon className={s.iconStatus} icon='warning' />} text={[`${warning}`]} />}
            {!big && error && <Tooltip trigger={<Icon className={s.iconStatus} icon='warning' />} text={[`${error}`]} />}
            {!disabled && filled && !readOnly && <Icon className={s.iconClear} icon='cross' onClick={this.handleClear} />}

            {/*{!big && warning && !error && <Tooltip disabled={complete === true} trigger={<Icon className={cx(s.icon, s.fieldIcon)} icon='warning' />}>{warning}</Tooltip>}*/}
            {/*{!big && error && <Tooltip red disabled={complete === true} trigger={<Icon className={cx(s.icon, s.fieldIcon)} icon='warning' />}>{error}</Tooltip>}*/}
          </div>

          {onSubmit && <div className={s.button} onClick={this.handleSubmit}>
            <Icon className={s.iconArrow} icon='arrow_right' />
          </div>}

        </div>
        {children}
      </div>
    )
  }
}

export default InputText
