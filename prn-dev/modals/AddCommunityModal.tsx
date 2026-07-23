import React, {Component} from 'react'

import ModalPopup from '../elements/ModalPopup/ModalPopup'
import { SingletonRouter, withRouter } from 'next/router'
import { inject, observer } from 'mobx-react'
import Title from '../elements/Title/Title'
import Row from '../elements/Row/Row'
import Text from '../elements/Text/Text'
import {Stores} from '../stores/RootStore'
import ProfileStore from '../stores/ProfileStore'
import AccountsStore from '../stores/AccountsStore'
import RouterUtil from '../utils/RouterUtil'
import InputText from '../elements/InputText/InputText'
import ModalAddCommunityHint from '../elements/ModalAddComunityHint/ModalAddCommunityHint'
import CommunitiesStore, { CommunityType } from '../stores/CommunitiesStore'
import Community from '../elements/Community/Community'
import ServiceBlockGroup from '../elements/ServiceBlock/ServiceBlockGroup'
import Loader from '../elements/Loader/Loader'
import Popup from '../elements/Popup/Popup'
import PopupButton from '../elements/Popup/PopupButton'
import PopupDivider from '../elements/Popup/PopupDivider'
import ScrollView from '../elements/ScrollView/ScrollView'
import ButtonText from '../elements/ButtonText/ButtonText'

interface IRouter extends SingletonRouter {
  /**
   * query
   */
  query: {
    /**
     * Название модалки
     */
    modal: string
    /**
     * Поисковая строка
     */
    queryCommunity: string
    /**
     * ID проекта для добавления сообществ
     */
    addToProjectID: string
  }
}

interface IProps {
  /**
   * router
   */
  router?: IRouter
  profileStore?: ProfileStore
  accountsStore?: AccountsStore
  communitiesStore?: CommunitiesStore
}


interface IStates {
  query: string
}

@(withRouter as any)
@inject(Stores.PROFILE_STORE, Stores.ACCOUNTS_STORE, Stores.COMMUNITIES_STORE)
@observer
export default class AddCommunityModal extends Component<IProps, IStates> {
  state: IStates = {
    query: ''
  }

  constructor (props: IProps) {
    super(props)
  }

  handleOpen = async () => {
    const { router } = this.props

    if (router.query.queryCommunity) this.search(router.query.queryCommunity)
  }

  search = async (query: string) => {
    this.setState({ query })

    this.props.communitiesStore.search(query)
  }

  createProject = async () => {
    const { router, accountsStore } = this.props

    accountsStore.projectForm.setData({ name: '', image: '' })

    await accountsStore.createAccount()

    RouterUtil.replaceParams(router, { addToProjectID: accountsStore.currentProject.accountID })
  }

  render (): JSX.Element {
    const { router, communitiesStore, accountsStore } = this.props

    const projectID = router.query.addToProjectID || accountsStore.currentProject?.accountID

    // const oneCommunity = communitiesStore.searchCommunities.find(item => item.url === router.query.queryCommunity)

    return (
      <ModalPopup
        open={router?.query?.modal === 'add-community'}
        onCloseClick={() => RouterUtil.replaceParams(router, { modal: undefined, addToProjectID: undefined })}
        onOpen={this.handleOpen}
      >
        <Title>Добавление страницы</Title>
        <Row padding='m' />
        <Text size='m' semibold>
          Поиск может найти страницы во всех соцсетях по названию или по ссылке на страницу. Не забывайте добавлять конкурентов и интересующих вас блогеров для проверки.
        </Text>
        <Row padding='s' />
        <Text size='m' semibold>
          Страницы будут добавлены в проект <Popup
            inline
            trigger={<ButtonText color='blue' size='s' loading={accountsStore.isCreating}>{accountsStore.getProject(projectID)?.name}</ButtonText>}
            maxHeight={1000}
            scrolling
            size='m' right>
            <PopupButton onClick={this.createProject} icon='plus_circle' autoClosePopup>Новый проект</PopupButton>
            <PopupDivider />
            <ScrollView>
              {accountsStore.accounts?.map(item => (
                <PopupButton
                  key={item.accountID}
                  onClick={() => RouterUtil.replaceParams(router, { addToProjectID: item.accountID })}
                  project
                  control={!item.isPaid ? 'admin' : ''}
                  image={item.image || 'empty'}
                  active={item.accountID === projectID}
                  autoClosePopup
                  error={!item.isPaid}
                >
                  {item.name}
                </PopupButton>
              ))}
            </ScrollView>
          </Popup>
        </Text>
        <Row padding='xs' />
        <Row padding='l'/>

        <InputText
          white
          big
          icon='search'
          label='Поиск'
          value={this.state.query}
          onChange={e => this.search(e.target.value)}
          loading={communitiesStore.isSearchLoading}
        />

        <Row padding='xl' />

        {communitiesStore.isSearchLoading && <Loader />}

        <ServiceBlockGroup>
          {!communitiesStore.isSearchLoading && communitiesStore.searchCommunities.map(community => (
            <Community
              key={community.communityID}
              image={community.image}
              name={community.name}
              url={community.url}
              disabledUrl
              usersCount={community.usersCount}
              onAddMyCommunity={() => communitiesStore.add(community.url, CommunityType.MY, projectID)}
              onAddCompetitor={() => communitiesStore.add(community.url, CommunityType.COMPETITOR, projectID)}
              onAddInfluencer={() => communitiesStore.add(community.url, CommunityType.INFLUENCER, projectID)}
              isAdded={!!communitiesStore.isAddedCommunity(community.cid, projectID)}
              isLoading={community.isLoading}
            />
          ))}
        </ServiceBlockGroup>

        {!communitiesStore.isSearchLoading && !communitiesStore.searchCommunities.length && <ModalAddCommunityHint />}

      </ModalPopup>
    )
  }
}
