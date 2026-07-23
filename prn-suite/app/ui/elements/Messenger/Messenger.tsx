import React, { Component, ReactNode } from 'react'

import './Messenger.scss'

interface IProps {
  children: ReactNode
}

/**
 * Элемент Messenger
 */
export default class Messenger extends Component<IProps> {
  render (): JSX.Element {
    return <div className='messenger'>{this.props.children}</div>
  }
}
