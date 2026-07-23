import React, { ChangeEvent, Component } from 'react'

import ModalPopup from '../elements/ModalPopup/ModalPopup'
import RouterUtil from '../utils/RouterUtil'
import { SingletonRouter, withRouter } from 'next/router'
import Title from '../elements/Title/Title'
import Row from '../elements/Row/Row'
import Text from '../elements/Text/Text'
import ButtonText from '../elements/ButtonText/ButtonText'
import {inject, observer} from 'mobx-react'
import {Stores} from '../stores/RootStore'
import ProfileStore from '../stores/ProfileStore'
import FormRow from '../elements/Form/FormRow'
import InputText from '../elements/InputText/InputText'
import Form from '../elements/Form/Form'
import Link from '../elements/Link/Link'

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
}

@(withRouter as any)
@inject(Stores.PROFILE_STORE)
@observer
export default class LoginModal extends Component<IProps, any> {
  constructor (props: IProps) {
    super(props)
  }

  render (): JSX.Element {
    const { router, profileStore } = this.props

    if (profileStore.isAuth && router?.query?.modal === 'login') {
      RouterUtil.replaceParams(router, { modal: undefined })
    }

    return (
      <ModalPopup
        open={router?.query?.modal === 'login'}
        onCloseClick={() => RouterUtil.replaceParams(router, { modal: undefined })}
      >
        <Title>Вход в сервис</Title>
        <Row padding='m'/>

        <Form onSubmit={() => profileStore.login()}>
          <FormRow>
            <InputText
              label='Адрес e-mail'
              name='email'
              value={profileStore.loginForm.email.value}
              error={profileStore.loginForm.email.error}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                profileStore?.loginForm.email.change(e.target.value)
                profileStore?.loginForm.setErrors({ password: profileStore.loginForm.getErrors().password })
              }}
              white
            />
          </FormRow>
          <FormRow>
            <InputText
              label='Пароль'
              name='password'
              type='password'
              value={profileStore.loginForm.password.value}
              error={profileStore.loginForm.password.error}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                profileStore?.loginForm.password.change(e.target.value)
                profileStore?.loginForm.setErrors({ email: profileStore.loginForm.getErrors().email })
              }}
              white
            />
            <Text size='s' middle>
              <Link to='?modal=reset-password'>Не помню пароль</Link>
            </Text>
          </FormRow>
          <FormRow buttons>
            <ButtonText type='submit' size='l' disabled={profileStore.isValidate} loading={profileStore.isLoading}>Войти</ButtonText>
            {/*<ButtonText to='https://prnapi.c-cube.ru/v5/login/elama' size='l'>Войти через eLama</ButtonText>*/}
            <Text size='s' middle>
              Ещё нет аккаунта?<br />
              <Link to='?modal=registration'>Зарегистрироваться</Link>
            </Text>
          </FormRow>
        </Form>
      </ModalPopup>
    )
  }
}
