import React, { Component } from 'react'

import s from './SimilarPage.module.scss'
import Image from '../Image/Image'
import Icon from '../Icon/Icon'
import Text from '../Text/Text'
import Title from '../Title/Title'

interface IProps {
  /**
   * Ссылка на изображение
   */
  image: string
  /**
   * Название страницы
   */
  title: string
  /**
   * Количество подписчиков
   */
  number: string
}

/**
 * Элемент SimilarPage
 * Выводит похожие страницы в рейтинге
 */
export default class SimilarPage extends Component<IProps> {

  render (): JSX.Element {
    let { image, title, number } = this.props

    return (
      <div className={s.element}>
        <Image className={s.image} round border ratio='100%' src={image} />
        <Title className={s.title} size='xs' center>{title}</Title>
        <div className={s.container}>
          <Icon className={s.icon} icon='user' />
          <Text size='m' semibold>{number}</Text>
        </div>
      </div>
    )
  }
}
