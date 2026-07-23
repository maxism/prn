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
import withParams, { ParamsProps } from '../utils/withParams'
import { Helmet } from 'react-helmet'
import Link from '../ui/elements/Link/Link'
import { IGlobalParams } from '../interfaces/IParams'
import YMUtil from '../utils/YMUtil'

interface IProps {
  params?: ParamsProps<IGlobalParams>
  profileStore?: ProfileStore
}

interface IState {
  showPromoCodeField: boolean
}

@withParams
@inject(Stores.PROFILE_STORE)
@observer
class SignupPage extends Component<IProps, IState> {

  state = {
    showPromoCodeField: false
  }

  componentDidMount (): void {
    const { params, profileStore } = this.props
    if (params.promoCode) {
      profileStore.loginForm.promoCode.change(params.promoCode)
      this.setState({ showPromoCodeField: true })
    }

    YMUtil.reachGoal('page_registration')
  }

  render (): JSX.Element {
    const { params, profileStore } = this.props

    if (profileStore.isLoading) return null

    if (profileStore.isAuth) params.changeUrl('/statistics')

    return (
      <LiteLayout center icon='logo_sign'>
        {/* @ts-ignore */}
        <Helmet>
          <title>Регистрация — КУБ Suite</title>
        </Helmet>

        <Title>Регистрация</Title>
        <Segment size={3} />
        <Form onSubmit={() => profileStore.signup()}>
          <FormRow>
            <InputText
              label='Адрес e-mail'
              name='email'
              value={profileStore.loginForm.email.value}
              error={profileStore.loginForm.email.error}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                profileStore.loginForm.email.change(e.target.value)
                profileStore?.loginForm.setErrors({ password: profileStore.loginForm.getErrors().password })
                profileStore?.loginForm.setErrors({ promoCode: profileStore.loginForm.getErrors().promoCode })
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
                profileStore.loginForm.password.change(e.target.value)
                profileStore?.loginForm.setErrors({ email: profileStore.loginForm.getErrors().email })
                profileStore?.loginForm.setErrors({ promoCode: profileStore.loginForm.getErrors().promoCode })
              }}
            />
          </FormRow>
          <FormRow>
            { !this.state.showPromoCodeField && <Link inForm onClick={() => this.setState({ showPromoCodeField: true })}>
              У меня еcть промокод
            </Link>}
            { this.state.showPromoCodeField && <InputText
              label='Промо-код'
              name='promo'
              value={profileStore.loginForm.promoCode.value}
              error={profileStore.loginForm.promoCode.error}
              focus={true}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                profileStore.loginForm.promoCode.change(e.target.value)
                profileStore?.loginForm.setErrors({ email: profileStore.loginForm.getErrors().email })
                profileStore?.loginForm.setErrors({ password: profileStore.loginForm.getErrors().password })
              }}
            />}
          </FormRow>
          <FormRow padding='small'>
            <ButtonText type='submit' color='blue' loading={profileStore.isValidate}>Зарегистрироваться</ButtonText>
            <ButtonText color='transparent' to='/'>Войти в сервис</ButtonText>
          </FormRow>
        </Form>
        <Segment size={3} />
        <Description size='small'>
          Нажимая на кнопку «Зарегистрироваться», вы принимаете [Лицензионное соглашение](/assets/docs/Cube_License_Agreement_Ru_30122020.pdf) и даёте согласие
          на обработку персональнах данных в соответствии с [Политикой конфиденциальности](/assets/docs/Cube_License_Agreement_Ru_30122020.pdf) КУБ.
        </Description>
      </LiteLayout>)
  }
}

export default SignupPage
