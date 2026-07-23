import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import RootStore, { Stores } from '../../stores/RootStore'
import LiteLayout from '../layouts/LiteLayout'
import Toolbar2Group from '../../ui/elements/Toolbar2/Toolbar2Group'
import ISocialType from '../../interfaces/ISocialType'
import Toolbar2 from '../../ui/elements/Toolbar2/Toolbar2'
import SourcesStore from '../../stores/SourcesStore'
import config from '../../config'
import AccountsStore from '../../stores/AccountsStore'
import Segment from '../../ui/elements/Segment/Segment'
import Title from '../../ui/elements/Title/Title'
import Description from '../../ui/elements/Description/Description'
import ButtonText from '../../ui/elements/ButtonText/ButtonText'
import SocialSource from '../../ui/elements/SocialSource/SocialSource'
import MetricGroup from '../../ui/elements/Metric/MetricGroup'
import { Helmet } from 'react-helmet'
import InputText from '../../ui/elements/InputText/InputText'
import Notifications from '../../ui/elements/Notifications/Notifications'

interface IProps {
  accountsStore?: AccountsStore
  sourcesStore?: SourcesStore
}

interface IState {
  tgActive: boolean
  tgPhoneText: string
  thHashText: string
  tgCodeText: string
  tgErrorMessage: string
}

@inject(Stores.ACCOUNTS_STORE, Stores.SOURCES_STORE)
@observer
class SourcesSettingsPage extends Component<IProps, IState> {
  public state: IState = {
    tgActive: false,
    tgPhoneText: '',
    thHashText: '',
    tgCodeText: '',
    tgErrorMessage: ''
  }

  constructor (props: IProps) {
    super(props)
    this.load()
    this.props.sourcesStore.loadApplications()
  }

  componentDidUpdate (prevProps: Readonly<IProps>, prevState: Readonly<{}>, snapshot?: any): void {
    this.load()
  }

  load = (): void => {
    const { accountsStore, sourcesStore } = this.props
    sourcesStore.loadTokens(accountsStore.currentAccount.accountID)
  }

  handleSwitchSource = (socialType: ISocialType, isActive: boolean): void => {
    const { accountsStore, sourcesStore } = this.props
    const accountID = accountsStore.currentAccount.accountID

    if (!isActive) {
      const applications = sourcesStore.applications
      const appID = applications.find(item => item.socialType === socialType).appID
      const redirectURL = `${config.websiteUrl}settings/sources`
      const url = `${config.apiUrl}accounts/${accountID}/data-sources/applications/${appID}/connect?redirectURL=${redirectURL}&token=${RootStore.profileStore.token}`
      location.href = url
    } else {
      const socialTokens = sourcesStore.tokens.filter(x => x.socialType === socialType)
      sourcesStore.deleteTokens(socialTokens.map(x => x.tokenID))
    }
  }

  renderTgSource = () => {
    const { tgPhoneText, thHashText, tgCodeText, tgErrorMessage } = this.state

    return (
      <Segment size={3}>
        <InputText
          label='Номер телефона'
          value={tgPhoneText}
          disabled={!!thHashText}
          onChange={e => this.setState({ tgPhoneText: e.target.value })}
        />
        {thHashText &&
          <Segment size={2}>
            <InputText
              label='Код'
              value={tgCodeText}
              onChange={e => this.setState({ tgCodeText: e.target.value })}
            />
          </Segment>
        }
        { tgErrorMessage && <Description size='big' red>{tgErrorMessage}</Description> }
        {(tgPhoneText || thHashText) &&
          <Segment size={3}>
            <ButtonText size={'big'} color='blue' onClick={() => tgCodeText ? this.tgSignIn() : this.tgSendCode()}>{tgCodeText ? 'Подтвердить' : 'Отправить'}</ButtonText>
          </Segment>
        }
      </Segment>)
  }

  tgSendCode = async () => {
    this.setState({ tgErrorMessage: '' })

    const { sourcesStore } = this.props
    await sourcesStore.tgSendCode(this.state.tgPhoneText)

    this.setState({
      thHashText: sourcesStore.tgHashCode,
      tgErrorMessage: sourcesStore.tgErrorMessage
    })
  }

  tgSignIn = async () => {
    const { tgPhoneText, thHashText, tgCodeText } = this.state
    const { sourcesStore } = this.props

    const result = await sourcesStore.tgSignIn(tgPhoneText, tgCodeText, thHashText)
    if (result) {
      Notifications.show({
        title: 'Токен успешно добавлен',
        text: 'Отлично! Всё получилось!',
        type: 'success'
      })

      this.setState({
        tgPhoneText: '',
        thHashText: '',
        tgCodeText: '',
        tgErrorMessage: ''
      })
    } else {
      this.setState({
        tgErrorMessage: sourcesStore.tgErrorMessage
      })
    }
  }

  render (): JSX.Element {
    const { accountsStore, sourcesStore } = this.props
    const { tgActive } = this.state

    const tokens = sourcesStore.tokens
    const accountID = accountsStore.currentAccount.accountID

    const socialTypes = ['VK', 'FB', 'INST', 'TW', 'OK', 'YT']

    return (
            <LiteLayout>
              {/* @ts-ignore */}
              <Helmet>
                <title>Подключение социальных сетей — КУБ Suite</title>
              </Helmet>

              <Toolbar2>
                  <Toolbar2Group>
                      <ButtonText to='/settings' icon='left'>Назад</ButtonText>
                  </Toolbar2Group>
              </Toolbar2>

              <Segment size={3}>
                <Title text='Подключение социальных сетей'/>
                <Segment size={3} />
                <Description size='big'>
                    Для получения расширенной статистики, возможности отвечать на комментарии и сообщения, а также для отложенного постинга — авторизуйтесь через социальные сети.
                </Description>
              </Segment>

              <Segment size={5}>
                  <MetricGroup>
                      {socialTypes.map(item => {
                        const socialType = item as ISocialType
                        const socialTokens = tokens.filter(x => x.socialType === socialType && x.active)
                        const isActive = socialTokens.length > 0
                        return <SocialSource
                              double
                              socialType={socialType}
                              active={isActive}
                              onClick={() => this.handleSwitchSource(socialType, isActive)}
                          />
                      })}
                      <SocialSource
                        double
                        socialType='TG'
                        active={tgActive}
                        onClick={() => this.setState({ tgActive: !tgActive })}
                      />
                  </MetricGroup>
              </Segment>
              { tgActive && this.renderTgSource()}

              <Segment size={3} />

            </LiteLayout>
    )
  }
}

export default SourcesSettingsPage
