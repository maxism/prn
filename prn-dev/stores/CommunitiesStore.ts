import { action, computed, makeAutoObservable } from 'mobx'
import ISocialType from '../interfaces/ISocialType'
import APIClient from '../lib/APIClient'
import { IBaseStore, IStore } from './RootStore'
import { createForm, MobxForm } from '../utils/mobx-form-creator'

interface ICommunity {
  communityID: string
  accountID: string
  communityType: CommunityType
  name: string
  url: string
  image: string
  comment: string
  status: string
  avgER: number
  avgInteractions: number
  avgViews: number
  qualityScore: number
  socialType: ISocialType
  groupID: string
  color: string
  usersCount: number
  communityStatus: CommunityStatus
  cid: string
  // isInsights: boolean
  isPaid: boolean
  isBlocked: boolean
  isClosed: boolean
  isLoading: boolean
  isDeleted: boolean
  timeAutoReport: Date
  timeAdd: Date
}

interface ICommunityNoteForm {
  status: string
  comment: string
}

export enum CommunityType {
  MY = 'my',
  COMPETITOR = 'competitor',
  INFLUENCER = 'influencer'
}

export enum CommunityStatus {
  COLLECTING = 'COLLECTING',
  PARTIAL = 'PARTIAL',
  DONE = 'DONE'
}

export default class CommunitiesStore implements IBaseStore {
  private _rootStoreID = Symbol()

  public isLoading: boolean = true
  public isSearchLoading: boolean = false
  public communityNoteForm: MobxForm<ICommunityNoteForm> = {}

  private communities: Array<ICommunity> = []
  public searchCommunities: Array<ICommunity> = []

  constructor (rootStore: IStore) {
    makeAutoObservable(this)

    this[this._rootStoreID] = rootStore

    createForm(this.communityNoteForm,{
      status: '',
      comment: ''
    })
  }

  get _rootStore (): IStore {
    return this[this._rootStoreID]
  }

  @computed
  public getCommunityByCid (cid: string, projectID: string = ''): ICommunity {
    const accountID = projectID || this._rootStore.accountsStore.currentProject?.accountID
    return this.communities.find(item => item.accountID === accountID && item.cid === cid)
  }

  @computed
  public isAddedCommunity (cid: string, projectID: string = ''): ICommunity {
    const accountID = projectID || this._rootStore.accountsStore.currentProject?.accountID
    return this.communities.find(item => item.accountID === accountID && item.cid === cid && !item.isDeleted)
  }

  @computed
  public isInfluencerCommunity (cid: string): boolean {
    return Boolean(this.getInfluencersCommunities().find(item => item.cid === cid))
  }

  @computed
  public isMyOrCompetitorCommunity (cid: string): boolean {
    return Boolean(this.getMyCommunities().find(item => item.cid === cid))
      || Boolean(this.getCompetitorsCommunities().find(item => item.cid === cid))
  }

  @computed
  public getMyCommunities (accountID: string = null): Array<ICommunity> {
    accountID = accountID || this._rootStore.accountsStore.currentProject?.accountID
    return this.communities.filter(item => item.accountID === accountID && item.communityType === CommunityType.MY && !item.isDeleted)
  }

  @computed
  public getCompetitorsCommunities (accountID: string = null): Array<ICommunity> {
    accountID = accountID || this._rootStore.accountsStore?.currentProject?.accountID
    return this.communities.filter(item => item.accountID === accountID && item.communityType === CommunityType.COMPETITOR && !item.isDeleted)
  }

  @computed
  public getInfluencersCommunities (accountID: string = null): Array<ICommunity> {
    accountID = accountID || this._rootStore.accountsStore?.currentProject?.accountID
    return this.communities.filter(item => item.accountID === accountID && item.communityType === CommunityType.INFLUENCER && !item.isDeleted)
  }

  @computed
  public getAllProjectsMyCommunities (): Array<ICommunity> {
    return this.communities.filter(item => item.communityType === CommunityType.MY && !item.isDeleted)
  }

  @computed
  public getAllProjectsCompetitors (): Array<ICommunity> {
    return this.communities.filter(item => item.communityType === CommunityType.COMPETITOR && !item.isDeleted)
  }

  @computed
  public getAllProjectsInfluencers (): Array<ICommunity> {
    return this.communities.filter(item => item.communityType === CommunityType.INFLUENCER && !item.isDeleted)
  }

  @computed
  public getAllProjectsCommunitiesByCid (cid: string): Array<ICommunity> {
    return this.communities.filter(item => item.cid === cid && !item.isDeleted)
  }

  @computed
  public getMaxCommunityPerProject (communityType: CommunityType): number {
    let maxCommunities = 0
    this._rootStore.accountsStore.accounts.forEach(account => {
      const count = this.communities.filter(community => community.accountID === account.accountID && community.communityType === communityType && !community.isDeleted).length

      if (maxCommunities < count) maxCommunities = count
    })

    return maxCommunities
  }

  @action
  public async load (silentLoad = false): Promise<void> {
    // console.log('currentAccountID load', this._rootStore.accountsStore.currentAccount.accountID)
    if (!silentLoad) this.isLoading = true
    try {
      const { data } = await APIClient.get(`communities/`, {
        token: this._rootStore.profileStore.token,
        fields: 'isDeleted'
      }, 'loadCommunitiesCancel')

      this.communities = data.data
      // this.communities.sort((a, b) => this.SOCIAL_TYPES_ORDER[a.socialType] - this.SOCIAL_TYPES_ORDER[b.socialType])

      // console.log('loaded communities', this.communities.length)
    } catch (err) {
      // console.error(err)
    } finally {
      this.isLoading = false
    }
  }

  @action
  public async search (query: string): Promise<void> {
    try {
      this.isSearchLoading = true

      const data: any = await APIClient.get('search', {
        q: query,
        socialTypes: [],
        page: 1,
        perPage: 100,
        token: this._rootStore.profileStore.token
      }, 'communitiesSearchCancel')

      this.searchCommunities = data.data.data as Array<ICommunity>

      this.isSearchLoading = false
    } catch (err) {
      // console.error(err)
    }
  }

  @action
  public async add (url: string, type: CommunityType, projectID: string = ''): Promise<ICommunity> {
    // Ставим флаг процесса добавления сообщества
    this.searchCommunities = this.searchCommunities.map(item => ({ ...item, isLoading: item.url === url ? true : item.isLoading }))
    this.communities = this.communities.map(item => ({ ...item, isLoading: item.url === url ? true : item.isLoading }))
    this._rootStore.influenceStore.communities = this._rootStore.influenceStore.communities?.map(item => ({ ...item, isLoading: item.url === url ? true : item.isLoading }))

    let result = null
    try {
      const data = await APIClient.post(`accounts/${projectID || this._rootStore.accountsStore.currentProject.accountID}/communities`, {
        url,
        communityType: type,
        token: this._rootStore.profileStore.token
      })
      // console.log(data.data.data)
      result = data.data.data as ICommunity
      this.communities.unshift(result)
    } catch (err) {
      console.error(err, err.response.status, err.response)
    }

    await this._rootStore.accountsStore.load(true)
    await this._rootStore.communitiesStore.load(true)

    // Снимаем флаг процесса добавления сообщества
    this.searchCommunities = this.searchCommunities.map(item => ({ ...item, isLoading: item.url === url ? false : item.isLoading }))
    this.communities = this.communities.map(item => ({ ...item, isLoading: item.url === url ? false : item.isLoading }))
    this._rootStore.influenceStore.communities = this._rootStore.influenceStore.communities?.map(item => ({ ...item, isLoading: item.url === url ? false : item.isLoading }))

    return result
  }

  @action
  public async remove (communityID: string, projectID: string = ''): Promise<void> {
    try {
      await APIClient.delete(`accounts/${projectID || this._rootStore.accountsStore.currentProject.accountID}/communities/${communityID}`, {
        token: this._rootStore.profileStore.token
      })
      // console.log(data.data.data)
      this.communities = this.communities.map(item => ({ ...item, isDeleted: item.communityID === communityID ? true : item.isDeleted }))
    } catch (err) {
      console.error(err, err?.response?.status, err?.response)
    }

    await this._rootStore.accountsStore.load(true)
    await this._rootStore.communitiesStore.load(true)
  }

  @action
  public async switchAutoReport (communityID: string, newAutoReport: boolean): Promise<void> {
    try {
      await APIClient.post(`accounts/${this._rootStore.accountsStore.currentProject.accountID}/communities/${communityID}/switchAutoReport`, {
        token: this._rootStore.profileStore.token,
        autoReport: newAutoReport
      })
    } catch (err) {
      console.error(err, err?.response?.status, err?.response)
    }
  }

  @action
  public async switchCommunityType (communityID: string, newCommunityType: CommunityType): Promise<void> {
    try {
      await APIClient.post(`accounts/${this._rootStore.accountsStore.currentProject.accountID}/communities/${communityID}/switchCommunity`, {
        token: this._rootStore.profileStore.token,
        communityType: newCommunityType
      })
    } catch (err) {
      console.error(err, err?.response?.status, err?.response)
    }
  }

  @action
  public async changeProject (communityID: string, newAccountID: string | 'new'): Promise<string> {
    try {
      const data = await APIClient.post(`accounts/${this._rootStore.accountsStore.currentProject.accountID}/communities/${communityID}/switchCommunity`, {
        token: this._rootStore.profileStore.token,
        newAccountID: newAccountID
      })
      newAccountID = data.data.data.accountID
    } catch (err) {
      // console.log(err, err?.response?.status, err?.response)
    }

    return newAccountID
  }

  @action
  public async updateCommunity (url: string): Promise<void> {
    await APIClient.patch(`accounts/${this._rootStore.accountsStore.currentProject.accountID}/communities?fields=isDeleted`, {
      token: this._rootStore.profileStore.token,
      status: this.communityNoteForm.status.value,
      comment: this.communityNoteForm.comment.value,
      url
    })

    this.load(true)
  }

  public async getInfluencersListReportUrl (): Promise<string> {
    try {
      const data = await APIClient.get(`accounts/${this._rootStore.accountsStore.currentProject.accountID}/reports/favorites/export`, {
        token: this._rootStore.profileStore.token,
      }, 'loadInfluencersList')

      return data.data.data
    } catch (e) {
      if (e.__CANCEL__) return ''

      // console.log('loadInfluencersList', e.response)
      // validationErrors: e.response.data.meta.errors
    }

    return ''
  }

  /**
   * Прокидываем данные
   *
   * @param initialData
   */
  hydrate (initialData: any) {
    this.isLoading = initialData?.isLoading || false
    this.isSearchLoading = initialData?.isSearchLoading || false
    this.communities = initialData?.communities || []
    this.searchCommunities = initialData?.searchCommunities || []
    this.communityNoteForm.hydrate(initialData?.communityNoteForm)
  }

  /**
   * Очистка стора
   */
  public clear (): void {
    this.isLoading = false
    this.isSearchLoading = false
    this.communities = []
    this.searchCommunities = []
  }
}
