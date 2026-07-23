import React, { Component } from 'react'

import ModalPopup from '../elements/ModalPopup/ModalPopup'
import { SingletonRouter, withRouter } from 'next/router'
import { inject, observer } from 'mobx-react'
import Title from '../elements/Title/Title'
import Row from '../elements/Row/Row'
import Text from '../elements/Text/Text'
import FormRow from '../elements/Form/FormRow'
import InputText from '../elements/InputText/InputText'
import ButtonText from '../elements/ButtonText/ButtonText'
import Form from '../elements/Form/Form'
import { Stores } from '../stores/RootStore'
import ProfileStore from '../stores/ProfileStore'
import AccountsStore from '../stores/AccountsStore'
import RouterUtil from '../utils/RouterUtil'

interface IRouter extends SingletonRouter {
  /**
   * query
   */
  query: {
    /**
     * Название модалки
     */
    modal: string
  }
}

interface IProps {
  /**
   * router
   */
  router?: IRouter
  profileStore?: ProfileStore
  accountsStore?: AccountsStore
}

@(withRouter as any)
@inject(Stores.PROFILE_STORE, Stores.ACCOUNTS_STORE)
@observer
export default class CreateProjectModal extends Component<IProps, any> {
  constructor (props: IProps) {
    super(props)
  }

  handleOpen = async () => {
    const { accountsStore } = this.props

    accountsStore.projectForm.setData({
      name: '',
      image: ''
    })
  }

  submit = async () => {
    const { router, accountsStore } = this.props
    await accountsStore.createAccount()
    RouterUtil.replaceParams(router, { modal: undefined })
  }

  render (): JSX.Element {
    const { router, accountsStore } = this.props

    return (
      <ModalPopup
        open={router?.query?.modal === 'create-project'}
        onCloseClick={() => RouterUtil.replaceParams(router, { modal: undefined })}
        onOpen={this.handleOpen}
      >
        <Title>Создание нового проекта</Title>
        <Row padding='m'/>

        <Text semibold>
          Проект — это место, где вы можете собрать вместе все страницы кампании из разных соцсетей, добавить страницы конкурентов и отобрать блогеров для рекламных интеграций.<br/><br/>
          Между проектами легко переключаться из шапки сайта. Это удобно, если у вас несколько компаний.
        </Text>
        <Row padding='xs' />
        <Row padding='l'/>

        <Form onSubmit={this.submit}>
          <FormRow full>
            <InputText
              label='Название проекта'
              value={accountsStore.projectForm.name.value}
              error={accountsStore.projectForm.name.error}
              onChange={e => accountsStore.projectForm.name.change(e.target.value)}
              white
            />
          </FormRow>

          <Row padding='s' />
          <FormRow buttons>
            <ButtonText type='submit' size='l' loading={accountsStore.isCreating} disabled={accountsStore.isCreating}>Создать проект</ButtonText>
          </FormRow>
        </Form>
      </ModalPopup>
    )
  }
}
