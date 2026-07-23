import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'

import {Stores} from '../../../../stores/RootStore'
import Meta from '../../../../components/Meta'
import Row from '../../../../elements/Row/Row'
import Col from '../../../../elements/Col/Col'
import ProjectSettingsLayout from './_ProjectSettingsLayout'
import Community from '../../../../elements/Community/Community'
import ServiceBlockGroup from '../../../../elements/ServiceBlock/ServiceBlockGroup'
import RouterUtil from '../../../../utils/RouterUtil'
import {SingletonRouter, withRouter} from 'next/router'
import CommunitiesStore from '../../../../stores/CommunitiesStore'
import TitleBlock from '../../../../elements/TitleBlock/TitleBlock'
import ProfileStore, {UserPermission} from '../../../../stores/ProfileStore'
import AccessDeniedPage from '../../../../components/AccessDeniedPage'
import Notification from '../../../../elements/Notification/Notification'
import ArrayUtil from '../../../../utils/ArrayUtil'
import Select from '../../../../elements/Select/Select'
import ButtonText from '../../../../elements/ButtonText/ButtonText'

interface IRouter extends SingletonRouter {
  query: {
    projectID: string
    modal: string
    addToProjectID?: string
    sort?: string
  }
}

interface IProps {
  router: IRouter
  profileStore?: ProfileStore
  communitiesStore?: CommunitiesStore
}

@(withRouter as any)
@inject(Stores.PROFILE_STORE, Stores.COMMUNITIES_STORE, Stores.ACCOUNTS_STORE)
@observer
export default class ProjectCommunitiesPage extends Component<IProps, any> {
  constructor (props: IProps) {
    super(props)
  }

  render (): JSX.Element {
    const { router, profileStore, communitiesStore } = this.props
    const projectID = router.query.projectID

    if (!profileStore.isAuth) return <AccessDeniedPage />

    const sortList = [
      { id: 'name', name: 'По названию' },
      { id: 'socialType', name: 'По социальной сети' },
      { id: '-timeAdd', name: 'По времени добавления' },
      { id: '-qualityScore', name: 'По КУБ Score' },
      { id: '-usersCount', name: 'По подписчикам' },
    ]

    return (
      <ProjectSettingsLayout>

        <Meta
          title='Страницы проекта'
        />

        <Row padding='xxl'>
          <Col size={12}>
            <TitleBlock
              title='Страницы проекта'
              text='Ваши страницы — это любые доступные для анализа аккаунты, группы и сообщества в социальных сетях. Можно добавить по одной своей странице в каждую из социальных сетей.'
              button='Добавить страницу'
              onClick={() => RouterUtil.replaceParams(router, { modal: 'add-community', addToProjectID: projectID })}
            />
          </Col>
        </Row>

        <Row padding='xl' />

        {!profileStore.checkPermission(UserPermission.PROJECT, projectID) && (
          <>
            <Notification
              icon='admin'
              title='Ограничен доступ к проекту'
              message={'Вы достигли лимита проектов. Для снятия ограничений перейдите на тариф '.concat(profileStore.getHigherPlansList())}
              onClick={() => RouterUtil.replaceParams(router, { modal: 'change-plan' })}
              buttonText='Выбрать тариф'
            />
            <Row padding='xl' />
          </>
        )}

        {!profileStore.checkPermission(UserPermission.COMMUNITIES, projectID) && profileStore.checkPermission(UserPermission.PROJECT, projectID) && (
          <>
            <Notification
              icon='admin'
              title='Ограничен доступ к некоторым страницам'
              message={'Вы достигли лимита страниц в проекте. Для снятия ограничений перейдите на тариф '.concat(profileStore.getHigherPlansList())}
              onClick={() => RouterUtil.replaceParams(router, { modal: 'change-plan' })}
              buttonText='Выбрать тариф'
            />
            <Row padding='xl' />
          </>
        )}

        <Row padding='z'>
          <Select label='Сортировка:' value={router.query.sort} list={sortList} onSelect={e => RouterUtil.replaceParams(router, { sort: e.target.value })} trigger={<ButtonText size='s' secondary />} />
        </Row>
        <Row padding='s' />

        <ServiceBlockGroup size='m'>
          {ArrayUtil.arrayObjectsSort(router.query.sort, communitiesStore.getMyCommunities(projectID)).map(community => (
            <Community
              key={community.communityID}
              image={community.image}
              name={community.name}
              qualityScore={community.qualityScore}
              usersCount={community.usersCount}
              avgER={community.avgER}
              avgInteractions={community.avgInteractions}
              url={community.url}
              to={`https://prns.c-cube.ru/?accountID=${community.accountID}&type=${community.socialType}&page=detail&token=${profileStore.token}`}
              isNotPaid={!community.isPaid}
              onRemove={() => confirm('Вы действительно хотите удалить страницу?') && communitiesStore.remove(community.communityID, community.accountID)}
              onChangePlan={() => RouterUtil.replaceParams(router, { modal: 'change-plan' })}
            />
          ))}
        </ServiceBlockGroup>

      </ProjectSettingsLayout>
    )
  }
}
