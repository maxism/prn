import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { Stores } from '../../stores/RootStore'
import withParams, { ParamsProps } from '../../utils/withParams'
import ModalPopup from '../../ui/elements/ModalPopup/ModalPopup'
import { IGlobalParams } from '../../interfaces/IParams'
import Title from '../../ui/elements/Title/Title'
import Segment from '../../ui/elements/Segment/Segment'
import Description from '../../ui/elements/Description/Description'
import Toolbar2 from '../../ui/elements/Toolbar2/Toolbar2'
import Toolbar2Group from '../../ui/elements/Toolbar2/Toolbar2Group'
import ButtonText from '../../ui/elements/ButtonText/ButtonText'
import InputText from '../../ui/elements/InputText/InputText'
import { debounce } from 'lodash'
import CommunitiesStore from '../../stores/CommunitiesStore'
import Community from '../../ui/elements/Community/Community'
import format from '../../lib/format'
import List from '../../ui/elements/List/List'
import ICommunity from '../../interfaces/ICommunity'
import CommunityType from '../../types/CommunityType'
import ISocialType from '../../interfaces/ISocialType'
import AccountsStore from '../../stores/AccountsStore'
import ViewAddCommunityTooltip from '../../ui/elements/ViewAddCommunityTooltip/ViewAddCommunityTooltip'
import ProfileStore from '../../stores/ProfileStore'
import ButtonTextGroup from '../../ui/elements/ButtonText/ButtonTextGroup'
import PopupButton from '../../ui/elements/Popup/PopupButton'
import PopupDivider from '../../ui/elements/Popup/PopupDivider'
import Account from '../../ui/elements/Account/Account'
import Popup from '../../ui/elements/Popup/Popup'

interface IState {
  open: boolean
  type: string
  q: string
}

interface IProps {
  params?: ParamsProps<IGlobalParams>
  profileStore?: ProfileStore
  accountsStore?: AccountsStore
  communitiesStore?: CommunitiesStore
}

/**
 * Модалка добавления страниц
 */
@withParams
@inject(Stores.PROFILE_STORE, Stores.ACCOUNTS_STORE, Stores.COMMUNITIES_STORE)
@observer
class AddCommunityModal extends Component<IProps, IState> {
  private debounceSearch: Function

  constructor (props: IProps) {
    super(props)
  }

  public state: IState = {
    open: false,
    type: '',
    q: ''
  }

  componentDidMount (): void {
    this.debounceSearch = debounce(q => {
      if (q) this.props.communitiesStore.search(q)
    }, 500)
  }

  componentDidUpdate (prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {
    const { params, profileStore } = this.props

    if (!profileStore.isLoading && profileStore.isAuth && (params.addCommunity || params.addCommunityCID) && !prevState.open && !this.state.open) {
      this.setState({ open: true, type: params.addCommunityType || CommunityType.MY, q: '' })

      if (params.addUrl) {
        this.handleSearch(params.addUrl)
        params.changeParams({ addUrl: undefined })
      }
    }
    if (!params.addCommunity && !params.addCommunityCID && prevState.open && this.state.open) this.setState({ open: false })
  }

  handleAdd = async (url: string, cid: string = ''): Promise<void> => {
    const community = await this.props.communitiesStore.add(url, this.state.type, cid)
    // this.handleClose()
    // if (!this.props.params.addCommunityCID) {
    //   if (this.state.type === CommunityType.MY) this.props.params.changeUrl('/statistics', { page: 'overview', type: community.socialType as ISocialType })
    //   else this.props.params.changeUrl('/statistics', { page: 'overview', type: 'ONE', reportCommunityID: community.communityID })
    // }
  }

  handleOpen = async (url: string): Promise<void> => {
    const community = await this.props.communitiesStore.getCommunityByUrl(url)
    this.handleClose()

    setTimeout(() => {
      if (this.state.type === CommunityType.MY) this.props.params.changeUrl('/statistics', { page: 'overview', type: community.socialType as ISocialType })
      else this.props.params.changeUrl('/statistics',{ page: 'overview', type: 'ONE', reportCommunityID: community.communityID })
    }, 500)
  }

  handleSearch = (q: string): void => {
    this.props.params.changeParams({ addCommunity: true, addCommunityCID: undefined })
    this.setState({ q })
    this.props.communitiesStore.setLoadingSearch()
    this.debounceSearch(q)
  }

  handleClose = () => {
    this.props.params.changeParams({ addCommunity: undefined, addCommunityCID: undefined })
  }

  AddToNewProject = async (url: string) => {
    const { params, accountsStore } = this.props
    const newAccount = await accountsStore.createAccount()

    params.changeParams({ accountID: newAccount.accountID })

    setTimeout(() => {
      this.handleAdd(url)
    }, 1000)
  }

  getNote = (item: ICommunity): { noteText: string, noteIcon: string, noteIconColor: string, newProject: boolean } => {
    if (this.props.communitiesStore.communities.find(community => community.cid === item.cid && (community.communityType === this.state.type || community.communityType === CommunityType.MY))) {
      return {
        noteText: 'Вы уже добавили\nэту страницу',
        noteIcon: 'complete',
        noteIconColor: '#91D339',
        newProject: false
      }
    } else if (this.state.type === CommunityType.MY) {
      if (this.props.communitiesStore.getMyCommunityBySocialType(item.socialType as ISocialType)) {
        return {
          noteText: ``,
          noteIcon: '',
          noteIconColor: '',
          newProject: true
        }
      }
    }
    /* else if (this.state.type === CommunityType.COMPETITOR && !this.props.communitiesStore.communities.find(community => community.socialType === item.socialType && community.communityType === CommunityType.MY)) {
      return {
        noteText: 'Сначала нужно добавить\nсвою страницу в этой соцсети',
        noteIcon: 'close_circle',
        noteIconColor: '#D9D9D9',
        newProject: false
      }
    }*/

    return null
  }

  createAccount = async () => {
    const { params, accountsStore } = this.props
    const newAccount = await accountsStore.createAccount()

    params.changeParams({ accountID: newAccount.accountID })
  }

  render (): JSX.Element {
    const { params, profileStore, communitiesStore, accountsStore } = this.props
    const { open, type, q } = this.state

    const currentAccount = accountsStore.currentAccount
    const accounts = accountsStore.accounts || []

    // todo: Поиск по ссылке на сайте

    const hasCommunities = communitiesStore.communities.length

    return (
      <ModalPopup wide open={open} onCloseClick={this.handleClose}>
        <Title size='big' text='Добавление страниц' controls>
          <Toolbar2 size='middle'>
            <Toolbar2Group>
              <ButtonTextGroup>
                <ButtonText
                  onClick={() => this.setState({ type: CommunityType.MY })}
                  active={type === CommunityType.MY}
                >Моя страница</ButtonText>
                <ButtonText
                  onClick={() => this.setState({ type: CommunityType.COMPETITOR })}
                  active={type === CommunityType.COMPETITOR}
                >Конкурент</ButtonText>
                <ButtonText
                  onClick={() => this.setState({ type: CommunityType.INFLUENCER })}
                  active={type === CommunityType.INFLUENCER}
                >Блогер</ButtonText>
              </ButtonTextGroup>
            </Toolbar2Group>
          </Toolbar2>
        </Title>

        <Segment size={2}>
          <Description size='big'>
            {type === CommunityType.MY && 'Наш поиск может найти страницы во всех соцсетях по названию или по ссылке на страницу. Для одной соцсети можно добавить только одну страницу, также не забывайте добавлять конкурентов.'}
            {type === CommunityType.COMPETITOR && 'Вы можете добавить конкурентов в каждую из соцсетей. Это поможет посчитать КУБ Score для ваших страниц и даст понимание о сильных и слабых сторонах.'}
          </Description>
        </Segment>

        <Segment size={2}>
          <Toolbar2 size='middle'>
            <Toolbar2Group>
              <Description size='big'>Страница будут добавлена в проект</Description>
              <Popup
                trigger={(
                  <Account
                    image={currentAccount?.image}
                    name={currentAccount?.name}
                    description={accountsStore.getDescription(currentAccount)}
                    active
                  />)}
                right
                maxHeight={1000}
                scrolling
              >
                <PopupButton icon='plus' autoClosePopup onClick={() => this.createAccount()}>
                  Добавить новый проект
                </PopupButton>
                <PopupDivider />
                {accounts?.map(account => (
                  <Account
                    key={account?.accountID}
                    image={account?.image}
                    name={account?.name}
                    description={accountsStore.getDescription(account)}
                    active={account?.accountID === currentAccount?.accountID}
                    attention={account?.creditsCommunitiesCount > 0}
                    onClick={() => params.changeParams({ accountID: account?.accountID })}
                    autoClosePopup
                  />
                ))}
              </Popup>
            </Toolbar2Group>
          </Toolbar2>
        </Segment>

        {params.addCommunityCID && (
          <Segment size={5}>
            <List>
              {communitiesStore.searchCommunities.filter(c => c.cid === params.addCommunityCID).map((item) => {
                const note = this.getNote(item)
                return (<Community
                  key={item.communityID}
                  image={item.image}
                  name={`${item.name}`}
                  url={item.url}
                  usersCount={format.number(item.usersCount, 'AA')}
                  admin={item.isInsights}
                  activeBtn='Добавить'
                  onClick={!note && (() => this.handleAdd(item.url, item.cid)) || (() => this.handleOpen(item.url))}
                  onActive={!note && (() => this.handleAdd(item.url, item.cid))}
                  noteText={note?.noteText}
                  noteIcon={note?.noteIcon}
                  noteIconColor={note?.noteIconColor}
                  adding={item?.isAdding}
                  createProjectLocked={profileStore.profile.isDemo}
                  onClickLocked={() => params.changeParams({ premium: 'true' })}
                  onCreateProject={note?.newProject && (() => this.AddToNewProject(item.url))}
                />)
              })}
            </List>
          </Segment>
        )}

        {!params.addCommunityCID && (
          <Segment size={5}>
            <InputText
              icon='search'
              label='Введите ссылку или название страницы в социальной сети'
              value={q}
              onChange={e => this.handleSearch(e.target.value)}
              focus={open}
              error={q && !communitiesStore.searchCommunities.length && !communitiesStore.isSearchLoading && 'Ошибка'}
              big
            />
          </Segment>
        )}

        {q && !communitiesStore.searchCommunities.length && !communitiesStore.isSearchLoading &&
        <Segment size={5}>
          <ViewAddCommunityTooltip />
        </Segment>
        }

        {q && (communitiesStore.searchCommunities.length || communitiesStore.isSearchLoading) && (
          <Segment size={5}>
            <List isLoading={communitiesStore.isSearchLoading} loadingText='Ищем страницы' emptyText='Страницы не найдены'>
              {communitiesStore.searchCommunities.map((item) => {
                const note = this.getNote(item)
                return (<Community
                  key={item.communityID}
                  image={item.image}
                  name={`${item.name}`}
                  url={item.url}
                  usersCount={format.number(item.usersCount, 'AA')}
                  admin={item.isInsights}
                  activeBtn='Добавить'
                  onClick={!note && (() => this.handleAdd(item.url, item.cid)) || (() => this.handleOpen(item.url))}
                  onActive={!note && (() => this.handleAdd(item.url, item.cid))}
                  noteText={note?.noteText}
                  noteIcon={note?.noteIcon}
                  noteIconColor={note?.noteIconColor}
                  adding={item?.isAdding}
                  createProjectLocked={profileStore.profile.isDemo}
                  onClickLocked={() => params.changeParams({ premium: 'true' })}
                  onCreateProject={note?.newProject && (() => this.AddToNewProject(item.url))}
                />)
              })}
            </List>
          </Segment>
        )}

      </ModalPopup>
    )
  }
}

export default AddCommunityModal
