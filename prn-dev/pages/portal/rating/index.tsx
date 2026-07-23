import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Stores } from '../../../stores/RootStore'
import { withRouter } from 'next/router'
import ProfileStore from '../../../stores/ProfileStore'
import AccessDeniedPage from '../../../components/AccessDeniedPage'
import PortalBlogLayout from './_PortalRatingLayout'
import Segment from '../../../elements/Segment/Segment'
import Container from '../../../elements/Container/Container'
import Row from '../../../elements/Row/Row'
import BlockGroup from '../../../elements/Block/BlockGroup'

interface IProps {
  profileStore?: ProfileStore
}

interface IProps {
  profileStore?: ProfileStore
}

@(withRouter as any)
@inject(Stores.PROFILE_STORE)
@observer
export default class PortalRatingPage extends Component<IProps, any> {
  static async getInitialProps (): Promise<Partial<any>> {
    // const { profileStore } = ctx.store

    // console.log(profileStore)

    return {}
  }

  render (): JSX.Element {
    const { profileStore } = this.props

    if (!profileStore.isDeveloper()) return <AccessDeniedPage />

    return (
      <PortalBlogLayout>
        <Segment>
          <Container>
            <Row padding='m' />
            <BlockGroup size='s'>

            </BlockGroup>
          </Container>
        </Segment>
      </PortalBlogLayout>
    )
  }
}
