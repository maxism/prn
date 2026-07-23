import { action, makeAutoObservable } from 'mobx'
import RootStore from './RootStore'
import APIClient from '../lib/APIClient'
import ISocialType from '../interfaces/ISocialType'
import whenChangedParameters from '../utils/whenChangedParameters'

interface IApplication {
  appID: string
  socialType: ISocialType
  sourceType: string
  name: string
}

interface ISourceToken {
  tokenID: string,
  socialType: ISocialType
  socialUserID: string
  socialUserName: string
  socialUserImage: string
  active: boolean
}

export default class SourcesStore {
  public isLoading: boolean = false
  public applications: Array<IApplication> = []
  public tokens: Array<ISourceToken> = []

  public tgHashCode: string = ''
  public tgErrorMessage: string = ''

  constructor () {
    makeAutoObservable(this)
  }

  @action
  public async loadApplications (): Promise<void> {
    this.isLoading = true

    if (!RootStore.accountsStore.currentAccount?.accountID) return

    try {
      const data = await APIClient.get(`accounts/${RootStore.accountsStore.currentAccount.accountID}/data-sources/applications`, {
        token: RootStore.profileStore.token
      })
      this.applications = data.data.data as Array<IApplication>
    } catch (err: any) {
      console.log(err, err.response)
    } finally {
      this.isLoading = false
    }
  }

  @action
  public async tgSendCode (phone: string): Promise<void> {
    this.tgHashCode = ''
    this.tgErrorMessage = ''
    try {
      const { data } = await APIClient.get('tg2SendCode', { phone })
      if (data.meta.code === 200) {
        this.tgHashCode = data.data
      } else {
        this.tgErrorMessage = data.meta.message
      }
    } catch (err: any) {
      console.log(err, err?.response?.status, err?.response)
    }
  }

  @action
  public async tgSignIn (phone: string, phoneCode: string, phoneCodeHash: string): Promise<boolean> {
    try {
      const { data } = await APIClient.get('tg2SignIn', {
        phone,
        phoneCode,
        phoneCodeHash
      })
      if (data.meta.code === 200) {
        return true
      } else {
        this.tgErrorMessage = data.meta.message
      }
    } catch (err: any) {
      console.log(err, err?.response?.status, err?.response)
    }

    return false
  }

  @action
  @whenChangedParameters
  public async loadTokens (accountID: string): Promise<void> {
    this.isLoading = true
    await this._loadTokens()
    this.isLoading = false
  }

  @action
  public async deleteTokens (tokenIDs: Array<string>): Promise<void> {
    for (const tokenID of tokenIDs) {
      try {
        await APIClient.delete(`accounts/${RootStore.accountsStore.currentAccount.accountID}/data-sources/tokens/${tokenID}`, {
          token: RootStore.profileStore.token
        })
      } catch (err: any) {
        console.log(err, err?.response?.status, err?.response)
      }
    }
    await this._loadTokens()
  }

  @action
  public async updateToken (tokenID: string, accessToken: string): Promise<void> {
    try {
      await APIClient.patch(`accounts/${RootStore.accountsStore.currentAccount.accountID}/data-sources/tokens/${tokenID}`, {
        token: RootStore.profileStore.token,
        accessToken
      })
    } catch (err: any) {
      console.log(err, err?.response?.status, err?.response)
    }
    await this._loadTokens()
  }

  private async _loadTokens (): Promise<void> {
    try {
      const data = await APIClient.get(`accounts/${RootStore.accountsStore.currentAccount.accountID}/data-sources/tokens`, {
        token: RootStore.profileStore.token
      })
      this.tokens = data.data.data as Array<ISourceToken>
    } catch (err: any) {
      console.log(err, err?.response?.status, err?.response)
    }
  }

  /**
   * Очистка стора
   */
  public clear (): void {
    this.isLoading = false
    this.applications = []
    this.tokens = []
  }
}
