import React, { Component, ReactNode } from 'react'

import './MetricsRowGroup.scss'

interface IProps {
  children: ReactNode
}

/**
 * Элемент MetricsRowGroup.
 * Задаёт расстояние между строками таблицы
 */

class MetricsRowGroup extends Component<IProps> {

  render (): JSX.Element {

    const { children } = this.props

    return (
      <div className='metrics-row-group'>
        {children}
      </div>
    )
  }
}

export default MetricsRowGroup
