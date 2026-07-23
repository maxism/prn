import React, { Component, MouseEventHandler } from 'react'
import cx from 'classnames'
import ISocialType from '../../../interfaces/ISocialType'

import Icon from '../Icon/Icon'

import './SocialButton.scss'

interface IProps {
  /**
   * Социальная сеть
   */
  socialType: ISocialType
  /**
   * Активная кнопка
   */
  active?: boolean
  /**
   * Обработчик клика
   */
  onClick: MouseEventHandler
}

/**
 * Элемент SocialButton
 * Кнопка-иконка
 */
class SocialButton extends Component<IProps> {
  render (): JSX.Element {
    const { socialType, onClick, active } = this.props

    const classes = cx('s-button', {
      's-button--active': active
    })

    return (
      <button className={classes} onClick={onClick}>
        {!active && <Icon className='s-button__icon' icon={`${socialType === 'ALL' ? 'select_dashboard' : socialType.toLowerCase()}`} />}
        {active && <Icon className='s-button__icon' icon={`${socialType === 'ALL' ? 'select_dashboard' : socialType.toLowerCase().concat('_colored')}`} />}
      </button>
    )
  }
}

export default SocialButton
