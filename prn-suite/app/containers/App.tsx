import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router'
import { YMInitializer } from 'react-yandex-metrika'
import { inject, observer } from 'mobx-react'
import { Helmet } from 'react-helmet'
import withParams, { ParamsProps } from '../utils/withParams'

import Notifications from '../ui/elements/Notifications/Notifications'
import { Stores } from '../stores/RootStore'
import PrivateRoute from './layouts/PrivateRoute'
import PublicRoute from './layouts/PublicRoute'
import MainPage from './MainPage'
import NotFoundPage from './NotFoundPage'
import AccessDeniedPage from './AccessDeniedPage'
import ResetPasswordPage from './ResetPasswordPage'
import SentResetPasswordPage from './SentResetPasswordPage'
import SetPasswordPage from './SetPasswordPage'
import SignupPage from './SignupPage'
import ProfileStore from '../stores/ProfileStore'
import MessengerPage from './MessengerPage'
import CommunitiesSettingsPage from './settings/CommunitiesSettingsPage'
import NYCommunitiesSettingsPage from './settings/NYCommunitiesSettingsPage'
import PlanSettingsPage from './settings/PlanSettingsPage'
import InvoiceSettingsPage from './settings/InvoiceSettingsPage'
import ProfileSettingsPage from './settings/ProfileSettingsPage'
import SettingsPage from './SettingsPage'
import StatisticsPage from './StatisticsPage'
import SourcesSettingsPage from './settings/SourcesSettingsPage'

import '../ui/style.scss'
import CommunitySettingsModal from './modals/CommunitySettingsModal'
import DetailPostModal from './modals/DetailPostModal'
import AddCommunityModal from './modals/AddCommunityModal'
import AccountSettingsModal from './modals/AccountSettingsModal'
import YMUtil from '../utils/YMUtil'
import ContentPage from './ContentPage'
import ChangePasswordModal from './modals/ChangePasswordModal'
import SurveyWelcomeModal from './modals/SurveyWelcomeModal'
import QRGeneratorPage from './private/CodeGeneratorPage'
import ConfirmTokenModal from './modals/ConfirmTokenModal'
import PremiumModal from './modals/PremiumModal'
import ProjectsSettingsPage from './settings/ProjectsSettingsPage'
import EditUserModal from './modals/EditUserModal'
import SearchPage from './SearchPage'
import SubscribePage from './SubscribePage'

interface IParams {
  token: string
}

interface IProps {
  params?: ParamsProps<IParams>
  profileStore?: ProfileStore
}

@withParams
@inject(Stores.PROFILE_STORE)
@observer
class App extends Component<IProps> {
  constructor (props: IProps) {
    super(props)

    if (this.props.params.token) {
      props.profileStore.setToken(this.props.params.token)
      props.params.changeParams({ token: undefined })
    }
  }

  componentDidCatch (error, errorInfo): void {
    console.log(error)
    console.log(errorInfo.componentStack)
  }

  render (): JSX.Element {
    const { profileStore } = this.props

    if (profileStore.isAuth) {
      window['carrotquest'].auth(profileStore.profile.userID, profileStore.profile.carrotquestToken)
      window['carrotquest'].identify({ '$name': profileStore.profile.name || profileStore.profile.email, '$email': profileStore.profile.email })

      const isElamaPartner = profileStore.profile.email.includes('_oidc_elama@c-cube.ru')

      for (let i = 0; i <= 10; i++) {
        setTimeout(() => {
          try {
            // @ts-ignore
            if (isElamaPartner) document.getElementsByClassName('carrotquest-messenger-right_bottom')[0].style.display = 'none'
          } catch (e) { }
        }, 1000 + i * 500)
      }

      YMUtil.userParams({
        SUID: profileStore.profile.userID,
        isDemo: profileStore.profile.isDemo,
        currentCommunities: profileStore.profile.currentCommunities,
        maxCommunities: profileStore.profile.maxCommunities
      })
    }

    YMUtil.hit()

    return (
      <>
        {/* @ts-ignore */}
        <Helmet>
          <title>КУБ Suite</title>
        </Helmet>
        {/* @ts-ignore */}
        <Switch>
          <PublicRoute path='/' exact component={MainPage} />
          <PublicRoute path='/reset-password' exact component={ResetPasswordPage} />
          <PublicRoute path='/signup' exact component={SignupPage} />
          <PublicRoute path='/sent-reset-password' exact component={SentResetPasswordPage} />
          <PublicRoute path='/set-password' exact component={SetPasswordPage} />
          <PrivateRoute path='/statistics' component={StatisticsPage} />
          <PrivateRoute path='/messenger' component={MessengerPage} />
          <PrivateRoute path='/content' component={ContentPage} />
          <PrivateRoute path='/search' component={SearchPage} />
          <PrivateRoute path='/settings' exact component={SettingsPage} />
          <PrivateRoute path='/settings/profile' component={ProfileSettingsPage} />
          <PrivateRoute path='/settings/projects' component={ProjectsSettingsPage} />
          <PrivateRoute path='/settings/communities' component={CommunitiesSettingsPage} />
          <PrivateRoute path='/settings/ny-communities' component={NYCommunitiesSettingsPage} />
          <PrivateRoute path='/settings/plan/invoice' component={InvoiceSettingsPage} />
          <PrivateRoute path='/settings/plan' component={PlanSettingsPage} />
          <PrivateRoute path='/settings/sources' component={SourcesSettingsPage} />
          <PrivateRoute path='/qr' component={QRGeneratorPage} />
          <PrivateRoute path='/subscribe' component={SubscribePage} />
          <PublicRoute path='/access-denied' component={AccessDeniedPage} />
          <PublicRoute path='/not-found' component={NotFoundPage} />
          {/* @ts-ignore */}
          <Route path='/ru/suite'><Redirect to='/statistics' /></Route>
          {/* @ts-ignore */}
          <Redirect to='/not-found' />
        </Switch>
        <Notifications />

        <DetailPostModal />
        <AddCommunityModal />
        {/*<ConfirmEmailModal />*/}
        <AccountSettingsModal />
        <CommunitySettingsModal />
        <ChangePasswordModal />
        <SurveyWelcomeModal />
        <ConfirmTokenModal />
        <PremiumModal />
        <EditUserModal />

        {/* @ts-ignore */}
        <YMInitializer accounts={[123]} options={{ clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: true, trackHash: true }} version='2' />
      </>
    )
  }
}

export default App
