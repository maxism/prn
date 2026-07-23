import React, { Component } from 'react'

import LiteLayout from './layouts/LiteLayout'
import Segment from '../ui/elements/Segment/Segment'
import ButtonText from '../ui/elements/ButtonText/ButtonText'
import Title from '../ui/elements/Title/Title'
import Description from '../ui/elements/Description/Description'
import ProfileStore from '../stores/ProfileStore'
import Toolbar2 from '../ui/elements/Toolbar2/Toolbar2'
import {Helmet} from 'react-helmet'

interface IProps {
  profileStore?: ProfileStore
}

class SentResetPasswordPage extends Component<IProps> {
  render (): JSX.Element {
    return (
      <LiteLayout center icon='logo_sign'>
        {/* @ts-ignore */}
        <Helmet>
          <title>Сброс пароля, Письмо отправлено — КУБ Suite</title>
        </Helmet>

        <Title>Письмо отправлено</Title>
        <Segment size={3} />
        <Description size='big'>
          Мы отправили вам письмо с инструкциями по сбросу пароля. Перейдите по ссылке из него, чтобы завершить процесс.
        </Description>
        <Segment size={3} />
        <Toolbar2>
          <ButtonText to='/' color='blue'>Вернуться на главную</ButtonText>
        </Toolbar2>
      </LiteLayout>)
  }
}

export default SentResetPasswordPage
