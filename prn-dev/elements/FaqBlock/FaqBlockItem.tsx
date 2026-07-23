import React, { Component, ReactNode } from 'react'
import cx from 'classnames'

import s from './FaqBlock.module.scss'
import Text from '../Text/Text'
import Icon from '../Icon/Icon'

interface IProps {
  /**
   * Вопрос
   */
  question: string
  /**
   * Содержимое элемента
   */
  children: ReactNode
}

interface IStates {
  open: boolean
}

/**
 * Блок одного вопроса и ответа
 */
export default class FaqBlockItem extends Component<IProps, IStates> {
  state: IStates = {
    open: false
  }

  handleClick = () => {
    this.setState({ open: !this.state.open })
  }

  render (): JSX.Element {
    const { question, children } = this.props

    // const classes = cx(s.element, {})

    return (
      <div className={s.itemElement}>
        <div className={s.itemQuestion}>
          <Text size='m' maxWidth semibold onClick={this.handleClick}>{question}</Text>
          <Icon className={cx({ [s.opened]: this.state.open })} icon='arrow_down' size='l' onClick={this.handleClick} />
        </div>
        <Text size='s' className={cx(s.itemAnswer, { [s.open]: this.state.open })}>{children}</Text>
      </div>
    )
  }
}
