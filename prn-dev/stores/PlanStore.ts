import { action, computed, makeAutoObservable } from 'mobx'
import { IBaseStore, IStore } from './RootStore'
import APIClient from '../lib/APIClient'
import { createForm, MobxForm } from '../utils/mobx-form-creator'
import ObjectUtil from '../utils/ObjectUtil'
import config from '../config'
import YMUtil from '../utils/YMUtil'
import ArrayUtil from '../utils/ArrayUtil'

interface IPaymentConfirmation {
  confirmationURL: string
  cost: number
}

interface IInvoice {
  invoiceID: string
  dateStart: Date
  dateFinish: Date
  cost: number
  items: number | IPlanItem
  status: 'pending' | 'paid' | 'canceled' | 'refunded'
  confirmationURL: string
  timeCreate: Date
}

export interface IPlanItem {
  planID: string
  name: string
  projects: number
  communities: number
  competitors: number
  influencers: number
  retrospectives: number
  priority: number
  reports: Array<string>
  postGrade: boolean
  communityScore: boolean
  qualityScore: boolean
  topRating: number
  indexLevel: number
  price: number
}

interface IPlanPaymentForm {
  name: string
  period: number
  method: 'bank_card' | 'enot' | 'cp' | 'paypal' | 'saved_card' | 'others' | ''
}

type TStep1Answer = string | 'too_expensive' | 'no_features' | 'use_other_service' | 'use_service_issues' | 'service_not_needed' | 'payment_period_issue' | 'other' | 'contact_me'
type TStep2Tasks = 'posting_in_social_networks' | 'comments_and_dm' | 'need_more_data' | 'need_more_reports_features' | 'teamwork'

interface IPlanSurveyForm {
  step1answer: TStep1Answer
  step2features: Array<TStep2Tasks>
  step2comment: string
  step2notifyAboutPriceChanges: boolean
}

export default class PlanStore implements IBaseStore {
  private _rootStoreID = Symbol()
  public isLoading: boolean = false
  public isPaying: boolean = false
  public plans: Array<IPlanItem> = []
  public invoices: Array<IInvoice> = []
  public planCost: number = 0
  public confirmationURL: string = ''
  public planPaymentForm: MobxForm<IPlanPaymentForm> = {}
  public planSurveyForm: MobxForm<IPlanSurveyForm> = {}

  constructor (rootStore: IStore) {
    makeAutoObservable(this)

    this[this._rootStoreID] = rootStore

    createForm<IPlanPaymentForm>(this.planPaymentForm,{
      name: '',
      period: null,
      method: 'bank_card'
    })

    createForm<IPlanSurveyForm>(this.planSurveyForm,{
      step1answer: '',
      step2features: [],
      step2comment: '',
      step2notifyAboutPriceChanges: false
    })
  }

  get _rootStore (): IStore {
    return this[this._rootStoreID]
  }

  @action
  public async loadPlans (): Promise<void> {
    this.isLoading = true
    try {
      const { data } = await APIClient.get(`payments/plans`, {
        token: this._rootStore.profileStore.token
      })

      // console.log(data.data)
      this.plans = ArrayUtil.arrayObjectsSort('price', data.data as Array<IPlanItem>)
    } catch (err) {
      // console.log(err, err?.response?.status, err?.response)
    }
    this.isLoading = false
  }

  @action
  public async loadInvoices (): Promise<void> {
    this.isLoading = true
    try {
      const { data } = await APIClient.get(`payments/invoices`, {
        token: this._rootStore.profileStore.token
      })
      this.invoices = data.data as Array<IInvoice>
    } catch (err) {
      // console.log(err, err?.response?.status, err?.response)
    }
    this.isLoading = false
  }

  @action
  public async pay (): Promise<void> {
    this.isPaying = true
    try {
      const paymentForm = this.planPaymentForm
      const { data } = await APIClient.post(`payments/pay`, {
        token: this._rootStore.profileStore.token,
        name: paymentForm.name.value,
        period: paymentForm.period.value,
        method: paymentForm.method.value,
        redirectURL: `${config.paymentRedirectUrl}?invoiceID={invoiceID}`
      })
      this.confirmationURL = (data.data as IPaymentConfirmation).confirmationURL
      this.planCost = (data.data as IPaymentConfirmation).cost
      if (this.confirmationURL === '') {
        await this._rootStore.profileStore.load(true)
      } else {
        YMUtil.reachGoal('checkout')
      }
    } catch (err) {
      // console.log(err, err?.response?.status, err?.response)
    }
    this.isPaying = false
  }

  @action
  public async removeCard (): Promise<void> {
    this.isLoading = true
    try {
      const surveyForm = this.planSurveyForm
      await APIClient.delete(`payments/card`, {
        token: this._rootStore.profileStore.token,
        survey: ObjectUtil.removeUndefined({
          step1answer: surveyForm.step1answer.value || undefined,
          step2features: surveyForm.step2features.value.length ? surveyForm.step2features.value : undefined,
          step2comment: surveyForm.step2comment.value || undefined,
          step2notifyAboutPriceChanges: surveyForm.step2notifyAboutPriceChanges.value || undefined
        })
      })

      await this._rootStore.profileStore.load(true)
    } catch (err) {
      // console.log(err, err?.response?.status, err?.response)
    }
    this.isLoading = false
  }

  @computed
  public getPlanByName (name: string): IPlanItem {
    return this.plans?.find(plan => plan.name === name)
  }

  @computed
  public getInvoiceByInvoiceID (invoiceID: string): IInvoice {
    return this.invoices?.find(invoice => invoice.invoiceID === invoiceID)
  }

  @computed
  public get paidInvoices (): Array<IInvoice> {
    return this.invoices ? this.invoices.filter(invoice => invoice.status === 'paid') : []
  }

  /**
   * Прокидываем данные
   *
   * @param initialData
   */
  hydrate (initialData: any) {
    this.isLoading = initialData?.isLoading
    this.isPaying = initialData?.isPaying
    this.plans = initialData?.plans
    this.invoices = initialData?.invoices
    this.confirmationURL = initialData?.confirmationURL
    this.planPaymentForm.hydrate(initialData?.planPaymentForm)
    this.planSurveyForm.hydrate(initialData?.planSurveyForm)
  }

  /**
   * Очистка стора
   */
  public clear (): void {
    this.isLoading = false
    this.isPaying = false
    this.plans = []
    this.invoices = []
    this.confirmationURL = ''
  }
}
