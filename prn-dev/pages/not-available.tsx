import React, { Component } from 'react'
import { SingletonRouter, withRouter } from 'next/router'
import { observer } from 'mobx-react'
import Segment from '../elements/Segment/Segment'
import Container from '../elements/Container/Container'
import Row from '../elements/Row/Row'
import Col from '../elements/Col/Col'
import Text from '../elements/Text/Text'
import Header from '../elements/Header/Header'
import Footer from '../elements/Footer/Footer'
import Meta from '../components/Meta'
import Title from '../elements/Title/Title'
import ButtonText from '../elements/ButtonText/ButtonText'

interface IProps {
  /**
   * router
   */
  router: SingletonRouter
}

@(withRouter as any)
@observer
export default class NotAvailablePage extends Component<IProps, any> {
  render (): JSX.Element {
    return (
      <>
        <Meta
          title='Недоступный раздел'
          noindex
        />
        <Header />
        <Segment>
          <Container>
            <Row padding='xxl'>
              <Col size={8} center>
                <Title size='l' center>Этот раздел сайта временно недоступен</Title>
              </Col>
            </Row>
            <Row padding='m'>
              <Col size={8} center>
                <Text size='m' semibold center>
                  Сейчас этот раздел сайта находится в разработке — скоро мы завершим все работы и он вернётся на свое место в новом виде. Рекомендуем ознакомиться с остальной информацией на сайте, скорее всего вы найдёте то, что искали.
                </Text>
              </Col>
            </Row>
            <Row padding='l'>
              <Col size={8} center>
                <ButtonText to='/' size='l'>На главную страницу</ButtonText>
              </Col>
            </Row>
            <Row padding='xxl'/>
          </Container>
        </Segment>

        <Footer/>
      </>
    )
  }
}
