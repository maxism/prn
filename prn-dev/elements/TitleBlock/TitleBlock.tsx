import React, { Component, MouseEventHandler, ReactNode } from 'react'

import s from './TitleBlock.module.scss'
import Title from '../Title/Title'
import Text from '../Text/Text'
import ButtonText from '../ButtonText/ButtonText'
import Row from '../Row/Row'

interface IProps {
  /**
   * Заголовок
   */
  title: string
  /**
   * Сопроводительный текст
   */
  text?: string
  /**
   * Надпись на кнопке
   */
  button?: string
  /**
   * Обработчик клика по кнопке
   */
  onClick?: MouseEventHandler
  /**
   * Контрол
   */
  control?: ReactNode
}

class TitleBlock extends Component<IProps> {
  render (): ReactNode {
    const { title, text, button, onClick, control } = this.props

    return (
      <div className={s.element}>
        <div className={s.container}>
          <Title>{title}</Title>
          {text && <>
            <Row padding='m' />
            <Text semibold>{text}</Text>
          </>}
        </div>

        {button && onClick && <div className={s.controls}><ButtonText size='l' onClick={onClick}>{button}</ButtonText></div>}
        {control && <div className={s.controls}>{control}</div>}
      </div>
    )
  }
}

export default TitleBlock
