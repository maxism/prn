import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import AccountsStore from '../stores/AccountsStore'
import { Stores } from '../stores/RootStore'

import Segment from '../ui/elements/Segment/Segment'
import LiteLayout from './layouts/LiteLayout'
import Title from '../ui/elements/Title/Title'
import DescriptionLink from '../ui/views/DescriptionLink/DescriptionLink'
import DescriptionLinkGroup from '../ui/views/DescriptionLink/DescriptionLinkGroup'
import ProfileStore from '../stores/ProfileStore'
import {Helmet} from 'react-helmet'

interface IProps {
  accountsStore?: AccountsStore
  profileStore?: ProfileStore
}

@inject(Stores.PROFILE_STORE, Stores.ACCOUNTS_STORE)
@observer

class SettingsPage extends Component<IProps> {
  render (): JSX.Element {
    const { accountsStore, profileStore } = this.props

    const isDeveloper = profileStore.profile.role === 'developer'
    return (
      <LiteLayout>
        {/* @ts-ignore */}
        <Helmet>
          <title>Личный кабинет — КУБ Suite</title>
        </Helmet>

        <Segment size={2} />
        <Title>Личный кабинет</Title>
        <Segment size={3}>
          <DescriptionLinkGroup>
            <DescriptionLink
              title='Профиль'
              description='Настройка информации о себе. Изменение личных данных, смена пароля, почты и автатара.'
              icon='person'
              to='/settings/profile'
            />
          </DescriptionLinkGroup>
        </Segment>

        <Segment size={5}>
          <Title size='middle'>Проект «{accountsStore.currentAccount.name}»</Title>
          <Segment size={3}>
            <DescriptionLinkGroup>
              <DescriptionLink
                title='Сообщества'
                description='Управление сообществами. Добавление, настройка и удаление своих сообществ и сообществ конкурентов.'
                icon='select_dashboard'
                to='/settings/communities'
              />
              <DescriptionLink
                title='Подписка и оплата'
                description='Оплата сервиса. Обзор вашей текущей подписки, платежной информации и детализация счетов.'
                icon='paid'
                to={`https://prn.c-cube.ru/settings/subscription?token=${profileStore.token}`}
              />
              {isDeveloper && (
                <DescriptionLink
                  title='Источники данных'
                  description='Подключение своих профилей в социальных сетях для расширенния возможностей сервиса.'
                  icon='rules'
                  to='/settings/sources'
                />)}
            </DescriptionLinkGroup>
          </Segment>
        </Segment>
        <Segment size={3} />
      </LiteLayout>
    )
  }
}

export default SettingsPage
