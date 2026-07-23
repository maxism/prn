import React, { Component } from 'react'
import Segment from '../elements/Segment/Segment'
import Container from '../elements/Container/Container'
import Row from '../elements/Row/Row'
import Col from '../elements/Col/Col'
import Title from '../elements/Title/Title'
import Text from '../elements/Text/Text'
import Header from '../elements/Header/Header'
import Footer from '../elements/Footer/Footer'
import Meta from '../components/Meta'
import ButtonTextGroup from '../elements/ButtonText/ButtonTextGroup'
import ButtonText from '../elements/ButtonText/ButtonText'
import ServiceBlockGroup from '../elements/ServiceBlock/ServiceBlockGroup'
import ServiceBlock from '../elements/ServiceBlock/ServiceBlock'
import TextColor from '../elements/TextColor/TextColor'

export default class AgreementsPage extends Component<any, any> {
  render (): JSX.Element {
    return (
      <>
        <Meta
          title='Условия использования'
        />
        <Header />
        <Segment>
          <Container>

            <Row padding='xxl'>
              <Col size={10} center>
                <Title size='xl' center>Документы</Title>
              </Col>
            </Row>
            <Row padding='m'>
              <Col size={10} center>
                <Text size='xl' semibold center><TextColor color='dark'>
                  Здесь вы сможете найти важные документы, касающиеся работы нашей компании и сервисов
                </TextColor></Text>
              </Col>
            </Row>
            <Row padding='xxl' />

            <ServiceBlockGroup size='l'>

              <ServiceBlock grid>
                <Row padding='l'>
                  <Col size={10} center>
                    <Title size='m' center>Условия использования сервисов КУБ</Title>
                  </Col>
                </Row>
                <Row padding='l'>
                  <Col size={10} center>
                    <Text center>
                      Условия использования и оплаты всех сервисов КУБ регламентируются настоящим лицензионным договором-офертой редакции 01 января 2025 года.
                    </Text>
                  </Col>
                </Row>
                <Row padding='xl'>
                  <Col size={10} center>
                    <ButtonTextGroup full size='s'>
                      <ButtonText to='/about/agreements' _blank size='l'>Скачать документ</ButtonText>
                      <ButtonText size='l' secondary onClick={() => window['carrotWrap']().open()}>Обратиться в поддержку</ButtonText>
                    </ButtonTextGroup>
                  </Col>
                </Row>
                <Row padding='l' />
              </ServiceBlock>

              <ServiceBlock grid>
                <Row padding='l'>
                  <Col size={10} center>
                    <Title size='m' center>Политика конфиденциальности</Title>
                  </Col>
                </Row>
                <Row padding='l'>
                  <Col size={10} center>
                    <Text center>
                      Условия получения, обработки и хранения персональных данных пользователей сервисов КУБ.
                    </Text>
                  </Col>
                </Row>
                <Row padding='xl'>
                  <Col size={10} center>
                    <ButtonTextGroup full size='s'>
                      <ButtonText to='/about/confidential' _blank size='l'>Скачать документ</ButtonText>
                      <ButtonText size='l' secondary onClick={() => window['carrotWrap']().open()}>Обратиться в поддержку</ButtonText>
                    </ButtonTextGroup>
                  </Col>
                </Row>
                <Row padding='l' />
              </ServiceBlock>

              <ServiceBlock grid>
                <Row padding='l'>
                  <Col size={10} center>
                    <Title size='m' center>Политика оплаты и возврата средств</Title>
                  </Col>
                </Row>
                <Row padding='l'>
                  <Col size={10} center>
                    <Text center>
                       Детальные алгоритмы оплаты доступа к сервису КУБ, а так же способы возврата денежных средств.
                    </Text>
                  </Col>
                </Row>
                <Row padding='xl'>
                  <Col size={10} center>
                    <ButtonTextGroup full size='s'>
                      <ButtonText to='/about/payment-and-refund' _blank size='l'>Скачать документ</ButtonText>
                      <ButtonText size='l' secondary onClick={() => window['carrotWrap']().open()}>Обратиться в поддержку</ButtonText>
                    </ButtonTextGroup>
                  </Col>
                </Row>
                <Row padding='l' />
              </ServiceBlock>

              <ServiceBlock grid>
                <Row padding='l'>
                  <Col size={10} center>
                    <Title size='m' center>Оферта регулярных платежей</Title>
                  </Col>
                </Row>
                <Row padding='l'>
                  <Col size={10} center>
                    <Text center>
                      Соглашение о предоставлении Пользователям возможности оплаты услуг посредством регулярных автоматических переводов денежных средств.
                    </Text>
                  </Col>
                </Row>
                <Row padding='xl'>
                  <Col size={10} center>
                    <ButtonTextGroup full size='s'>
                      <ButtonText to='/about/payment-regular' _blank size='l'>Скачать документ</ButtonText>
                      <ButtonText size='l' secondary onClick={() => window['carrotWrap']().open()}>Обратиться в поддержку</ButtonText>
                    </ButtonTextGroup>
                  </Col>
                </Row>
                <Row padding='l' />
              </ServiceBlock>

            </ServiceBlockGroup>

            <Row padding='xxl' />
            <Row padding='xxl' />

          </Container>
        </Segment>

        <Footer/>
      </>
    )
  }
}
