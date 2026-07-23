import React, { Component, ReactNode } from 'react'
import Link from 'next/link'
import cx from 'classnames'

import { IBlogTag } from '../../stores/BlogStore'
import Title from '../Title/Title'
import ButtonTag from '../ButtonTag/ButtonTag'
import ButtonTagGroup from '../ButtonTag/ButtonTagGroup'

import s from './Article.module.scss'
import Image from '../Image/Image'
import Text from '../Text/Text'

interface IProps {
  children?: ReactNode
  /**
   * Картинка
   */
  image?: string
  /**
   * Заголовоу
   */
  title?: string
  /**
   * Текст
   */
  preview?: string
  /**
   * Ссылка кнопки
   */
  to?: string
  /**
   * Теги
   */
  tags?: Array<IBlogTag>
  /**
   * Светлый фон
   */
  white?: boolean
  /**
   * Пост - черновик
   */
  isDraft?: boolean
}

/**
 * Элемент Segment
 */
export default class Article extends Component<IProps> {
  static defaultProps = {
    tags: []
  }
  render (): JSX.Element {
    const { to, title, preview, image, tags, white, isDraft } = this.props

    const classes = cx(s.element, {
      [s.white]: white
    })

    return (
      <Link href={to}>
        <a className={classes} href={to}>
          <div className={s.container}>
            <Image className={s.image} src={image} alt={title} border ratio='50%' />
            <Title size='s' className={s.title}>{title}</Title>
            <Text size='s' className={s.text}>{preview}</Text>
            <ButtonTagGroup className={s.tags} size='s'>
              {isDraft && <ButtonTag size='s' color='red'>Черновик</ButtonTag>}
              {tags.map(tag => <ButtonTag color={white ? 'grey' : 'dark'} key={tag.tagID} icon={tag.icon} to={`/blog/tag/${tag.slug || tag.tagID}`} size='s'>{tag.name}</ButtonTag>)}
            </ButtonTagGroup>
          </div>
        </a>
      </Link>
    )
  }
}
