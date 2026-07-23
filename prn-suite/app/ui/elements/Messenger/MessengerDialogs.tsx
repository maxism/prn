import React, { Component, ReactNode } from 'react'

import './Messenger.scss'

interface IProps {
  children: ReactNode
}

/**
 * Элемент MessengerDialogs
 */
export default class MessengerDialogs extends Component<IProps> {
  render (): JSX.Element {
    return <div className='messenger__dialogs'>{this.props.children}</div>
  }
}
