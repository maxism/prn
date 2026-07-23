import React, { Component, ReactNode } from 'react'

import './Messenger.scss'

interface IProps {
  children: ReactNode
}

/**
 * Элемент MessengerMessages
 */
export default class MessengerMessages extends Component<IProps> {
  render (): JSX.Element {
    return <div className='messenger__messages'>{this.props.children}</div>
  }
}
