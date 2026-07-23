import React, { Component, ReactNode } from 'react'

import './Messenger.scss'

interface IProps {
  children: ReactNode
}

/**
 * Элемент MessengerMessagesList
 */
export default class MessengerMessagesList extends Component<IProps> {
  render (): JSX.Element {
    return <div className='messenger__messages-list'>{this.props.children}</div>
  }
}
