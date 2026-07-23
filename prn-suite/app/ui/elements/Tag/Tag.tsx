import React, {Component, MouseEventHandler} from 'react'
import cx from 'classnames'

import { IIcon } from '../Icon/Icons'
import Icon from '../Icon/Icon'

import './Tag.scss'
import NumeralUtil from '../../../utils/NumeralUtil'
import Image from '../Image/Image'

interface IProps {
  children: string | number
  indexGrade?: number
  icon?: string
  image?: string
  onClick?: MouseEventHandler
}

/**
 * 'Элемент Tag - Метка поста
 */
class Tag extends Component<IProps> {
  render (): JSX.Element {
    let { children, indexGrade, image, onClick } = this.props

    let grade = null
    let mark = null
    let color = null
    let icon: IIcon = null

    if (children === 'deleted') {
      color = '#FF0000'
      mark = true
      children = 'Удален'
    }

    if (children === 'ad') {
      color = '#1877f2'
      mark = true
      children = 'Реклама'
    }

    if (children === 'd') {
      icon = 'grade_d'
      color = '#BEBEBE'
      grade = true
      children = 'Худший пост'
    }

    if (children === 'c') {
      icon = 'grade_c'
      color = '#FF0000'
      grade = true
      children = 'Плохой пост'
    }

    if (children === 'b') {
      icon = 'grade_b'
      color = '#E46F00'
      grade = true
      children = 'Обычный пост'
    }

    if (children === 'a') {
      icon = 'grade_a'
      color = '#00AD00'
      grade = true
      children = 'Хороший пост'
    }

    if (children === 'a_plus') {
      icon = 'grade_a_plus'
      color = '#00DA00'
      grade = true
      children = 'Лучший пост'
    }

    if (children === 'photo') {
      color = '#ff9f00'
      children = 'Фото'
    }

    if (children === 'REELS') {
      color = '#ff9f00'
      children = 'REELS'
    }

    if (children === 'SHORTS') {
      color = '#ff9f00'
      children = 'SHORTS'
    }

    if (children === 'video') {
      color = '#ff9f00'
      children = 'Видео'
    }

    if (children === 'carousel_album') {
      color = '#ff9f00'
      children = 'Карусель'
    }

    if (children === 'gif') {
      color = '#ff9f00'
      children = 'GIF'
    }

    if (children === 'text') {
      color = '#ff9f00'
      children = 'Текст'
    }

    if (children === 'copy') {
      color = '#ff9f00'
      children = 'Репост'
    }

    if (children === 'link_external') {
      color = '#ff9f00'
      children = 'Сниппет'
    }

    if (children === 'link_internal') {
      color = '#ff9f00'
      children = 'Внутренняя ссылка'
    }

    if (children === 'cover_photo') {
      color = '#ff9f00'
      children = 'Обложка'
    }

    if (children === 'profile_media') {
      color = '#ff9f00'
      children = 'Изменение профиля'
    }

    if (children === 'album') {
      color = '#ff9f00'
      children = 'Альбом'
    }

    if (children === 'link') {
      color = '#ff9f00'
      children = 'Ссылка'
    }

    if (children === 'status') {
      color = '#ff9f00'
      children = 'Статус'
    }

    if (children === 'poll') {
      color = '#ff9f00'
      children = 'Голосование'
    }

    if (children === 'text_small') {
      color = '#ff9f00'
      children = 'Короткий текст'
    }

    if (children === 'text_medium') {
      color = '#ff9f00'
      children = 'Средний текст'
    }

    if (children === 'text_big') {
      color = '#ff9f00'
      children = 'Длинный текст'
    }

    if (children === 'multi_share') {
      color = '#ff9f00'
      children = 'Кольцевая галерея'
    }

    // todo: Добавить все типы постов и иконки к типам

    const classes = cx('tag', {
      'tag--grade': grade,
      'tag--mark': mark,
      'tag--link': onClick
    })

    return (
      <div className={classes} style={{ backgroundColor: (grade || mark) && color }} onClick={onClick}>
        <div className='tag__main'>
          {icon && <Icon className='tag__icon' icon={icon} />}
          {image && <Image className='tag__image' src={image} noImage={require('./img/no_image.svg')} />}
          <span className='tag__text'>{children}</span>
          {grade && <>
            <span className='tag__splitter'/>
            <span className='tag__grade_index'>{NumeralUtil.format(indexGrade, '+0.00')}x</span>
          </>}
        </div>
      </div>)
  }
}

export default Tag
