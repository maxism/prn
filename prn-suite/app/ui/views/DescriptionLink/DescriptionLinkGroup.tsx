import React, { Component } from 'react'

import './DescriptionLinkGroup.scss'

interface IProps {
  children: object
}

/**
 * Элемент DescriptionLinkGroup
 * Группа ссылкок с описанием
 */
class DescriptionLinkGroup extends Component<IProps> {
  render () {
    return (
      <div className='description-link-group'>{this.props.children}</div>)
  }
}

export default DescriptionLinkGroup
