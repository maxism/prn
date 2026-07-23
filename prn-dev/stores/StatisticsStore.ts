import {action, computed, makeAutoObservable} from 'mobx'
import APIClient from '../lib/APIClient'
import { IBaseStore, IStore } from './RootStore'
import moment from 'moment/moment'
import ISocialType from '../interfaces/ISocialType'
import ArrayUtil from '../utils/ArrayUtil'

interface ISimilar {
  cid: string
  name: string
  image: string
  usersCount: number
}

export interface IRatingTag {
  tagID: string
  name: string
}

interface ICommunity {
  cid: string
  socialType: string
  groupID: string
  url: string
  name: string
  screenName: string
  image: string
  description: string
  usersCount: number
  communityStatus: string
  isBlocked: boolean
  isClosed: boolean
  qualityScore: number
  avgER: number
  avgInteractions: number
  avgViews: number
  pctFakeFollowers: number
  tags: Array<string>
  suggestedTags: Array<string>
  ratingTags: Array<IRatingTag>
  similar: Array<ISimilar>
  timeStatistics: Date
  isPublicBlocked: boolean
}

interface ICommunityRetrospectiveSeries {
  date: Date
  er: number
  usersCount: number
  deltaUsersCount: number
  deltaPosts: number
  deltaInteractions: number
  deltaLikes: number
  deltaComments: number
  deltaRePosts: number
  deltaViews: number
}

interface ICommunityRetrospectiveSummary {
  er: number
  usersCount: number
  deltaUsersCount: number
  deltaPosts: number
  deltaInteractions: number
  deltaLikes: number
  deltaComments: number
  deltaRePosts: number
  deltaDislikes: number
  deltaViews: number
}

interface ICommunityRetrospective {
  series: {
    current: Array<ICommunityRetrospectiveSeries>,
    prev: Array<ICommunityRetrospectiveSeries>
  },
  summary: {
    current: ICommunityRetrospectiveSummary,
    prev: ICommunityRetrospectiveSummary,
    delta: ICommunityRetrospectiveSummary
  }
}

interface ICommunityPost {
  socialType: ISocialType
  name: string
  image: string
  url: string
  socialPostID: string
  postID: string
  postImage: string
  postUrl: string
  cid: string
  dataId: string
  date: Date
  likes: number
  comments: number
  rePosts: number
  interactions: number
  views: number
  type: string
  types: Array<string>
  hashTags: Array<string>
  text: string
  textLength: number
  fromOwner: boolean
  usersCount: number
  er: number
  viewsER: number
  videoViewsER: number
  mainGrade: string
  indexGrade: number
}

interface ICommunityActivity {
  time: string
  likes: number
  comments: number
  rePosts: number
  interactions: number
  views: number
}

interface IPostsCategory {
  name: string
  count: number
  grade: number
}

export default class StatisticsStore implements IBaseStore {
  private _rootStoreID = Symbol()
  public community: ICommunity = null
  public communityRetrospective: ICommunityRetrospective = null
  public communityPosts: Array<ICommunityPost> = []
  public communityPostsHashTags: Array<IPostsCategory> = []
  public communityActivity: Array<ICommunityActivity> = []
  public communityActivityPrediction: Array<ICommunityActivity> = []
  public communityRetrospectiveGrades = []
  public isLoading: boolean = false

  constructor (rootStore: IStore) {
    makeAutoObservable(this)

    this[this._rootStoreID] = rootStore
  }

  get _rootStore (): IStore {
    return this[this._rootStoreID]
  }

  @action
  public async loadCommunity (cid: string, screenName: string, silentLoad = false, force: boolean = undefined): Promise<void> {
    if (!silentLoad) {
      this.isLoading = true
      this.community = null
    }
    try {
      const data: any = await APIClient.get('community', {
        cid, screenName, force,
        token: this._rootStore.profileStore.token
      })
      this.community = {
        // todo: Не возвращается qualityScore
        ...data.data.data,
        timeStatistics: moment(data.data.data.timeStatistics).toDate()
      }
    } catch (e) {
      // console.log('error loadCommunity')
    }

    this.isLoading = false
  }

  @action
  public async loadCommunityRetrospective (cid: string, screenName: string, from: string, to: string): Promise<void> {
    this.communityRetrospective = null
    try {
      const data: any = await APIClient.get('statistics/retrospective', {
        cid, screenName, from, to,
        token: this._rootStore.profileStore.token
      })
      this.communityRetrospective = {
        series: {
          current: data.data.data.series.current.map(item => ({ ...item, date: moment(item.date, 'DD.MM.YYYY').toDate() })),
          prev: data.data.data.series.prev.map(item => ({ ...item, date: moment(item.date, 'DD.MM.YYYY').toDate() }))
        },
        summary: data.data.data.summary
      }

      // console.log('communityRetrospective', data.data.data)
    } catch (e) {
      // console.log('error', e)
    }
  }

  @action
  public async loadCommunityPosts (cid: string, screenName: string, from: string, to: string, sort: string = 'date', limit: number = undefined): Promise<void> {
    this.communityPosts = []
    this.communityPostsHashTags = []
    try {
      const data: any = await APIClient.get('posts', {
        cid, screenName, from, to, sort, limit,
        token: this._rootStore.profileStore.token
        // todo: Добавить пагинацию и сортировку
      })
      this.communityPosts = data.data.data.posts
      this.communityPostsHashTags = ArrayUtil.arrayObjectsSort('-grade', data.data.data.summary.hashTags) // todo: Добавить сортировку по убыванию грейда

      // console.log('communityPosts', data.data.data)
    } catch (e) {
      // console.log('error', e)
    }
  }

  @action
  public async loadCommunityActivity (cid: string, screenName: string): Promise<void> {
    this.communityActivity = null
    try {
      const data: any = await APIClient.get('statistics/activity', {
        cid, screenName,
        token: this._rootStore.profileStore.token
      })
      this.communityActivity = this.applyTimezoneOffset(data.data.data)

      // console.log('communityActivity', data.data.data)
    } catch (e) {
      // console.log('error', e)
    }
  }

  @action
  public async loadCommunityActivityPrediction (cid: string, screenName: string): Promise<void> {
    this.communityActivityPrediction = null
    try {
      const { data } = await APIClient.get('statistics/activityPrediction', {
        cid, screenName,
        token: this._rootStore.profileStore.token
      })
      this.communityActivityPrediction = this.applyTimezoneOffset(data.data)

      // console.log('communityActivityPrediction', data.data)
    } catch (e) {
      // console.log('error', e)
    }
  }

  @action
  public async loadCommunityRetrospectiveGrades (cid: string, screenName: string): Promise<void> {
    this.communityRetrospectiveGrades = null
    try {
      const { data } = await APIClient.get('statistics/retrospectiveGrades', {
        cid, screenName,
        token: this._rootStore.profileStore.token
      })

      this.communityRetrospectiveGrades = data.data

      // console.log('communityRetrospective', data.data)
    } catch (e) {
      // console.log('error', e)
    }
  }

  @computed
  public getCommunityRetrospectiveGradesViews (): Array<{ hour: number, value: number }> {
    if (!this.communityRetrospectiveGrades) return null

    const data = [{ hour: 0, value: 0 }]
    data.push(...this.communityRetrospectiveGrades['delta']['views'])

    return data
  }

  /**
   * Смещение данных по астивности в зависимости от часового пояса пользователя
   */
  private applyTimezoneOffset (data: Array<ICommunityActivity>): Array<ICommunityActivity> {
    const timezoneOffset = new Date().getTimezoneOffset() / -60
    if (timezoneOffset === 0) return data

    const obj = [...data].reduce((acc, value) => {
      acc[value.time] = value
      return acc
    }, <{[key: string]: ICommunityActivity}>{})


    const values = Object.values(obj)
    if (timezoneOffset > 0) {
      values.unshift(...values.splice(-timezoneOffset))
    } else {
      values.push(...values.splice(timezoneOffset))
    }

    const keys = Object.keys(obj)
    keys.forEach((time, index) => values[index].time = time)

    return values
  }

  /**
   * Прокидываем данные
   *
   * @param initialData
   */
  hydrate (initialData: any) {
    this.community = initialData?.community
    this.communityRetrospective = initialData?.communityRetrospective
    this.communityPosts = initialData?.communityPosts || []
    this.communityPostsHashTags = initialData?.communityPostsHashTags || []
    this.communityActivity = initialData?.communityActivity || []
    this.communityActivityPrediction = initialData?.communityActivityPrediction || []
    this.communityRetrospectiveGrades = initialData?.communityRetrospectiveGrades
    this.isLoading = initialData?.isLoading
  }

  /**
   * Очистка стора
   */
  public clear (): void {
    this.community = null
    this.communityRetrospective = null
    this.communityPosts = []
    this.communityPostsHashTags = []
    this.communityActivity = []
    this.communityActivityPrediction = []
    this.communityRetrospectiveGrades = null
    this.isLoading = false
  }
}
