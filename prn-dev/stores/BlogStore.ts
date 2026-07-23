import { action, computed, makeAutoObservable } from 'mobx'
import APIClient from '../lib/APIClient'
import {IBaseStore, IStore} from './RootStore'
import ArrayUtil from '../utils/ArrayUtil'

export interface IBlogTag {
  tagID: string
  name: string
  slug: string
  icon: string
  description: string
  count: number
}

interface IBlogPost {
  postID: string
  slug: string
  postTitle: string
  postImage: string
  preview: string
  text: string
  author: string
  timeCreate: string
  publishDate: string
  type: string
  status: string
  tags: Array<IBlogTag>
  views: number
}

interface IPostForm {
  postID: string
  slug: string
  postTitle: string
  postImage: string
  preview: string
  text: string
  author: string
  timeCreate: string
  publishDate: string
  type: string
  status: string
  tags: Array<string>
}

interface ITagForm {
  tagID: string
  name: string
  slug: string
  icon: string
  description: string
}

export default class BlogStore implements IBaseStore {
  private _rootStoreID = Symbol()
  public isLoading: boolean = false
  public isLoadingTags: boolean = false
  public isLoadingPosts: boolean = false
  public isLoadingPost: boolean = false
  public tags: Array<IBlogTag> = []
  public posts: Array<IBlogPost> = []
  public nextPage: number = 1
  public totalPages: number = 0
  public post: IBlogPost = null
  public postForm: IPostForm = null
  public postFormErrors: Array<string> = []
  public tagForm: ITagForm = null
  public recommendations: Array<IBlogPost> = []

  constructor (rootStore: IStore) {
    makeAutoObservable(this)

    this[this._rootStoreID] = rootStore
  }

  get _rootStore (): IStore {
    return this[this._rootStoreID]
  }

  /**
   * Загрузка списка тегов
   */
  @action
  public async loadTags (): Promise<void> {
    this.isLoadingTags = true

    try {
      const data: any = await APIClient.get('blog/tags', { token: this._rootStore.profileStore.token })

      this.tags = ArrayUtil.arrayObjectsSort('-count', data.data.data.map(tag => ({ ...tag, slug: tag.slug || tag.tagID })))
    } catch (e) {
      //
    }

    this.isLoadingTags = false
  }

  @computed
  public getPostsCategories (withoutTags: Array<string> = []): Array<IBlogTag> {
    const categories = this.posts.map(post => post.tags.map(tag => tag.tagID)).flat()

    return [...new Set(categories)].map(tagID => this.getTagBySlug(tagID)).filter(tag => !withoutTags.includes(tag.tagID) && !withoutTags.includes(tag.slug))
  }

  /**
   * Загрузка списка постов
   */
  @action
  public async loadPosts (type: string = '', tags: Array<string> = [], page: number = 1, perPage: number = 10, query: string = ''): Promise<void> {
    this.isLoadingPosts = true
    this.nextPage = page

    try {
      const data: any = await APIClient.get('blog/posts', { page, perPage, type, tags, query, token: this._rootStore.profileStore.token })

      const posts = data.data.data.map(post => ({ ...post, tags: ArrayUtil.arrayObjectsSort('-count', post.tags.map(tagID => this.getTagBySlug(tagID))) }))

      if (page === 1) this.posts = posts
      else this.posts = this.posts.concat(posts)
      this.nextPage = data.data.pagination.nextPage
      this.totalPages = data.data.pagination.totalPages
    } catch (e) {
      this.nextPage = 1
      this.totalPages = 0
    }

    this.isLoadingPosts = false
  }

  /**
   * Загрузка одного поста
   */
  @action
  public async loadPost (slug: string): Promise<void> {
    this.isLoadingPost = true

    try {
      const data: any = await APIClient.get(`blog/posts/${slug}`, { token: this._rootStore.profileStore.token })

      const post = data.data.data.post
      post.tags = ArrayUtil.arrayObjectsSort('-count', post.tags.map(tagID => this.getTagBySlug(tagID)))

      this.post = post
      this.recommendations = data.data.data.recommendations.map(post => ({ ...post, tags: ArrayUtil.arrayObjectsSort('-count', post.tags.map(tagID => this.getTagBySlug(tagID))) }))
    } catch (e) {
      // console.log('data.data', e.response)
      this.post = null
      this.recommendations = []
    }

    this.isLoadingPost = false
  }

  /**
   * Создание нового поста
   */
  @action
  public async createPost (): Promise<string> {
    this.postFormErrors = []
    let postID: string = ''

    try {
      const data: any = await APIClient.post('blog/posts', {
        ...this.postForm,
        token: this._rootStore.profileStore.token
      })

      postID = data.data.data.postID
    } catch (e) {
      this.postFormErrors = e.response.data.meta.errors || {}
    }

    return postID
  }

  /**
   * Обновление поста
   */
  @action
  public async updatePost (): Promise<void> {
    this.postFormErrors = []
    try {
      await APIClient.patch(`blog/posts/${this.postForm.postID}`, {
        ...this.postForm,
        token: this._rootStore.profileStore.token
      })
    } catch (e) {
      this.postFormErrors = e.response.data.meta.errors || {}
    }
  }

  /**
   * Удаление поста
   */
  @action
  public async removePost (postID: string): Promise<void> {
    try {
      await APIClient.delete(`blog/posts/${postID}`, {
        token: this._rootStore.profileStore.token
      })
    } catch (e) {
      //
    }
  }

  /**
   * Удаление тега у посты
   *
   * @param tagID
   */
  public async postFormAddTag (tagID: string): Promise<void> {
    this.postForm.tags = (this.postForm.tags || []).filter(tID => tID !== tagID).concat(tagID)
  }

  /**
   * Добавление тега к посту
   *
   * @param tagID
   */
  public async postFormRemoveTag (tagID: string): Promise<void> {
    this.postForm.tags = (this.postForm.tags || []).filter(tID => tID !== tagID)
  }

  /**
   * Создание нового тега
   */
  @action
  public async createTag (): Promise<string> {
    let tagID: string = ''

    try {
      const data: any = await APIClient.post('blog/tags', {
        ...this.tagForm,
        token: this._rootStore.profileStore.token
      })

      tagID = data.data.data.tagID
    } catch (e) {
      //
    }

    return tagID
  }

  /**
   * Обновление тега
   */
  @action
  public async updateTag (): Promise<void> {
    try {
      await APIClient.patch(`blog/tags/${this.tagForm.tagID}`, {
        ...this.tagForm,
        token: this._rootStore.profileStore.token
      })
    } catch (e) {
      //
    }
  }

  /**
   * Удаление тега
   */
  @action
  public async removeTag (tagID: string): Promise<void> {
    try {
      await APIClient.delete(`blog/tags/${tagID}`, {
        token: this._rootStore.profileStore.token
      })
    } catch (e) {
      //
    }
  }

  @computed
  public getTagBySlug (slug: string): IBlogTag {
    return this.tags.find(tag => tag.tagID === slug || tag.slug === slug)
  }

  @action
  public setPostFormData(data: Partial<IPostForm>): void {
    this.postForm = {
      ...this.postForm,
      ...data
    }
  }

  @action
  public setTagFormData(data: Partial<ITagForm>): void {
    this.tagForm = {
      ...this.tagForm,
      ...data
    }
  }

  /**
   * Прокидываем данные
   *
   * @param initialData
   */
  hydrate (initialData: any) {
    this.isLoading = initialData?.isLoading || false
    this.isLoadingTags = initialData?.isLoadingTags || false
    this.isLoadingPosts = initialData?.isLoadingPosts || false
    this.isLoadingPost = initialData?.isLoadingPost || false
    this.tags = initialData?.tags || []
    this.posts = initialData?.posts || []
    this.post = initialData?.post
    this.recommendations = initialData?.recommendations || []
    this.nextPage = initialData?.nextPage || 1
    this.totalPages = initialData?.totalPages
    this.postForm = initialData?.postForm
    this.postFormErrors = initialData?.postFormErrors
    this.tagForm = initialData?.tagForm
  }

  /**
   * Очистка стора
   */
  public clear (): void {
    this.isLoading = false
    this.tags = []
  }
}
