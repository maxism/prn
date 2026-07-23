import React, { Component } from 'react'
import cx from 'classnames'

import './Form.scss'

interface IProps {
  /**
   * Обработчик onSubmit, вызывается при отправки формы
   */
  onSubmit: Function
  /**
   * Содержимое формы
   */
  children: object
}

/**
 * Коллекция Form
 */
class Form extends Component<IProps> {
  handleSubmit = (e) => {
    e.preventDefault()

    this.props.onSubmit(e)
  }

  render (): JSX.Element {
    const { children } = this.props
    const classes = cx('form')

    return (
      <form className={classes} onSubmit={this.handleSubmit}>
        {children}
      </form>
    )
  }
}

export default Form
