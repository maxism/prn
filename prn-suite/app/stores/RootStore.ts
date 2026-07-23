import { RouterStore } from 'mobx-react-router'
import ProfileStore from './ProfileStore'
import AccountsStore from './AccountsStore'
import PlanStore from './PlanStore'
import CommunitiesStore from './CommunitiesStore'
import PostsStore from './PostsStore'
import StatisticsStore from './StatisticsStore'
import SourcesStore from './SourcesStore'
import MessengerStore from './MessengerStore'
import StatisticsSummaryStore from './StatisticsSummaryStore'
import { configure } from 'mobx'
import ReportsStore from './ReportsStore'
import StatisticsActivityStore from './StatisticsActivityStore'
import UsersStore from './UsersStore'

configure({
  enforceActions: 'never'
})

export enum Stores {
  ROUTING = 'routing',
  PROFILE_STORE = 'profileStore',
  ACCOUNTS_STORE = 'accountsStore',
  SOURCES_STORE = 'sourcesStore',
  PLAN_STORE = 'planStore',
  COMMUNITIES_STORE = 'communitiesStore',
  POSTS_STORE = 'postsStore',
  MESSENGER_STORE = 'messengerStore',
  STATISTICS_STORE = 'statisticsStore',
  STATISTICS_SUMMARY_STORE = 'statisticsSummaryStore',
  STATISTICS_ACTIVITY_STORE = 'statisticsActivityStore',
  REPORTS_STORE = 'reportsStore',
  USERS_STORE = 'usersStore'
}

const stores = {
  routingStore: new RouterStore(),
  profileStore: new ProfileStore(),
  accountsStore: new AccountsStore(),
  sourcesStore: new SourcesStore(),
  planStore: new PlanStore(),
  communitiesStore: new CommunitiesStore(),
  postsStore: new PostsStore(),
  messengerStore: new MessengerStore(),
  statisticsStore: new StatisticsStore(),
  statisticsSummaryStore: new StatisticsSummaryStore(),
  statisticsActivityStore: new StatisticsActivityStore(),
  reportsStore: new ReportsStore(),
  usersStore: new UsersStore()
}

export function clear (): void {
  for (let key in stores) {
    if (stores[key] instanceof RouterStore) continue
    stores[key].clear()
  }
}

export default stores
