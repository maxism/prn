import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import ICommunity from '../../interfaces/ICommunity'
import AccountsStore from '../../stores/AccountsStore'
import CommunitiesStore from '../../stores/CommunitiesStore'
import { Stores } from '../../stores/RootStore'
import CallbackStatus from '../../types/CallbackStatus'
import CommunityType from '../../types/CommunityType'
import ButtonText from '../../ui/elements/ButtonText/ButtonText'
import List from '../../ui/elements/List/List'
import Segment from '../../ui/elements/Segment/Segment'
import Title from '../../ui/elements/Title/Title'

import Toolbar2 from '../../ui/elements/Toolbar2/Toolbar2'
import Toolbar2Group from '../../ui/elements/Toolbar2/Toolbar2Group'
import NumeralUtil from '../../utils/NumeralUtil'
import withParams, { ParamsProps } from '../../utils/withParams'
import ModalPopup from '../../ui/elements/ModalPopup/ModalPopup'
import { IGlobalParams } from '../../interfaces/IParams'
import Description from '../../ui/elements/Description/Description'
import ArrayUtil from '../../utils/ArrayUtil'
import Community from '../../ui/elements/Community/Community'
import format from '../../lib/format'
import CommunityStatus from '../../types/CommunityStatus'
import ISocialType from '../../interfaces/ISocialType'

interface IState {
  open: boolean
}

interface IProps {
  params?: ParamsProps<IGlobalParams>
  accountsStore?: AccountsStore
  communitiesStore?: CommunitiesStore
}

/**
 * Модалка настроек страницы
 */
@withParams
@inject(Stores.ACCOUNTS_STORE, Stores.COMMUNITIES_STORE, Stores.SOURCES_STORE)
@observer
class AccountSettingsModal extends Component<IProps, IState> {
  public state: IState = {
    open: false
  }

  componentDidUpdate (prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {
    const { params, communitiesStore } = this.props

    if (params.accountSettings && !prevState.open && !this.state.open) this.setState({ open: true })
    if (!params.accountSettings && prevState.open && this.state.open) this.setState({ open: false })
  }

  handleClose = () => {
    this.props.params.changeParams({ accountSettings: undefined })
  }

  renderCommunity = (type: string, item: ICommunity): JSX.Element => {
    const { communitiesStore } = this.props
    const isAdmin = item.isInsights
    const hasMessenger = isAdmin && item.socialType === 'VK'
    const messengerEnabled = item.callbackStatus === CallbackStatus.ENABLED
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
      status={item.communityStatus === CommunityStatus.COLLECTING && 'process'}
      messengerIcon={hasMessenger ? (messengerEnabled ? 'active' : 'disabled') : null}
      onRemove={() => confirm('Вы действительно хотите удалить страницу?') && communitiesStore.remove(item.communityID)}
      onClick={() => this.props.params.changeUrl('/statistics', { type: item.socialType as ISocialType, accountSettings: undefined })}
      onSettings={() => this.props.params.changeParams({ communityID: item.communityID })}
    />)
  }

  render (): JSX.Element {
    const { accountsStore, communitiesStore } = this.props

    const account = accountsStore.currentAccount

    return (
      <ModalPopup open={this.state.open} onCloseClick={this.handleClose}>

        <Title size='big' text='Список страниц проекта' controls>
          <Toolbar2>
            <Toolbar2Group>
              {accountsStore.accounts.length > 1 && <ButtonText
                icon='trash'
                onClick={() => confirm('Вы действительно хотите удалить проект?') && accountsStore.removeAccount(account?.accountID)}
              />}
            </Toolbar2Group>
          </Toolbar2>
        </Title>

        <Segment size={2}>
          <Title size='middle'>Мои страницы</Title>
          <Segment size={2}/>
          <Description>
            Ваши страницы — это страницы, по которым вы будете получать подробную статистику. Вы можете добавить по одной странице в каждую из социальных сетей. Одна страница стоит 200 рублей.
          </Description>
        </Segment>

        <List emptyText='Сначала нужно добавить страницу'>
          {ArrayUtil.arrayObjectsSort('communityStatus',
            communitiesStore.communities.filter(item => item.communityType === CommunityType.MY)).map(item => this.renderCommunity('my', item))
          }
        </List>

        <Segment size={2}>
          <Title size='middle'>Страницы конкурентов</Title>
          <Segment size={2}/>
          <Description>
            Вы будете получать усредненные показатели по конкурентам и сравнивать со своими. У всех страниц будет высчитан КУБ Score и рекомендации, на которые стоит обратить внимание.
          </Description>
        </Segment>

        <List emptyText='Вы пока ничего не добавили'>
          {ArrayUtil.arrayObjectsSort('communityStatus',
            communitiesStore.communities.filter(item => item.communityType === CommunityType.COMPETITOR)).map(item => this.renderCommunity('competitor', item))
          }
        </List>
      </ModalPopup>
    )
  }
}

export default AccountSettingsModal
