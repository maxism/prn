import React, { Component, ReactNode } from 'react'

import Icon from '../Icon/Icon'

import Segment from '../Segment/Segment'
import Container from '../Container/Container'
import Link from '../Link/Link'
import IconGroup from '../Icon/IconGroup'
import Row from '../Row/Row'
import Col from '../Col/Col'
import Title from '../Title/Title'
import Text from '../Text/Text'
import TextColor from '../TextColor/TextColor'

class ContactUs extends Component {
  render (): ReactNode {

    return (
      <Segment>
        <Container>
          <Row padding='xxl' />
          <Row padding='xxl'>
            <Col size={10} center>
              <Title size='l' center><TextColor color='#311E9D' gradientColor='#AA60F6'>Всегда на связи</TextColor></Title>
            </Col>
          </Row>
          <Row padding='m'>
            <Col size={10} center>
              <Text size='l' semibold center maxWidth><TextColor color='dark'>
                Если вы хотите узнать больше о наших сервисах или у вас есть какие-то вопросы — мы всегда на связи
              </TextColor></Text>
            </Col>
          </Row>
          <Row padding='xl'>
            <Col size={10} center>
              <IconGroup size='xl' full>
                <Link to='https://t.me/telegram' newTab><Icon icon='tg_colored' size='xl' /></Link>
                {/*<Link to='https://www.facebook.com/facabook' newTab><Icon icon='fb_colored' size='xl' /></Link>*/}
                <Link to='https://vk.com/vkontakte' newTab><Icon icon='vk_colored' size='xl' /></Link>
                <Link to='https://ok.ru/odnoklassniki' newTab><Icon icon='ok_colored' size='xl' /></Link>
                {/*<Link to='https://www.instagram.com/instagram' newTab><Icon icon='ig_colored' size='xl' /></Link>*/}
              </IconGroup>
            </Col>
          </Row>
          <Row padding='xxl' />
          <Row padding='xxl' />
        </Container>
      </Segment>
    )
  }
}

export default ContactUs
