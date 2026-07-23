import React, { Component } from 'react'
import Title from '../elements/Title/Title'
import ButtonText from '../elements/ButtonText/ButtonText'
import Meta from './Meta'
import Header from '../elements/Header/Header'
import Segment from '../elements/Segment/Segment'
import Container from '../elements/Container/Container'
import Row from '../elements/Row/Row'
import Col from '../elements/Col/Col'
import Text from '../elements/Text/Text'
import { SingletonRouter, withRouter } from 'next/router'
import RouterUtil from '../utils/RouterUtil'
import ButtonTextGroup from '../elements/ButtonText/ButtonTextGroup'

interface IProps {
  /**
   * router
   */
  router?: SingletonRouter
}

/**
 * Страница доступ запрещен
 */
@(withRouter as any)
export default class AccessDeniedPage extends Component<IProps> {
  /**
   * Метод render
   */
  render (): JSX.Element {
    const { router } = this.props

    return (
      <>
        <Meta
          title='Доступ запрещен'
          noindex
        />
        <Header lite />
        <Segment full>
          <Container>
            <Row>
              <Col size={8}>
                <Title size='l'>Доступ запрещен</Title>
              </Col>
            </Row>
            <Row padding='m'>
              <Col size={8}>
                <Text size='m' semibold>
                  К сожалению, у вас нет прав на просмотр данной страницы
                </Text>
              </Col>
            </Row>
            <Row padding='l'>
              <Col size={8}>
                <ButtonTextGroup size='s'>
                  <ButtonText onClick={() => RouterUtil.replaceParams(router, { modal: 'login' })} size='l'>Войти</ButtonText>
                  <ButtonText to='/' size='l' secondary>Перейти на главную страницу</ButtonText>
                </ButtonTextGroup>
              </Col>
            </Row>
            <Row padding='l' />
          </Container>
        </Segment>
      </>
    )
  }
}
