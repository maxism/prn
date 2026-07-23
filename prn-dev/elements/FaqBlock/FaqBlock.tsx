import React, { Component, ReactNode } from 'react'

import Block from '../Block/Block'
import Title from '../Title/Title'
import BlockGroup from '../Block/BlockGroup'
import Row from '../Row/Row'
import Segment from '../Segment/Segment'
import Container from '../Container/Container'

import s from './FaqBlock.module.scss'

interface IProps {
  /**
   * Содержимое элемента
   */
  children?: ReactNode
}

/**
 * Блок вопросами и разворачивающимися ответами
 */
export default class FaqBlock extends Component<IProps> {
  static defaultProps = {
    size: 12
  }

  render (): JSX.Element {
    const { children } = this.props

    // const classes = cx(s.element, {})

    return (
      <Segment>
        <Container>
          <Row padding='xxl' />
          <Row padding='xxl' />
            <BlockGroup size='l'>
              <Block size={12}>
                <div className={s.element}>
                  <Title size='l' center className={s.title}>Остались вопросы?</Title>
                  {children}
                </div>
              </Block>
            </BlockGroup>
        </Container>
      </Segment>
    )
  }
}
