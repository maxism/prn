import React, { Component, ReactNode } from 'react'

import Block from '../Block/Block'
import BlockGroup from '../Block/BlockGroup'

import s from './PlanHistory.module.scss'

interface IProps {
  /**
   * Содержимое элемента
   */
  children?: ReactNode
}

/**
 * Блок с историей платежей
 */
export default class PlanHistory extends Component<IProps> {
  static defaultProps = {
    size: 12
  }

  render (): JSX.Element {
    const { children } = this.props

    // const classes = cx(s.element, {})

    return (
      <BlockGroup size='z'>
        <Block size={12}>
          <div className={s.element}>
            {children}
          </div>
        </Block>
      </BlockGroup>
    )
  }
}
