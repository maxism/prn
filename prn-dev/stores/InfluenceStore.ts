import { action, makeAutoObservable } from 'mobx'
import APIClient from '../lib/APIClient'
import { IBaseStore, IStore } from './RootStore'
import ISocialType from '../interfaces/ISocialType'
import { IRatingTag } from './StatisticsStore'

interface IInfluenceCommunity {
  cid: string
  socialType: ISocialType
  groupID: string
  name: string
  image: string
  url: string
  screenName: string
  usersCount: number
  avgER: number
  avgInteractions: number
  avgViews: number
  tags: Array<string>
  ratingTags: Array<IRatingTag>
  qualityScore: number
  isLoading: boolean
}

interface IInfluenceSearchParams {
  query?: string
  socialType?: string
  minER?: string
  maxER?: string
  minUsersCount?: string
  maxUsersCount?: string
  sort?: string
  tags?: Array<string>
  inRating?: boolean
  category?: string
  country?: string
  isActive?: boolean
}

export default class InfluenceStore implements IBaseStore {
  private _rootStoreID = Symbol()
  public searchParams: IInfluenceSearchParams = {}
  public page: number = 1
  public hasNextPage: boolean = false
  public communities: Array<IInfluenceCommunity> = []
  public totalCommunities: number = 0
  public isLoading: boolean = false

  constructor (rootStore: IStore) {
    makeAutoObservable(this)

    this[this._rootStoreID] = rootStore
  }

  get _rootStore (): IStore {
    return this[this._rootStoreID]
  }

  /*throttleAutocomplete = throttle(query => {
    this.loadAutocomplete(query)
  }, 200)

  @action
  public async autocomplete (query: string): Promise<void> {
    this.query = query
    this.isAutocompleteLoading = true
    await this.throttleAutocomplete(query)
  }*/

  @action
  public async search (searchParams: IInfluenceSearchParams, page: number = 1): Promise<void> {
    this.isLoading = true
    this.page = page
    this.searchParams = searchParams

    try {
      const data: any = await APIClient.get('search', {
        q: searchParams.query,
        socialTypes: searchParams.socialType === 'ALL' ? 'VK,OK,TW,TT,TG,YZ,YT,RT,VB,TC,VC,MX' : [searchParams.socialType],
        minER: Number(searchParams.minER) || undefined,
        maxER: Number(searchParams.maxER) || undefined,
        minUsersCount: Number(searchParams.minUsersCount) || undefined,
        maxUsersCount: Number(searchParams.maxUsersCount) || undefined,
        sort: searchParams.sort,
        tags: (searchParams.tags || []).filter(item => item !== 'all').filter(Boolean),
        // inRating: searchParams.inRating,
        page,
        perPage: 10,
        token: this._rootStore.profileStore.token,
        trackTotal: true,
        categories: searchParams.category || undefined,
        locations: searchParams.country || undefined,
        isActive: searchParams.isActive,
        extended: true
      }, 'searchCancel')
      const communities = data.data.data || []
      const pagination = data.data.pagination

      this.totalCommunities = pagination.total

      if (page === 1) this.communities = communities
      else this.communities = this.communities.concat(communities)

      this.hasNextPage = pagination.hasNextPage
    } catch (e) {
      // console.log('Error')
      if (e.__CANCEL__) return
    }

    this.isLoading = false
  }

  @action
  public async loadListNextPage (): Promise<void> {
    if (!this.isLoading && this.hasNextPage) {
      await this.search(this.searchParams, this.page + 1)
    }
  }

  /**
   * Прокидываем данные
   *
   * @param initialData
   */
  hydrate (initialData: any) {
    this.searchParams = initialData?.searchParams || {}
    this.page = initialData?.page
    this.hasNextPage = initialData?.hasNextPage
    this.communities = initialData?.communities
    this.totalCommunities = initialData?.totalCommunities
    this.isLoading = initialData?.isLoading
  }

  /**
   * Очистка стора
   */
  public clear (): void {
    this.searchParams = {}
    this.page = 1
    this.hasNextPage = false
    this.communities = []
    this.totalCommunities = 0
    this.isLoading = false
  }
}
