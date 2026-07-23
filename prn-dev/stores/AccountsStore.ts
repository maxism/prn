import { action, computed, makeAutoObservable } from 'mobx'
import { IBaseStore, IStore } from './RootStore'
import APIClient from '../lib/APIClient'
import CookieUtil from '../utils/CookieUtil'
import { createForm, MobxForm } from '../utils/mobx-form-creator'
import ISocialType from '../interfaces/ISocialType'
import ObjectUtil from '../utils/ObjectUtil'

interface IAccount {
  accountID: string
  name: string
  image: string
  socials: Array<ISocialType>
  communitiesCount: number
  myCommunitiesCount: number
  competitorCommunitiesCount: number
  influencerCommunitiesCount: number
  creditsCommunitiesCount: number
  isPaid: boolean
  country: string
  category: string
  reportPeriod: string
}

interface IProjectForm {
  name: string
  image: string
  country: string
  category: string
  reportPeriod: string
}

export default class AccountsStore implements IBaseStore {
  private _rootStoreID = Symbol()
  private _currentAccountID: string = null

  public isLoading: boolean = false
  public isCreating: boolean = false
  public accounts: Array<IAccount> = []
  public projectForm: MobxForm<IProjectForm> = {}

  constructor (rootStore: IStore) {
    makeAutoObservable(this)

    this[this._rootStoreID] = rootStore

    createForm(this.projectForm,{
      name: '',
      image: '',
      country: '',
      category: '',
      reportPeriod: ''
    })
  }

  get _rootStore (): IStore {
    return this[this._rootStoreID]
  }

  @action
  public async load (silentLoad = false): Promise<void> {
    this.isLoading = !silentLoad
    try {
      const data = await APIClient.get('accounts', { token: this._rootStore.profileStore.token })
      this.accounts = data.data.data as Array<IAccount>

      // console.log(result)
    } catch (err) {
      //console.log(err)
    } finally {
      this.isLoading = false
    }
  }

  @action
  public async createAccount (): Promise<IAccount> {
    this.isCreating = true

    try {
      const data = await APIClient.post('accounts', ObjectUtil.removeUndefined({
        name: this.projectForm.name.value || undefined,
        image: this.projectForm.image.value || undefined,
        token: this._rootStore.profileStore.token
      }))
      const account = data.data.data as IAccount
      await this.load()
      await this.setAccount(account.accountID)

      this.isCreating = false

      return account
    } catch (err) {
      // console.log(err, err?.response?.status, err?.response)
    }

    this.isCreating = false
  }

  @action
  public async removeAccount (accountID: string = ''): Promise<IAccount> {
    if (!accountID) accountID = this.currentProject.accountID
    try {
      const data = await APIClient.delete(`accounts/${accountID}`, { token: this._rootStore.profileStore.token })
      const account = data.data.data as IAccount

      await this.load()

      return account
    } catch (err) {
      // console.log(err, err?.response?.status, err?.response)
    }
  }

  /**
   * Переключение аккаунта. Возвращает ID установленного аккаунта
   *
   * @param accountID
   */
  @action
  public async setAccount (accountID: string = null): Promise<void> {
    console.log('setAccount', accountID)

    if (!accountID) accountID = CookieUtil.get(null, 'c_accountId') || ''

    if (this._currentAccountID === accountID) return
    this._currentAccountID = accountID

    if (!this.accounts.length) {
      await this.load()
      return
    }

    await this._rootStore.communitiesStore.load()

    CookieUtil.set(null, 'c_accountId', this.currentProject.accountID)
  }

  @action
  public async update (projectID: string): Promise<void> {
    this.isLoading = true
    try {
      await APIClient.patch(`accounts/${projectID}`, {
        name: this.projectForm.name.value,
        country: this.projectForm.country.value,
        category: this.projectForm.category.value,
        reportPeriod: this.projectForm.reportPeriod.value,
        token: this._rootStore.profileStore.token
      })

      await this.load()

      this.projectForm.setCompleted()
    } catch (e) {
      this.projectForm.setErrors(e.response.data.meta.errors || [])
    }
    this.isLoading = false
  }

  @action
  public async updateImage (projectID: string): Promise<void> {
    try {
      await APIClient.patch(`accounts/${projectID}`, {
        image: this.projectForm.image.value,
        token: this._rootStore.profileStore.token
      })

      await this.load()

      this.projectForm.setCompleted()
    } catch (e) {
      this.projectForm.setErrors(e.response.data.meta.errors || [])
    }
  }

  @computed
  public get currentProject (): IAccount {
    let account = this.accounts.find(item => item.accountID === this._currentAccountID)
    if (!account) account = this.accounts?.length ? this.accounts[0] : null

    return account
  }

  @computed
  public getProjects = (): Array<IAccount> => this.accounts

  @computed
  public getProject = (projectID: string): IAccount => this.accounts.find(item => item.accountID === projectID)

  @computed
  public getTotalProjectsCount = () => this.accounts.length

  @computed
  public getTotalMyCommunitiesCount = () => this.accounts.reduce((acc, item) => acc + item.myCommunitiesCount, 0)

  @computed
  public getTotalCompetitorCommunitiesCount = () => this.accounts.reduce((acc, item) => acc + item.competitorCommunitiesCount, 0)

  @computed
  public getTotalInfluencerCommunitiesCount = () => this.accounts.reduce((acc, item) => acc + item.influencerCommunitiesCount, 0)

  /**
   * Прокидываем данные
   *
   * @param initialData
   */
  hydrate (initialData: any) {
    this._currentAccountID = initialData?._currentAccountID || null
    this.isLoading = initialData?.isLoading || false
    this.accounts = initialData?.accounts || []
    this.projectForm.hydrate(initialData?.projectForm)
  }

  /**
   * Очистка стора
   */
  public clear (): void {
    this._currentAccountID = null
    this.isLoading = false
    this.accounts = []
  }
}
