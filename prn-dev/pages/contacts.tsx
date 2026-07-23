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
import Link from '../elements/Link/Link'
import IconGroup from '../elements/Icon/IconGroup'
import Icon from '../elements/Icon/Icon'
import BlockGroup from '../elements/Block/BlockGroup'
import Block from '../elements/Block/Block'
// import YandexMap from '../elements/YandexMap/YandexMap'
import TextColor from '../elements/TextColor/TextColor'

export default class ContactsPage extends Component<any, any> {
  render (): JSX.Element {
    return (
      <>
        <Meta
          title='Контакты'
          description='Мы находимся в ... и всегда рады выслушать обратную связь или помочь решить ваши вопросы'
          image='/images/sharing.png'
          keywords='КУБ, сотрудники, контакты, телефон'
        />
        <Header />
        <Segment>
          <Container>
            <Row padding='xxl'>
              <Col size={10} center>
                <Title size='xl' center>Контакты</Title>
              </Col>
            </Row>
            <Row padding='m'>
              <Col size={10} center>
                <Text size='xl' semibold center><TextColor color='dark'>
                  Мы находимся в ... и всегда рады выслушать обратную связь или помочь решить ваши вопросы
                </TextColor></Text>
              </Col>
            </Row>

            <Row padding='xxl'>
              <Col size={8} center>
                <IconGroup size='xl' full>
                  <Link to='https://t.me/telegram' newTab><Icon icon='tg_colored' size='xl' /></Link>
                  {/*<Link to='https://www.facebook.com/facebook' newTab><Icon icon='fb_colored' size='xl' /></Link>*/}
                  <Link to='https://vk.com/vkontakte' newTab><Icon icon='vk_colored' size='xl' /></Link>
                  <Link to='https://ok.ru/odnoklassniki' newTab><Icon icon='ok_colored' size='xl' /></Link>
                  {/*<Link to='https://www.instagram.com/instagram' newTab><Icon icon='ig_colored' size='xl' /></Link>*/}
                </IconGroup>
              </Col>
            </Row>

            <Row padding='xxl'>
              <Col size={8} center>
                <BlockGroup>
                  <Block size={6} to='tel:+99999999999'>
                    <Title size='xs' center>Наш номер телефона</Title>
                    <Row padding='m' />
                    <Text center><Link to='tel:+99999999999'>+9 999 999-99-99</Link></Text>
                  </Block>
                  <Block size={6} to='mailto:info@c-cube.ru'>
                    <Title size='xs' center>По общим вопросам</Title>
                    <Row padding='m' />
                    <Text center><Link to='mailto:info@c-cube.ru'>info@c-cube.ru</Link></Text>
                  </Block>
                  <Block size={6} to='mailto:info@c-cube.ru'>
                    <Title size='xs' center>Техническая поддержка</Title>
                    <Row padding='m' />
                    <Text center><Link to='mailto:info@c-cube.ru'>info@c-cube.ru</Link></Text>
                  </Block>
                  <Block size={6} to='mailto:info@c-cube.ru'>
                    <Title size='xs' center>Вопросы оплаты</Title>
                    <Row padding='m' />
                    <Text center><Link to='mailto:info@c-cube.ru'>info@c-cube.ru</Link></Text>
                  </Block>
                </BlockGroup>
              </Col>
            </Row>

            <Row padding='xxl'>
              <Col size={8} center>
                <Title>ООО «Комсинсайтс»</Title>
              </Col>
            </Row>
            <Row padding='m'>
              <Col size={8} center>
                <Text>
                  ...
                </Text>
              </Col>
            </Row>
            <Row padding='m'>
              <Col size={8} center>
                <Text>Работаем в будние дни с 9 до 18.</Text>
              </Col>
            </Row>

            {/*<Row padding='xl'>*/}
            {/*  <Col size={8} center>*/}
            {/*    <YandexMap />*/}
            {/*  </Col>*/}
            {/*</Row>*/}

            <Row padding='xxl' />
            <Row padding='xxl' />
          </Container>
        </Segment>

        <Footer/>
      </>
    )
  }
}
