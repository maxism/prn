import React, { Component } from 'react'
import { IStatisticsParams } from '../../interfaces/IParams'
import AccountsStore from '../../stores/AccountsStore'
import { Stores } from '../../stores/RootStore'
import Segment from '../../ui/elements/Segment/Segment'
import Title from '../../ui/elements/Title/Title'
import ButtonText from '../../ui/elements/ButtonText/ButtonText'
import LiteLayout from '../layouts/LiteLayout'
import List from '../../ui/elements/List/List'
import { inject, observer } from 'mobx-react'
import CommunitiesStore from '../../stores/CommunitiesStore'
import CommunityType from '../../types/CommunityType'
import withParams, { ParamsProps } from '../../utils/withParams'
import { Helmet } from 'react-helmet'
import ProjectOverview from '../../ui/elements/ProjectOverview/ProjectOverview'
import Account from '../../ui/elements/Account/Account'

interface IProps {
  params?: ParamsProps<IStatisticsParams>
  accountsStore?: AccountsStore
  communitiesStore?: CommunitiesStore
}

interface IStates {
  //
}

@withParams
@inject(Stores.ACCOUNTS_STORE)
@observer
class ProjectsSettingsPage extends Component<IProps, IStates> {
  createAccount = async () => {
    const { params, accountsStore } = this.props
    const newAccount = await accountsStore.createAccount()

    params.changeParams({ accountID: newAccount.accountID, addCommunityType: 'my', addCommunity: true })
  }

  render (): JSX.Element {
    const { params, accountsStore } = this.props

    return (
      <LiteLayout>
        {/*@ts-ignore*/}
        <Helmet>
          <title>Список проектов — КУБ</title>
        </Helmet>

          <Segment size={3}>
            <Title text='Список проектов'>
              <ButtonText onClick={this.createAccount} color='blue'>Добавить новый проект</ButtonText>
            </Title>
          </Segment>

          <Segment size={3} />
          <List emptyText='Сначала нужно добавить страницу'>
            {accountsStore.accounts.map(account => (
              <ProjectOverview
                key={account?.accountID}
                image={account?.image}
                name={account?.name}
                description={accountsStore.getDescription(account)}
                onClick={() => params.changeUrl('/settings/communities', { accountID: account?.accountID })}
              />
            ))}
          </List>

        <Segment size={3} />

      </LiteLayout>
    )
  }
}

export default ProjectsSettingsPage
