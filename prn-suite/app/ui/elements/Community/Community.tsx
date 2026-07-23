import React, { Component, MouseEventHandler } from 'react'
import cx from 'classnames'

import Image from '../Image/Image'
import Icon from '../Icon/Icon'
import CommunityUrl from '../../views/CommunityUrl/CommunityUrl'
import Button from '../Button/Button'

import './Community.scss'
import Checkbox from '../Checkbox/Checkbox'
import ButtonText from '../ButtonText/ButtonText'

type TStatus = 'blocked' | 'error' | 'process' | ''
type TIconStatus = 'active' | 'disabled' | 'error'

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
   * Ссылка на сообщество
   */
  url: string
  /**
   * Количество участников
   */
  usersCount?: string
  /**
   * Администратор
   */
  admin?: boolean
  /**
   * Статус сообщества
   */
  status?: TStatus
  /**
   * Страница оплачена
   */
  isCredit?: boolean
  /**
   * Страница закрыта
   */
  isClosed?: boolean
  /**
   * Страница заблокирована
   */
  isBlocked?: boolean
  /**
   * Кнопка добавления
   */
  activeBtn?: string
  /**
   * Кнопка удаления
   */
  removeBtn?: boolean
  /**
   * Кнопка настроек
   */
  settingsBtn?: boolean
  /**
   * Иконка мессенджера
   */
  messengerIcon?: TIconStatus
  /**
   * Иконка постинга
   */
  postingIcon?: TIconStatus
  /**
   * Иконка общей статистики
   */
  statsIcon?: TIconStatus
  /**
   * Иконка охватов
   */
  reachIcon?: TIconStatus
  /**
   * Текст сообщения
   */
  noteText?: string
  /**
   * Иконка сообщения
   */
  noteIcon?: string
  /**
   * Цвет иконки сообщения
   */
  noteIconColor?: string
  /**
   * Обработчик кнопки удаления
   */
  onRemove?: MouseEventHandler
  /**
   * Обработчик кнопки редактирования
   */
  onSettings?: MouseEventHandler
  /**
   * Обработчик кнопки добавления
   */
  onActive?: MouseEventHandler
  /**
   * Сообщество можно выбрать (появляется чекбокс)
   */
  checked?: boolean
  /**
   * Обработчик клика
   */
  onClick?: MouseEventHandler
  /**
   * Проверяем, используется ли элемент в CommunityPicker
   */
  small?: boolean
  /**
   * Неактивное состояние
   */
  disabled?: boolean
  /**
   * Активный элемент
   */
  active?: boolean
  /**
   * Для автоматического закрытия в Popup
   */
  autoClosePopup?: boolean
  /**
   * Состояние добавления
   */
  adding?: boolean
  /**
   * Возможность создания нового проекта заблокирована
   */
  createProjectLocked?: boolean
  /**
   * Обработчик клика на заблокированное сообщество
   */
  onClickLocked?: MouseEventHandler
  /**
   * Обработчик создания нового проекта
   */
  onCreateProject?: MouseEventHandler
}

/**
 * Элемент Community
 * Сообщество
 */
export default class Community extends Component<IProps> {
  handleActive = (e) => {
    this.props.onActive(e)
    e.stopPropagation()
  }

  render (): JSX.Element {
    const {
      image, name, url, usersCount, admin, status, checked, active, isCredit, isBlocked, isClosed,
      activeBtn, removeBtn, settingsBtn,
      messengerIcon, postingIcon, statsIcon, reachIcon,
      noteText, noteIcon, noteIconColor,
      onRemove, onSettings, onActive, onClick,
      small, disabled, adding,
      createProjectLocked, onClickLocked, onCreateProject
    } = this.props

    const icons = { blocked: 'c_error', error: 'undetected', process: 'analyze_static' }
    const statuses = { blocked: 'Страница заблокирована', error: 'Страница не найдена', process: 'Страница анализируется', process2: 'Сбор ретроспективы' }

    const classes = cx('community', {
      'community--small': small,
      'community--disabled': disabled,
      'community--active': active,
      'active': active
    })

    return (
      <div className={classes} onClick={onClick}>
        <Image className='community__image' round border src={image} noImage={require('./img/no_image.svg')} />
        <div className='community__main'>
          <div className='community__title'>
            <span className='community__name'>{name}</span>
            {admin && <span className='community__badge-blue'>Администратор</span>}
            {status && <span className='community__badge-green'>{statuses[status]}</span>}
            {isCredit && <span className='community__badge-red'>Страница не оплачена</span>}
            {isBlocked && <span className='community__badge-red'>Страница заблокирована</span>}
            {isClosed && <span className='community__badge-red'>Страница закрыта</span>}
          </div>
          <div className='community__description'>
            <CommunityUrl to={url} />
            {usersCount && <Icon className='community__usersCount-icon' icon='person' />}
            {usersCount && <span className='community__usersCount'>{usersCount}</span>}
          </div>
        </div>
        <div className='community__right'>
          {!adding && onActive && <ButtonText color='blue' size='middle' onClick={this.handleActive}>{activeBtn}</ButtonText>}
          {adding && <Icon className='community__loading' icon='loading_dots' />}

          {!adding && !onActive && (noteText || (noteIcon && noteIconColor)) &&
          <div className='community__note-container'>
            <pre className='community__note-text'>{noteText}</pre>
            <Icon className='community__note-icon' icon={noteIcon} color={noteIconColor} />
          </div>}

          {!adding && onCreateProject &&
            <>
              {!createProjectLocked &&
                <ButtonText color='blue' size='middle' onClick={(e) => confirm('В вашем проекте уже есть страница из этой социальной сети. Создать новый проект с этой страницей?') && onCreateProject(e)}>
                  Добавить в новый проект
                </ButtonText>
              }
              {createProjectLocked &&
                <div className='community__note-container' onClick={onClickLocked}>
                  <pre className='community__note-text'>Оформите подписку, чтобы<br/>добавить больше проектов</pre>
                  <Icon className='community__note-icon' icon={'locker'} color='#d9d9d9' />
                </div>
              }
            </>
          }

          {!adding && !noteText && !noteIcon &&
            <div className='community__controls'>
              {reachIcon && <Icon className={cx('community__control-icon', { [`community__control-icon--${reachIcon}`]: true })} icon='paid' />}
              {statsIcon && <Icon className={cx('community__control-icon', { [`community__control-icon--${statsIcon}`]: true })} icon='dashboard_domain' />}
              {postingIcon && <Icon className={cx('community__control-icon', { [`community__control-icon--${postingIcon}`]: true })} icon='page' />}
              {messengerIcon && <Icon className={cx('community__control-icon', { [`community__control-icon--${messengerIcon}`]: true })} icon='icon_comment' />}

              {((reachIcon || statsIcon || postingIcon || messengerIcon) && (settingsBtn || removeBtn)) && <div className='community__control-divider' />}
              {settingsBtn && <Icon onClick={e => { onSettings(e); e.stopPropagation() } } className='community__control-button' icon='gear' />}
              {removeBtn && <Icon onClick={e => { onRemove(e); e.stopPropagation() } } className='community__control-button community__control-button--attention' icon='trash' />}
            </div>}
          {checked !== undefined && <Checkbox checked={checked} />}
        </div>
      </div>)
  }
}
