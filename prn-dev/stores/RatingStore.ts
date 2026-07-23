import { action, makeAutoObservable } from 'mobx'
import { throttle } from 'lodash'
import APIClient from '../lib/APIClient'
import { IBaseStore, IStore } from './RootStore'
import ISocialType from '../interfaces/ISocialType'

interface IRatingCommunitySearch {
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
  qualityScore: number
}

export default class RatingStore implements IBaseStore {
  private _rootStoreID = Symbol()
  public query: string
  public page: number = 1
  public hasNextPage: boolean = false
  public communities: Array<IRatingCommunitySearch> = []
  public autocompleteTags: Array<{ request: string, data: string }> = []
  public autocompleteCommunities: Array<IRatingCommunitySearch> = []
  public isLoading: boolean = false
  public isAutocompleteLoading: boolean = false

  constructor (rootStore: IStore) {
    makeAutoObservable(this)

    this[this._rootStoreID] = rootStore
  }

  get _rootStore (): IStore {
    return this[this._rootStoreID]
  }

  throttleAutocomplete = throttle(query => {
    this.loadAutocomplete(query)
  }, 200)

  @action
  public async autocomplete (query: string): Promise<void> {
    this.query = query
    this.isAutocompleteLoading = true
    await this.throttleAutocomplete(query)
  }

  @action
  public async search (query: string, page: number = 1): Promise<void> {
    this.isLoading = true
    this.page = page
    this.query = query

    if (!this.query) this.clear()

    try {
      const data: any = await APIClient.get('tagsSearch', {
        q: query,
        page,
        perPage: 20,
        token: this._rootStore.profileStore.token
      })
      const communities = data.data.data || []
      const pagination = data.data.pagination

      if (page === 1) this.communities = communities
      else this.communities = this.communities.concat(communities)

      this.hasNextPage = pagination.hasNextPage

      await this.loadAutocomplete(query)
    } catch (e) {
      //
    }

    // Если результатов поиска по категориям нет - ищем сообщества
    if (!this.communities.length) {
      try {
        const data: any = await APIClient.get('search', {
          q: query,
          page,
          perPage: 50,
          token: this._rootStore.profileStore.token
        }, 'searchCancel')

        const communities = data.data.data || []
        const pagination = data.data.pagination

        if (page === 1) this.autocompleteCommunities = communities
        else this.autocompleteCommunities = this.autocompleteCommunities.concat(communities)

        this.hasNextPage = pagination.hasNextPage
      } catch (e) {
        if (e.__CANCEL__) return
      }
    }
    //

    this.isLoading = false
  }

  @action
  public async loadAutocomplete (query: string): Promise<void> {
    this.query = query

    let autocompleteTagsFull = []

    try {
      const data: any = await APIClient.get('autocompleteSearch', {
        q: query,
        token: this._rootStore.profileStore.token
      }, 'autocompleteSearchCancel')

      autocompleteTagsFull = data.data.data || []
      const queryWords = query.toLowerCase().split(' ')
      this.autocompleteTags = []
      for (const item of autocompleteTagsFull) {
        const request = item.request.toLowerCase()
        const requestWords = request.split(' ').filter(word => !queryWords.includes(word))
        if (requestWords.length) this.autocompleteTags.push({ request, data: requestWords.join(' ') })
      }
    } catch (e) {
      if (e.__CANCEL__) return
    }

    this.isAutocompleteLoading = false
  }

  @action
  public async loadListNextPage (): Promise<void> {
    if (!this.isLoading && this.hasNextPage) {
      await this.search(this.query, this.page + 1)
    }
  }

  /**
   * Предложить тег
   */
  @action
  public async suggestTag (tagID: string): Promise<void> {
    try {
      await APIClient.post('rating/tags/approve', {
        cid: this._rootStore.statisticsStore.community.cid,
        tags: [tagID],
        token: this._rootStore.profileStore.token
      })

      await this._rootStore.statisticsStore.loadCommunity(this._rootStore.statisticsStore.community.cid, this._rootStore.statisticsStore.community.screenName)
    } catch (e) {
      // console.log('error', e)
    }
  }

  /**
   * Удалить предложенный тег
   */
  @action
  public async removeSuggestTag (tagID: string): Promise<void> {
    try {
      await APIClient.delete('rating/tags/approve', {
        cid: this._rootStore.statisticsStore.community.cid,
        tags: [tagID],
        token: this._rootStore.profileStore.token
      })

      await this._rootStore.statisticsStore.loadCommunity(this._rootStore.statisticsStore.community.cid, this._rootStore.statisticsStore.community.screenName)
    } catch (e) {
      // console.log('error', e)
    }
  }

  /**
   * Подтверждение всех тегов
   */
  @action
  public async approveTags (): Promise<void> {
    try {
      await APIClient.patch('rating/tags/approve', {
        cid: this._rootStore.statisticsStore.community.cid,
        token: this._rootStore.profileStore.token
      })

      await this._rootStore.statisticsStore.loadCommunity(this._rootStore.statisticsStore.community.cid, this._rootStore.statisticsStore.community.screenName)
    } catch (e) {
      // console.log('error', e)
    }
  }

  @action
  public async getNextApproveCommunity (): Promise<string> {
    try {
      const data: any = await APIClient.get('rating/tags/approve', { token: this._rootStore.profileStore.token })
      return data.data.data.cid
    } catch (e) {
      //
    }

    return ''
  }

  /**
   * Прокидываем данные
   *
   * @param initialData
   */
  hydrate (initialData: any) {
    this.query = initialData?.query || ''
    this.page = initialData?.page
    this.hasNextPage = initialData?.hasNextPage
    this.communities = initialData?.communities
    this.autocompleteTags = initialData?.autocompleteTags || []
    this.autocompleteCommunities = initialData?.autocompleteCommunities || []
    this.isLoading = initialData?.isLoading
    this.isAutocompleteLoading = initialData?.isAutocompleteLoading
  }

  /**
   * Очистка стора
   */
  public clear (): void {
    this.query = ''
    this.page = 1
    this.hasNextPage = false
    this.communities = []
    this.autocompleteTags = []
    this.autocompleteCommunities = []
    this.isLoading = false
    this.isAutocompleteLoading = false
  }
}
