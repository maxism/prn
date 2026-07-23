import React, { Component, ReactNode } from 'react'

import './Messenger.scss'

interface IProps {
  children: ReactNode
}

/**
 * Элемент MessengerAnswer
 */
export default class MessengerAnswer extends Component<IProps> {
  render (): JSX.Element {
    return <div className='messenger__answer'>{this.props.children}</div>
  }
}
