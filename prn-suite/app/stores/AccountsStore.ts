import { action, makeAutoObservable } from 'mobx'
import RootStore from './RootStore'
import APIClient from '../lib/APIClient'
import NumeralUtil from '../utils/NumeralUtil'

interface IAccount {
  accountID: string
  name: string
  image: string
  communitiesCount: number
  myCommunitiesCount: number
  competitorCommunitiesCount: number
  influencerCommunitiesCount: number
  creditsCommunitiesCount: number
}

interface IAccountUpdate {
  name: string
  image: string
}

export default class AccountsStore {
  public isLoading: boolean = false
  public isUpdating: boolean = false
  public accounts: Array<IAccount> = []
  public currentAccount: IAccount = null

  constructor () {
    makeAutoObservable(this)
  }

  @action
  public async load (silentLoad = false): Promise<void> {
    this.isLoading = !silentLoad
    try {
      const data = await APIClient.get('accounts', {
        token: RootStore.profileStore.token
      })
      // console.log(data.data.data)
      const result = data.data.data as Array<IAccount>
      this.accounts = result
      await this.setAccount()
    } catch (err) {
      console.log(err)
    } finally {
      this.isLoading = false
    }
  }

  @action
  public async createAccount (): Promise<IAccount> {
    try {
      const data = await APIClient.post('accounts', {
        token: RootStore.profileStore.token
      })
      // console.log(data.data.data)
      const result = data.data.data as IAccount
      this.accounts.push(result)

      return result
    } catch (err: any) {
      console.log(err, err?.response?.status, err?.response)
    }
  }

  @action
  public async removeAccount (accountID: string = ''): Promise<IAccount> {
    if (!accountID) accountID = this.currentAccount.accountID
    // console.log('removeAccount', accountID)
    try {
      const data = await APIClient.delete(`accounts/${accountID}`, {
        token: RootStore.profileStore.token
      })
      // console.log(data.data)
      const result = data.data.data as IAccount

      await RootStore.profileStore.load(true)

      return result
    } catch (err: any) {
      console.log(err, err?.response?.status, err?.response)
    }
  }

  @action
  public async updateAccount (accountID: string, params: IAccountUpdate): Promise<IAccount> {
    this.isUpdating = true
    // console.log('removeAccount', accountID)
    try {
      const data = await APIClient.patch(`accounts/${accountID}`, {
        name: params.name,
        image: params.image,
        token: RootStore.profileStore.token
      })
      // console.log(data.data)
      const result = data.data.data as IAccount

      await RootStore.profileStore.load(true)
      this.isUpdating = false

      return result
    } catch (err: any) {
      console.log(err, err?.response?.status, err?.response)
    }

    this.isUpdating = false
  }

  /**
   * Переключение аккаунта. Возвращает ID установленного аккаунта
   *
   * @param accountID
   */
  @action
  public async setAccount (accountID: string = null): Promise<string> {
    if (!this.accounts.length) return

    let newAccount: IAccount = this.accounts.find(item => item.accountID === accountID)

    if (!newAccount) newAccount = this.accounts.find(item => item.accountID === this.currentAccount?.accountID)
    if (!newAccount && accountID === 'localstorage') newAccount = this.accounts.find(item => item.accountID === localStorage.getItem('currentAccountID'))
    if (!newAccount) newAccount = this.accounts[0]

    if (this.currentAccount?.accountID !== newAccount?.accountID || !this.currentAccount || !accountID) {
      this.currentAccount = newAccount
      localStorage.setItem('currentAccountID', newAccount?.accountID)
      await RootStore.communitiesStore.load(true)
    }

    // console.log('setAccount accountID', accountID, '=>', newAccount?.accountID)

    return newAccount?.accountID || ''
  }

  public getCurrentProduct (): string {
    const lsProduct = localStorage.getItem('currentProduct')
    let product = ''

    if (location.pathname.includes('/statistics')) product = 'statistics'
    else if (location.pathname.includes('/messenger')) product = 'messenger'
    else if (location.pathname.includes('/content')) product = 'content'
    else if (location.pathname.includes('/search')) product = 'search'
    else if (location.pathname.includes('/settings/communities')) product = 'settings/communities'
    else product = lsProduct

    if (product !== lsProduct) localStorage.setItem('currentProduct', product)

    return product
  }

  getDescription = (account) => {
    if (!account) return ''

    const my = NumeralUtil.format(account.myCommunitiesCount, '0,0', ['страница', 'страницы', 'страниц'])
    const competitor = NumeralUtil.format(account.competitorCommunitiesCount, '0,0', ['конкурент', 'конкурента', 'конкурентов'])
    const influencer = NumeralUtil.format(account.influencerCommunitiesCount, '0,0', ['блогер', 'блогера', 'блогеров'])

    const list = [account.myCommunitiesCount ? my : '', account.competitorCommunitiesCount ? competitor : '', account.influencerCommunitiesCount ? influencer : ''].filter(b => b)

    if (!account.myCommunitiesCount && !account.competitorCommunitiesCount && !account.influencerCommunitiesCount) return 'Пустой проект'
    if (list.length === 3) return `${account.myCommunitiesCount} стр., ${account.competitorCommunitiesCount} конк., ${account.influencerCommunitiesCount} блог.`

    return list.join(', ')
  }

  /**
   * Очистка стора
   */
  public clear (): void {
    this.isLoading = false
    this.accounts = []
    this.currentAccount = null
  }
}
