import React, {Component, MouseEventHandler, ReactNode} from 'react'
import cx from 'classnames'

import s from './CommunityInfo.module.scss'
import Image from '../Image/Image'
import SocialDataUtil from '../../utils/SocialDataUtil'
import Icon from '../Icon/Icon'
import Link from '../Link/Link'
import Text from '../Text/Text'
import Row from '../Row/Row'
import statusList from '../../interfaces/StatusList'
import Tooltip from '../Tooltip/Tooltip'

type TSize = 'm' | 'heavy'

interface IProps {
  /**
   * Картинка
   */
  image: string
  /**
   * Название
   */
  name: string
  /**
   * Ссылка
   */
  url: string
  /**
   * Описание
   */
  description?: string
  /**
   * Вложенные компоненты
   */
  children?: ReactNode
  /**
   * Размер
   */
  size?: TSize
  /**
   * Обработчик нажатия на закладку
   */
  onBookmark?: MouseEventHandler
  /**
   * Сообщество в закладках
   */
  isBookmark?: boolean
  /**
   * Состояние добавления сообщества
   */
  isLoading?: boolean
  /**
   * Статус работы с блогером
   */
  status?: string
  /**
   * Наличие комментария и его текст
   */
  comment?: string
  /**
   * Обработчик редактирования комментария
   */
  onComment?: MouseEventHandler
}

/**
 * Элемент вывода информации по сообществу
 */
export default class CommunityInfo extends Component<IProps> {
  static defaultProps = {
    size: 'm'
  }

  render (): JSX.Element {
    const { image, name, url, children, size, description, isLoading, isBookmark, onBookmark, status, comment, onComment } = this.props

    const socialType = SocialDataUtil.urlToSocialType(url || '')
    const uri = SocialDataUtil.urlToUri(url || '')

    const hasControls = onBookmark

    const classes = cx(s.element, {
      [s.sizeM]: size === 'm',
      [s.sizeHeavy]: size === 'heavy',
      [s.hasControls]: hasControls
    })

    const currentStatus = statusList.find(item => item.id === status)

    return (
      <div className={classes}>
        <div className={s.image}>
          <Image src={image} round border ratio='100%' />
        </div>

        <div className={s.container}>
          <span className={s.name}>{name}</span>
          <Link className={s.link} to={url} newTab onClick={e => e.stopPropagation()}><Icon icon={`${String(socialType).toLowerCase()}_colored`} />{uri}</Link>
          {children && <div className={s.addition}>
            {children}
            {description && <Text className={s.description} size='s' maxWidth>{description}</Text>}
            {onBookmark && (!currentStatus && !comment) && <div className={s.addNote} onClick={onComment}>
              <Icon icon='item_edit' className={s.addNoteIcon} />
              <span className={s.addNoteLink}>Добавить заметку</span>
            </div>}
            {onComment && (currentStatus || comment) &&
              <div className={s.note}>
                <div className={s.noteHeader}>
                  <span className={s.noteTitle}>Заметка</span>
                  <Icon className={s.noteIcon} icon='edit' onClick={onComment} />
                </div>
                <Row padding='s' />
                {comment &&
                  <>
                    <Text className={s.noteComment} size='s' maxWidth>{comment}</Text>
                    <Row padding='s' />
                  </>
                }
                {currentStatus &&
                  <div className={s.noteFooter}>
                    <Icon className={s.noteStatus} icon={currentStatus.icon} color={currentStatus.color}/>
                    <Text size='s'>{currentStatus.name}</Text>
                  </div>
                }
              </div>}
          </div>}
        </div>

        {hasControls && (
          <div className={s.controls}>
            {onBookmark && <div className={s.controlsContainer}>
              { isLoading
                ? <Icon className={cx(s.icon, s.activeControl)} icon='loader' />
                : <Tooltip
                  trigger={
                    <Icon
                      className={cx(s.icon, { [s.activeControl]: isBookmark })}
                      icon={isBookmark ? 'bookmarks_selected' : 'bookmarks_unselected'}
                      onClick={onBookmark}
                    />}
                  text='Добавить или удалить страницу из закладок'
                  delay
                />
              }
            </div>}
          </div>
        )}
      </div>)
  }
}
