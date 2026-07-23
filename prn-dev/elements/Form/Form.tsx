import React, { Component, ReactNode } from 'react'
import cx from 'classnames'

import s from './Form.module.scss'

interface IProps {
  /**
   * Обработчик onSubmit, вызывается при отправки формы
   */
  onSubmit?: Function
  /**
   * Обработчик onReset, вызывается при сбросе формы
   */
  onReset?: Function
  /**
   * Содержимое формы
   */
  children: ReactNode
}

/**
 * Элемент Form
 */
class Form extends Component<IProps> {
  handleSubmit = (e) => {
    e.preventDefault()

    this.props.onSubmit(e)
  }

  handleReset = (e) => {
    e.preventDefault()

    this.props.onReset(e)
  }

  render (): JSX.Element {
    const { children } = this.props
    const classes = cx(s.element)

    return (
      <form className={classes} onSubmit={this.handleSubmit} onReset={this.handleReset}>
        {children}
      </form>
    )
  }
}

export default Form
