import { action, makeAutoObservable } from 'mobx'
import Notifications from '../ui/elements/Notifications/Notifications'
import API from './API/API'
import { createForm, MobxForm } from '../utils/mobx-form-creator'
import RootStore from './RootStore'
import APIClient from '../lib/APIClient'
import YMUtil from '../utils/YMUtil'
import Timeout = NodeJS.Timeout
import moment from 'moment'

type TLoginFormField = 'email' | 'password'
type TCompleteSurveyType = string | 'close' | 'finish'

interface IProfile {
  userID: string
  email: string
  confirmedEmail: boolean
  name: string
  country: string
  city: string
  phone: string
  company: string
  post: string
  role: string
  showSurvey: boolean

  isDemo: boolean
  isReports: boolean
  activeToDate: Date
  currentCommunities: number
  maxCommunities: number
  creditsCommunities: number

  appVersion: string

  plan: IPlan,
  carrotquestToken: string
}

interface IPlan {
  name: string
  isPlanValid: boolean
  activeToDate?: Date
  activeToDateNext?: Date
  costItem: number
  costNext: number
  costCurrent: number
  costCredits: number
  isCardAttached: boolean
  isCardValid: boolean
  cardNumber: string
  retrospectives: number
  reports: Array<string>
  topRating: number
}

interface ILoginForm {
  email: string
  password: string
  promoCode: string
}

interface IPasswordForm {
  recovery_hash: string
  old_password: string
  new_password: string
  new_password2: string
  password: string
  password2: string
}

interface IProfileForm {
  userID: string
  email: string
  confirmedEmail: boolean
  name: string
  country: string
  city: string
  phone: string
  company: string
  post: string
}

interface ISurveyForm {
  completeType: TCompleteSurveyType
  representative: string
  tasks: Array<string>
  comment: string
}

export default class ProfileStore {
  public loginForm: MobxForm<ILoginForm> = {}
  public profileForm: MobxForm<IProfileForm> = {}
  public passwordForm: MobxForm<IPasswordForm> = {}
  public surveyForm: MobxForm<ISurveyForm> = {}
  public profile: IProfile = {
    userID: '',
    email: '',
    confirmedEmail: false,
    name: '',
    country: '',
    city: '',
    phone: '',
    company: '',
    post: '',
    role: '',
    showSurvey: false,
    isDemo: false,
    isReports: false,
    activeToDate: new Date(),
    currentCommunities: 0,
    maxCommunities: 0,
    creditsCommunities: 0,
    appVersion: '',
    plan: null,
    carrotquestToken: ''
  }
  public isValidate: boolean = false
  public isLoading: boolean = false
  public isAuth: boolean = false
  public token: string = ''
  public emailConfirmCountdown: number = 0

  private _loopTimeout: Timeout
  private _emailConfirmTimer: Timeout

  constructor () {
    makeAutoObservable(this)
    this.token = localStorage.getItem('token') || ''
    if (this.token) this.load()

    createForm<ILoginForm>(this.loginForm,{
      email: '',
      password: '',
      promoCode: ''
    })
    createForm<IProfileForm>(this.profileForm,{
      userID: '',
      email: '',
      confirmedEmail: false,
      name: '',
      country: '',
      city: '',
      phone: '',
      company: '',
      post: ''
    })
    createForm<IPasswordForm>(this.passwordForm,{
      recovery_hash: '',
      old_password: '',
      new_password: '',
      new_password2: '',
      password: '',
      password2: ''
    })
    createForm<ISurveyForm>(this.surveyForm,{
      completeType: '',
      representative: '',
      tasks: [],
      comment: ''
    })
  }

  @action
  public async login (): Promise<void> {
    if (!this._validateLoginForm(['email', 'password'])) return

    this.isValidate = true
    const data = await API.profile.signin(this.loginForm.email.value, this.loginForm.password.value)
    this.loginForm.setErrors(data.validationErrors || [])
    if (!data.validationErrors) {
      this.token = data.token
      await this.load()

      YMUtil.reachGoal('login')
    }

    this.isValidate = false
  }

  @action
  public async setToken (token: string): Promise<void> {
    this.token = token
    await this.load()
  }

  @action
  public async load (silentLoad = false): Promise<void> {
    clearInterval(this._loopTimeout)
    this.isLoading = !silentLoad

    const data = await API.profile.getProfile(this.token)

    if (data.validationErrors || !data.userID) {
      this.isAuth = false
      this.token = ''
      this.isLoading = false
      localStorage.removeItem('token')
      return
    }

    // console.log('appVersion', this.profile.appVersion, data.appVersion)

    // Проверка на изменение версии приложения
    if (this.profile.appVersion && this.profile.appVersion !== data.appVersion) document.location.reload()

    this.isAuth = true
    localStorage.setItem('token', this.token)
    this.profile = {
      userID: data.userID,
      email: data.email,
      confirmedEmail: data.confirmedEmail,
      name: data.name,
      country: data.country,
      city: data.city,
      phone: data.phone,
      company: data.company,
      post: data.post,
      role: data.role,
      showSurvey: data.showSurvey,

      isDemo: (data.plan?.current?.name === 'free' || data.plan?.current?.name === 'start') && !data.plan?.current?.price && data.plan.isPlanValid || false,
      isReports: data.plan?.current?.reports?.includes('xlsx') && data.plan.isPlanValid,
      activeToDate: data.activeToDate,
      currentCommunities: data.currentCommunities,
      maxCommunities: data.maxCommunities,
      creditsCommunities: data.creditsCommunities,
      appVersion: data.appVersion,
      plan: {
        name: data.plan?.current?.name,
        isPlanValid: data.plan.isPlanValid,
        activeToDate: data.plan.activeToDate,
        activeToDateNext: data.plan.activeToDateNext,
        costItem: data.plan.costItem,
        costNext: data.plan.costNext,
        costCurrent: data.plan.costCurrent,
        costCredits: data.plan.costCredits,
        isCardAttached: data.plan.isCardAttached,
        isCardValid: data.plan.isCardValid,
        cardNumber: data.plan.cardNumber,
        retrospectives: data.plan.current.retrospectives,
        reports: data.plan.current.reports,
        topRating: data.plan.current.topRating
      },
      carrotquestToken: data.carrotquestToken
    }
    await RootStore.accountsStore.load(silentLoad)

    this._loopTimeout = setTimeout(() => this.load(true), 30000)

    this.isLoading = false
  }

  @action
  public async update (): Promise<void> {
    // todo: Рефакторинг форм и ошибок форм через MobxForm
    const data = await API.profile.updateProfile(this.token, this.profileForm.getData())

    this.profileForm.setErrors(data.validationErrors || [])
    if (data.validationErrors) return

    // console.log(data)

    Notifications.show({
      title: 'Профиль обновлён',
      text: 'Отлично! Всё получилось, мы уже обновили ваши персональные данные.',
      type: 'attention'
    })
  }

  @action
  public async sendSurvey (): Promise<void> {
    const data = await API.profile.sendSurvey(this.token, this.surveyForm.getData())
    this.surveyForm.setErrors(data.validationErrors || [])
    if (data.validationErrors) return
  }

  @action
  public logout (): void {
    localStorage.removeItem('token')
    window.location.href = 'https://prn.c-cube.ru'

    this.isAuth = false
  }

  @action
  public async signup (): Promise<void> {
    if (!this._validateLoginForm(['email', 'password'])) return

    this.isValidate = true
    const data = await API.profile.signup(this.loginForm.email.value, this.loginForm.password.value, this.loginForm.promoCode.value)
    // console.log(data)

    this.loginForm.setErrors(data.validationErrors || [])
    if (!data.validationErrors) {
      this.token = data.token
      await this.load()

      YMUtil.reachGoal('registration')
    }

    this.isValidate = false
  }

  @action
  public async changePassword (): Promise<boolean> {
    if (this.passwordForm.new_password.value !== this.passwordForm.new_password2.value) {
      this.passwordForm.setErrors({
        new_password2: 'Пароли не совпадают'
      })

      return false
    }

    try {
      await APIClient.patch('profile/change-password', {
        token: this.token,
        old_password: this.passwordForm.old_password.value,
        new_password: this.passwordForm.new_password2.value
      })
    } catch (e: any) {
      this.passwordForm.setErrors(e.response.data.meta.errors || [])
      return false
    }

    this.passwordForm.setData({
      old_password: '',
      new_password: '',
      new_password2: ''
    })

    Notifications.show({
      title: 'Пароль изменён',
      text: 'Ну вот, в следующий раз входить в сервис нужно будет уже с новым паролем :)',
      type: 'attention'
    })
  }

  @action
  public async resetPassword (): Promise<void> {
    if (!this._validateLoginForm(['email'])) return

    this.isValidate = true
    const data = await API.profile.resetPassword(this.loginForm.email.value)
    // console.log(data)
    this.loginForm.setErrors(data.validationErrors || [])
    if (!data.validationErrors) {
      RootStore.routingStore.push('/sent-reset-password')
    }

    this.isValidate = false
  }

  @action
  public async setPassword (): Promise<void> {
    if (this.passwordForm.password.value !== this.passwordForm.password2.value) {
      return this.passwordForm.setErrors({
        password2: 'Пароли не совпадают'
      })
    }

    const data = await API.profile.setPassword(this.passwordForm.recovery_hash.value, this.passwordForm.password.value)
    // console.log(data)
    this.passwordForm.setErrors(data.validationErrors || [])
    if (data.validationErrors) return

    RootStore.routingStore.push('/', { token: data.token, recovery_hash: undefined })
  }

  @action
  public async sendConfirmEmail (withTimeout: boolean = true): Promise<boolean> {
    if (withTimeout) {
      if (this.emailConfirmCountdown > 0) return
      this.emailConfirmCountdown = 30
      this._emailConfirmTimer = setInterval(() => {
        this.emailConfirmCountdown--
        if (this.emailConfirmCountdown <= 0) {
          this.emailConfirmCountdown = 0
          clearInterval(this._emailConfirmTimer)
        }
      }, 1000)
    }

    const data = await API.profile.updateProfile(this.token, this.profileForm.getData())
    this.profileForm.setErrors(data.validationErrors || [])
    if (data.validationErrors) return false

    await APIClient.post('profile/verify-email', { token: this.token })

    return true
  }

  @action
  public async confirmEmail (code: string): Promise<void> {
    await APIClient.patch('profile/verify-email', { token: this.token, email_verify_hash: code })

    await this.load()

    YMUtil.reachGoal('confirmEmail')
  }

  private _validateLoginForm (fields: Array<TLoginFormField>): boolean {
    const validationErrors = {}
    if (fields.includes('email')) {
      const isEmailEmpty = this.loginForm.email.value !== ''
      const isEmailValid = /\S+@\S+\.\S+/.test(this.loginForm.email.value)
      if (!isEmailEmpty) {
        validationErrors['email'] = 'Email is required'
      } else if (!isEmailValid) {
        validationErrors['email'] = 'Email is invalid'
      }
    }
    if (fields.includes('password')) {
      const isPasswordEmpty = this.loginForm.password.value !== ''
      if (!isPasswordEmpty) validationErrors['password'] = 'Password is required'
    }

    this.loginForm.setErrors(validationErrors)
    return Object.keys(validationErrors).length === 0
  }

  /**
   * Очистка стора
   */
  public clear (): void {
    this.profile = {
      userID: '',
      email: '',
      confirmedEmail: false,
      name: '',
      country: '',
      city: '',
      phone: '',
      company: '',
      post: '',
      role: '',
      showSurvey: false,
      isDemo: false,
      isReports: false,
      activeToDate: new Date(),
      currentCommunities: 0,
      maxCommunities: 0,
      creditsCommunities: 0,
      appVersion: '',
      plan: null,
      carrotquestToken: ''
    }
    this.isValidate = false
    this.isLoading = false
    this.isAuth = false
    this.token = ''
    this.emailConfirmCountdown = 0
    clearInterval(this._emailConfirmTimer)
  }
}
