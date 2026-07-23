import {inject, observer} from 'mobx-react'
import React, {Component} from 'react'
import config from '../../config'
import ICommunity from '../../interfaces/ICommunity'
import AccountsStore from '../../stores/AccountsStore'
import CommunitiesStore from '../../stores/CommunitiesStore'
import {Stores} from '../../stores/RootStore'
import SourcesStore from '../../stores/SourcesStore'
import CallbackStatus from '../../types/CallbackStatus'
import CommunityType from '../../types/CommunityType'
import ButtonText from '../../ui/elements/ButtonText/ButtonText'
import CommunityInfo from '../../ui/elements/CommunityInfo/CommunityInfo'
import List from '../../ui/elements/List/List'
import Segment from '../../ui/elements/Segment/Segment'
import SettingsButton from '../../ui/elements/SettingsButton/SettingsButton'
import Title from '../../ui/elements/Title/Title'

import Toolbar2 from '../../ui/elements/Toolbar2/Toolbar2'
import Toolbar2Group from '../../ui/elements/Toolbar2/Toolbar2Group'
import NumeralUtil from '../../utils/NumeralUtil'
import withParams, {ParamsProps} from '../../utils/withParams'
import ModalPopup from '../../ui/elements/ModalPopup/ModalPopup'
import {IGlobalParams} from '../../interfaces/IParams'
import Description from '../../ui/elements/Description/Description'
import ProfileStore from '../../stores/ProfileStore'
import DateUtil from '../../utils/DateUtil'
import FormRow from '../../ui/collections/Form/FormRow'
import InputText from '../../ui/elements/InputText/InputText'
import Form from '../../ui/collections/Form/Form'
import moment from 'moment'

interface IState {
  open: boolean
  communityID: string
  active: boolean
  autoReportSwitching: boolean
  communityTypeSwitching: boolean
  messengerSwitching: boolean
  isDeveloperOptions: boolean
}

interface IProps {
  params?: ParamsProps<IGlobalParams>
  accountsStore?: AccountsStore
  communitiesStore?: CommunitiesStore
  sourcesStore?: SourcesStore
  profileStore?: ProfileStore
}
/**
 * Модалка настроек страницы
 */
@withParams
@inject(Stores.ACCOUNTS_STORE, Stores.COMMUNITIES_STORE, Stores.SOURCES_STORE, Stores.PROFILE_STORE)
@observer
class CommunitySettingsModal extends Component<IProps, IState> {
  constructor (props: IProps) {
    super(props)
  }

  state: IState = {
    open: false,
    communityID: undefined,
    active: false,
    autoReportSwitching: false,
    communityTypeSwitching: false,
    messengerSwitching: false,
    isDeveloperOptions: false
  }

  componentDidUpdate (prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {
    const { params } = this.props
    const communityID = params.communityID

    if (communityID && !prevState.open && !this.state.open) {
      this.setState({ open: true, communityID })
    }

    if (!communityID && prevState.open && this.state.open) {
      this.setState({ open: false })
    }
  }

  removeCommunity = (communityID) => {
    this.props.communitiesStore.remove(communityID)
  }

  changeCommunityType = async (communityType: CommunityType) => {
    const { params, communitiesStore } = this.props
    const communityID = params.communityID

    if (!confirm('Вы действительно хотите поменять тип собщества?')) return

    const community = communitiesStore.getCommunityByCommunityID(communityID)

    this.setState({ communityTypeSwitching: true })
    await communitiesStore.switchCommunityType(communityID, communityType)
    this.setState({ communityTypeSwitching: false })
  }

  switchAutoReport = async () => {
    const { params, communitiesStore } = this.props
    const communityID = params.communityID

    const community = communitiesStore.getCommunityByCommunityID(communityID)
    const autoReport = Boolean(community.timeAutoReport)
    if (autoReport && !confirm('Вы действительно хотите отменить еженедельные отчеты?')) return

    this.setState({ autoReportSwitching: true })
    await communitiesStore.switchAutoReport(communityID, !autoReport)
    this.setState({ autoReportSwitching: false })
  }

  switchMessenger = async (community: ICommunity) => {
    const { sourcesStore, communitiesStore } = this.props
    if (community.callbackStatus !== CallbackStatus.ENABLED) {
      await sourcesStore.loadApplications()
      const app = sourcesStore.applications.find(app => app.socialType === community.socialType)
      const redirectURL = encodeURIComponent(`${config.websiteUrl}settings/communities?accountID=${community.accountID}&communityID=${community.communityID}&confirmToken=true`)
      const url = `${config.apiUrl}accounts/${community.accountID}/data-sources/applications/${app.appID}/connect?redirectURL=${redirectURL}&token=${this.props.profileStore.token}`
      location.href = url
    } else {
      this.setState({ messengerSwitching: true })
      await communitiesStore.removeCallback(community.communityID)
      this.setState({ messengerSwitching: false })
    }
  }

  changeProject = async (newAccountID: string) => {
    const { params, communitiesStore } = this.props
    const communityID = params.communityID

    if (!confirm('Вы действительно хотите переместить страницу в другой проект?')) return

    newAccountID = await communitiesStore.changeProject(communityID, newAccountID)
    params.changeParams({ accountID: newAccountID, communityID })
  }

  handleClose = () => {
    this.props.params.changeParams({ communityID: undefined })
  }

  render (): JSX.Element {
    const { communitiesStore, profileStore } = this.props
    const { isDeveloperOptions } = this.state
    const communityID = this.state.communityID
    const community = communitiesStore.getCommunityByCommunityID(communityID)
    const autoReport = Boolean(community?.timeAutoReport)
    const isDeveloper = profileStore.profile.role === 'developer'

    return (
      <ModalPopup wide open={this.state.open} onCloseClick={this.handleClose}>

        {!communitiesStore.isLoading && community && (
          <>
            <Title size='big' text='Настройка страницы' controls>
              <Toolbar2>
                <Toolbar2Group>
                  {isDeveloper && (<ButtonText onClick={() => this.setState({ isDeveloperOptions: !isDeveloperOptions })} active={isDeveloperOptions} icon='widget_admin' />)}
                  <ButtonText
                    icon='trash'
                    onClick={() => confirm('Вы действительно хотите удалить страницу?') && this.removeCommunity(communityID)}>
                    Удалить
                  </ButtonText>
                </Toolbar2Group>
              </Toolbar2>
            </Title>

            {!isDeveloperOptions && (
              <>
                <Segment size={2} >
                  <Description size='big'>
                    Здесь можно посмотреть подробную информацию о странице \r и управлять нужными опциями.
                  </Description>
                </Segment>

                <Segment size={5} >
                  <CommunityInfo community={community} />
                </Segment>

                <Segment size={5}>
                  <List>
                    <SettingsButton
                      icon='admin'
                      title='Это моя страница'
                      description='По своим страницам доступны расширенная статистика и посты.'
                      active={community.communityType === CommunityType.MY}
                      loading={this.state.communityTypeSwitching}
                      onClick={() => this.changeCommunityType(CommunityType.MY)}
                    />
                    <SettingsButton
                      icon='admin'
                      title='Это конкурент'
                      description='По своим страницам доступны расширенная статистика и посты.'
                      active={community.communityType === CommunityType.COMPETITOR}
                      loading={this.state.communityTypeSwitching}
                      onClick={() => this.changeCommunityType(CommunityType.COMPETITOR)}
                    />
                    <SettingsButton
                      icon='admin'
                      title='Это блогер'
                      description='По своим страницам доступны расширенная статистика и посты.'
                      active={community.communityType === CommunityType.INFLUENCER}
                      loading={this.state.communityTypeSwitching}
                      onClick={() => this.changeCommunityType(CommunityType.INFLUENCER)}
                    />
                    {/*{isDeveloper && community.socialType === 'VK' && community.communityType === CommunityType.MY && <SettingsButton*/}
                    {/*  icon='comment'*/}
                    {/*  title='Мессенджер'*/}
                    {/*  description='Возможность отвечать на личные сообщения и комментарии на странице.'*/}
                    {/*  notificationIcon={community.callbackStatus === CallbackStatus.ERROR ? 'disconnect' : (communitiesStore.isLoading ? 'loader' : null)}*/}
                    {/*  active={community.callbackStatus === CallbackStatus.ENABLED}*/}
                    {/*  loading={this.state.messengerSwitching}*/}
                    {/*  onClick={() => this.switchMessenger(community)}*/}
                    {/*/>}*/}

                    {/*{isDeveloper && community.socialType === 'VK' && community.callbackStatus === CallbackStatus.ENABLED &&*/}
                    {/*<>*/}
                    {/*  <div>Для тестирования мессенджера получите access_token по <Link _blank={true} to='https://oauth.vk.com/authorize?client_id=7318005&redirect_uri=https://oauth.vk.com/blank.html&scope=wall,offline,photos&response_type=token&state=165298807'>ссылке</Link> и вставьте в поле ниже</div>*/}
                    {/*  <Toolbar2Group>*/}
                    {/*    <InputText*/}
                    {/*      label='access_token'*/}
                    {/*      value={this.state.accessToken}*/}
                    {/*      onChange={ (e: ChangeEvent<HTMLInputElement>) => this.setState({ accessToken: e.target.value }) }*/}
                    {/*    />*/}
                    {/*    <ButtonText disabled={this.state.accessToken === ''} onClick={() => this.updateAccessToken(community, this.state.accessToken)}>Использовать</ButtonText>*/}
                    {/*  </Toolbar2Group>*/}
                    {/*</>}*/}

                    {community.communityType === CommunityType.MY && <SettingsButton
                        icon='page'
                        title='Еженедельный отчёт'
                        description={autoReport
                          ? `Мы будем присылать отчёт в начале каждой недели. Следующая отправка — ${DateUtil.format(community.timeAutoReport)}`
                          : 'Мы будем присылать на почту автоматический отчёт по этой странице.'}
                        active={autoReport}
                        loading={this.state.autoReportSwitching}
                        onClick={() => this.switchAutoReport()}
                    />}
                  </List>
                </Segment>
              </>
            )}

            {/*<Segment size={3}>
              <List>
                <SettingsButton
                  icon='duplicate'
                  title='Отложенный постинг'
                  description='Создание контент-плана и настройка автоматического постинга в сообществе'
                  notificationIcon='loader'
                  active={this.state.active}
                  onClick={e => this.setState({ active: !this.state.active })}
                />
                <SettingsButton
                  icon='dashboard_domain'
                  title='Расширенная статистика'
                  description='Расширенная статистика по сообществу — охваты, реклама, пользователи, просмотры'
                  notificationIcon='disconnect'
                  active={this.state.active}
                  onClick={e => this.setState({ active: !this.state.active })}
                />
              </List>
            </Segment>*/}

            {isDeveloperOptions && isDeveloper && (
              <>
                <Segment size={5} >
                  <Title>Администрирование (для менеджера)</Title>
                </Segment>
                <Segment size={3}>
                  <Form onSubmit={() => profileStore.update()}>
                    <FormRow>
                      <InputText
                        label='CID'
                        readOnly
                        value={community.cid}
                        icon='dot'
                      />
                    </FormRow>
                    <FormRow>
                      <InputText
                        label='Время обновления'
                        readOnly
                        value={DateUtil.format(community.timeLoop, 'TT')}
                        icon={moment(community.timeLoop).isBefore(moment().subtract(1, 'year')) ? 'loading_dots_square' : 'success_circle'}
                      />
                      <ButtonText
                        onClick={() => communitiesStore.manageCommunity(community.cid)}
                        disabled={moment(community.timeLoop).isBefore(moment().subtract(1, 'year'))}
                      >Проверить состояние / Ускорить сбор</ButtonText>
                    </FormRow>
                    <FormRow>
                      <InputText
                        label='Сбор короткого цикла'
                        readOnly
                        value={DateUtil.format(community.timeShortLoop, 'TT')}
                        icon={community.isLoadingShortLoop ? 'loading_dots_square' : 'success_circle'}
                      />
                      <ButtonText
                        onClick={() => communitiesStore.manageCommunity(community.cid, { resetShortLoop: true })}
                        disabled={community.isLoadingShortLoop}
                      >Обновить последние 14 дней</ButtonText>
                    </FormRow>
                    <FormRow>
                      <InputText
                        label='Сбор длинного цикла'
                        readOnly
                        value={DateUtil.format(community.timeLongLoop, 'TT')}
                        icon={community.isLoadingRunLongLoop ? 'loading_dots_square' : 'success_circle'}
                      />
                      <ButtonText
                        onClick={() => communitiesStore.manageCommunity(community.cid, { resetLongLoop: true })}
                        disabled={community.isLoadingRunLongLoop}
                      >Полностью обновить данные</ButtonText>
                    </FormRow>
                  </Form>
                </Segment>
              </>
            )}
          </>)}

      </ModalPopup>
    )
  }
}

export default CommunitySettingsModal
