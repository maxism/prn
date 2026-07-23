import ProfileStore from './ProfileStore'
import { NextPageContext } from 'next'
import { RouterStore } from 'mobx-react-router'
import { configure } from 'mobx'
import BlogStore from './BlogStore'
import RatingStore from './RatingStore'
import RatingTagsStore from './RatingTagsStore'
import SocialIndexStore from './SocialIndexStore'
import RequestStore from './RequestStore'
import AccountsStore from './AccountsStore'
import CommunitiesStore from './CommunitiesStore'
import InfluenceStore from './InfluenceStore'
import AppUtil from '../utils/AppUtil'
import PlanStore from './PlanStore'
import StatisticsStore from './StatisticsStore'

configure({
  enforceActions: 'never'
})

let firstLoading = false

export interface IBaseStore {
  hydrate: (any) => void
  clear: () => void
}

function createStore (): IStore {
  let store: IStore = {} as IStore

  store.routingStore = new RouterStore()
  store.profileStore = new ProfileStore(store)
  store.ratingStore = new RatingStore(store)
  store.ratingTagsStore = new RatingTagsStore(store)
  store.blogStore = new BlogStore(store)
  store.socialIndexStore = new SocialIndexStore(store)
  store.requestStore = new RequestStore(store)
  store.accountsStore = new AccountsStore(store)
  store.communitiesStore = new CommunitiesStore(store)
  store.influenceStore = new InfluenceStore(store)
  store.planStore = new PlanStore(store)
  store.statisticsStore = new StatisticsStore(store)

  store.clear = (): void => {
    for (let key in store) {
      if (store[key] instanceof RouterStore) continue
      if (store[key].clear) store[key].clear()
    }
  }

  return store
}

let store = createStore()

export enum Stores {
  ROUTING = 'routing',
  PROFILE_STORE = 'profileStore',
  RATING_STORE = 'ratingStore',
  RATING_TAGS_STORE = 'ratingTagsStore',
  BLOG_STORE = 'blogStore',
  SOCIALINDEX_STORE = 'socialIndexStore',
  REQUEST_STORE = 'requestStore',
  ACCOUNTS_STORE = 'accountsStore',
  COMMUNITIES_STORE = 'communitiesStore',
  INFLUENCE_STORE = 'influenceStore',
  PLAN_STORE = 'planStore',
  STATISTICS_STORE = 'statisticsStore'
}

export interface IStore {
  routingStore: RouterStore,
  profileStore: ProfileStore,
  ratingStore: RatingStore,
  ratingTagsStore: RatingTagsStore,
  blogStore: BlogStore,
  socialIndexStore: SocialIndexStore,
  requestStore: RequestStore,
  accountsStore: AccountsStore,
  communitiesStore: CommunitiesStore
  influenceStore: InfluenceStore,
  planStore: PlanStore,
  statisticsStore: StatisticsStore,

  clear: () => void
}

export interface IStoreContext extends NextPageContext {
  /**
   * store
   */
  store: IStore
}

export function initializeStore (initialDate?: any) {
  // console.log('initializeStore', initialDate)

  if (AppUtil.isServerSide) store = createStore()

  if (firstLoading) return store
  firstLoading = true

  for (let key in store) {
    if (store[key] instanceof RouterStore) continue
    if (store[key].hydrate) store[key].hydrate(initialDate[key])
  }

  return store
}

export default store

