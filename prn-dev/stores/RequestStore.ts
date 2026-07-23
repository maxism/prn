import { action, makeAutoObservable } from 'mobx'
import { createForm, MobxForm } from '../utils/mobx-form-creator'
import APIClient from '../lib/APIClient'
import {IBaseStore, IStore} from './RootStore'

interface IRequestForm {
  name: string
  phone: string
  email: string
  company: string
  target: string
}

export default class RequestStore implements IBaseStore {
  private _rootStoreID = Symbol()
  public requestForm: MobxForm<IRequestForm> = {}
  public isValidate: boolean = false
  public isSent: boolean = false
  public isLoading: boolean = false

  constructor (rootStore: IStore) {
    makeAutoObservable(this)

    this[this._rootStoreID] = rootStore

    createForm(this.requestForm,{
      name: '',
      phone: '',
      email: '',
      company: '',
      target: ''
    })
  }

  get _rootStore (): IStore {
    return this[this._rootStoreID]
  }

  @action
  public async sendAnalyticsRequest (): Promise<void> {
    if (!this._validateLoginForm(['email', 'company', 'name', 'phone', 'target'])) return

    this.isValidate = true

    try {
      const data: any = await APIClient.postAnalytics('events/register', {
        subject: 'registration_request',
        name: this.requestForm.name.value,
        phone: this.requestForm.phone.value,
        email: this.requestForm.email.value,
        company: this.requestForm.company.value,
        target: this.requestForm.target.value,
        lang: 'ru',
        token: this._rootStore.profileStore.token
      })

      if (data.data.meta.code !== 200) throw new Error()

      this.isSent = true
    }
     catch (e) {
      // console.log('error', e)
    }

    this.isValidate = false
  }

  private _validateLoginForm (fields: Array<keyof IRequestForm>): boolean {
    const validationErrors = {}
    if (fields.includes('email')) {
      const isEmailEmpty = this.requestForm.email.value !== ''
      const isEmailValid = /\S+@\S+\.\S+/.test(this.requestForm.email.value)
      if (!isEmailEmpty) {
        validationErrors['email'] = 'Укажите вашу почту'
      } else if (!isEmailValid) {
        validationErrors['email'] = 'Почта указана с ошибкой'
      }
    }
    if (fields.includes('name')) {
      const isPasswordEmpty = this.requestForm.name.value !== ''
      if (!isPasswordEmpty) validationErrors['name'] = 'Укажите ваше имя'
    }
    if (fields.includes('company')) {
      const isPasswordEmpty = this.requestForm.company.value !== ''
      if (!isPasswordEmpty) validationErrors['company'] = 'Укажите вашу компанию'
    }
    if (fields.includes('phone')) {
      const isPasswordEmpty = this.requestForm.phone.value !== ''
      if (!isPasswordEmpty) validationErrors['phone'] = 'Укажите ваш телефон для связи'
    }

    this.requestForm.setErrors(validationErrors)
    return Object.keys(validationErrors).length === 0
  }

  /**
   * Прокидываем данные
   *
   * @param initialData
   */
  hydrate (initialData: any) {
    this.requestForm.hydrate(initialData?.requestForm)
  }

  /**
   * Очистка стора
   */
  public clear (): void {
    this.isValidate = false
    this.isLoading = false
    this.isSent = false
  }
}
