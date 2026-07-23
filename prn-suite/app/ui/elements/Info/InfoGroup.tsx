import React, { Component, ReactNode } from 'react'

import './InfoGroup.scss'

interface IProps {
  children: object
}

class InfoGroup extends Component<IProps> {

  render () {
    return (
      <div className='info-group'>
        {this.props.children}
      </div>
    )
  }
}

export default InfoGroup
