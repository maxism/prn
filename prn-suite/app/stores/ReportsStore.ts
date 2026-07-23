import { CancelTokenSource } from 'axios'
import { action, makeAutoObservable } from 'mobx'
import APIClient from '../lib/APIClient'
import BaseAPI from './API/BaseAPI'
import RootStore from './RootStore'
import ISocialType from '../interfaces/ISocialType'

export default class ReportsStore {
  private _cancelSource: CancelTokenSource
  public isLoading: boolean = false
  public url: string = ''

  constructor () {
    makeAutoObservable(this)
  }

  @action
  public async loadCommunityReport (communityID: string, from: string, to: string): Promise<string> {
    this.isLoading = true
    if (this._cancelSource) this._cancelSource.cancel()
    this._cancelSource = BaseAPI.cancelSource()

    try {
      const data = await APIClient.get(`accounts/${RootStore.accountsStore.currentAccount.accountID}/communities/${communityID}/reports/export`, {
        token: RootStore.profileStore.token,
        withCompetitorsPosts: true,
        from,
        to
      }, this._cancelSource.token)

      this.url = data.data.data
      console.log('Export url', this.url)

      this.isLoading = false
    } catch (e: any) {
      if (e.__CANCEL__) return

      console.log('posts', e.response)
      // validationErrors: e.response.data.meta.errors
      return
    }
  }

  @action
  public async loadReport (socialType: ISocialType, from: string, to: string, short: boolean = false): Promise<string> {
    this.isLoading = true
    if (this._cancelSource) this._cancelSource.cancel()
    this._cancelSource = BaseAPI.cancelSource()

    try {
      const data = await APIClient.get(`accounts/${RootStore.accountsStore.currentAccount.accountID}/reports/export`, {
        token: RootStore.profileStore.token,
        from,
        to,
        socialType,
        short
      }, this._cancelSource.token)

      this.url = data.data.data
      console.log('Export url', this.url)

      this.isLoading = false
    } catch (e: any) {
      if (e.__CANCEL__) return

      console.log('posts', e.response)
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
    this.url = ''
  }
}
