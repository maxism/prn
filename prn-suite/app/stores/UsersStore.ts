import { action, makeAutoObservable } from 'mobx'
import RootStore from './RootStore'
import APIClient from '../lib/APIClient'

interface IUser {
  userID: string
  email: string
  token: string
  timeLogin: Date
  activeToDate: Date
  isCardAttached: boolean
  isCardValid: boolean
  planName: string
  planProjects: number
  planCommunities: number
  planCompetitors: number
  planInfluencers: number
  planRetrospectives: number
  planPriority: number
  planPostGrade: boolean
  planCommunityScore: boolean
  planQualityScore: boolean
  planTopRating: number
  planIndexLevel: number
  planPrice: number
  planPeriod: number
}

interface IUserUpdate {
  email: string
  activeToDate: string
  isCardAttached: string
  planName: string
  planProjects: string
  planCommunities: string
  planCompetitors: string
  planInfluencers: string
  planRetrospectives: string
  planPriority: string
  planPostGrade: string
  planCommunityScore: string
  planQualityScore: string
  planTopRating: string
  planIndexLevel: string
  planPrice: string
  planPeriod: string
}

export default class UsersStore {
  public isLoading: boolean = false
  public isUpdating: boolean = false
  public selectUser: IUser = null

  constructor () {
    makeAutoObservable(this)
  }

  @action
  public async loadUser (email: string): Promise<void> {
    this.isLoading = true
    try {
      const data = await APIClient.get('user', {
        email,
        token: RootStore.profileStore.token
      })
      // console.log(data.data.data)
      this.selectUser = data.data.data as IUser
    } catch (err) {
      console.log(err)
    } finally {
      this.isLoading = false
    }
  }

  @action
  public async updateUser (email: string, params: IUserUpdate): Promise<void> {
    this.isUpdating = true
    try {
      const data = await APIClient.patch(`user/${email}`, {
        ...params,
        token: RootStore.profileStore.token
      })

      await this.loadUser(email)
      this.isUpdating = false
    } catch (err: any) {
      alert('Что-то пошло не так. Проверьте корректность ввода данных')
      console.log(err, err?.response?.status, err?.response)
    }

    this.isUpdating = false
  }

  /**
   * Очистка стора
   */
  public clear (): void {
    this.isLoading = false
    this.selectUser = null
  }
}
