import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Stores } from '../../stores/RootStore'
import { SingletonRouter, withRouter } from 'next/router'
import ProfileStore from '../../stores/ProfileStore'
import AccessDeniedPage from '../../components/AccessDeniedPage'
import PortalLayout from './_PortalLayout'
import Meta from '../../components/Meta'
import Segment from '../../elements/Segment/Segment'
import Container from '../../elements/Container/Container'
import Row from '../../elements/Row/Row'
import Title from '../../elements/Title/Title'

interface IProps {
  router: SingletonRouter
  profileStore?: ProfileStore
}

@(withRouter as any)
@inject(Stores.PROFILE_STORE)
@observer
export default class BlogPage extends Component<IProps, any> {
  static async getInitialProps (): Promise<Partial<any>> {

    return {}
  }

  render (): JSX.Element {
    const { profileStore } = this.props

    if (!profileStore.isDeveloper()) return <AccessDeniedPage />

    return (
      <PortalLayout>
        <Meta />

        <Segment>
          <Container>
            <Row padding='m'>
              <Title>Главная</Title>
            </Row>
          </Container>
        </Segment>
      </PortalLayout>
    )
  }
}
