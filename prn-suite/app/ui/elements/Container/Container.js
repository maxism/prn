import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './Container.scss'

/**
 *  Элемент Container
 *  Каркас страницы - выравнен по центру, имеет максимальную и минимальную ширину
 */
class Container extends Component {
  static propTypes = {
    /**
     * Содержимое контейнера
     */
    children: PropTypes.node
  }

  render () {
    return (
      <div className='container'>{this.props.children}</div>
    )
  }
}

export default Container
