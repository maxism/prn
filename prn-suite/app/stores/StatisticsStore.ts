import { CancelTokenSource } from 'axios'
import { action, makeAutoObservable } from 'mobx'
import moment, { Moment } from 'moment'
import APIClient from '../lib/APIClient'
import whenChangedParameters from '../utils/whenChangedParameters'
import BaseAPI from './API/BaseAPI'
import RootStore from './RootStore'

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

interface IStatisticsSerie extends IStatisticsMetrics {
  date: Moment
}

export interface IStatisticsSummary {
  prev: IStatisticsSerie
  current: IStatisticsSerie
  delta: IStatisticsSerie
}

export interface IStatistics {
  series: Array<IStatisticsSerie>
  summary: IStatisticsSummary
}

export default class StatisticsStore {
  private _cancelSource: CancelTokenSource
  public isLoading: boolean = false
  public statistics: IStatistics = {
    series: [],
    summary: {
      prev: {},
      current: {},
      delta: {}
    }
  } as IStatistics

  constructor () {
    makeAutoObservable(this)
  }

  @action
  @whenChangedParameters
  public async load (communityID: string, from: string, to: string, communitiesHash?: string): Promise<void> {
    this.isLoading = true
    if (this._cancelSource) this._cancelSource.cancel()
    this._cancelSource = BaseAPI.cancelSource()

    try {
      const data = await APIClient.get(`accounts/${RootStore.accountsStore.currentAccount.accountID}/communities/${communityID}/statistics/retrospective`, {
        token: RootStore.profileStore.token,
        currentDateFrom: from,
        currentDateTo: to
      }, this._cancelSource.token)

      const statistics = data.data.data

      statistics.series = statistics.series.map(serie => ({ ...serie, date: moment(serie.date, 'DD.MM.YYYY') }))

      this.statistics = statistics

      // console.log('StatisticsStore statistics', statistics)

      this.isLoading = false
    } catch (e: any) {
      if (e.__CANCEL__) return

      console.log('Error statistics', e, e.response)
      // validationErrors: e.response.data.meta.errors
      return
    }
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
        prev: {},
        current: {},
        delta: {}
      }
    } as IStatistics
  }
}
