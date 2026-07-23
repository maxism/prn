import React, { Component, ReactNode } from 'react'
import PortalLayout from '../_PortalLayout'
import { inject, observer } from 'mobx-react'
import { Stores } from '../../../stores/RootStore'
import BlogStore from '../../../stores/BlogStore'
import Container from '../../../elements/Container/Container'
import Row from '../../../elements/Row/Row'
import Col from '../../../elements/Col/Col'
import ButtonNavGroup from '../../../elements/ButtonNav/ButtonNavGroup'
import ButtonNav from '../../../elements/ButtonNav/ButtonNav'
import Segment from '../../../elements/Segment/Segment'

interface IProps {
  children: ReactNode
  blogStore?: BlogStore
}

@inject(Stores.BLOG_STORE)
@observer
export default class PortalRatingLayout extends Component<IProps, any> {
  render (): JSX.Element {
    const { children } = this.props

    return (
      <PortalLayout>
        <Segment>
          <Container>
            <Row padding='m'>
              <Col size={12} center>
                <ButtonNavGroup size='s'>
                  <ButtonNav to='/portal/rating/tags' exact>Теги</ButtonNav>
                </ButtonNavGroup>
              </Col>
            </Row>
          </Container>
        </Segment>

        {children}
      </PortalLayout>
    )
  }
}
