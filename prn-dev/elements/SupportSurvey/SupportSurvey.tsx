import React, { Component } from 'react'

import s from './SupportSurvey.module.scss'
import TextColor from '../TextColor/TextColor'
import Title from '../Title/Title'
import ButtonText from '../ButtonText/ButtonText'
import ButtonTextGroup from '../ButtonText/ButtonTextGroup'

interface IProps {
  question: string
}

/**
 * Блок c опросом на странице статьи поддержки
 */
export default class SupportSurvey extends Component<IProps> {

  render (): JSX.Element {

    const { question } = this.props

    return (
      <div className={s.element}>

        <div className={s.question}>
          <Title size='xs'><TextColor color='black'>
            {question}
          </TextColor></Title>
        </div>

        <div className={s.buttons}>
          <ButtonTextGroup size='s'>
            <ButtonText size='m'>Да</ButtonText>
            <ButtonText size='m'>Нет</ButtonText>
          </ButtonTextGroup>
        </div>

        {/*<div className={s.question}>*/}
        {/*  <Title size='xs'><TextColor color='black'>*/}
        {/*    Спасибо за отзыв!*/}
        {/*  </TextColor></Title>*/}
        {/*</div>*/}

        {/*<div className={s.buttons}>*/}
        {/*  <Icon icon='complete' className={s.icon} />*/}
        {/*</div>*/}

      </div>
    )
  }
}
