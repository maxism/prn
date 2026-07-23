import { CancelTokenSource } from 'axios'
import { action, computed, makeAutoObservable } from 'mobx'
import APIClient from '../lib/APIClient'
import whenChangedParameters from '../utils/whenChangedParameters'
import BaseAPI from './API/BaseAPI'
import RootStore from './RootStore'

export interface IStatisticsActivity {
  cid: string
  points: {[key: string]: IStatisticsActivityPoint}
}

interface IStatisticsActivityPoint {
  likes?: number
  comments?: number
  rePosts?: number
  dislikes?: number
  views?: number
}

export default class StatisticsActivityStore {
  private _cancelSource: CancelTokenSource
  public isLoading: boolean = false
  public statistics: IStatisticsActivity = {
    cid: '',
    points: {}
  } as IStatisticsActivity

  constructor () {
    makeAutoObservable(this)
  }

  @action
  @whenChangedParameters
  public async load (communityID: string, communitiesHash?: string): Promise<void> {
    this.isLoading = true
    if (this._cancelSource) this._cancelSource.cancel()
    this._cancelSource = BaseAPI.cancelSource()

    try {
      const data = await APIClient.get(`accounts/${RootStore.accountsStore.currentAccount.accountID}/communities/${communityID}/statistics/activity`, {
        token: RootStore.profileStore.token,
      }, this._cancelSource.token)

      let statistics = data.data.data

      const offset = new Date().getTimezoneOffset() / -60
      const values = Object.values(statistics.points)
      if (offset > 0) {
        values.unshift(...values.splice(-offset))
      } else {
        values.push(...values.splice(offset))
      }
      Object.entries(statistics.points).map((item, index) => {
        statistics.points[item[0]] = values[index]
      })

      this.statistics = statistics

      // console.log('StatisticsStore statistics', statistics)
      this.isLoading = false
    } catch (e: any) {
      if (e.__CANCEL__) return

      if (e.response.status === 404) {
        this.statistics = { cid: communityID, points: {} }
        this.isLoading = false
      }

      console.log('Error statistics', e, e.response)
      // validationErrors: e.response.data.meta.errors
      return
    }
  }

  @computed
  public getActivityData (metric: string): Array<{ time: string, value: number }> {
    return Object.entries(this.statistics.points).map(item => {
      const [time, data] = item
      let value
      if (metric === 'interactions') {
        value = (data.likes || 0) + (data.comments || 0) + (data.dislikes || 0) + (data.rePosts || 0)
      } else if (metric === 'views') {
        value = data.views
      }

      return {
        time,
        value
      }
    })
  }

  @computed
  public getActivitiesList (): Array<string> {
    const activitiesList = ['interactions', 'views']
    const data = Object.values(this.statistics.points).filter(item => Object.keys(item).length)[0]
    return data && activitiesList.reduce((acc, value) => {
      if (value === 'interactions' && !['likes', 'comments', 'dislikes', 'rePosts'].every(item => data[item] === undefined)) {
        acc.push(value)
      }
      if (value === 'views' && data.views !== undefined) {
        acc.push(value)
      }
      return acc
    }, []) || ['interactions', 'views']
  }

  /**
   * Очистка стора
   */
  public clear (): void {
    if (this._cancelSource) this._cancelSource.cancel()
    this.isLoading = false
    this.statistics = {
      cid: '',
      points: {}
    } as IStatisticsActivity
  }
}
