import React, { Component, MouseEventHandler } from 'react'
import cx from 'classnames'

import ButtonText from '../ButtonText/ButtonText'

import './NoData.scss'
import Icon from '../Icon/Icon'

export type TNoDataStyle = 'graph' | 'advanced'

interface IProps {
  /**
   * Сообщение, которое будем выводить
   */
  message?: string
  /**
   * Если нам нужно уточнение для сообщения
   */
  description?: string
  /**
   * Высота блока
   */
  size?: number
  /**
   * Выбор стиля плашки - с фоном, без фона, итд
   */
  style?: TNoDataStyle
  /**
   * Вертикальное выравнивание по центру
   */
  center?: boolean
  /**
   * Отображаем иконку загрузки
   */
  loading?: boolean
  /**
   * Добавляет кнопку действия
   */
  buttonLabel?: string
  /**
   * Ссылка кнопки
   */
  buttonLink?: string
  /**
   * Обработчик кнопки
   */
  buttonOnClick?: MouseEventHandler
}

/**
 * Элемент NoData.
 * Заглушка на случай, если нету даных
 */

class NoData extends Component<IProps> {
  render (): JSX.Element {
    const { message, size, style, description, buttonLabel, buttonOnClick, buttonLink, center, loading } = this.props

    const classes = cx('no-data', {
      [`no-data--${style}`]: style,
      'no-data--center': center
    })

    return (
      <div className={classes} style={{ height: `${size}px` }}>
        {loading && <Icon className='no-data__loading' icon='loading_dots'/>}
        <span className='no-data__label'>{message || 'Нет данных'}</span>
        {description && <span className='no-data__description'>{description}</span>}
        {buttonLabel && <ButtonText color='blue' onClick={buttonOnClick} to={buttonLink}>{buttonLabel}</ButtonText>}
      </div>
    )
  }
}

export default NoData
