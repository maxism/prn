import React, { Children, Component, MouseEventHandler, ReactElement, ReactNode, cloneElement } from 'react'
import cx from 'classnames'
import Tippy from '@tippyjs/react'
import 'tippy.js/animations/scale.css';
import Icon from '../../elements/Icon/Icon'
import ButtonText from '../../elements/ButtonText/ButtonText'

import s from  './Tooltip.module.scss'
import AppUtil from '../../utils/AppUtil'

interface IProps {
  /**
   * Содержимое тултипа
   */
  children?: ReactNode | string
  /**
   * Элемент, к которому привязан тултип
   */
  trigger: ReactElement
  /**
   * Открыт ли
   */
  open?: boolean
  /**
   * Обработчик onRequestClose
   */
  onRequestClose?: () => void
  /**
   * Отключён ли элемент
   */
  disabled?: boolean
  /**
   * Обработчик для прокидывания клика
   */
  onClick?: MouseEventHandler
  /**
   * Нужна ли кнопка закрытия
   */
  close?: boolean
  /**
   * Заголовок подсказки
   */
  title?: string
  /**
   * Текст подсказки
   */
  text?: ReactNode
  /**
   * Текст описания
   */
  description?: ReactNode
  /**
   * Кнопка
   */
  button?: string
  /**
   * Обработчик клика по кнопке
   */
  buttonOnClick?: MouseEventHandler
  /**
   * Стиль подсказок для ошибок в полях
   */
  red?: boolean
  /**
   * Классы
   */
  className?: string
  /**
   * Показывать тултип с задержкой
   */
  delay?: boolean | number
}

/**
 * Модуль Tooltip
 */

class Tooltip extends Component<IProps> {
  static defaultProps = {
    delay: 0,
    hideDelay: 0
  }

  render (): JSX.Element {

    const {
      trigger, children, title, disabled, open, close, text, description, button, red,
      onRequestClose, onClick, className, buttonOnClick, delay
    } = this.props

    const classes = cx(s.element, className, {
      [s.red]: red,
      [s.disabled]: disabled
    })

    return (
      <Tippy
        interactive={true}
        animation='scale'
        duration={[200,200]}
        delay={[typeof delay == 'boolean' ? 500 : delay, 0]}
        disabled={disabled}
        visible={open}
        onClickOutside={onRequestClose}
        allowHTML
        appendTo={AppUtil.isClientSide && document.getElementById('__next')}
        content={
          <div className={classes} onClick={e => { e.stopPropagation(); e.preventDefault(); }}>
            {title && <div className={s.top}>
              <span className={s.title}>{title}</span>
              {close && <Icon className={s.icon} icon='error'/>}
            </div>}
            {text && Children.map(text, item => <span className={s.text}>{item}</span>)}
            {!text && children}
            {description && <div className={s.description}>
              {Children.map(description, item => <span className={s.descriptionItem}>{item}</span>)}
            </div>}
            {button && <div className={s.button}>
              <ButtonText onClick={buttonOnClick}>{button}</ButtonText>
            </div>}
          </div>}
      >
        <div className={s.wrapper}>{onClick ? cloneElement(trigger, { onClick: e => { onClick(e); e.stopPropagation(); e.preventDefault(); } }) : trigger}</div>
      </Tippy>
    )
  }
}

export default Tooltip
