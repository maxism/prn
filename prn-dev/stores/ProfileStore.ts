import {action, computed, makeAutoObservable} from 'mobx'
import {createForm, MobxForm} from '../utils/mobx-form-creator'
import APIClient from '../lib/APIClient'
import CookieUtil from '../utils/CookieUtil'
import {IBaseStore, IStore} from './RootStore'
import YMUtil from '../utils/YMUtil'
import ObjectUtil from '../utils/ObjectUtil'
import moment from 'moment'
import {CommunityType} from './CommunitiesStore'
import AppUtil from '../utils/AppUtil'

type TLoginFormField = 'email' | 'password'

interface IProfile {
  userID: string
  email: string
  name: string
  picture: string
  phone: string
  company: string
  post: string
  city: string
  representative: string
  role: string
  confirmedEmail: boolean
  carrotquestToken: string
  plan: IPlan
  isPartner: boolean
  partnerPromoCode: string
  tempDiscount: number
  permDiscount: number
}

export interface IPlan {
  isPlanValid: boolean
  isCardAttached: boolean
  isCardValid: boolean
  cardNumber: string
  planStatus: PlanStatus
  activeToDate: Date
  current: IUserPlan
  next: IUserPlan
}

interface IUserPlan {
  name: string,
  projects: number,
  communities: number,
  competitors: number,
  influencers: number,
  retrospectives: number,
  price: number,
  period: number
  priority: number
  reports: Array<string>
  postGrade: boolean
  communityScore: boolean
  qualityScore: boolean
  topRating: number
  indexLevel: number
}

interface ILoginForm {
  email: string
  password: string
  promoCode: string
  partnerCode: string
  addCommunityUrl: string
  captchaToken: string
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
  email: string
  name: string
  picture: string
  phone: string
  company: string
  post: string
  city: string
  representative: string
  isPartner: boolean
}

interface IChangePasswordForm {
  password: string
  newPassword: string
  newPassword2: string
}

export enum UserPermission {
  PROJECTS,
  COMMUNITIES,
  COMPETITORS,
  INFLUENCERS,
  PROJECT
}

export enum PlanStatus {
  NONE = '',
  PAID = 'paid',
  PREPAY = 'prepay',
  PAY = 'pay',
  PAY_7 = 'pay7',
  PAY_14 = 'pay14',
  PAY_15 = 'pay15'
}

export interface IReferrer {
  /**
   * ID пользователя
   */
  userID: string
  /**
   * Частично закрытая почта
   */
  secretEmail: string
  /**
   * Дата регистрации
   */
  regDate: Date
  /**
   * Вознаграждение
   */
  amount: number
  /**
   * Замороженное вознаграждение
   */
  frozen: number
}

export interface IPartnerReport {
  list: Array<IReferrer>
  summary: {
    /**
     * Количество рефералов
     */
    count: number
    /**
     * Общее вознаграждение
     */
    amount: number
    /**
     * Замороженная суммма (14 дней после оплаты)
     */
    frozen: number
    /**
     * Сейчас доступно для выплаты
     */
    available: number
    /**
     * Выплаченная сумма
     */
    payout: number
  }
}

export default class ProfileStore implements IBaseStore {
  private _rootStoreID = Symbol()
  public loginForm: MobxForm<ILoginForm> = {}
  public profileForm: MobxForm<IProfileForm> = {}
  public passwordForm: MobxForm<IPasswordForm> = {}
  public changePasswordForm: MobxForm<IChangePasswordForm> = {}
  public profile: IProfile = {
    userID: '',
    email: '',
    name: '',
    picture: '',
    phone: '',
    company: '',
    post: '',
    city: '',
    representative: '',
    role: '',
    confirmedEmail: false,
    carrotquestToken: '',
    plan: null,
    isPartner: false,
    partnerPromoCode: '',
    tempDiscount: 0,
    permDiscount: 0
  }
  public isValidate: boolean = false
  public isLoading: boolean = false
  public isAuth: boolean = false
  public token: string = ''
  public isSentConfirmEmail: boolean = false
  public partnerReport: IPartnerReport = null

  constructor (rootStore: IStore) {
    makeAutoObservable(this)

    this[this._rootStoreID] = rootStore

    createForm(this.loginForm,{
      email: '',
      password: '',
      promoCode: '',
      partnerCode: '',
      addCommunityUrl: '',
      captchaToken: ''
    })

    createForm<IPasswordForm>(this.passwordForm,{
      recovery_hash: '',
      old_password: '',
      new_password: '',
      new_password2: '',
      password: '',
      password2: ''
    })

    createForm<IProfileForm>(this.profileForm,{
      email: '',
      name: '',
      picture: '',
      phone: '',
      company: '',
      post: '',
      city: '',
      representative: '',
      isPartner: false
    })

    createForm<IChangePasswordForm>(this.changePasswordForm,{
      password: '',
      newPassword: '',
      newPassword2: ''
    })

    if (AppUtil.isClientSide) {
      clearInterval(window['__mainLoop'])
      window['__mainLoop'] = setInterval(() => this.reload(), 30000)
    }
  }

  get _rootStore (): IStore {
    return this[this._rootStoreID]
  }

  @action
  public async login (): Promise<void> {
    if (!this._validateLoginForm(['email', 'password'])) return

    this.isValidate = true

    try {
      const data: any = await APIClient.get('signin', {
        email: this.loginForm.email.value,
        password: this.loginForm.password.value,
        captchaToken: this.loginForm.captchaToken.value
      })

      this.setToken(data.data.data.token)
      await this.load()

      YMUtil.reachGoal('login')
    } catch (e) {

      // Если ошибка, пробуем авторизоваться в аналитике
      try {
        const data: any = await APIClient.getAnalytics('signin', {
          email: this.loginForm.email.value,
          password: this.loginForm.password.value
        })

        document.location.href = 'https://prna.c-cube.ru?token='.concat(data.data.data.token)
        return
      } catch (e) { }
      //

      this.loginForm.setErrors(e.response.data.meta.errors || [])
    }

    this.isValidate = false
  }

  @action
  public async setToken (token: string, accountID: string = ''): Promise<void> {
    if (this.token !== token && token !== 'undefined') {
      this.token = token
      console.log('setToken', token)
      await Promise.all([
        this.load(),
        this._rootStore.accountsStore.load(),
        this._rootStore.accountsStore.setAccount(accountID),
        this._rootStore.communitiesStore.load(true),
        this._rootStore.planStore.loadPlans()
      ])
    } else {
      await this._rootStore.planStore.loadPlans()
    }
  }

  @action
  public async reload (): Promise<void> {
    console.log('reload Profile')
    if (this.token) {
      await Promise.all([
        this.load(true),
        this._rootStore.accountsStore.load(true),
        this._rootStore.communitiesStore.load(true),
        this._rootStore.planStore.loadPlans()
      ])
    }
  }

  @action
  public async load (silentLoad = false): Promise<void> {
    this.isLoading = !silentLoad

    try {
      const data: any = await APIClient.get('profile/personal', { token: this.token, fields: 'representative,picture,carrotquestToken,isPartner,partnerPromoCode' })
      const user = data.data.data

      if (!user.userID) {
        this.isAuth = false
        this.token = ''
        this.isLoading = false
        this.profile = {
          userID: '',
          email: '',
          name: '',
          picture: '',
          phone: '',
          company: '',
          post: '',
          city: '',
          representative: '',
          role: '',
          confirmedEmail: false,
          carrotquestToken: '',
          plan: null,
          isPartner: false,
          partnerPromoCode: '',
          tempDiscount: 0,
          permDiscount: 0
        }
        CookieUtil.set(null, 's_token', '')
        return
      }

      CookieUtil.set(null, 's_token', this.token)
      const plan = user.plan
      this.profile = {
        userID: user.userID,
        email: user.email,
        name: user.name,
        picture: user.picture,
        phone: user.phone,
        company: user.company,
        post: user.post,
        city: user.city,
        representative: user.representative,
        role: user.role,
        confirmedEmail: user.confirmedEmail,
        carrotquestToken: user.carrotquestToken,
        plan: {
          isPlanValid: moment().isBefore(plan.activeToDate),
          isCardAttached: plan.isCardAttached,
          isCardValid: plan.isCardValid,
          cardNumber: plan.cardNumber,
          activeToDate: plan.activeToDate,
          planStatus: plan.planStatus,
          current: plan.current,
          next: plan.next,
        },
        isPartner: user.isPartner,
        partnerPromoCode: user.partnerPromoCode,
        tempDiscount: user.tempDiscount,
        permDiscount: user.permDiscount
      }
      this.isAuth = true
    } catch (e) {
      //
    }

    this.isLoading = false
  }

  @action
  public logout (): void {
    this._rootStore.clear()
    CookieUtil.set(null, 's_token', undefined)

    window.location.href = '/'
  }

  @action
  public async signup (): Promise<void> {
    if (!this._validateLoginForm(['email', 'password'])) return

    this.isValidate = true

    try {
      const data = await APIClient.post('signup', {
        email: this.loginForm.email.value,
        password: this.loginForm.password.value,
        promoCode: this.loginForm.promoCode.value,
        partnerCode: this.loginForm.partnerCode.value,
        lang: 'ru',
        addCommunityUrl: this.loginForm.addCommunityUrl.value
      })

      this.token = data.data.data.token
      await this.load()

      YMUtil.reachGoal('registration')
    } catch (e) {
      this.loginForm.setErrors(e.response.data.meta.errors || [])
    }

    this.isValidate = false
  }

  @action
  public async update (): Promise<void> {
    this.isLoading = true
    try {
      await APIClient.patch('profile/personal', ObjectUtil.removeUndefined({
        email: this.profileForm.email.value || undefined,
        name: this.profileForm.name.value || undefined,
        picture: this.profileForm.picture.value || undefined,
        phone: this.profileForm.phone.value || undefined,
        company: this.profileForm.company.value || undefined,
        post: this.profileForm.post.value || undefined,
        city: this.profileForm.city.value || undefined,
        representative: this.profileForm.representative.value || undefined,
        isPartner: this.profileForm.isPartner.value || undefined,
        token: this.token
      }))

      await this.load()

      this.profileForm.setCompleted()
    } catch (e) {
      this.profileForm.setErrors(e.response.data.meta.errors || [])
    }
    this.isLoading = false
  }

  @action
  public async updatePicture (): Promise<void> {
    try {
      await APIClient.patch('profile/personal', ObjectUtil.removeUndefined({
        picture: this.profileForm.picture.value || undefined,
        email: this.profileForm.email.value || undefined,
        token: this.token
      }))

      await this.load()
    } catch (e) {
      this.profileForm.setErrors(e.response.data.meta.errors || [])
    }
  }

  @action
  public async resetPassword (): Promise<void> {
    if (!this._validateLoginForm(['email'])) return

    this.isValidate = true
    try {
      await APIClient.post('profile/reset-password', {
        email: this.loginForm.email.value,
        token: this._rootStore.profileStore.token
      })

      this.loginForm.setCompleted()
    } catch (e) {
      this.loginForm.setErrors(e.response.data.meta.errors || [])
    }

    this.isValidate = false
  }

  @action
  public async setPassword (): Promise<void> {
    if (!this.passwordForm.password.value) {
      return this.passwordForm.setErrors({ password: 'Введите пароль' })
    }

    if (!this.passwordForm.password2.value) {
      return this.passwordForm.setErrors({ password2: 'Введите пароль' })
    }

    if (this.passwordForm.password.value !== this.passwordForm.password2.value) {
      return this.passwordForm.setErrors({ password2: 'Пароли не совпадают' })
    }

    try {
      const data = await APIClient.patch('profile/reset-password', {
        recovery_hash: this.passwordForm.recovery_hash.value,
        password: this.passwordForm.password.value,
        token: this._rootStore.profileStore.token
      })

      this.token = data.data.data.token
      await this.load()

      this.passwordForm.setCompleted()
    } catch (e) {
      this.passwordForm.setErrors({ password: 'Ссылка для восстановления пароля устарела' })
    }
  }

  @action
  public async changePassword (): Promise<void> {
    if (!this.changePasswordForm.password.value) {
      return this.changePasswordForm.setErrors({ password: 'Введите текущий пароль' })
    }

    if (!this.changePasswordForm.newPassword.value) {
      return this.changePasswordForm.setErrors({ newPassword: 'Введите новый пароль' })
    }

    if (!this.changePasswordForm.newPassword2.value) {
      return this.changePasswordForm.setErrors({ newPassword2: 'Введите новый пароль ще раз' })
    }

    if (this.changePasswordForm.newPassword.value !== this.changePasswordForm.newPassword2.value) {
      return this.changePasswordForm.setErrors({ newPassword: 'Пароли не совпадают' })
    }

    try {
      await APIClient.patch('profile/change-password', {
        old_password: this.changePasswordForm.password.value,
        new_password: this.changePasswordForm.newPassword.value,
        token: this.token,
      })

      this.changePasswordForm.setCompleted()
    } catch (e) {
      this.changePasswordForm.setErrors({ password: 'Неверный пароль' })
    }
  }

  @action
  public async sendConfirmEmail (): Promise<void> {
    await APIClient.post('profile/verify-email', { token: this.token })
    this.isSentConfirmEmail = true
  }

  @action
  public async confirmEmail (code: string): Promise<void> {
    await APIClient.patch('profile/verify-email', { token: this.token, email_verify_hash: code })

    await this.load()

    YMUtil.reachGoal('confirmEmail')
  }

  @action
  public async loadPartnerReport (): Promise<void> {
    try {
      const data: any = await APIClient.get('profile/partner/report', { token: this.token })
      this.partnerReport = data.data.data
    } catch (e) {
      //
    }
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

  @computed
  public isDeveloper (): boolean {
    return this.isAuth && this.profile?.role === 'developer'
  }

  @computed
  public get userPlan (): IPlan {
    const guestPlan: IPlan = {
      isPlanValid: false,
      isCardAttached: false,
      isCardValid: false,
      cardNumber: '',
      activeToDate: new Date(),
      planStatus: PlanStatus.NONE,
      current: this._rootStore.planStore.getPlanByName('guest') as unknown as IUserPlan,
      next: null
    }

    return this.isAuth ? this.profile?.plan : guestPlan
  }

  @computed
  public checkPermission (permission: UserPermission, projectID: string = ''): boolean {
    if (permission === UserPermission.PROJECTS && this._rootStore.accountsStore.accounts.length <= this.userPlan.current.projects) return true
    if (permission === UserPermission.COMMUNITIES && this._rootStore.communitiesStore.getMyCommunities(projectID).length <= this.userPlan.current.communities) return true
    else if (permission === UserPermission.COMPETITORS && this._rootStore.communitiesStore.getCompetitorsCommunities(projectID).length <= this.userPlan.current.competitors) return true
    else if (permission === UserPermission.INFLUENCERS && this._rootStore.communitiesStore.getInfluencersCommunities(projectID).length <= this.userPlan.current.influencers) return true
    else if (permission === UserPermission.PROJECT && this._rootStore.accountsStore.getProject(projectID)?.isPaid) return true

    return false
  }

  @computed
  public getHigherPlansList (options: Partial<IUserPlan> = {}): string {
    const plans = this.getHigherPlansByOptions(options).map(planName => planName[0].toUpperCase() + planName.slice(1))
    const lastPlan = plans.pop()

    return (plans.length ? plans.join(', ').concat(' или ') : '').concat(lastPlan)
  }

  @computed
  public getHigherPlansByOptions (options: Partial<IUserPlan> = {}): Array<string> {
    let plans = this._rootStore.planStore.plans.filter(plan => {
      // todo: Проверять тарифы по переданной функциональности в зависимости от места вывода сообщения
      if (['guest', 'free'].includes(plan.name)) return false
      if (!Object.keys(options).length && this._rootStore.accountsStore.accounts.length > plan.projects) return false
      if (!Object.keys(options).length &&this._rootStore.communitiesStore.getMaxCommunityPerProject(CommunityType.MY) > plan.communities) return false
      else if (!Object.keys(options).length &&this._rootStore.communitiesStore.getMaxCommunityPerProject(CommunityType.COMPETITOR) > plan.competitors) return false
      else if (!Object.keys(options).length &&this._rootStore.communitiesStore.getMaxCommunityPerProject(CommunityType.INFLUENCER) > plan.influencers) return false
      else if (options.qualityScore && !plan.qualityScore) return false
      else if (options.topRating > plan.topRating) return false
      else if (options.indexLevel > plan.indexLevel) return false

      return true
    }).map(plan => plan.name)

    plans.push('special')

    return plans
  }

  @computed
  public getPromoDiscount (): number {
    return this.profile.tempDiscount || this.profile.permDiscount
  }

  @computed
  public isAvailableStatistics (): boolean {
    if (!this.isAuth) return false

    if (this.userPlan.current?.name === 'free') return false
    if (this.userPlan.current?.name === 'start') return false
    if (!this.userPlan.isPlanValid) return false

    return true
  }

  /**
   * Прокидываем данные
   *
   * @param initialData
   */
  hydrate (initialData: any) {
    this.isAuth = initialData?.isAuth
    this.profile = initialData?.profile
    this.token = initialData?.token
    this.loginForm.hydrate(initialData?.loginForm)
    this.profileForm.hydrate(initialData?.profileForm)
    this.changePasswordForm.hydrate(initialData?.changePasswordForm)
    this.partnerReport = initialData?.partnerReport
  }

  /**
   * Очистка стора
   */
  public clear (): void {
    this.profile = {
      userID: '',
      email: '',
      name: '',
      picture: '',
      phone: '',
      company: '',
      post: '',
      city: '',
      representative: '',
      role: '',
      confirmedEmail: false,
      carrotquestToken: '',
      plan: null,
      isPartner: false,
      partnerPromoCode: '',
      permDiscount: 0,
      tempDiscount: 0
    }
    this.isValidate = false
    this.isLoading = false
    this.isAuth = false
    this.token = ''
    this.isSentConfirmEmail = false
    this.partnerReport = null
  }
}
