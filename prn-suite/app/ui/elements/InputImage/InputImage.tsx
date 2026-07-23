import React, { ChangeEventHandler, Component, ReactElement } from 'react'

import './InputImage.scss'
import Image from '../Image/Image'
import APIClient from '../../../lib/APIClient'
import Uuid from '../../behaviors/Uuid/Uuid'

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
   * Подпись
   */
  label?: string
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
  static defaultProps = {
    value: ''
  }

  state = {
    uuid: Uuid()
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

    return (
      <div className='input-image'>
        <label htmlFor={this.state.uuid} className='input-image__label'>
          <Image src={value} className='input-image__image' />
        </label>
        <input
          id={this.state.uuid}
          type='file'
          accept='.jpg, .jpeg, .png'
          name={name}
          onChange={this.handleChange}
          className='file-upload__input'
        />
      </div>
    )
  }
}

export default InputImage
