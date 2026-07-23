import React, { ChangeEventHandler, Component, ReactElement } from 'react'
import Uuid from '../Uuid/Uuid'

import s from './InputImage.module.scss'
import APIClient from '../../lib/APIClient'
import Image from '../Image/Image'

type Type = 'text' | 'password'

interface IProps {
  /**
   * Аттрибут name
   */
  name?: string
  /**
   * Значение
   */
  value?: string
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
   * Обработчик onBlur, вызывается при потере фокуса
   */
  onBlur?: ChangeEventHandler<HTMLInputElement>
  /**
   * Подпись
   */
  label?: string
  /**
   * Тип
   */
  type?: Type,
  /**
   * Readonly
   */
  readOnly?: boolean
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
  icon?: string
  /**
   * Токен для загрузки файла
   */
  uploadToken?: string
}

/**
 * Элемент InputImage
 * Поле для выбора картинки.
 * Загружает картинку на cdn
 */
class InputImage extends Component<IProps> {
  state = {
    uuid: Uuid()
  }

  static defaultProps = {
    value: '',
    type: 'text'
  }

  constructor (props) {
    super(props)
  }

  handleChange = async (e) => {
    const imageUrl = await APIClient.uploadToCDN(e.target.files[0], this.props.uploadToken)

    e.target = {
      value: imageUrl
    }
    if (this.props.onChange) this.props.onChange(e)
  }

  handleClear = (e) => {
    e.target.value = ''
    this.props.onChange(e)
  }

  render (): JSX.Element {
    const {
      name, value
    } = this.props

    // const classes = cx(s.container, {
    //   [s.disabled]: disabled,
    //   [s.focus]: focus,
    //   [s.big]: big,
    //   [s.error]: error,
    //   [s.filled]: filled,
    //   [s.icon]: icon
    // })

    return (
      <div className={s.element}>
        <label htmlFor={this.state.uuid} className={s.label}>
          <Image src={value} className={s.image} />
        </label>
        <input
          id={this.state.uuid}
          type='file'
          accept=".jpg, .jpeg, .png"
          name={name}
          onChange={this.handleChange}
          className='file-upload__input'
        />
      </div>
    )
  }
}

export default InputImage
