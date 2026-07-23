import React, { Component } from 'react'
import Title from '../elements/Title/Title'
import ButtonText from '../elements/ButtonText/ButtonText'
import Meta from '../components/Meta'
import Header from '../elements/Header/Header'
import Text from '../elements/Text/Text'
import Segment from '../elements/Segment/Segment'
import Container from '../elements/Container/Container'
import Row from '../elements/Row/Row'
import Col from '../elements/Col/Col'
import Footer from '../elements/Footer/Footer'

interface IError {
  /**
   * Статус код
   */
  statusCode: number,
  /**
   * res
   */
  res: any,
  /**
   * err
   */
  err: any
}

/**
 * Класс Error
 */
export default class ErrorPage extends Component<IError> {
  /**
   * Метод getInitialProps
   *
   * @param error
   */
  static getInitialProps (error: IError): Partial<IError> {
    const statusCode = error.res ? error.res.statusCode : error.err ? error.err.statusCode : null
    return { statusCode }
  }

  /**
   * Метод render
   */
  render (): JSX.Element {
    return (
      <>
        <Meta
          title='404 — Страница не найдена'
          noindex
        />
        <Header lite />
        <Segment full>
          <Container>
            <Row>
              <Col size={8}>
                <Title size='l'>Мы не смогли найти эту страницу</Title>
              </Col>
            </Row>
            <Row padding='m'>
              <Col size={8}>
                <Text size='m' semibold>
                  К сожалению, мы не смогли найти страницу, которая должна быть по этому адресу. Скорее всего её не существует, но у нас есть много других!
                </Text>
              </Col>
            </Row>
            <Row padding='l'>
              <Col size={8}>
                <ButtonText to='/' size='l'>Перейти на главную страницу</ButtonText>
              </Col>
            </Row>
            <Row padding='l'>
              <Col size={8}>

              </Col>
            </Row>
          </Container>
        </Segment>

        <Footer lite />
      </>
    )
  }
}
