import React, { Component, MouseEventHandler } from 'react'

import './CommunityNotification.scss'
import Icon from '../Icon/Icon'
import ButtonText from '../ButtonText/ButtonText'

interface IButton {
  buttonEnabled: boolean
  buttonLabel: string
  buttonClick: MouseEventHandler
}

interface IProps {
  title: string
  loading?: boolean
  description?: string
  button?: IButton
}

interface IStates {
  open: boolean
}

/**
 * Элемент CommunityNotification.
 * Уведомление на странице о неполном сборе данных и других важных моментах в работе сервиса на страницах статистики.
 */
class CommunityNotification extends Component<IProps, IStates> {
  state: IStates = {
    open: true
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  render (): JSX.Element {
    const { title, loading, description, button } = this.props

    if (!this.state.open) return null

    return (
      <div className='community-notification'>

        {loading && <Icon className='community-notification__loading' icon={'loading_dots_square'}/>}

        {!loading && <Icon className='community-notification__icon' icon='attention_nt' />}

        <div className='community-notification__content'>
          <span className='community-notification__content-title'>{title}</span>
          <span className='community-notification__content-description'>{description}</span>
        </div>

        {button && button.buttonEnabled && <ButtonText color='blue' size='middle' onClick={button.buttonClick}>{button.buttonLabel}</ButtonText>}

        <div className='community-notification__close' onClick={this.handleClose}>
          <Icon className='community-notification__close-icon' icon='close_circle' />
        </div>

      </div>
    )
  }
}

export default CommunityNotification
