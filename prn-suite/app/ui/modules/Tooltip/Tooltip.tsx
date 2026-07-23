import React, { Children, cloneElement, Component, MouseEventHandler, ReactElement, ReactNode } from 'react'
import cx from 'classnames'

import { Tooltip as Tooltip2 } from 'react-tippy'

import './Tooltip.scss'
import Icon from '../../elements/Icon/Icon'
import ButtonText from '../../elements/ButtonText/ButtonText'

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
   * Позиция тултипа
   */
  position?: string
  /**
   * Расстояние от элемента
   */
  distance?: number
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
   * Задержка перед появлением
   */
  delay?: number
  hideDelay?: number
}

/**
 * Модуль Tooltip
 */

class Tooltip extends Component<IProps> {
  static defaultProps = {
    delay: 0,
    hideDelay: 250
  }

  render (): JSX.Element {

    const {
      trigger, children, position, title, disabled, distance, open, close, text, description, button, red, delay, hideDelay,
      onRequestClose, onClick, className, buttonOnClick
    } = this.props

    const classes = cx('tooltip', className, {
      'tooltip--red': red
    })

    return (
      // @ts-ignore
      <Tooltip2
        className='tooltip2'
        animateFill={false}
        hideOnClick={false}
        interactive={true}
        interactiveBorder={0}
        distance={5}
        delay={delay}
        hideDelay={hideDelay}
        disabled={disabled}
        unmountHTMLWhenHide
        html={
            <div className={classes}>
              {title && <div className='tooltip__top'>
                <span className='tooltip__title'>{title}</span>
                {close && <Icon className='tooltip__icon' icon='close_circle'/>}
              </div>}
              {text && Children.map(text, item => <span className='tooltip__text'>{item}</span>)}
              {!text && children}
              {description && <div className='tooltip__description'>
                {Children.map(description, item => <span className='tooltip__description-item'>{item}</span>)}
              </div>}
              {button && <div className='tooltip__button'>
                <ButtonText size='small' onClick={buttonOnClick}>{button}</ButtonText>
              </div>}
            </div>
        }
        open={open}
        onRequestClose={onRequestClose}
      >
        {onClick ? cloneElement(trigger, { onClick }) : trigger}
      </Tooltip2>
    )
  }
}

export default Tooltip
