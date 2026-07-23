import React, { Component } from 'react'
import Icon from '../Icon/Icon'

import './HeaderIcons.scss'
import ButtonText from '../ButtonText/ButtonText'
import Popup from '../Popup/Popup'
import PopupButton from '../Popup/PopupButton'
import PopupDivider from '../Popup/PopupDivider'

interface IProps {
  token: string
}

/**
 * Элемент HeaderLogo
 */
class HeaderIcons extends Component<IProps> {
  render (): JSX.Element {
    const { token } = this.props

    return (
      <div className='header-icons'></div>
    )
  }
}

export default HeaderIcons
