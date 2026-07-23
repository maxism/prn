import { action, makeAutoObservable } from 'mobx'
import APIClient from '../lib/APIClient'
import {IBaseStore, IStore} from './RootStore'
import ISocialType from '../interfaces/ISocialType'
import ArrayUtil from '../utils/ArrayUtil'

interface ISocialIndexSummary {
  socialType: ISocialType

  lastAvgIndex: number
  lastAvgUsersCount: number
  lastAvgPosts: number
  lastAvgInteractions: number
  lastAvgViews: number
  lastAvgEr: number
  lastAvgAr: number

  deltaAvgIndex: number
  deltaAvgUsersCount: number
  deltaAvgPosts: number
  deltaAvgInteractions: number
  deltaAvgViews: number
  deltaAvgEr: number
  deltaAvgAr: number

  deltaPctAvgIndex: number
  deltaPctAvgWeekIndex: number
  deltaPctAvgMonthIndex: number
  deltaPctAvgUsersCount: number
  deltaPctAvgPosts: number
  deltaPctAvgInteractions: number
  deltaPctAvgViews: number
  deltaPctAvgEr: number
  deltaPctAvgAr: number
}

interface ISocialIndexMetrics {
  date: Date
  avgIndex: number
  avgUsersCount: number
  avgPosts: number
  avgInteractions: number
  avgViews: number
  avgEr: number
  avgAr: number
}

export default class SocialIndexStore implements IBaseStore {
  private _rootStoreID = Symbol()
  public retrospective: Array<ISocialIndexMetrics> = []
  public indices: Array<ISocialIndexSummary> = []
  public summary: ISocialIndexSummary = null
  public isLoading: boolean = false

  constructor (rootStore: IStore) {
    makeAutoObservable(this)

    this[this._rootStoreID] = rootStore
  }

  get _rootStore (): IStore {
    return this[this._rootStoreID]
  }

  @action
  public async load (socialType: ISocialType, country: string, industry: string): Promise<void> {
    this.isLoading = true

    this.retrospective = []
    this.summary = null

    try {
      const data: any = await APIClient.get('socialindex/retrospective', {
        socialType,
        country,
        industry,
        days: 7 * 30,
        token: this._rootStore.profileStore.token
      }, 'socialindexRetrospectiveCancel')

      const retrospective = data.data.data
      this.retrospective = retrospective
    } catch (e) {
      //
    }

    try {
      const data: any = await APIClient.get('socialindex', {
        country,
        industry,
        token: this._rootStore.profileStore.token
      }, 'socialindexCancel')

      let indices = data.data.data.map(item => ({
        socialType: item.socialType as ISocialType,
        lastAvgIndex: item.lastAvgMonthIndex,
        lastAvgUsersCount: item.lastAvgMonthUsersCount,
        lastAvgPosts: item.lastAvgMonthPosts * 30,
        lastAvgInteractions: item.lastAvgMonthInteractions * 30,
        lastAvgViews: item.lastAvgMonthViews * 30,
        lastAvgEr: item.lastAvgMonthEr,
        lastAvgAr: item.lastAvgMonthAr,

        deltaAvgIndex: item.deltaAvgMonthIndex * 30,
        deltaAvgUsersCount: item.deltaAvgMonthUsersCount * 30,
        deltaAvgPosts: item.deltaAvgMonthPosts * 30,
        deltaAvgInteractions: item.deltaAvgMonthInteractions * 30,
        deltaAvgViews: item.deltaAvgMonthViews * 30,
        deltaAvgEr: item.deltaAvgMonthEr,
        deltaAvgAr: item.deltaAvgMonthAr,

        deltaPctAvgIndex: item.deltaPctAvgMonthIndex,
        deltaPctAvgWeekIndex: item.deltaPctAvgWeekIndex,
        deltaPctAvgMonthIndex: item.deltaPctAvgMonthIndex,
        deltaPctAvgUsersCount: item.deltaPctAvgMonthUsersCount,
        deltaPctAvgPosts: item.deltaPctAvgMonthPosts,
        deltaPctAvgInteractions: item.deltaPctAvgMonthInteractions,
        deltaPctAvgViews: item.deltaPctAvgMonthViews,
        deltaPctAvgEr: item.deltaPctAvgMonthEr,
        deltaPctAvgAr: item.deltaPctAvgMonthAr,
      }))
      const summary = indices.find(item => item.socialType === socialType)

      indices = ArrayUtil.arrayObjectsSort('-lastAvgIndex', indices)

      this.indices = indices
      this.summary = summary
    } catch (e) {
      //
    }

    this.isLoading = false
  }

  /**
   * Прокидываем данные
   *
   * @param initialData
   */
  hydrate (initialData: any) {
    this.indices = initialData?.indices || []
    this.summary = initialData?.summary
    this.retrospective = initialData?.retrospective
    this.isLoading = initialData?.isLoading
  }

  /**
   * Очистка стора
   */
  public clear (): void {
    this.indices = []
    this.summary = null
    this.retrospective = []
    this.isLoading = false
  }
}
