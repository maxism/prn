import React, { Component } from 'react'
import ButtonText from '../ui/elements/ButtonText/ButtonText'
import Description from '../ui/elements/Description/Description'

import Segment from '../ui/elements/Segment/Segment'
import LiteLayout from './layouts/LiteLayout'
import Title from '../ui/elements/Title/Title'
import Toolbar2 from '../ui/elements/Toolbar2/Toolbar2'
import {Helmet} from 'react-helmet'

class NotFoundPage extends Component  {
  render (): JSX.Element {
    return (
      <LiteLayout center icon='attention'>
        {/* @ts-ignore */}
        <Helmet>
          <title>Страница не найдена — КУБ Suite</title>
        </Helmet>

        <Title>Страница не найдена</Title>
        <Segment size={3} />
        <Description size='big'>
          Ой, кажется вы не туда попали. Такой страницы либо не существует, либо произошла какая-то дурацкая ошибка. В любом случае — не стоит паниковать, просто вернитесь на главную страницу и продолжайте пользоваться сервисом :)
        </Description>
        <Segment size={3} />
        <Toolbar2>
          <ButtonText to='/' color='blue'>Окей, всё понятно!</ButtonText>
        </Toolbar2>
      </LiteLayout>
    )
  }
}

export default NotFoundPage
