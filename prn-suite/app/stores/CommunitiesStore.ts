import { CancelTokenSource } from 'axios'
import { action, computed, makeAutoObservable } from 'mobx'
import ISocialType from '../interfaces/ISocialType'
import CommunityType from '../types/CommunityType'
import BaseAPI from './API/BaseAPI'
import RootStore from './RootStore'
import ICommunity from '../interfaces/ICommunity'
import APIClient from '../lib/APIClient'
import Notifications from '../ui/elements/Notifications/Notifications'
import CommunityStatus from '../types/CommunityStatus'
import Timeout = NodeJS.Timeout
import ObjectUtil from '../utils/ObjectUtil'

interface ISearchParams {
  socialType?: string
  tags?: Array<string>
  locations?: Array<string>
  language?: string
  category?: string
  interest?: string
  genders?: string
  minAge?: number
  maxAge?: number
  minUsersCount?: number
  maxUsersCount?: number
  minER?: number
  maxER?: number
  minViews?: number
  maxViews?: number
  audienceLocations?: Array<string>
  audienceGenders?: string
  minAudienceAge?: number
  maxAudienceAge?: number
  maxFakeFollowers?: number
  minQualityScore?: number
  isVerified?: boolean
  isActive?: boolean
  minAudienceLocationsPercent?: number,
  minAudienceGendersPercent?: number,
  minAudienceAgePercent?: number,
  page?: number
  sort?: string
}

export interface IRatingTag {
  tagID: string
  icon: string
  name: string
  parent: string
  level: number
  fullName: string
  isLeaf: boolean
  hidden: boolean
  code: string
  parents: Array<string>
}

export default class CommunitiesStore {
  private SOCIAL_TYPES_ORDER = ['VK', 'FB', 'INST', 'OK', 'TT', 'TG', 'TW', 'YZ', 'RT', 'YT', 'CH', 'VB', 'TC', 'VC', 'MX']
    .reduce((c, v, i) => Object.assign(c, { [v]: i }), {})

  private _loopTimeout: Timeout

  public isLoading: boolean = true
  public isSearchLoading: boolean = false
  public searchTotalResults: number = 0
  public communities: Array<ICommunity> = []
  public searchCommunities: Array<ICommunity> = []
  public communitiesHash: string
  public tags: Array<IRatingTag> = []

  private _searchCancelSource: CancelTokenSource

  constructor () {
    makeAutoObservable(this)
  }

  @computed
  public getCommunityByCommunityID (communityID: string): ICommunity {
    return this.communities.find(item => item.communityID === communityID)
  }

  @computed
  public getCommunityByCID (cid: string): ICommunity {
    return this.communities.find(item => item.cid === cid)
  }

  @computed
  public getCommunityByUrl (url: string): ICommunity {
    return this.communities.find(item => item.url === url)
  }

  @computed
  public getCommunitiesBySocialType (socialType: ISocialType): Array<ICommunity> {
    return this.communities.filter(item => item.socialType === socialType)
  }

  @computed
  public getMyCommunityBySocialType (socialType: ISocialType): ICommunity {
    return this.communities.filter(item => item.socialType === socialType).find(item => item.communityType === CommunityType.MY)
  }

  @computed
  public getMyCommunityStatusBySocialType (socialType: ISocialType): string {
    return this.communities.filter(item => item.socialType === socialType).find(item => item.communityType === CommunityType.MY)?.communityStatus
  }

  @computed
  public getMyCommunityStatus (): string {
    const communities = this.communities.filter(item => item.communityType === CommunityType.MY)

    if (communities.find(item => item.communityStatus === 'COLLECTING')) return 'COLLECTING'
    if (communities.find(item => item.communityStatus === 'PARTIAL')) return 'PARTIAL'
    if (communities.find(item => item.communityStatus === 'DONE')) return 'DONE'

    return null
  }

  @computed
  public getMyCommunitySocialTypes (): Array<ISocialType> {
    return [ ...new Set(this.communities.filter(item => item.communityType === CommunityType.MY).map(item => item.socialType))] as Array<ISocialType>
  }

  @computed
  public getCompetitorsSocialTypes (): Array<ISocialType> {
    return [ ...new Set(this.communities.filter(item => item.communityType === CommunityType.COMPETITOR).map(item => item.socialType))] as Array<ISocialType>
  }

  @computed
  public getCompetitorsCommunitiesBySocialType (socialType: ISocialType): Array<ICommunity> {
    return this.communities.filter(item => item.communityType === CommunityType.COMPETITOR && item.socialType === socialType)
  }

  @computed
  public getCommunities (): Array<ICommunity> {
    return this.communities
  }

  @computed
  public getMyAndCompetitorsCommunities (): Array<ICommunity> {
    return this.communities.filter(item => [CommunityType.MY, CommunityType.COMPETITOR].includes(item.communityType))
  }

  @computed
  public getMyCommunities (): Array<ICommunity> {
    return this.communities.filter(item => item.communityType === CommunityType.MY)
  }

  @computed
  public getCompetitorsCommunities (): Array<ICommunity> {
    return this.communities.filter(item => item.communityType === CommunityType.COMPETITOR)
  }

  @computed
  public getInfluencersCommunities (): Array<ICommunity> {
    return this.communities.filter(item => item.communityType === CommunityType.INFLUENCER)
  }

  @computed
  public getCompetitorsCommunityStatusBySocialType (socialType: ISocialType): string {
    const competitors = this.communities.filter(item => item.communityType === CommunityType.COMPETITOR && item.socialType === socialType)

    if (competitors.find(item => item.communityStatus === 'COLLECTING')) return 'COLLECTING'
    if (competitors.find(item => item.communityStatus === 'PARTIAL')) return 'PARTIAL'
    if (competitors.find(item => item.communityStatus === 'DONE')) return 'DONE'

    return null
  }

  @computed
  public getCompetitorsCommunityStatus (): string {
    const competitors = this.communities.filter(item => item.communityType === CommunityType.COMPETITOR)

    if (competitors.find(item => item.communityStatus === 'COLLECTING')) return 'COLLECTING'
    if (competitors.find(item => item.communityStatus === 'PARTIAL')) return 'PARTIAL'
    if (competitors.find(item => item.communityStatus === 'DONE')) return 'DONE'

    return null
  }

  @action
  public async load (silentLoad = false): Promise<void> {
    clearInterval(this._loopTimeout)
    if (!silentLoad) this.isLoading = true
    try {
      const data = await APIClient.get(`accounts/${RootStore.accountsStore?.currentAccount?.accountID}/communities`, {
        token: RootStore.profileStore.token
      })
      // console.log(data.data.data)
      const result = data.data.data as Array<ICommunity>
      if (result.length && result[0].accountID !== RootStore.accountsStore?.currentAccount?.accountID) {
        // console.log('fake update')
      } else {
        // console.log('loaded communities')
        // todo: Сделать проверку на изменение статуса сообществ и показывать пользователю нотификацию о изменении статуса
        // Например: Завершен первичный сбор данных по сообществу
        this.sendCommunityNotifications(result)

        this.communities = result.sort((a, b) => this.SOCIAL_TYPES_ORDER[a.socialType] - this.SOCIAL_TYPES_ORDER[b.socialType])
        this.communitiesHash = this.communities.map(community => `${community.communityID}_${community.communityStatus}_${community.communityType}`).join(',')
      }
    } catch (err) {
      // console.error(err)
    } finally {
      this.isLoading = false
    }
    if (RootStore.accountsStore && RootStore.accountsStore.currentAccount) {
      this._loopTimeout = setTimeout(() => this.load(true), 60000)
    }
  }

  @action
  public async add (url: string, type: string, cid: string = ''): Promise<ICommunity> {
    // Ставим флаг процесса добавления сообщества
    this.searchCommunities = this.searchCommunities.map(item => ({ ...item, isAdding: item.url === url ? true : item.isAdding }))

    let result = null
    try {
      const data = await APIClient.post(`accounts/${RootStore.accountsStore.currentAccount.accountID}/communities`, {
        url,
        cid,
        communityType: type,
        token: RootStore.profileStore.token
      })
      // console.log(data.data.data)
      result = data.data.data as ICommunity
      this.communities.unshift(result)
      await RootStore.profileStore.load(true)
    } catch (err: any) {
      console.error(err, err.response.status, err.response)
    }

    // Снимаем флаг процесса добавления сообщества
    this.searchCommunities = this.searchCommunities.map(item => ({ ...item, isAdding: item.url === url ? false : item.isAdding }))

    return result
  }

  @action
  public async remove (communityID: string): Promise<void> {
    try {
      await APIClient.delete(`accounts/${RootStore.accountsStore.currentAccount.accountID}/communities/${communityID}`, {
        token: RootStore.profileStore.token
      })
      // console.log(data.data.data)
      const index = this.communities.findIndex(item => item.communityID === communityID)
      this.communities.splice(index, 1)
      await RootStore.profileStore.load(true)
    } catch (err: any) {
      console.error(err, err?.response?.status, err?.response)
    }
  }

  @action
  public async switchAutoReport (communityID: string, newAutoReport: boolean): Promise<void> {
    try {
      await APIClient.post(`accounts/${RootStore.accountsStore.currentAccount.accountID}/communities/${communityID}/switchAutoReport`, {
        token: RootStore.profileStore.token,
        autoReport: newAutoReport
      })
      // console.log('changeCommunityType', data.data.data)
      await RootStore.profileStore.load(true)
    } catch (err: any) {
      console.error(err, err?.response?.status, err?.response)
    }
  }

  @action
  public async switchCommunityType (communityID: string, newCommunityType: CommunityType): Promise<void> {
    try {
      await APIClient.post(`accounts/${RootStore.accountsStore.currentAccount.accountID}/communities/${communityID}/switchCommunity`, {
        token: RootStore.profileStore.token,
        communityType: newCommunityType
      })
      // console.log('changeCommunityType', data.data.data)
      await RootStore.profileStore.load(true)
    } catch (err: any) {
      console.error(err, err?.response?.status, err?.response)
    }
  }

  @action
  public async changeProject (communityID: string, newAccountID: string | 'new'): Promise<string> {
    try {
      const data = await APIClient.post(`accounts/${RootStore.accountsStore.currentAccount.accountID}/communities/${communityID}/switchCommunity`, {
        token: RootStore.profileStore.token,
        newAccountID: newAccountID
      })
      // console.log('changeProject', data.data.data)
      newAccountID = data.data.data.accountID
      await RootStore.profileStore.load(true)
    } catch (err: any) {
      console.log(err, err?.response?.status, err?.response)
    }

    return newAccountID
  }

  @action
  public async manageCommunity (cid: string, { resetShortLoop = false, resetLongLoop = false }: { resetShortLoop?: boolean, resetLongLoop?: boolean } = {}): Promise<void> {
    try {
      const data = await APIClient.get(`community?cid=${cid}&manage=true&priorityRandomMembers=true&resetShortLoop=${resetShortLoop ? 'true' : ''}&resetLongLoop=${resetLongLoop ? 'true' : ''}`, {
        token: RootStore.profileStore.token
      })
      await RootStore.profileStore.load(true)
    } catch (err: any) {
      console.log(err, err?.response?.status, err?.response)
    }
  }

  @action
  public async registerCallback (communityID: string, accessToken: string): Promise<boolean | string> {
    console.log('register callback start')
    try {
      const data = await APIClient.post(`social/accounts/${RootStore.accountsStore.currentAccount.accountID}/communities/${communityID}/callback`, {
        token: RootStore.profileStore.token,
        accessToken: accessToken
      })
      console.log(`register callback:: ${data.data.meta.message}`)
      RootStore.accountsStore.load(true)
      return true
    } catch (err: any) {
      console.error(err, err.response.status, err.response)
      if (err.response.status === 400) return err.response.data.meta.errors.accessToken
    }
  }

  @action
  public async removeCallback (communityID: string): Promise<void> {
    try {
      await APIClient.delete(`social/accounts/${RootStore.accountsStore.currentAccount.accountID}/communities/${communityID}/callback`, {
        token: RootStore.profileStore.token
      })
      // console.log(`remove callback:: ${data.data.meta.message}`)
      RootStore.accountsStore.load(true)
    } catch (err: any) {
      console.error(err, err.response.status, err.response)
    }
  }

  @action
  public async search (q: string, params: ISearchParams = {}): Promise<void> {
    this.isSearchLoading = true
    if (params.page === 1) {
      this.searchCommunities = []
      this.searchTotalResults = 0
    }

    if (this._searchCancelSource) this._searchCancelSource.cancel()
    this._searchCancelSource = BaseAPI.cancelSource()
    try {
      const data = await APIClient.get('search', ObjectUtil.removeUndefined({
        q,
        socialTypes: params.socialType !== 'ALL' ? [params.socialType] : [],
        tags: (params.tags || []).concat([params.language, params.category, params.interest]).filter(Boolean),
        locations: params.locations || [],
        genders: params.genders || undefined,
        minAge: params.minAge,
        maxAge: params.maxAge,
        minUsersCount: params.minUsersCount,
        maxUsersCount: params.maxUsersCount,
        minER: params.minER,
        maxER: params.maxER,
        minViews: params.minViews,
        maxViews: params.maxViews,
        audienceLocations: params.audienceLocations || [],
        audienceGenders: params.audienceGenders || undefined,
        minAudienceAge: params.minAudienceAge,
        maxAudienceAge: params.maxAudienceAge,
        maxFakeFollowers: params.maxFakeFollowers,
        minQualityScore: params.minQualityScore,
        isVerified: params.isVerified,
        isActive: params.isActive,
        minAudienceLocationsPercent: params.minAudienceLocationsPercent,
        minAudienceGendersPercent: params.minAudienceGendersPercent,
        minAudienceAgePercent: params.minAudienceAgePercent,
        sort: params.sort,
        page: params.page,
        perPage: 10,
        extended: true,
        trackTotal: true,
        token: RootStore.profileStore.token
      }), this._searchCancelSource.token)

      // console.log(data.data.data)
      const result = data.data.data as Array<ICommunity>
      this.searchCommunities = this.searchCommunities.concat(result)

      this.searchTotalResults = data.data.pagination.total
    } catch (err: any) {
      console.error(err, err.response.status, err.response)
    }
    this.isSearchLoading = false
  }

  @action
  public async loadTags (): Promise<void> {
    try {
      const data = await APIClient.get('rating/tags', ObjectUtil.removeUndefined({
        fields: 'parents',
        token: RootStore.profileStore.token
      }))

      const result = data.data.data as Array<IRatingTag>
      this.tags = result
    } catch (err: any) {
      console.error(err, err.response.status, err.response)
    }
  }

  @computed
  public getChildren (parentID: string): Array<IRatingTag> {
    return this.tags.filter(tag => (tag.parent || '') === parentID)
  }

  @computed
  public getAllChildren (parentID: string, level: number = 0): Array<IRatingTag> {
    let tags = []

    for (let tag of this.getChildren(parentID)) {
      tags.push({ ...tag, level })

      tags = tags.concat(this.getAllChildren(tag.tagID, level + 1))
    }

    return tags
  }

  @computed
  public get getLocations (): Array<IRatingTag> {
    return this.tags.filter(tag => tag.parents.includes('countries') && tag.parent)
  }

  @computed
  public get getLanguages (): Array<IRatingTag> {
    return this.tags.filter(tag => tag.parents.includes('language') && tag.parent)
  }

  @computed
  public get getAllCategories (): Array<IRatingTag> {
    let categories = this.getAllChildren('industries')

    categories = categories.concat(this.getAllChildren('categories'))
    categories = categories.concat(this.getAllChildren('categories2'))
    categories = categories.concat(this.getAllChildren('influencers'))

    return categories.filter(item => !item.hidden)
  }

  @computed
  public get getCategories (): Array<IRatingTag> {
    return this.getAllChildren('categories').concat(this.getAllChildren('categories2'))
  }

  @computed
  public get getInterests (): Array<IRatingTag> {
    return this.getAllChildren('interests')
  }

  @computed
  public get getAllTags (): Array<IRatingTag> {
    return this.getAllChildren('')
  }

  /**
   * Установка состояния загрузки поиска
   */
  public setLoadingSearch (): void {
    this.isSearchLoading = true
    this.searchCommunities = []
  }

  /**
   * Очистка стора
   */
  public clear (): void {
    clearInterval(this._loopTimeout)
    this.isLoading = false
    this.isSearchLoading = false
    this.communities = []
    this.searchCommunities = []
    this.searchTotalResults = 0
    this.tags = []
    this._searchCancelSource = null
  }

  public sendCommunityNotifications (result: Array<ICommunity>): void {
    const oldData = this.communities.map(community => ({ id: community.communityID, status: community.communityStatus }))
    const newData = result.map(community => ({ id: community.communityID, status: community.communityStatus }))
    const toNotify = oldData.reduce((acc, currentValue) => {
      const item = newData.find(x => x.id === currentValue.id)
      if (item && currentValue.status !== item.status) acc.push(item)
      return acc
    }, [])
    toNotify.forEach(item => {
      const { id: communityID, status } = item
      const community = this.getCommunityByCommunityID(communityID)
      if (community.isPaid) this.notify(community, status)
    })
  }

  private notify (community: ICommunity, newStatus: CommunityStatus): void {
    let title = ''
    let text = ''
    switch (newStatus) {
      case CommunityStatus.PARTIAL:
        title = 'Первичный сбор завершен'
        text = `По странице ${community.name} уже доступны данные за последние 30 дней`
        break
      case CommunityStatus.DONE:
        title = 'Сбор данных завершен'
        text = `Страница ${community.name} полностью проанализирована`
        break
    }
    if (title && text) {
      Notifications.show({
        title,
        text,
        type: 'default',
        image: community.image,
        socialType: community.socialType
      })
    }
  }
}
