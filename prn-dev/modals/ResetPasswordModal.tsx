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
import Image from '../elements/Image/Image'
import ButtonTagGroup from '../elements/ButtonTag/ButtonTagGroup'

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
export default class ResetPasswordModal extends Component<IProps, any> {
  constructor (props: IProps) {
    super(props)
  }

  handleOpen = async () => {
    this.props.profileStore.loginForm.clearCompleted()
    if (this.props.profileStore.isAuth) {
      this.props.profileStore.loginForm.setData({
        email: this.props.profileStore.profile.email
      })
    }
  }

  handleClose = async () => {
    RouterUtil.replaceParams(this.props.router, { modal: undefined })
  }

  render (): JSX.Element {

    const { router, profileStore } = this.props

    return (
      <ModalPopup
        open={router?.query?.modal === 'reset-password'}
        onCloseClick={this.handleClose}
        onOpen={this.handleOpen}
      >
        {!profileStore.loginForm.isCompleted && (
          <>
            <Title>Изменение пароля</Title>
            <Row padding='m'/>

            <Text size='m' semibold>
              В целях безопасности — мы не храним ваши пароли. Самым надежным способом в этом случае будет сброс пароля. Письмо с дальнейшими инструкциями мы отправим вам на почту, которую вы указали при регистрации.
            </Text>

            <Row padding='m' />
            <Row padding='xxs' />

            <Form onSubmit={() => profileStore.resetPassword()}>
              <FormRow>
                {!profileStore.isAuth && (
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
                )}
              </FormRow>
              <FormRow buttons>
                <ButtonText type='submit' size='l' disabled={profileStore.isValidate}>Сбросить пароль</ButtonText>
                {!profileStore.isAuth && <ButtonText onClick={() => RouterUtil.replaceParams(router, { modal: 'login' })} size='l' secondary>Отменить сброс</ButtonText>}
              </FormRow>
            </Form>
          </>
        )}
        {profileStore.loginForm.isCompleted && (
          <>
            <Image src={require('../public/images/emoji_mail.png')} emoji />
            <Row padding='l'/>
            <Title>Письмо отправлено</Title>
            <Row padding='m'/>
            <Text size='m' semibold>
              Мы отправили вам письмо с инструкциями по сбросу пароля. Чтобы завершить процесс — перейдите по ссылке из него.
            </Text>
            <Row padding='xs' />
            <Row padding='l'/>
            <ButtonTagGroup>
              <ButtonText size='l' onClick={this.handleClose}>Закрыть окно</ButtonText>
            </ButtonTagGroup>
          </>
        )}
      </ModalPopup>
    )
  }
}
