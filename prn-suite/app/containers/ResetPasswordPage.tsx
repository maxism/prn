import React, { ChangeEvent, Component } from 'react'
import { Stores } from '../stores/RootStore'

import LiteLayout from './layouts/LiteLayout'
import Segment from '../ui/elements/Segment/Segment'
import { inject, observer } from 'mobx-react'
import InputText from '../ui/elements/InputText/InputText'
import ButtonText from '../ui/elements/ButtonText/ButtonText'
import Form from '../ui/collections/Form/Form'
import Title from '../ui/elements/Title/Title'
import Description from '../ui/elements/Description/Description'
import ProfileStore from '../stores/ProfileStore'
import FormRow from '../ui/collections/Form/FormRow'
import {Helmet} from 'react-helmet'

interface IProps {
  profileStore?: ProfileStore
}

@inject(Stores.PROFILE_STORE)
@observer
class ResetPasswordPage extends Component<IProps> {
  render (): JSX.Element {
    const { profileStore } = this.props

    return (
      <LiteLayout center icon='logo_sign'>
        {/* @ts-ignore */}
        <Helmet>
          <title>Сброс пароля — КУБ Suite</title>
        </Helmet>

        <Title>Сброс пароля</Title>
        <Segment size={3} />
        <Description size='big'>
          Напишите адрес электронной почты, который был указан при регистрации. Мы пришлём вам письмо с дальнейшими инструкциями.
        </Description>
        <Segment size={3} />
        <Form onSubmit={() => profileStore.resetPassword()}>
          <FormRow>
            <InputText
              label='Адрес e-mail'
              name='email'
              value={profileStore.loginForm.email.value}
              error={profileStore.loginForm.email.error}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                profileStore.loginForm.email.change(e.target.value)
                profileStore?.loginForm.setErrors({})
              }}
            />
          </FormRow>
          <FormRow padding='small'>
            <ButtonText type='submit' color='blue' loading={profileStore.isValidate}>Сбросить пароль</ButtonText>
            <ButtonText color='transparent' to='/'>Я помню пароль</ButtonText>
          </FormRow>
        </Form>
      </LiteLayout>)
  }
}

export default ResetPasswordPage
