import React, { ChangeEvent, Component } from 'react'

import '../ui/style.scss'
import { Stores } from '../stores/RootStore'
import FormRow from '../ui/collections/Form/FormRow'
import withParams, { ParamsProps } from '../utils/withParams'
import LiteLayout from './layouts/LiteLayout'
import Segment from '../ui/elements/Segment/Segment'
import { inject, observer } from 'mobx-react'
import InputText from '../ui/elements/InputText/InputText'
import ButtonText from '../ui/elements/ButtonText/ButtonText'
import Form from '../ui/collections/Form/Form'
import Title from '../ui/elements/Title/Title'
import ProfileStore from '../stores/ProfileStore'
import {Helmet} from 'react-helmet'

interface IProps {
  params?: ParamsProps
  profileStore?: ProfileStore
}

@withParams
@inject(Stores.PROFILE_STORE)
@observer
class MainPage extends Component<IProps> {
  render (): JSX.Element {
    const { params, profileStore } = this.props

    if (profileStore.isLoading) return null

    if (profileStore.isAuth) params.changeUrl('/settings/communities')

    return (
      <LiteLayout center icon='logo_sign'>
        {/* @ts-ignore */}
        <Helmet>
          <title>Авторизация — КУБ Suite</title>
        </Helmet>

        <Title>Войти в сервис</Title>
        <Segment size={3} />
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
            />
            <ButtonText to='/reset-password' color='transparent'>Забыли пароль?</ButtonText>
          </FormRow>
          <FormRow padding='small'>
            <ButtonText type='submit' color='blue' loading={profileStore.isValidate}>Войти в сервис</ButtonText>
            <ButtonText to='/signup' color='transparent'>Зарегистрироваться</ButtonText>
          </FormRow>
        </Form>
      </LiteLayout>)
  }
}

export default MainPage
