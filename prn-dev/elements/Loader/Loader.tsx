import React, { Component } from 'react'
import cx from 'classnames'

import s from './Loader.module.scss'
import Icon from '../Icon/Icon'

interface IProps {
  /**
   * Класс
   */
  className?: string
}

/**
 * Элемент отображает прелоадер
 */
class Loader extends Component<IProps> {
  render (): JSX.Element {
    let { className } = this.props

    const classes = cx(s.element, className)

    return <div className={classes}><Icon icon='loading_dots_square' /></div>
  }
}

export default Loader
