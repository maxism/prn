import React, {ChangeEvent, Component} from 'react'

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
import Checkbox from '../elements/Checkbox/Checkbox'
import CookieUtil from '../utils/CookieUtil'
import AppUtil from '../utils/AppUtil'
import YMUtil from '../utils/YMUtil'

interface IRouter extends SingletonRouter {
  /**
   * query
   */
  query: {
    /**
     * Название модалки
     */
    modal: string
    /**
     * Промокод
     */
    promoCode?: string
    /**
     * Ссылка на сообщество
     */
    addCommunityUrl?: string
  }
}

interface IProps {
  /**
   * router
   */
  router?: IRouter
  profileStore?: ProfileStore
}

interface IStates {
  isPromoCode: boolean
  isConfidential: boolean
}

@(withRouter as any)
@inject(Stores.PROFILE_STORE)
@observer
export default class RegistrationModal extends Component<IProps, IStates> {
  state: IStates = {
    isPromoCode: false,
    isConfidential: true
  }

  constructor (props: IProps) {
    super(props)
  }

  handleOpen = async () => {
    const { router, profileStore } = this.props

    YMUtil.reachGoal('page_registration')

    const promoCode = CookieUtil.get(null, 'promoCode') || router.query.promoCode?.toString()
    profileStore.loginForm.promoCode.change(promoCode)
    profileStore.loginForm.partnerCode.change(CookieUtil.get(null, 'partnerCode'))
    profileStore.loginForm.addCommunityUrl.change(router.query.addCommunityUrl)
  }

  render (): JSX.Element {
    const { router, profileStore } = this.props

    if (AppUtil.isClientSide && profileStore.isAuth && router?.query?.modal === 'registration') {
      if (router.query.addCommunityUrl) window.location.href = `https://prns.c-cube.ru/statistics?addCommunityType=my&addCommunity=true&addUrl=${router.query.addCommunityUrl}&token=${profileStore.token}`
      else RouterUtil.replaceParams(router, { modal: undefined })
    }

    const isViewPromoCode = this.state.isPromoCode || profileStore.loginForm.promoCode.value

    return (
      <ModalPopup
        open={router?.query?.modal === 'registration'}
        onCloseClick={() => RouterUtil.replaceParams(router, { modal: undefined })}
        onOpen={this.handleOpen}
      >
        <Title>Регистрация</Title>
        <Row padding='m'/>

        <Form onSubmit={() => !profileStore.isValidate && this.state.isConfidential && profileStore.signup()}>
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
          </FormRow>
          <FormRow>
            {!isViewPromoCode && <Checkbox label='У меня есть промо-код' onChange={() => this.setState({ isPromoCode: true })} white />}
            {isViewPromoCode && <InputText
              label='Промо-код'
              name='promoCode'
              value={profileStore.loginForm.promoCode.value}
              error={profileStore.loginForm.promoCode.error}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                profileStore?.loginForm.promoCode.change(e.target.value)
                profileStore?.loginForm.setErrors({ email: profileStore.loginForm.getErrors().promoCode })
              }}
              white
            />}
          </FormRow>
          <FormRow buttons>
              <ButtonText type='submit' size='l' disabled={profileStore.isValidate || !this.state.isConfidential} loading={profileStore.isLoading}>Зарегистрироваться</ButtonText>
              {/*<ButtonText to='https://prnapi.c-cube.ru/v5/login/elama' size='l'>Войти через eLama</ButtonText>*/}
              <Text size='s' middle>
                Уже зарегистрировались?<br />
                <Link to='?modal=login'>Войти в сервис</Link>
              </Text>
          </FormRow>
          <FormRow full>
            <Text size='xs'>Нажимая кнопку «Зарегистрироваться»:</Text>
            <Checkbox
              white
              size='s'
              checked={this.state.isConfidential}
              onChange={() => this.setState({ isConfidential: !this.state.isConfidential })}
              label={<>
                <Text size='xs'>
                  Я принимаю условия <Link to='/about/agreements' newTab>Лицензионного договора - оферты</Link> и даю своё <Link to='/about/confidential' newTab>Cогласие на обработку персональных данных</Link> КУБ
                </Text>
              </>}
            />
          </FormRow>
        </Form>
      </ModalPopup>
    )
  }
}
