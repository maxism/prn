import React, { Component } from 'react'
import format from '../lib/format'

import MessengerAnswer from '../ui/elements/Messenger/MessengerAnswer'
import MessengerDialogs from '../ui/elements/Messenger/MessengerDialogs'
import MessengerMessages from '../ui/elements/Messenger/MessengerMessages'
import MessengerMessagesList from '../ui/elements/Messenger/MessengerMessagesList'

import LiteLayout from './layouts/LiteLayout'
import Messenger from '../ui/elements/Messenger/Messenger'
import ScrollView from '../ui/elements/ScrollView/ScrollView'
import Dialog from '../ui/elements/Dialog/Dialog'
import DialogMessage from '../ui/elements/DialogMessage/DialogMessage'
import TextareaReply from '../ui/elements/TextareaReply/TextareaReply'
import { inject, observer } from 'mobx-react'
import { Stores } from '../stores/RootStore'
import AccountsStore from '../stores/AccountsStore'
import MessengerStore, { IDialog, IMessage } from '../stores/MessengerStore'
import ArrayUtil from '../utils/ArrayUtil'
import withParams, { ParamsProps } from '../utils/withParams'
import { IMessengerParams } from '../interfaces/IParams'
import ProfileStore from '../stores/ProfileStore'
import NoData from '../ui/elements/NoData/NoData'
import Toolbar2Group from '../ui/elements/Toolbar2/Toolbar2Group'
import Toolbar2 from '../ui/elements/Toolbar2/Toolbar2'
import ButtonTextGroup from '../ui/elements/ButtonText/ButtonTextGroup'
import ButtonText from '../ui/elements/ButtonText/ButtonText'
import Segment from '../ui/elements/Segment/Segment'
import MessengerSplitter from '../ui/elements/Messenger/MessengerSplitter'
import DialogInfo from '../ui/elements/DialogInfo/DialogInfo'
import { Helmet } from 'react-helmet'
import Select from '../ui/elements/Select/Select'
import BadgeCount from '../ui/elements/BadgeCount/BadgeCount'

interface IProps {
  params?: ParamsProps<IMessengerParams>
  accountsStore?: AccountsStore
  messengerStore?: MessengerStore
  profileStore?: ProfileStore
}

interface IState {
  replyText: string
  replyTo: IMessage
  replyClosed: boolean
}

enum MessengerTab {
  COMMENTS = 'comments',
  DIALOGS = 'dialogs'
}

/**
 * Страница MessengerPage
 */
@withParams
@inject(Stores.ACCOUNTS_STORE, Stores.MESSENGER_STORE, Stores.PROFILE_STORE)
@observer
class MessengerPage extends Component<IProps, IState> {
  public state: IState = {
    replyText: '',
    replyTo: null,
    replyClosed: false
  }

  constructor (props: IProps) {
    super(props)

    this.loadDialogs()
  }

  componentDidUpdate (prevProps: Readonly<IProps>, prevState: Readonly<{}>, snapshot?: any): void {
    const { params, messengerStore } = this.props
    const { dialogs, currentDialog } = messengerStore
    const { dialogID } = params

    this.loadDialogs()

    if (dialogs.length) {
      let newDialogID = ''
      if (currentDialog && !dialogs.includes(currentDialog)) {
        newDialogID = dialogs[0].dialogID
      }

      if (prevProps.params.dialogID !== dialogID || !currentDialog) {
        newDialogID = dialogID
      }

      if (newDialogID) {
        messengerStore.selectDialog(newDialogID)
        // todo: Сбрасывает текст в сообщение если выбран диалог, найти другое решение
        // this.setState({ replyText: '', replyTo: null })
      }
    } else {
      if (dialogID) {
        params.changeParams({ dialogID: undefined })
        messengerStore.clearMessages()
      }
    }
  }

  loadDialogs = () => {
    const { params, accountsStore, messengerStore } = this.props
    messengerStore.loadDialogs(accountsStore.currentAccount.accountID, params.tab, params.filter)

    // Если нет выбранной вкладки - редиректим на comments
    const tabsList = [MessengerTab.COMMENTS, MessengerTab.DIALOGS] as Array<string>
    if (!tabsList.includes(params.tab)) params.changeParams({ tab: MessengerTab.COMMENTS, filter: 'all' })
  }

  loadMessages = (dialogID: string) => {
    this.props.messengerStore.loadMessages(dialogID, true)
  }

  handleOpenDialog = (dialogID: string) => {
    this.props.params.changeParams({ dialogID })
  }

  handleChangeReplyText = (e) => {
    const replyText = e.target.value
    this.setState({ replyText })
    this.updateRepliedMessage(replyText)
  }

  handleAddEmojiToReplyText = (data) => {
    const replyText = this.state.replyText + data.native
    this.setState({ replyText })
    this.updateRepliedMessage(replyText)
  }

  updateRepliedMessage = (replyText: string) => {
    const { replyTo, replyClosed } = this.state
    if (!replyText) {
      this.setState({ replyTo: null })
    } else if (!replyTo && !replyClosed) {
      const userMessages: Array<IMessage> = this.props.messengerStore.messages.filter(message => !message.fromOwner && message.messageType === 'text')
      const repliedMessage = ArrayUtil.arrayGetLastElement(userMessages)
      this.setState({ replyTo: repliedMessage })
    }
  }

  handleCancelQuote = () => {
    // const replyTo = this.state.replyText ? this.getRepliedMessage() : null
    this.setState({ replyTo: null, replyClosed: true })
  }

  handleRepeatMessage = async (dialogID: string, message: IMessage) => {
    if (message.messageStatus === 'error') {
      await this.props.messengerStore.updateMessage(dialogID, message.messageID, { messageStatus: 'process' })
    }
  }

  handleReply = async () => {
    const { replyText, replyTo } = this.state
    const { messengerStore } = this.props
    if (replyText) {
      await messengerStore.replyMessage(messengerStore.currentDialog.dialogID, replyText, replyTo?.messageID)
      this.setState({ replyText: '', replyTo: null, replyClosed: false })
    }
  }

  changeDialogStatus = async (dialogID, status) => {
    await this.props.messengerStore.updateDialog(dialogID, { dialogStatus: status })
  }

  renderMessages = (dialog: IDialog, messages: Array<IMessage>) => {
    const messagesList = []

    if (dialog && dialog.dialogType === 'comment') {
      messagesList.push(<DialogMessage key='post' type='post' time={dialog.post.date} image={dialog.post.image} url={dialog.post.url}>{dialog.post.text}</DialogMessage>)
    }

    let date = ''
    let prevMessageID = ''
    messages.forEach(message => {
      const messageDate = format.dateTime3(message.date)
      if (date !== messageDate) {
        date = messageDate
        messagesList.push(<DialogMessage key={`time${message.messageID}`} type='date'>{date}</DialogMessage>)
      }

      if (message.messageType === 'system') {
        if (message.systemType === 'open') {
          messagesList.push((
            <DialogMessage key={message.messageID} type='open'>
              Обращение открыто — {format.dateTime(message.date)}
            </DialogMessage>))
        }
        if (message.systemType === 'close') {
          messagesList.push((
            <DialogMessage key={message.messageID} type='close'>
              Обращение закрыто — {format.dateTime(message.date)}
            </DialogMessage>))
        }
      }
      if (message.messageType === 'text') {
        messagesList.push((
          <DialogMessage
            key={message.messageID}
            type={message.fromOwner ? 'reply' : 'message'}
            time={message.date}
            status={message.messageStatus}
            onReply={() => this.setState({ replyTo: message })}
            onRepeat={() => this.handleRepeatMessage(dialog.dialogID, message) }
            quoteText={message.replyTo && message.replyTo.messageID !== prevMessageID && this.formatMessage(message.replyTo.text, message.messageType, dialog.socialType)}
          >
            {this.formatMessage(message.text, message.messageType, dialog.socialType)}
          </DialogMessage>))
        prevMessageID = message.messageID
      }
    })

    return messagesList
  }

  formatMessage (messageText: string, messageType: string, socialType: string): string {
    if (messageType === 'text') {
      if (socialType === 'VK') {
        const regexp = /\[(club.*|id.*)\|(.*)\]/i
        if (regexp.test(messageText)) {
          const name = messageText.split(']')[0].split('|')[1]
          return messageText.replace(regexp, name)
        }
      }
    }

    return messageText
  }

  render (): JSX.Element {
    const { params, messengerStore, profileStore } = this.props
    const { replyText, replyTo } = this.state
    const currentDialog = messengerStore.currentDialog
    const dialogs = messengerStore.dialogs
    const badges = messengerStore.badges
    const messages = messengerStore.messages

    const isDeveloper = profileStore.profile.role === 'developer'
    const hasDialogs = badges.get('comments') || badges.get('directs')

    if (!isDeveloper) {
      return (
        <LiteLayout full>
          {/* @ts-ignore */}
          <Helmet>
            <title>Мессенджер — КУБ Suite</title>
          </Helmet>

          <NoData
            loading
            message='Мессенджер в разработке'
            description='Сейчас мы работаем над расширением функционала КУБ Suite. Мессенджер — это место, где вы сможете отвечать на личные сообщения и комментарии со своих страниц. Входящие сообщения со всех страниц будут собираться в одном месте для удобной работы.'
          />
        </LiteLayout>
      )
    }

    if (!hasDialogs) {
      return (
        <LiteLayout full>
          {/* @ts-ignore */}
          <Helmet>
            <title>Мессенджер — КУБ Suite</title>
          </Helmet>

          <NoData
            message='Диалогов пока нет'
            description='Сейчас у вас нету ни одного диалога. Как только вы получите личное сообщение или комментарий на одной из ваших подключенных страниц — здесь сразу появится диалог и вы сможете оперативно ответить на него.'
          />
        </LiteLayout>
      )
    }

    const filterList = [
      { id: 'all', name: `Все ${params.tab === MessengerTab.DIALOGS ? 'диалоги' : 'комментарии'}`, badge: `${badges.get('all')}` },
      { id: 'opened', name: 'Открытые', badge: `${badges.get('opened')}` },
      { id: 'closed', name: 'Закрытые', badge: `${badges.get('closed')}` },
      { id: 'noAnswer', name: 'Без ответа', badge: `${badges.get('noAnswer')}` },
      { id: 'withErrors', name: 'Неотправленные', badge: `${badges.get('withErrors')}` }
    ]
    return (
      <LiteLayout
        full
        secondHeader={
          <Toolbar2 size='middle'>
          <Toolbar2Group>
            <ButtonTextGroup>
              <ButtonText
                size='big'
                onClick={() => params.changeParams({ tab: MessengerTab.COMMENTS })}
                active={params.tab === MessengerTab.COMMENTS}
                disabled={badges.get('comments') === 0}
              >
                <span>Комментарии</span>
                <BadgeCount disabled={badges.get('comments') === 0}>
                  {badges.get('comments')}
                </BadgeCount>
              </ButtonText>
              <ButtonText
                size='big'
                onClick={() => params.changeParams({ tab: MessengerTab.DIALOGS })}
                active={params.tab === MessengerTab.DIALOGS}
                disabled={badges.get('directs') === 0}
              >
                <span>Диалоги</span>
                <BadgeCount disabled={badges.get('directs') === 0}>
                  {badges.get('directs')}
                </BadgeCount>
              </ButtonText>
            </ButtonTextGroup>

          </Toolbar2Group>
          <Toolbar2Group right>
            <Select
              label='Показывать'
              list={filterList}
              value={params.filter}
              onSelect={(e) => params.changeParams({ filter: e.target.value })}
            />
            {/*<ButtonText size='big' icon='filter'/>*/}
          </Toolbar2Group>
        </Toolbar2>}
      >
        {/* @ts-ignore */}
        <Helmet>
          <title>Мессенджер — КУБ Suite</title>
        </Helmet>

        <Messenger>
          <MessengerDialogs>
            <ScrollView>
              <Segment size={1.5}/>
              {dialogs.map(dialog => (
                <Dialog
                  key={dialog.dialogID}
                  socialType={dialog.socialType}
                  image={dialog.from.avatar}
                  name={dialog.from.name}
                  type={dialog.dialogType}
                  time={dialog.lastMessage.date}
                  author={dialog.lastMessage.fromOwner && 'Вы: '}
                  text={this.formatMessage(dialog.lastMessage.text, 'text', dialog.socialType)}
                  status={dialog.dialogStatus}
                  onClick={() => this.handleOpenDialog(dialog.dialogID)}
                  active={currentDialog?.dialogID === dialog.dialogID}
                />))}
              <Segment size={1.5}/>
            </ScrollView>
          </MessengerDialogs>

          <MessengerSplitter/>

          <MessengerMessages>

            {currentDialog &&
            <DialogInfo dialog={ currentDialog } onClick={() => this.changeDialogStatus(currentDialog.dialogID, currentDialog.dialogStatus === 'opened' ? 'closed' : 'opened')}/>}

            <MessengerMessagesList>
              <ScrollView padding autoScrolling>
                <Segment size={10}/>
                { !messengerStore.isLoading && this.renderMessages(currentDialog, messages)}
              </ScrollView>
            </MessengerMessagesList>

            {currentDialog && (
              <MessengerAnswer>

                <Toolbar2>
                  <Toolbar2Group fill alignBottom>
                    <TextareaReply
                      quoteText={this.formatMessage(replyTo?.text, 'text', currentDialog.socialType)}
                      replyText={replyText}
                      onChangeReplyText={this.handleChangeReplyText}
                      onCancelQuote={this.handleCancelQuote}
                      onAddEmoji={this.handleAddEmojiToReplyText}
                    />
                    <ButtonText color='blue' icon='send' onClick={this.handleReply}/>
                  </Toolbar2Group>
                </Toolbar2>
              </MessengerAnswer>)}
          </MessengerMessages>
        </Messenger>
      </LiteLayout>
    )
  }
}

export default MessengerPage
