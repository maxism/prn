import React, { Component, MouseEventHandler, ReactNode } from 'react'
import cx from 'classnames'

import Icon from '../Icon/Icon'
import { IIcon } from '../Icon/Icons'

import s from './PopupButton.module.scss'
import BaseButtonText from '../ButtonText/BaseButtonText'
import Text from '../Text/Text'
import Image from '../Image/Image'

interface IProps {
  /**
   * Иконка пункта меню (слева)
   */
  icon?: IIcon | string
  /**
   * Цвет иконки
   */
  iconColor?: string
  /**
   * Иконка контролов (справа)
   */
  control?: IIcon | string
  /**
   * Изображение у пункта меню
   */
  image?: string
  /**
   * Стиль пункта меню, если это проект
   */
  project?: boolean
  /**
   * Текст
   */
  children: ReactNode
  /**
   * Активное состояние
   */
  active?: boolean
  /**
   * Отключенное состояние
   */
  disabled?: boolean
  /**
   * Состояние ошибки или предупреждения
   */
  error?: boolean
  /**
   * Ссылка
   */
  to?: string
  /**
   * Обработчик клика
   */
  onClick?: MouseEventHandler
  /**
   * Используется для автоматического закрытия Popup
   */
  autoClosePopup?: boolean
  /**
   * Чекбокс
   */
  checked?: boolean
  /**
   * Обработчик нажатия на иконку-кнопку
   */
  onControl?: MouseEventHandler
  /**
   * Уровень вложенности списка
   */
  level?: number
  /**
   * Класс
   */
  className?: string
}

/**
 * Блок PopupButton
 */
export default class PopupButton extends Component<IProps> {

  render (): JSX.Element {
    const { icon, iconColor, control, image, project, children, active, disabled, error, to, onClick, checked, onControl, level, className } = this.props

    const classes = cx(s.element, {
      [s.active]: active,
      'active': active,
      [s.checked]: checked,
      [s.disabled]: disabled,
      [s.error]: error,
      [s.project]: project,
      [s.level0]: level === 0,
      [s.level1]: level === 1,
      [s.level2]: level === 2,
    }, className)

    return (
      <BaseButtonText className={classes} to={!disabled && to} onClick={!disabled && onClick || (() => {})} type='button'>

        {!!(icon || image || level !== undefined) && <div className={s.left}>
          {icon && <Icon className={s.icon} icon={icon} color={iconColor} />}
          {image && <Image className={s.image} src={image} alt='' border round />}
          <div className={s.level} />
          <div className={s.level} />
          <div className={s.level} />
        </div>}

        <Text className={s.text}>{children}</Text>

        {control && <Icon className={s.control} icon={control} onClick={onControl} />}

        {/*todo: Перенести галочку в ButtonText*/}
        {/*{checked && <Icon className={s.check} icon='complete' />}*/}

      </BaseButtonText>)
  }
}
