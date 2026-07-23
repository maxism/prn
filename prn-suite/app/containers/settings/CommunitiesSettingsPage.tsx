import React, { Component } from 'react'
import { IStatisticsParams } from '../../interfaces/IParams'
import ISocialType from '../../interfaces/ISocialType'
import format from '../../lib/format'
import AccountsStore from '../../stores/AccountsStore'
import { Stores } from '../../stores/RootStore'
import Segment from '../../ui/elements/Segment/Segment'
import Title from '../../ui/elements/Title/Title'
import ButtonText from '../../ui/elements/ButtonText/ButtonText'
import LiteLayout from '../layouts/LiteLayout'
import Description from '../../ui/elements/Description/Description'
import List from '../../ui/elements/List/List'
import Community from '../../ui/elements/Community/Community'
import { inject, observer } from 'mobx-react'
import CommunitiesStore from '../../stores/CommunitiesStore'
import { debounce } from 'lodash'
import CommunityType from '../../types/CommunityType'
import ArrayUtil from '../../utils/ArrayUtil'
import ICommunity from '../../interfaces/ICommunity'
import CommunityStatus from '../../types/CommunityStatus'
import CallbackStatus from '../../types/CallbackStatus'
import withParams, { ParamsProps } from '../../utils/withParams'
import { Helmet } from 'react-helmet'
import ButtonTextGroup from '../../ui/elements/ButtonText/ButtonTextGroup'
import Toolbar2 from '../../ui/elements/Toolbar2/Toolbar2'
import Toolbar2Group from '../../ui/elements/Toolbar2/Toolbar2Group'
import EditProjectModal from '../modals/EditProjectModal'

interface IProps {
  params?: ParamsProps<IStatisticsParams>
  accountsStore?: AccountsStore
  communitiesStore?: CommunitiesStore
}

interface IStates {
  add: boolean
  q: string
  type?: CommunityType
}

@withParams
@inject(Stores.ACCOUNTS_STORE, Stores.COMMUNITIES_STORE)
@observer
class CommunitiesSettingsPage extends Component<IProps, IStates> {
  private debounceSearch: Function

  public state: IStates = {
    add: false,
    q: ''
  }

  componentDidMount (): void {
    this.debounceSearch = debounce(q => {
      const { communitiesStore } = this.props
      if (q) communitiesStore.search(q)
    }, 500)
  }

  handleAdd = (url: string): void => {
    this.props.communitiesStore.add(url, this.state.type)
    // this.setState({ add: false })
  }

  handleSearch = (q: string): void => {
    this.setState({ q })
    this.debounceSearch(q)
  }

  getNote = (item: ICommunity): { noteText: string, noteIcon: string, noteIconColor: string } => {
    const communities = this.props.communitiesStore.communities
    const findCommunity = communities.find(community => community.cid === item.cid)
    if (findCommunity) {
      return {
        noteText: 'Вы уже добавили эту страницу',
        noteIcon: 'complete',
        noteIconColor: '#91d339'
      }
    } else if (this.state.type === CommunityType.MY) {
      const findCommunity = communities.find(community => community.communityType === CommunityType.MY && community.socialType === item.socialType)
      if (findCommunity) {
        return {
          noteText: `У вас уже добавлена одна страница в ${findCommunity.socialType}.\n Можно добавить эту страницу в новый проект`,
          noteIcon: 'close_circle',
          noteIconColor: '#D9D9D9'
        }
      }
    }

    return null
  }

  renderCommunity = (type: string, item: ICommunity): JSX.Element => {
    const { communitiesStore } = this.props
    const isAdmin = item.isInsights
    const hasMessenger = isAdmin && item.socialType === 'VK'
    const messengerEnabled = item.callbackStatus === CallbackStatus.ENABLED

    let onClick = () => this.props.params.changeUrl('/statistics', { type: 'ONE', reportCommunityID: item.communityID, page: 'detail', hash: 'top' })

    if (item.communityType === 'my') onClick = () => this.props.params.changeUrl('/statistics', { type: item.socialType as ISocialType, page: 'detail', hash: 'top' })

    let status = null
    if (item.communityStatus === CommunityStatus.PARTIAL) status = 'process2'
    if (item.communityStatus === CommunityStatus.COLLECTING) status = 'process'

    return (<Community
      key={type.concat(item.communityID)}
      image={item.image}
      name={item.name}
      url={item.url}
      usersCount={format.number(item.usersCount, 'AA')}
      admin={isAdmin}
      isCredit={!item.isPaid}
      isClosed={item.isClosed}
      isBlocked={item.isBlocked}
      settingsBtn
      removeBtn
      status={status}
      messengerIcon={hasMessenger ? (messengerEnabled ? 'active' : 'disabled') : null}
      onRemove={() => confirm('Вы действительно хотите удалить страницу?') && communitiesStore.remove(item.communityID)}
      onClick={onClick}
      onSettings={() => this.props.params.changeParams({ communityID: item.communityID })}
    />)
  }

  render (): JSX.Element {
    const { add, q } = this.state
    const { params, accountsStore, communitiesStore } = this.props

    const hasCommunities = communitiesStore.communities.length

    let tabs = []
    let hasMyCommunities = Boolean(communitiesStore.communities.filter(item => item.communityType === CommunityType.MY).length)
    let hasCompetitorsCommunities = Boolean(communitiesStore.communities.filter(item => item.communityType === CommunityType.COMPETITOR).length)
    let hasInfluencersCommunities = Boolean(communitiesStore.communities.filter(item => item.communityType === CommunityType.INFLUENCER).length)
    if (hasMyCommunities) tabs.push('my')
    if (hasCompetitorsCommunities) tabs.push('competitors')
    if (hasInfluencersCommunities) tabs.push('influencers')
    if (!tabs.includes('my')) tabs.push('my')
    if (!tabs.includes('competitors')) tabs.push('competitors')
    if (!tabs.includes('influencers')) tabs.push('influencers')

    return (
      <LiteLayout>
        {/* @ts-ignore */}
        <Helmet>
          <title>{accountsStore.currentAccount.name} — Список страниц проекта — КУБ Suite</title>
        </Helmet>

        <Segment size={3}>
          <Title text={accountsStore.currentAccount.name}>
            <Toolbar2>
              <Toolbar2Group>
                <ButtonText
                  icon='gear'
                  onClick={() => params.changeParams({ editProject: true })}
                >Настройки проекта</ButtonText>
                {accountsStore.accounts.length > 1 && (
                  <ButtonText
                    icon='trash'
                    onClick={() => confirm('Вы действительно хотите удалить проект?') && accountsStore.removeAccount()}
                  >Удалить проект</ButtonText>
                )}
              </Toolbar2Group>
            </Toolbar2>
          </Title>
        </Segment>

        {tabs.map(tab => (
          <>
            {tab === 'my' && (
              <>
                <Segment size={10}>
                  <Title size='middle' text='Мои страницы' controls>
                    <ButtonText color='blue' onClick={() => params.changeParams({ addCommunity: true, addCommunityType: CommunityType.MY })}>Добавить мою страницу</ButtonText>
                  </Title>
                  <Segment size={2}/>
                  <Description>
                    Ваши страницы — это страницы, по которым вы будете получать подробную статистику. Вы можете добавить по одной странице в каждую из социальных сетей.
                  </Description>
                </Segment>

                <Segment size={3} />
                <List emptyText='Вы пока ничего не добавили'>
                  {ArrayUtil.arrayObjectsSort('communityStatus',
                    communitiesStore.communities.filter(item => item.communityType === CommunityType.MY)).map(item => this.renderCommunity('my', item))
                  }
                </List>
              </>
            )}
            {tab === 'competitors' && (
              <>
                <Segment size={10}>
                  <Title size='middle' text='Страницы конкурентов' controls>
                    <ButtonText color='blue' onClick={() => params.changeParams({ addCommunity: true, addCommunityType: CommunityType.COMPETITOR })}>Добавить страницу конкурента</ButtonText>
                  </Title>
                  <Segment size={2}/>
                  <Description>
                    Вы будете получать усредненные показатели по конкурентам и сравнивать со своими. У всех страниц будет высчитан КУБ Score и рекомендации, на которые стоит обратить внимание.
                  </Description>
                </Segment>

                <Segment size={3} />
                <List emptyText='Вы пока ничего не добавили'>
                  {ArrayUtil.arrayObjectsSort('communityStatus',
                    communitiesStore.communities.filter(item => item.communityType === CommunityType.COMPETITOR)).map(item => this.renderCommunity('competitor', item))
                  }
                </List>
              </>
            )}
            {tab === 'influencers' && (
              <>
                <Segment size={10}>
                  <Title size='middle' text='Блогеры' controls>
                    <ButtonText color='blue' onClick={() => params.changeParams({ addCommunity: true, addCommunityType: CommunityType.INFLUENCER })}>Добавить страницу блогера</ButtonText>
                  </Title>
                  <Segment size={2}/>
                  <Description>
                    Это страницы блогеров, с которыми вы планируете работать или работаете.
                  </Description>
                </Segment>

                <Segment size={3} />
                <List emptyText='Вы пока ничего не добавили'>
                  {ArrayUtil.arrayObjectsSort('communityStatus',
                    communitiesStore.communities.filter(item => item.communityType === CommunityType.INFLUENCER)).map(item => this.renderCommunity('influencer', item))
                  }
                </List>
              </>
            )}
          </>
        ))}

        <Segment size={3} />

        <EditProjectModal />

      </LiteLayout>
    )
  }
}

export default CommunitiesSettingsPage
