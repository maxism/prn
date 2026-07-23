import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './RemoveDialogDescription.scss'

/**
 * Вид RemoveDialogDescription - расширенное описание диалога удаления
 */
class RemoveDialogDescription extends Component {
    static propTypes = {
      /**
       * Внутренние компоненты
       */
      children: PropTypes.node
    }

    render () {
      const { children } = this.props

      return (
        <div className='remove-dialog__description'>{children}</div>
      )
    }
}

export default RemoveDialogDescription
