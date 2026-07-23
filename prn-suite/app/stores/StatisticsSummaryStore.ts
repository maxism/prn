import { CancelTokenSource } from 'axios'
import { action, computed, makeAutoObservable } from 'mobx'
import APIClient from '../lib/APIClient'
import whenChangedParameters from '../utils/whenChangedParameters'
import BaseAPI from './API/BaseAPI'
import RootStore from './RootStore'
import ISocialType from '../interfaces/ISocialType'

interface IStatisticsMetrics {
  usersCount: number | null
  deltaUsersCount: number | null
  deltaInteractions: number | null
  deltaLikes: number | null
  deltaComments: number | null
  deltaRePosts: number | null
  deltaDislikes: number | null
  deltaViews: number | null
  deltaPosts: number | null
  er: number | null
}

interface IStatisticsSerie extends IMyStatisticsInfo {
  communityID: string
  score: IStatisticsMetrics & { total: number }
}

interface IMyStatisticsInfo {
  current: IStatisticsMetrics
  avgCurrent: IStatisticsMetrics
  prev: IStatisticsMetrics
  delta: IStatisticsMetrics
  score?: IStatisticsMetrics
  avgScore?: IStatisticsMetrics
}

interface ICompetitorsStatisticsInfo {
  current: IStatisticsMetrics
  avgCurrent: IStatisticsMetrics
  prev: IStatisticsMetrics
  delta: IStatisticsMetrics
  score?: IStatisticsMetrics
  avgScore?: IStatisticsMetrics
}

export interface IStatisticsSummary {
  my: IMyStatisticsInfo
  competitors: ICompetitorsStatisticsInfo
}

export interface IStatistics {
  series: Array<IStatisticsSerie>
  summary: IStatisticsSummary
}

export default class StatisticsSummaryStore {
  private _cancelSource: CancelTokenSource
  public isLoading: boolean = false
  public statistics: IStatistics = {
    series: [],
    summary: {
      my: {},
      competitors: {}
    }
  } as IStatistics

  constructor () {
    makeAutoObservable(this)
  }

  @action
  @whenChangedParameters
  public async load (socialType: ISocialType, from: string, to: string, communitiesHash?: string): Promise<void> {
    this.isLoading = true
    if (this._cancelSource) this._cancelSource.cancel()
    this._cancelSource = BaseAPI.cancelSource()

    try {
      const data = await APIClient.get(`accounts/${RootStore.accountsStore.currentAccount.accountID}/statistics/summary`, {
        token: RootStore.profileStore.token,
        currentDateFrom: from,
        currentDateTo: to,
        socialType
      }, this._cancelSource.token)

      this.statistics = data.data.data

      this.isLoading = false
    } catch (e: any) {
      if (e.__CANCEL__) return

      console.log('Error statistics', e, e.response)
      // validationErrors: e.response.data.meta.errors
      return
    }
  }

  @computed
  public getStatisticsByCommunityID (communityID: string): IStatisticsSerie {
    return this.statistics.series.find(serie => serie.communityID === communityID)
  }

  @computed
  public getCompetitorsStatistics (): ICompetitorsStatisticsInfo {
    return this.statistics.summary.competitors
  }

  /**
   * Очистка стора
   */
  public clear (): void {
    if (this._cancelSource) this._cancelSource.cancel()
    this.isLoading = false
    this.statistics = {
      series: [],
      summary: {
        my: {},
        competitors: {}
      }
    } as IStatistics
  }
}
