import React, {Component, ReactNode} from 'react'
import Footer from '../../../../elements/Footer/Footer'

import Header from '../../../../elements/Header/Header'
import Segment from '../../../../elements/Segment/Segment'
import Meta from '../../../../components/Meta'
import Container from '../../../../elements/Container/Container'
import Row from '../../../../elements/Row/Row'
import Col from '../../../../elements/Col/Col'
import ButtonNavGroup from '../../../../elements/ButtonNav/ButtonNavGroup'
import ButtonNav from '../../../../elements/ButtonNav/ButtonNav'
import { inject, observer } from 'mobx-react'
import { Stores } from '../../../../stores/RootStore'
import ProfileStore from '../../../../stores/ProfileStore'
import AccountsStore from '../../../../stores/AccountsStore'
import { SingletonRouter, withRouter } from 'next/router'
import ButtonText from '../../../../elements/ButtonText/ButtonText'
import Page from '../../../../elements/Page/Page'
import ServiceBlockGroup from '../../../../elements/ServiceBlock/ServiceBlockGroup'
import ServiceBlock from '../../../../elements/ServiceBlock/ServiceBlock'
import SettingsInfo from '../../../../elements/SettingsInfo/SettingsInfo'
import AccessDeniedPage from '../../../../components/AccessDeniedPage'
import AppUtil from '../../../../utils/AppUtil'

interface IRouter extends SingletonRouter {
  /**
   * query
   */
  query: {
    /**
     * ID проекта
     */
    projectID: string
  }
}

interface IProps {
  router?: IRouter
  children: ReactNode
  profileStore?: ProfileStore
  accountsStore?: AccountsStore
}

@(withRouter as any)
@inject(Stores.PROFILE_STORE, Stores.ACCOUNTS_STORE)
@observer
export default class ProjectSettingsLayout extends Component<IProps, any> {
  handleChange = async (e) => {
    const { accountsStore } = this.props
    accountsStore.projectForm.image.value = e.target.value
    await accountsStore.updateImage(this.getProjectID())
  }

  handleDelete = async () => {
    if (confirm('Вы действительно хотите удалить проект?')) {
      const { accountsStore } = this.props
      await accountsStore.removeAccount(this.getProjectID())
    }
  }

  getProjectID = () => this.props.router.query.projectID

  render (): JSX.Element {
    const { router, children, profileStore, accountsStore } = this.props

    if (!profileStore.isAuth) return <AccessDeniedPage />

    const projectID = this.getProjectID()
    const project = accountsStore.getProject(projectID)

    if (!project) {
      if (AppUtil.isClientSide) setTimeout(() => router.push('/settings/projects'), 500)
      return null
    }

    return (
      <Page grey>

        <Meta
          title='Проект'
        />
        <Header />

        <Segment>
          <Container>

            <Row padding='l' />
            <Row padding='xs' />

            <ButtonText to='/settings/projects' secondary icon='arrow_left'>К списку проектов</ButtonText>

            <Row padding='m' />

            <ServiceBlockGroup size='l'>
              <ServiceBlock size={12} white>
                <SettingsInfo
                  type='project'
                  image={project?.image}
                  name={project?.name}
                  token={profileStore?.token}
                  socials={project?.socials}
                  myCommunitiesCount={project?.myCommunitiesCount}
                  competitorCommunitiesCount={project?.competitorCommunitiesCount}
                  influencerCommunitiesCount={project?.influencerCommunitiesCount}
                  onChange={this.handleChange}
                  onDelete={(accountsStore.getProjects().length > 1) && this.handleDelete}
                  isNotPaid={!project?.isPaid}
                  warning={(project.myCommunitiesCount > profileStore.userPlan.current.communities
                    || project.competitorCommunitiesCount > profileStore.userPlan.current.competitors
                    || project.influencerCommunitiesCount > profileStore.userPlan.current.influencers) && 'Превышены ограничения тарифа'}
                />
              </ServiceBlock>
            </ServiceBlockGroup>

            <Row padding='xl'>
              <Col size={12}>
                <ButtonNavGroup white>
                  <ButtonNav to={`/settings/projects/${projectID}/communities?scroll=false`}>Мои страницы</ButtonNav>
                  <ButtonNav to={`/settings/projects/${projectID}/competitors?scroll=false`}>Конкуренты</ButtonNav>
                  <ButtonNav to={`/settings/projects/${projectID}/influencers?scroll=false`}>Блогеры</ButtonNav>
                  <ButtonNav to={`/settings/projects/${projectID}/info?scroll=false`}>Настройки проекта</ButtonNav>
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
