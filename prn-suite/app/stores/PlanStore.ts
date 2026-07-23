import { action, computed, makeAutoObservable } from 'mobx'
import RootStore from './RootStore'
import moment from 'moment'
import APIClient from '../lib/APIClient'

interface IPaymentConfirmation {
  confirmationURL: string
}

export interface IPaymentInvoice {
  dateStart: Date
  dateFinish?: Date
  totalCost: number
  invoices: Array<IInvoice>
}

interface IInvoice {
  invoiceID: string
  dateStart: Date
  dateFinish: Date
  cost: number
  items: number
  status: string
  confirmationURL: string
  timeCreate: Date
}

export default class PlanStore {
  public isLoading: boolean = false
  public isPaying: boolean = false
  public invoices: Array<IInvoice> = []
  public confirmationURL: string = ''

  constructor () {
    makeAutoObservable(this)
  }

  @action
  public async load (): Promise<void> {
    this.isLoading = true
    try {
      const data = await APIClient.get(`payments/invoices`, {
        token: RootStore.profileStore.token
      })
      this.invoices = data.data.data as Array<IInvoice>
    } catch (err: any) {
      console.log(err, err?.response?.status, err?.response)
    } finally {
      this.isLoading = false
    }
  }

  @action
  public async pay (redirectURL: string, method: string = ''): Promise<void> {
    this.isPaying = true
    try {
      const data = await APIClient.post(`payments/pay`, {
        token: RootStore.profileStore.token,
        redirectURL,
        method
      })
      this.confirmationURL = (data.data.data as IPaymentConfirmation).confirmationURL
      this.isPaying = false
    } catch (err: any) {
      console.log(err, err?.response?.status, err?.response)
    }
  }

  @action
  public async removeCard (): Promise<void> {
    try {
      await APIClient.delete(`payments/card`, {
        token: RootStore.profileStore.token
      })

      await RootStore.profileStore.load(true)
    } catch (err: any) {
      console.log(err, err?.response?.status, err?.response)
    }
  }

  @computed
  public getInvoiceByInvoiceID (invoiceID: string): IInvoice {
    return this.invoices.find(invoice => invoice.invoiceID === invoiceID)
  }

  @computed
  public getGroupInvoices (): Array<IPaymentInvoice> {
    return this.invoices.reduce((acc, currentValue) => {
      // currentValue.status = ['paid', 'pending', 'canceled', 'refunded'][Math.round(Math.random() * 3)]
      if (currentValue.dateStart && currentValue?.dateFinish) {
        let invoiceData = acc.find(item => item?.dateFinish?.valueOf() === currentValue?.dateFinish?.valueOf())
        if (invoiceData) {
          invoiceData.dateStart = moment.min([moment(invoiceData.dateStart), moment(currentValue.dateStart)]).toDate()
          invoiceData.invoices.push(currentValue)
          invoiceData.totalCost += currentValue.status === 'paid' ? currentValue.cost : 0
        } else {
          invoiceData = {
            dateStart: currentValue.dateStart,
            dateFinish: currentValue?.dateFinish,
            invoices: [currentValue],
            totalCost: currentValue.status === 'paid' ? currentValue.cost : 0
          }
          acc.push(invoiceData)
        }
      } else {
        // старые инвойсы или инвойсы в статусе "pending"
        acc.push({
          dateStart: currentValue.timeCreate,
          invoices: [currentValue],
          totalCost: currentValue.status === 'paid' ? currentValue.cost : 0
        })
      }
      return acc
    }, new Array<IPaymentInvoice>())
  }

  /**
   * Очистка стора
   */
  public clear (): void {
    this.isLoading = false
    this.isPaying = false
    this.invoices = []
    this.confirmationURL = ''
  }
}
