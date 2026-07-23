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
    recoveryCode: string
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
export default class ChangePasswordModal extends Component<IProps, any> {
  constructor (props: IProps) {
    super(props)
  }

  handleOpen = async () => {
    const { router } = this.props
    this.props.profileStore.passwordForm.clearCompleted()
    this.props.profileStore.passwordForm.setData({
      recovery_hash: String(router.query.recoveryCode)
    })
  }

  handleClose = async () => {
    RouterUtil.replaceParams(this.props.router, { modal: undefined, recoveryCode: undefined })
  }

  render (): JSX.Element {
    const { router, profileStore } = this.props

    return (
      <ModalPopup
        open={router?.query?.modal === 'change-password'}
        onCloseClick={this.handleClose}
        onOpen={this.handleOpen}
      >
        {!profileStore.passwordForm.isCompleted && (
          <>
            <Title>Новый пароль</Title>
            <Row padding='m'/>
            <Text size='m' semibold>
              Вы запросили сброс пароля. Теперь вам нужно придумать новый и написать его в двух полях — чтобы исключить ошибки и лучше запомнить.
            </Text>

            <Row padding='xl' />

            <Form onSubmit={() => profileStore.setPassword()}>
              <FormRow>
                <InputText
                  label='Новый пароль'
                  name='password'
                  type='password'
                  value={profileStore.passwordForm.password.value}
                  error={profileStore.passwordForm.password.error}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    profileStore?.passwordForm.password.change(e.target.value)
                    profileStore?.passwordForm.setErrors({ password: profileStore.passwordForm.getErrors().password })
                  }}
                  white
                />
                <InputText
                  label='Повторите новый пароль'
                  name='password'
                  type='password'
                  value={profileStore.passwordForm.password2.value}
                  error={profileStore.passwordForm.password2.error}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    profileStore?.passwordForm.password2.change(e.target.value)
                    profileStore?.passwordForm.setErrors({ password2: profileStore.passwordForm.getErrors().password2 })
                  }}
                  white
                />
              </FormRow>

              <Row padding='m' />
              <Row padding='xxs' />

              <FormRow buttons>
                <ButtonText type='submit' size='l' disabled={profileStore.isValidate}>Сохранить новый пароль</ButtonText>
              </FormRow>
            </Form>
          </>
        )}
        {profileStore.passwordForm.isCompleted && (
          <>
            <Image src={require('../public/images/emoji_okay.png')} emoji />
            <Row padding='l'/>
            <Title>Новый пароль установлен</Title>
            <Row padding='m'/>
            <Text size='m' semibold>
              Пароль успешно изменен.
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
