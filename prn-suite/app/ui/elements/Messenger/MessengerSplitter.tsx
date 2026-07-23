import React, { Component } from 'react'

import './Messenger.scss'

/**
 * Элемент MessengerSplitter
 */

export default class MessengerSplitter extends Component {
  render (): JSX.Element {
    return (
      <div className='messenger__splitter'>
        <div className='messenger__splitter-line'/>
      </div>
    )
  }
}
