import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { IStatisticsParams } from '../interfaces/IParams'
import CommunitiesStore from '../stores/CommunitiesStore'
import PostsStore from '../stores/PostsStore'
import { Stores } from '../stores/RootStore'
import StatisticsStore from '../stores/StatisticsStore'
import withParams, { ParamsProps } from '../utils/withParams'

import LiteLayout from './layouts/LiteLayout'
import ReportsStore from '../stores/ReportsStore'
import ProfileStore from '../stores/ProfileStore'

interface IProps {
  params?: ParamsProps<IStatisticsParams>
  profileStore?: ProfileStore
  communitiesStore?: CommunitiesStore
  statisticsStore?: StatisticsStore
  postsStore?: PostsStore
  reportsStore?: ReportsStore
}

/**
 * Страница ContentPage
 */
@withParams
@inject(Stores.PROFILE_STORE, Stores.SOURCES_STORE, Stores.COMMUNITIES_STORE, Stores.POSTS_STORE, Stores.REPORTS_STORE)
@observer
class SubscribePage extends Component<IProps> {
  render (): JSX.Element {
    return (
      <LiteLayout>
        Страница подписки
      </LiteLayout>
    )
  }
}

export default SubscribePage
