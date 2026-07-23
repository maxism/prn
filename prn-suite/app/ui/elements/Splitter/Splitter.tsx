import React, { Component } from 'react'
import cx from 'classnames'

import './Splitter.scss'

interface IProps {
  header?: boolean
  vertical?: boolean
  white?: boolean
}

/**
 * Элемент Splitter.
 * Разделительная полоса
 */

class Splitter extends Component<IProps> {
  render (): JSX.Element {

    const { header, vertical, white } = this.props

    const classes = cx('splitter', {
      'splitter--header': header,
      'splitter--vertical': vertical,
      'splitter--white': white
    })

    return (
      <div className={classes}>
        <div className='splitter__line' />
      </div>
    )
  }
}

export default Splitter
