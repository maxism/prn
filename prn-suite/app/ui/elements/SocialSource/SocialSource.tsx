import React, { Component, MouseEventHandler } from 'react'

import ISocialType from '../../../interfaces/ISocialType'

import './SocialSource.scss'
import SettingsButton from '../SettingsButton/SettingsButton'
import SocialDataUtil from '../../../utils/SocialDataUtil'

interface IProps {
  /**
   * Социальная сеть
   */
  socialType: ISocialType
  /**
   * Подключена или нет
   */
  active?: boolean
  /**
   * Обработчик клика
   */
  onClick: MouseEventHandler
  /**
   * Иконка уведомления
   */
  notificationIcon?: string
  /**
   * Вывод по 2 плашки в строку
   */
  double?: boolean
}

/**
 * Элемент SocialSource
 * Подключение профиля социальной сети
 */

class SocialSource extends Component<IProps> {
  render (): JSX.Element {

    const { socialType, active, onClick, notificationIcon, double } = this.props

    return (
        <SettingsButton
          double={double}
          icon={`${socialType.toLowerCase()}_colored`}
          active={active}
          onClick={onClick}
          title={SocialDataUtil.getSocialTypeName(socialType)}
          notificationIcon={notificationIcon}
          description={active ? 'Подключено' : 'Нужна авторизация через соцсеть'}
        />
    )
  }
}

export default SocialSource
