import React, {Component, ReactNode} from 'react'
import Footer from '../../elements/Footer/Footer'

import Header from '../../elements/Header/Header'
import Segment from '../../elements/Segment/Segment'
import Meta from '../../components/Meta'
import Container from '../../elements/Container/Container'
import Row from '../../elements/Row/Row'
import Col from '../../elements/Col/Col'
import ButtonNavGroup from '../../elements/ButtonNav/ButtonNavGroup'
import ButtonNav from '../../elements/ButtonNav/ButtonNav'

interface IProps {
  children: ReactNode
}

export default class PortalLayout extends Component<IProps, any> {
  render (): JSX.Element {
    const { children } = this.props

    return (
      <>
        <Meta
          title='Портал'
        />
        <Header/>

        <Segment>
          <Container>
            <Row padding='m'>
              <Col size={12} center>
                <ButtonNavGroup size='s'>
                  <ButtonNav to='/portal' exact>Главная</ButtonNav>
                  <ButtonNav to='/portal/blog'>Блог</ButtonNav>
                  <ButtonNav to='/portal/rating'>Рейтинг</ButtonNav>
                </ButtonNavGroup>
              </Col>
            </Row>
          </Container>
        </Segment>

        {children}

        <Row padding='xxl' />

        <Footer lite />
      </>
    )
  }
}
