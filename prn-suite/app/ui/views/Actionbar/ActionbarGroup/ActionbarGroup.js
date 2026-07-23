import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './ActionbarGroup.scss'

/**
 * Элемент ActionbarGroup - группа элементов ActionBar
 */
class ActionbarGroup extends Component {
    static propTypes = {
      /**
       * Внутренние компоненты
       */
      children: PropTypes.node,
      /**
       * Заголовок
       */
      title: PropTypes.string
    }

    render () {
      const { children, title } = this.props

      return (
        <div className='actionbar__group'>
          {title && <p className='actionbar__group-title'>{title}</p>}
          <div className='actionbar__group-content'>
            {children}
          </div>
        </div>
      )
    }
}

export default ActionbarGroup
