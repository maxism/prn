import React, { Component } from 'react'

import Title from '../ui/elements/Title/Title'
import LiteLayout from './layouts/LiteLayout'
import Description from '../ui/elements/Description/Description'
import Segment from '../ui/elements/Segment/Segment'
import ButtonText from '../ui/elements/ButtonText/ButtonText'
import Toolbar2 from '../ui/elements/Toolbar2/Toolbar2'
import {Helmet} from 'react-helmet'

class AccessDeniedPage extends Component {
  render (): JSX.Element {
    return (
      <LiteLayout center icon='none'>
        {/* @ts-ignore */}
        <Helmet>
          <title>Доступ ограничен — КУБ Suite</title>
        </Helmet>

        <Title>Доступ ограничен</Title>
        <Segment size={3} />
        <Description size='big'>
          У вас нет доступа к этой странице. Скорее всего вам ещё не выдали права доступа или вы попали сюда по ошибке.
        </Description>
        <Segment size={3} />
        <Toolbar2>
          <ButtonText color='blue' to='/'>Вернуться на главную</ButtonText>
        </Toolbar2>
      </LiteLayout>
    )
  }
}

export default AccessDeniedPage
