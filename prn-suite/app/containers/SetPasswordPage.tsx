import React, { Component } from 'react'
import { Stores } from '../stores/RootStore'
import withParams, { ParamsProps } from '../utils/withParams'

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
import {IGlobalParams} from '../interfaces/IParams'
import {Helmet} from 'react-helmet'

interface IProps {
  params?: ParamsProps<IGlobalParams>
  profileStore?: ProfileStore
}

@withParams
@inject(Stores.PROFILE_STORE)
@observer
class SetPasswordPage extends Component<IProps> {
  constructor (props: IProps) {
    super(props)

    props.profileStore.passwordForm.setData({
      recovery_hash: this.props.params.recoveryCode
    })
  }

  render (): JSX.Element {
    const { profileStore } = this.props

    return (
      <LiteLayout center icon='logo_sign'>
        {/* @ts-ignore */}
        <Helmet>
          <title>Новый пароль — КУБ Suite</title>
        </Helmet>

        <Title>Новый пароль</Title>
        <Segment size={3} />
        <Description size='big'>
          Вы запросили сброс пароля. Теперь вам нужно придумать новый и написать его в двух полях — чтобы исключить ошибку и лучше запомнить.
        </Description>
        <Segment size={3} />
        <Form onSubmit={() => profileStore.setPassword()}>
          <FormRow>
            <InputText
              label='Новый пароль'
              name='password'
              type='password'
              value={profileStore.passwordForm.password.value}
              error={profileStore.passwordForm.password.error}
              onChange={e => profileStore.passwordForm.password.change(e.target.value)}
            />
          </FormRow>
          <FormRow>
            <InputText
              label='Повторите новый пароль'
              name='password2'
              type='password'
              value={profileStore.passwordForm.password2.value}
              error={profileStore.passwordForm.password2.error}
              onChange={e => profileStore.passwordForm.password2.change(e.target.value)}
            />
          </FormRow>
          <FormRow padding='small'>
            <ButtonText type='submit' color='blue'>Сохранить новый пароль</ButtonText>
          </FormRow>
        </Form>
      </LiteLayout>)
  }
}

export default SetPasswordPage
