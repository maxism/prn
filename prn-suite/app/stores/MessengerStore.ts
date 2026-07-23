import { action, makeAutoObservable } from 'mobx'
import whenChangedParameters from '../utils/whenChangedParameters'
import APIClient from '../lib/APIClient'
import RootStore from './RootStore'
import ISocialType from '../interfaces/ISocialType'
import Timeout = NodeJS.Timeout

type TDialogFilter = 'comments' | 'directs' | 'all' | 'opened' | 'closed' | 'withErrors' | 'noAnswer'
type TDialogStatus = 'opened' | 'closed' | 'process' | 'error'
type TDialogType = 'direct' | 'comment'
type TMessageType = 'system' | 'text'
type TSystemType = 'open' | 'close'
type TMessageStatus = 'process' | 'publish' | 'done' | 'error'

export interface IDialog {
  dialogID: string
  accountID: string
  groupID: string
  socialType: ISocialType
  dialogStatus: TDialogStatus
  dialogType: TDialogType
  from: IFromMessage
  post: IMessagePost
  lastMessage: ILastMessage
}

interface IFromMessage {
  name: string
  avatar: string
  url: string
}

interface IMessagePost {
  text: string,
  url: string,
  image: string,
  date: Date
}

interface ILastMessage {
  text: string
  date: Date
  fromOwner: boolean
}

export interface IMessage {
  messageID: string
  messageType: TMessageType
  messageStatus: TMessageStatus
  systemType: TSystemType
  date: Date
  fromOwner: boolean
  replyTo: IReplyToMessage
  text: string
}

interface IReplyToMessage {
  messageID: string
  text: string
  date: Date
}

export default class MessengerStore {
  private _loopTimeout: Timeout
  private _filter: TDialogFilter
  private _tab: string

  public isLoading: boolean = false
  public currentDialog: IDialog = null
  public badges: Map<TDialogFilter, number> = new Map()
  public dialogs: Array<IDialog> = []
  public messages: Array<IMessage> = []

  constructor () {
    makeAutoObservable(this)
  }

  @action
  @whenChangedParameters
  public async loadDialogs (accountID: string, tab: TDialogType | string, filter: TDialogFilter | string): Promise<void> {
    this.isLoading = true
    this._tab = tab as TDialogType
    this._filter = filter as TDialogFilter
    await this._load()
    this.isLoading = false
  }

  @action
  public async updateDialog (dialogID: string, data: Partial<IDialog>): Promise<void> {
    try {
      await APIClient.patch(`accounts/${RootStore.accountsStore.currentAccount.accountID}/messenger/dialogs/${dialogID}`, {
        ...data,
        token: RootStore.profileStore.token
      })
      // await this.loadMessages(dialogID, false)
      await this._loadDialogs()
      this.selectDialog(dialogID)
    } catch (err: any) {
      console.log(err, err?.response?.status, err?.response)
    }
  }

  @action
  public selectDialog (dialogID: string): void {
    this.currentDialog = this.dialogs.find(item => item.dialogID === dialogID) || this.dialogs[0]
    this.loadMessages(dialogID, true)
  }

  @action
  public async loadMessages (dialogID: string, withLoader: boolean): Promise<void> {
    // console.log('MessengerStore:: loadMessages')
    this.isLoading = withLoader
    try {
      const data = await APIClient.get(`accounts/${RootStore.accountsStore.currentAccount.accountID}/messenger/dialogs/${dialogID}/messages`, {
        fields: 'tokens',
        token: RootStore.profileStore.token
      })
      this.messages = data.data.data as Array<IMessage>
    } catch (err: any) {
      console.log(err, err?.response?.status, err?.response)
    } finally {
      this.isLoading = false
    }
  }

  @action
  public async replyMessage (dialogID: string, replyText: string, replyToMessageID: string): Promise<void> {
    try {
      await APIClient.post(`accounts/${RootStore.accountsStore.currentAccount.accountID}/messenger/dialogs/${dialogID}/messages`, {
        token: RootStore.profileStore.token,
        text: replyText,
        replyToMessageID
      })
      // const messageID = data.data.data
      await this.loadMessages(dialogID, false)
    } catch (err: any) {
      console.log(err, err?.response?.status, err?.response)
    }
  }

  @action
  public async updateMessage (dialogID: string, messageID: string, data: Partial<IMessage>): Promise<void> {
    try {
      await APIClient.patch(`accounts/${RootStore.accountsStore.currentAccount.accountID}/messenger/dialogs/${dialogID}/messages/${messageID}`, {
        ...data,
        token: RootStore.profileStore.token
      })
      await this.loadMessages(dialogID, false)
    } catch (err: any) {
      console.log(err, err?.response?.status, err?.response)
    }
  }

  @action
  public clearMessages (): void {
    this.messages = []
    this.currentDialog = null
  }

  @action
  private async _load (): Promise<void> {
    clearInterval(this._loopTimeout)
    await this._loadDialogs()
    if (this.currentDialog) await this.loadMessages(this.currentDialog.dialogID, false)
    this._loopTimeout = setTimeout(() => this._load(), 10000)
  }

  private async _loadDialogs (): Promise<void> {
    // console.log('MessengerStore:: loadDialogs')

    try {
      const data = await APIClient.get(`accounts/${RootStore.accountsStore.currentAccount.accountID}/messenger/dialogs`, {
        fields: 'tokens',
        token: RootStore.profileStore.token
      })

      const allDialogs = data.data.data as Array<IDialog>
      const directs = allDialogs.filter(dialog => dialog.dialogType === 'direct')
      const comments = allDialogs.filter(dialog => dialog.dialogType === 'comment')
      const dialogs = this._tab === 'dialogs' ? directs : comments
      const openedDialogs = dialogs.filter(dialog => dialog.dialogStatus === 'opened')
      const closedDialogs = dialogs.filter(dialog => dialog.dialogStatus === 'closed')
      const withErrorsDialogs = dialogs.filter(dialog => dialog.dialogStatus === 'error')
      const noAnswerDialogs = dialogs.filter(dialog => !dialog.lastMessage.fromOwner)
      this.badges.set('comments', comments.length)
      this.badges.set('directs', directs.length)
      this.badges.set('all', dialogs.length)
      this.badges.set('opened', openedDialogs.length)
      this.badges.set('closed', closedDialogs.length)
      this.badges.set('withErrors', withErrorsDialogs.length)
      this.badges.set('noAnswer', noAnswerDialogs.length)

      if (this._filter === 'all') this.dialogs = dialogs
      if (this._filter === 'opened') this.dialogs = openedDialogs
      if (this._filter === 'closed') this.dialogs = closedDialogs
      if (this._filter === 'withErrors') this.dialogs = withErrorsDialogs
      if (this._filter === 'noAnswer') this.dialogs = noAnswerDialogs

    } catch (err: any) {
      console.log(err, err?.response?.status, err?.response)
    }
  }

  /**
   * Очистка стора
   */
  public clear (): void {
    clearInterval(this._loopTimeout)
    this.isLoading = false
    this.currentDialog = null
    this.badges.clear()
    this.dialogs = []
    this.messages = []
  }
}
