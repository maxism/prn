import React, { Component } from 'react'
import ModalPopup from '../elements/ModalPopup/ModalPopup'
import { SingletonRouter, withRouter } from 'next/router'
import { inject, observer } from 'mobx-react'
import Title from '../elements/Title/Title'
import Row from '../elements/Row/Row'
import Text from '../elements/Text/Text'
import {Stores} from '../stores/RootStore'
import RouterUtil from '../utils/RouterUtil'
import ButtonText from '../elements/ButtonText/ButtonText'
import Image from '../elements/Image/Image'
import ButtonTagGroup from '../elements/ButtonTag/ButtonTagGroup'
import ProfileStore from '../stores/ProfileStore'

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
     * ID платежа
     */
    confirmCode: string
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
export default class ConfirmEmailModal extends Component<IProps> {
  constructor (props: IProps) {
    super(props)
  }

  handleOpen = async () => {
    const { router, profileStore } = this.props
    await profileStore.confirmEmail(router.query.confirmCode).catch(() => null)
  }

  handleClose = () => {
    RouterUtil.replaceParams(this.props.router, { modal: undefined, confirmCode: undefined })
  }

  sendEmail = () => {
    this.props.profileStore.sendConfirmEmail()
    this.handleClose()
  }

  render (): JSX.Element {
    const { router } = this.props
    const confirmedEmail = this.props.profileStore.profile?.confirmedEmail
    return (
      <ModalPopup
        open={router?.query?.modal === 'confirm-email'}
        onCloseClick={this.handleClose}
        onOpen={this.handleOpen}
      >
        {confirmedEmail && (
          <>
            <Image src={require('../public/images/emoji_mail_heart.png')} emoji />
            <Row padding='l'/>
            <Title>Почта подтверждена</Title>
            <Row padding='m'/>
            <Text size='m' semibold>
              Да, мы получили подтверждение. Всё прошло отлично, желаем продуктивного использования сервисов КУБ!
            </Text>
            <Row padding='xs' />
            <Row padding='l'/>
            <ButtonTagGroup>
              <ButtonText size='l' onClick={this.handleClose}>Отлично!</ButtonText>
            </ButtonTagGroup>
          </>
        )}

        {!confirmedEmail && (
          <>
            <Image src={require('../public/images/emoji_sad_crying.png')} emoji />
            <Row padding='l'/>
            <Title>Не получилось</Title>
            <Row padding='m'/>
            <Text size='m' semibold>
              Вашу почту подтвердить не удалось, но мы можем прислать другое письмо с подтверждением. Давайте попробуем ещё раз?
            </Text>
            <Row padding='xs' />
            <Row padding='l'/>
            <ButtonTagGroup>
              <ButtonText size='l' onClick={() => this.sendEmail()}>Прислать письмо</ButtonText>
              <ButtonText size='l' secondary onClick={() => window['carrotWrap']().open()}>Обратиться в поддержку</ButtonText>
            </ButtonTagGroup>
          </>
        )}
      </ModalPopup>
    )
  }
}
