import { CancelTokenSource } from 'axios'
import { action, computed, makeAutoObservable } from 'mobx'
import APIClient from '../lib/APIClient'
import ArrayUtil from '../utils/ArrayUtil'
import whenChangedParameters from '../utils/whenChangedParameters'
import BaseAPI from './API/BaseAPI'
import RootStore from './RootStore'
import ISocialType from '../interfaces/ISocialType'
import ObjectUtil from '../utils/ObjectUtil'

export interface IPostMention {
  cid: string
  url: string
  image: string
  name: string
  usersCount: number
}

export interface IPostSummaryMention extends IPostMention {
  count: number
  views: number
  interactions: number
}

export interface IPost {
  communityID: string
  cid: string
  comments: number
  dataId: string
  date: string
  er: number
  fromOwner: boolean
  hashTags: Array<string>
  image: string
  interactions: number
  likes: number
  mainGrade: string
  indexGrade: number
  name: string
  postID: string
  postImage: string
  postUrl: string
  rePosts: number
  socialPostID: string
  socialType: string
  text: string
  textLength: number
  type: string
  types: Array<string>
  url: string
  usersCount: number
  videoViews: number
  views: number
  tags: Array<string>
  isDeleted: boolean
  isAd: boolean
  mentions?: Array<IPostMention>
}

interface IPostsSummary {
  types: Array<IPostSummaryData>
  hashTags: Array<IPostSummaryData>
  textLength: Array<IPostSummaryData>
  mentions: Array<IPostSummaryMention>
}

interface IPostSummaryData {
  name: string
  count: number
  grade: number
}

interface IPostsParams {
  type?: string
  grades?: Array<string>
  q?: string
  sort?: string
  direction?: string
}

export default class PostsStore {
  private _cancelSource: CancelTokenSource
  public isLoading: boolean = false
  public posts: Array<IPost> = []
  public competitorsPosts: Array<IPost> = []

  public postsSummary: IPostsSummary = null
  public competitorsPostsSummary: IPostsSummary = null

  constructor () {
    makeAutoObservable(this)
  }

  @action
  @whenChangedParameters
  public async loadCompetitors (accountID: string, socialType: ISocialType, from: string, to: string,
                     grades: Array<string> = [], q: string = '', sort: string = 'interactions', direction: string = 'desc'): Promise<void> {
    this.isLoading = true
    if (this._cancelSource) this._cancelSource.cancel()
    this._cancelSource = BaseAPI.cancelSource()

    try {
      const { data } = await APIClient.get(`accounts/${accountID}/posts`, {
        token: RootStore.profileStore.token,
        socialType,
        communityType: 'competitor',
        from,
        to,
        grades,
        q,
        sort: `${direction === 'asc' ? '' : '-'}${sort}`
      }, this._cancelSource.token)

      const { posts, summary } = data.data

      this.competitorsPostsSummary = summary
      this.competitorsPosts = posts.map((post): IPost => ({
        communityID: post.communityID,
        cid: post.cid,
        comments: post.comments,
        dataId: post.dataId,
        date: post.date,
        er: post.er,
        fromOwner: post.fromOwner,
        hashTags: post.hashTags,
        image: post.image,
        interactions: post.interactions,
        likes: post.likes,
        mainGrade: post.mainGrade,
        indexGrade: post.indexGrade,
        name: post.name,
        postID: post.postID,
        postImage: post.postImage,
        postUrl: post.postUrl,
        rePosts: post.rePosts,
        socialPostID: post.socialPostID,
        socialType: post.socialType,
        text: post.text,
        textLength: post.textLength,
        type: post.type,
        types: post.types,
        url: post.url,
        usersCount: post.usersCount,
        videoViews: post.videoViews,
        views: post.views,
        tags: [...new Set([post.type, ...post.hashTags.map(hashTag => `#${hashTag}`)])],
        isAd: post.isAd,
        mentions: post.mentions || [],
        isDeleted: post.isDeleted
      }))

      console.log('PostsStore posts', posts)

      this.isLoading = false
    } catch (e: any) {
      if (e.__CANCEL__) return

      console.log('Error posts', e.response)
      // validationErrors: e.response.data.meta.errors
      return
    }
  }

  @action
  @whenChangedParameters
  public async loadOne (cid: string, from: string, to: string, params: IPostsParams = {}): Promise<void> {
    this.isLoading = true
    if (this._cancelSource) this._cancelSource.cancel()
    this._cancelSource = BaseAPI.cancelSource()

    const { sort = 'interactions', direction = 'desc' } = params

    try {
      const { data } = await APIClient.get(`posts`, {
        token: RootStore.profileStore.token,
        type: params.type || 'posts',
        cid,
        from,
        to,
        grades: params.grades || [],
        q: params.q || '',
        sort: `${direction === 'asc' ? '' : '-'}${sort}`
      }, this._cancelSource.token)

      const { posts, summary } = data.data

      summary.mentions = ArrayUtil.arrayObjectsSort('-count', summary.mentions)

      this.postsSummary = summary
      this.posts = posts.map((post): IPost => ({
        communityID: post.communityID,
        cid: post.cid,
        comments: post.comments,
        dataId: post.dataId,
        date: post.date,
        er: post.er,
        fromOwner: post.fromOwner,
        hashTags: post.hashTags,
        image: post.image,
        interactions: post.interactions,
        likes: post.likes,
        mainGrade: post.mainGrade,
        indexGrade: post.indexGrade,
        name: post.name,
        postID: post.postID,
        postImage: post.postImage,
        postUrl: post.postUrl,
        rePosts: post.rePosts,
        socialPostID: post.socialPostID,
        socialType: post.socialType,
        text: post.text,
        textLength: post.textLength,
        type: post.type,
        types: post.types,
        url: post.url,
        usersCount: post.usersCount,
        videoViews: post.videoViews,
        views: post.views,
        tags: [...new Set([post.type, ...post.hashTags.map(hashTag => `#${hashTag}`)])],
        isAd: post.isAd,
        mentions: post.mentions || [],
        isDeleted: post.isDeleted
      }))

      // console.log('PostsStore posts', posts)

      this.isLoading = false
    } catch (e: any) {
      if (e.__CANCEL__) return

      console.log('Error posts', e.response)
      // validationErrors: e.response.data.meta.errors
      return
    }
  }

  @computed
  public getBestPost (): IPost {
    const posts = ArrayUtil.arrayObjectsSort('-indexGrade', this.posts.slice() || [])

    return posts.length ? posts[0] : null
  }

  /**
   * Очистка стора
   */
  public clear (): void {
    if (this._cancelSource) this._cancelSource.cancel()
    this.isLoading = false
    this.posts = []
    this.competitorsPosts = []
    this.postsSummary = null
    this.competitorsPostsSummary = null
  }
}
