import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'

import {Stores} from '../../../stores/RootStore'
import ProfileStore, { UserPermission } from '../../../stores/ProfileStore'
import Meta from '../../../components/Meta'
import Row from '../../../elements/Row/Row'
import Col from '../../../elements/Col/Col'
import SettingsLayout from '../_SettingsLayout'
import AccountsStore from '../../../stores/AccountsStore'
import ServiceBlockGroup from '../../../elements/ServiceBlock/ServiceBlockGroup'
import RouterUtil from '../../../utils/RouterUtil'
import {SingletonRouter, withRouter} from 'next/router'
import Project from '../../../elements/Project/Project'
import TitleBlock from '../../../elements/TitleBlock/TitleBlock'
import AccessDeniedPage from '../../../components/AccessDeniedPage'
import Notification from '../../../elements/Notification/Notification'

interface IProps {
  router: SingletonRouter
  profileStore?: ProfileStore
  accountsStore?: AccountsStore
}

@(withRouter as any)
@inject(Stores.PROFILE_STORE, Stores.ACCOUNTS_STORE)
@observer
export default class ProjectsPage extends Component<IProps, any> {
  constructor (props: IProps) {
    super(props)
  }

  render (): JSX.Element {
    const { router, profileStore, accountsStore } = this.props

    if (!profileStore.isAuth) return <AccessDeniedPage />

    return (
      <SettingsLayout>

        <Meta
          title='Мои проекты'
        />

        <Row padding='xxl'>
          <Col size={12}>
            <TitleBlock
              title='Список проектов'
              text='Ваши проекты — это удобная группировка страниц. Место, где вы можете собрать вместе все страницы своей компании из разных соцсетей, добавить страницы конкурентов и отобрать блогеров для рекламных интеграций.'
              button='Добавить проект'
              onClick={() => RouterUtil.replaceParams(router, { modal: 'create-project' })}
            />
          </Col>
        </Row>

        <Row padding='xl' />

        {!profileStore.checkPermission(UserPermission.PROJECTS) && (
          <>
            <Notification
              icon='admin'
              title='Ограничен доступ к некоторым проектам'
              message={'Вы достигли лимита проектов в своем тарифе. Для снятия ограничения — нужно перейти на тариф '.concat(profileStore.getHigherPlansList())}
              onClick={() => RouterUtil.replaceParams(router, { modal: 'change-plan' })}
              buttonText='Выбрать тариф'
            />
            <Row padding='xl' />
          </>
        )}

        <ServiceBlockGroup>
          {accountsStore.accounts.map(project => (
            <Project
              key={project.accountID}
              image={project.image}
              name={project.name}
              socials={project.socials}
              myCommunitiesCount={project.myCommunitiesCount}
              competitorCommunitiesCount={project.competitorCommunitiesCount}
              influencerCommunitiesCount={project.influencerCommunitiesCount}
              to={`/settings/projects/${project.accountID}/communities`}
              isNotPaid={!project.isPaid}
              onChangePlan={() => RouterUtil.replaceParams(router, { modal: 'change-plan' })}
              warning={(project.myCommunitiesCount > profileStore.userPlan.current.communities
                || project.competitorCommunitiesCount > profileStore.userPlan.current.competitors
                || project.influencerCommunitiesCount > profileStore.userPlan.current.influencers) && 'Превышены ограничения тарифа'}
            />
          ))}
        </ServiceBlockGroup>

      </SettingsLayout>
    )
  }
}
