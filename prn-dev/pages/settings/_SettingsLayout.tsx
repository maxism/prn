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
import { inject, observer } from 'mobx-react'
import { Stores } from '../../stores/RootStore'
import ProfileStore from '../../stores/ProfileStore'
import Page from '../../elements/Page/Page'
import ServiceBlockGroup from '../../elements/ServiceBlock/ServiceBlockGroup'
import ServiceBlock from '../../elements/ServiceBlock/ServiceBlock'
import SettingsInfo from '../../elements/SettingsInfo/SettingsInfo'
import AccessDeniedPage from '../../components/AccessDeniedPage'
import AccountsStore from '../../stores/AccountsStore'
import { SingletonRouter, withRouter } from 'next/router'
import RouterUtil from '../../utils/RouterUtil'

interface IProps {
  router?: SingletonRouter
  children: ReactNode
  profileStore?: ProfileStore
  accountsStore?: AccountsStore
}

@(withRouter as any)
@inject(Stores.PROFILE_STORE, Stores.ACCOUNTS_STORE)
@observer
export default class SettingsLayout extends Component<IProps, any> {
  handleChange = async (e) => {
    const { profileStore } = this.props
    profileStore.profileForm.picture.value = e.target.value
    await profileStore.updatePicture()
  }

  render (): JSX.Element {
    const { router, children, profileStore, accountsStore } = this.props

    if (!profileStore.isAuth) return <AccessDeniedPage />

    return (
      <Page grey>

        <Meta
          title='Профиль'
        />
        <Header />

        <Segment>
          <Container>
            <Row padding='xxl' />

            <ServiceBlockGroup size='l'>
              <ServiceBlock size={12} white>
                <SettingsInfo
                  type='user'
                  image={profileStore.profile?.picture}
                  name={profileStore.profile?.name}
                  token={profileStore?.token}
                  plan={profileStore?.userPlan}
                  projectsCount={accountsStore?.getTotalProjectsCount()}
                  myCommunitiesCount={accountsStore?.getTotalMyCommunitiesCount()}
                  competitorCommunitiesCount={accountsStore?.getTotalCompetitorCommunitiesCount()}
                  influencerCommunitiesCount={accountsStore?.getTotalInfluencerCommunitiesCount()}
                  onChange={this.handleChange}
                  onSelectPaymentMethod={() => RouterUtil.replaceParams(router, { modal: 'select-payment-method', planName: profileStore.userPlan.current.name, planPeriod: String(profileStore.userPlan.current.period) })}
                  onLogout={() => profileStore.logout()}
                />
              </ServiceBlock>
            </ServiceBlockGroup>

            <Row padding='xl'>
              <Col size={12}>
                <ButtonNavGroup white>
                  <ButtonNav to='/settings/subscription?scroll=false'>Подписка и оплата</ButtonNav>
                  <ButtonNav to='/settings/projects?scroll=false'>Мои проекты</ButtonNav>
                  <ButtonNav to='/settings/profile?scroll=false'>Профиль</ButtonNav>
                  <ButtonNav to='/settings/partnership?scroll=false'>Партнерская программа</ButtonNav>
                </ButtonNavGroup>
              </Col>
            </Row>

            {children}

          </Container>
        </Segment>

        <Row padding='xxl' />
        <Row padding='xxl' />

        <Footer lite />

      </Page>
    )
  }
}
