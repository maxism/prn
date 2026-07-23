import {action, computed, makeAutoObservable} from 'mobx'
import APIClient from '../lib/APIClient'
import { IBaseStore, IStore } from './RootStore'
import { createForm, MobxForm } from '../utils/mobx-form-creator'

export interface ITag {
  tagID: string
  name: string
  fullName: string
  icon: string
  parent: string
  description: string
  isLeaf: boolean
  count: number
  level: number
  words: string
  hidden: boolean
}

interface ITagForm {
  tagID: string
  name: string
  icon: string
  parent: string
  description: string
  words: string
  hidden: boolean
}

export default class RatingTagsStore implements IBaseStore {
  private _rootStoreID = Symbol()
  public tags: Array<ITag> = []
  public tagForm: MobxForm<ITagForm> = {}
  public isLoading: boolean = false

  constructor (rootStore: IStore) {
    makeAutoObservable(this)

    this[this._rootStoreID] = rootStore

    createForm(this.tagForm,{
      tagID: '',
      name: '',
      icon: '',
      parent: '',
      description: '',
      words: '',
      hidden: false
    })
  }

  get _rootStore (): IStore {
    return this[this._rootStoreID]
  }

  @action
  public async load (full: boolean = false): Promise<void> {
    this.isLoading = true
    try {
      const data: any = await APIClient.get('rating/tags', {
        fields: full ? 'words' : '',
        token: this._rootStore.profileStore.token
      }, 'loadTagsCancel')

      this.tags = data.data.data || []
    } catch (e) {
      if (e.__CANCEL__) return
    }

    this.isLoading = false
  }

  /**
   * Создание нового тега
   */
  @action
  public async createTag (): Promise<void> {
    try {
      await APIClient.post('rating/tags', {
        tagID: this.tagForm.tagID.value,
        name: this.tagForm.name.value,
        icon: this.tagForm.icon.value,
        parent: this.tagForm.parent.value,
        description: this.tagForm.description.value,
        hidden: this.tagForm.hidden.value,
        words: this.tagForm.words.value,
        token: this._rootStore.profileStore.token
      })

      await this.load(true)

      this.tagForm.setErrors({})
    } catch (e) {
      // console.log('error', e)
      if (e.response.data.meta.code === 422) this.tagForm.setErrors({ tagID: 'Такой ID уже существует' })
      else this.tagForm.setErrors(e.response.data.meta.errors || [])
    }
  }

  /**
   * Обновление тега
   */
  @action
  public async updateTag (): Promise<void> {
    try {
      await APIClient.patch(`rating/tags/${this.tagForm.tagID.value}`, {
        name: this.tagForm.name.value,
        icon: this.tagForm.icon.value,
        parent: this.tagForm.parent.value,
        description: this.tagForm.description.value,
        hidden: this.tagForm.hidden.value,
        words: this.tagForm.words.value,
        token: this._rootStore.profileStore.token
      })

      await this.load(true)

      this.tagForm.setErrors({})
    } catch (e) {
      // console.log('error', e)
      this.tagForm.setErrors(e.response.data.meta.errors || [])
    }
  }

  /**
   * Удаление тега
   */
  @action
  public async removeTag (tagID: string): Promise<void> {
    try {
      await APIClient.delete(`rating/tags/${tagID}`, {
        token: this._rootStore.profileStore.token
      })

      await this.load(true)
    } catch (e) {
      // console.log('error', e)
    }
  }

  @computed
  public getChildren (parentID: string): Array<ITag> {
    return this.tags.filter(tag => (tag.parent || '') === parentID)
  }

  @computed
  public getAllChildren (parentID: string, level: number = 0): Array<ITag> {
    let tags = []

    for (let tag of this.getChildren(parentID)) {
      tags.push({ ...tag, level })

      tags = tags.concat(this.getAllChildren(tag.tagID, level + 1))
    }

    return tags
  }

  @computed
  public getTag (tagID: string): ITag {
    return this.tags.find(tag => tag.tagID === tagID) || {
      tagID,
      name: tagID,
      parent: ''
    } as ITag
  }

  @computed
  public get getCountries (): Array<ITag> {
    const countries = this.getChildren('countries')

    return countries.filter(item => !item.hidden)
  }

  @computed
  public get getCountriesCities (): Array<ITag> {
    const countries = this.getAllChildren('countries')

    return countries.filter(item => !item.hidden)
  }

  @computed
  public get getAllCategories (): Array<ITag> {
    let categories = this.getAllChildren('industries')

    categories = categories.concat(this.getAllChildren('categories'))
    categories = categories.concat(this.getAllChildren('influencers'))

    return categories.filter(item => !item.hidden)
  }

  @computed
  public get getCategories (): Array<ITag> {
    return this.getAllChildren('categories')
  }

  @computed
  public get getAllTags (): Array<ITag> {
    return this.getAllChildren('')
  }

  /**
   * Прокидываем данные
   *
   * @param initialData
   */
  hydrate (initialData: any) {
    this.tags = initialData?.tags || []
    this.tagForm.hydrate(initialData?.tagForm)
    this.isLoading = initialData?.isLoading
  }

  /**
   * Очистка стора
   */
  public clear (): void {
    this.tags = []
    this.isLoading = false
  }
}
