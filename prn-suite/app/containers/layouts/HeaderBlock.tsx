import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { IGlobalParams } from '../../interfaces/IParams'
import ScrollView from '../../ui/elements/ScrollView/ScrollView'
import NumeralUtil from '../../utils/NumeralUtil'

import withParams, { ParamsProps } from '../../utils/withParams'
import ProfileStore from '../../stores/ProfileStore'
import { Stores, clear } from '../../stores/RootStore'
import Header from '../../ui/elements/Header/Header'
import HeaderLogo from '../../ui/elements/Header/HeaderLogo'
import HeaderMenu from '../../ui/elements/Header/HeaderMenu'
import HeaderAccount from '../../ui/elements/Header/HeaderAccount'
import Popup from '../../ui/elements/Popup/Popup'
import PopupButton from '../../ui/elements/Popup/PopupButton'
import PopupDivider from '../../ui/elements/Popup/PopupDivider'
import Account from '../../ui/elements/Account/Account'
import AccountsStore from '../../stores/AccountsStore'
import SocialButton from '../../ui/elements/SocialButton/SocialButton'
import ButtonText from '../../ui/elements/ButtonText/ButtonText'
import CommunitiesStore from '../../stores/CommunitiesStore'
import Toolbar2Group from '../../ui/elements/Toolbar2/Toolbar2Group'
import Toolbar2 from '../../ui/elements/Toolbar2/Toolbar2'
import Splitter from '../../ui/elements/Splitter/Splitter'
import HeaderIcons from '../../ui/elements/Header/HeaderIcons'
import HeaderControls from '../../ui/elements/Header/HeaderControls'

interface IProps {
  params?: ParamsProps<IGlobalParams>
  profileStore?: ProfileStore
  accountsStore?: AccountsStore
  communitiesStore?: CommunitiesStore
}

@withParams
@inject(Stores.PROFILE_STORE, Stores.ACCOUNTS_STORE, Stores.COMMUNITIES_STORE)
@observer
class HeaderBlock extends Component<IProps> {

  constructor (props: IProps) {
    super(props)

    this.load()
  }

  componentDidUpdate (prevProps: Readonly<IProps>, prevState: Readonly<{}>, snapshot?: any): void {
    this.load()
  }

  load = async () => {
    const { params, accountsStore, profileStore } = this.props

    const accountID = await accountsStore.setAccount(params.accountID || 'localstorage')
    if (accountID && (!accountsStore.currentAccount || accountID !== params.accountID)) {
      params.changeParams({ accountID })
    }

    if (profileStore.isAuth && params.token === profileStore.token) {
      params.changeParams({ token: undefined })
    }
  }

  handleLogout = () => {
    this.props.profileStore.logout()
    clear()
  }

  createAccount = async () => {
    const { params, accountsStore } = this.props
    const newAccount = await accountsStore.createAccount()

    params.changeParams({ accountID: newAccount.accountID, addCommunityType: 'my', addCommunity: true })
  }

  render (): JSX.Element {
    const { params, profileStore, accountsStore, communitiesStore } = this.props

    const currentAccount = accountsStore.currentAccount
    const accounts = accountsStore.accounts || []

    if (!profileStore.isAuth || !currentAccount) {
      return (
        <Header>
          <HeaderLogo />
        </Header>)
    }

    const myCommunitySocialTypes = communitiesStore.getMyCommunitySocialTypes()
    const isDemo = profileStore.profile.isDemo
    const isDeveloper = profileStore.profile.role === 'developer'

    return (
      <Header>
        <HeaderLogo />
        <HeaderMenu>
          <Toolbar2 center>
            <Toolbar2Group>
              {['settings/communities', 'statistics', 'search'].includes(accountsStore.getCurrentProduct()) && (
                <>
                  <ButtonText
                    round
                    color='new'
                    icon='case'
                    onClick={() => params.changeUrl('/settings/communities',{})}
                    active={accountsStore.getCurrentProduct() === 'settings/communities'}
                  />
                  <Splitter header />
                  <SocialButton
                    socialType='ALL'
                    onClick={() => params.changeUrl(`/statistics`,{ type: 'ALL' })}
                    active={accountsStore.getCurrentProduct() === 'statistics' && params.type === 'ALL'}
                  />

                  <Splitter header />

                  {myCommunitySocialTypes.map(socialType => (
                    <SocialButton
                      key={socialType}
                      socialType={socialType}
                      onClick={() => params.changeUrl(`/statistics`,{ type: socialType })}
                      active={socialType === params.type}
                    />
                  ))}

                  {!!myCommunitySocialTypes.length && <Splitter header />}
                  <ButtonText round color='new' icon='plus' onClick={() => params.changeParams({ addCommunity: true, addCommunityType: 'my' })} />
                  <Splitter header />
                  <ButtonText round color='new' icon='search' onClick={() => params.changeUrl('/search',{})} active={accountsStore.getCurrentProduct() === 'search'} />

                  {/*<Splitter header />*/}
                  {/*<ButtonText*/}
                  {/*  round*/}
                  {/*  iconColor='red'*/}
                  {/*  icon='new_year'*/}
                  {/*  onClick={() => params.changeUrl('/settings/ny-communities',{})}*/}
                  {/*  active={accountsStore.getCurrentProduct() === 'settings/ny-communities'}*/}
                  {/*/>*/}
                </>
                )}
            </Toolbar2Group>
          </Toolbar2>
        </HeaderMenu>
        <HeaderControls>
          <HeaderIcons token={profileStore.token} />

          <Popup
            trigger={(
              <HeaderAccount
                image={currentAccount?.image}
                name={currentAccount?.name}
                description={accountsStore.getDescription(currentAccount)}
              />)}
            maxHeight={1000}
            scrolling
          >

            <PopupButton icon='plus' autoClosePopup onClick={this.createAccount}>
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
                // onClick={() => params.changeUrl(`/${accountsStore.getCurrentProduct()}`, { accountID: account?.accountID })}
                onClick={() => params.changeUrl('/settings/communities', { accountID: account?.accountID })}
                // onSettings={() => params.changeUrl('/settings/communities', { accountID: account?.accountID })}
                autoClosePopup
              />
            ))}
            <PopupDivider />
            {isDeveloper && (
              <PopupButton
                icon='admin'
                autoClosePopup
                onClick={() => params.changeParams({ editUser: true })}
              >
                Редактирование пользователя
              </PopupButton>
            )}
            {isDeveloper && (
              <PopupButton
                icon='admin'
                autoClosePopup
                onClick={() => window.open(`https://prnapi.c-cube.ru/v5/elama/report?period=week&token=${profileStore.token}`)}
              >
                Недельный отчет для eLama
              </PopupButton>
            )}
            {isDeveloper && (
              <PopupButton
                icon='admin'
                autoClosePopup
                onClick={() => window.open(`https://prnapi.c-cube.ru/v5/elama/report?period=month&token=${profileStore.token}`)}
              >
                Месячный отчет для eLama
              </PopupButton>
            )}
            <PopupButton
              icon='paid'
              autoClosePopup
              onClick={() => params.changeParams({ premium: 'true' })}
            >
              Подписка и оплата
            </PopupButton>
            <PopupButton
              icon='group'
              autoClosePopup
              onClick={() => params.changeUrl('/settings/projects')}
            >
              Управление проектами
            </PopupButton>
            <PopupButton
              icon='person'
              autoClosePopup
              onClick={() => params.changeUrl('https://prn.c-cube.ru/settings/profile', { token: profileStore.token })}
            >
              Мой профиль
            </PopupButton>
            <PopupButton
              icon='help'
              autoClosePopup
              onClick={() => params.changeUrl('https://prn.c-cube.ru/support', { token: profileStore.token })}
            >
              Поддержка
            </PopupButton>
            <PopupButton
              icon='logout_circle'
              onClick={() => this.handleLogout()}
            >
              Выйти
            </PopupButton>
          </Popup>
        </HeaderControls>
      </Header>
    )
  }
}

export default HeaderBlock
