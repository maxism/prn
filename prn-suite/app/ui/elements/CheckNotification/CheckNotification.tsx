import React, { Component, MouseEventHandler } from 'react'

import Icon from '../Icon/Icon'
import ButtonText from '../ButtonText/ButtonText'
import './CheckNotification.scss'
import { IIcon } from '../Icon/Icons'

interface IButton {
  buttonEnabled: boolean
  buttonLabel: string
  buttonClick: MouseEventHandler
}

interface IProps {
  icon?: IIcon | string
  iconColor?: 'red' | string
  title: string
  loading?: boolean
  description?: string
  button?: IButton
}

/**
 * Элемент CheckNotification
 */
class CheckNotification extends Component<IProps> {
  render (): JSX.Element {
    let { icon, iconColor, title, loading, description, button } = this.props

    if (iconColor === 'orange') iconColor = '#FF7501'
    if (iconColor === 'red') iconColor = '#DE0000'

    return (
      <div className='check-notification'>

        {loading && <Icon className='check-notification__loading' icon={'loading_dots_square'} />}

        {!loading && <Icon className='check-notification__icon' icon={icon || 'complete' } color={iconColor} />}

        <div className='check-notification__content'>
          <span className='check-notification__content-title'>{title}</span>
          <span className='check-notification__content-description'>{description}</span>
        </div>

        {button && button.buttonEnabled && <ButtonText color='blue' size='middle' onClick={button.buttonClick}>{button.buttonLabel}</ButtonText>}

      </div>
    )
  }
}

export default CheckNotification
