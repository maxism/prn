import React, {Component, MouseEventHandler} from 'react'
import cx from 'classnames'

import s from './Community.module.scss'
import Image from '../Image/Image'
import Icon from '../Icon/Icon'
import ServiceBlock from '../ServiceBlock/ServiceBlock'
import QualityScore from '../QualityScore/QualityScore'
import NumeralUtil from '../../utils/NumeralUtil'
import SocialDataUtil from '../../utils/SocialDataUtil'
import Link from '../Link/Link'
import statusList from '../../interfaces/StatusList'
import PopupButton from '../Popup/PopupButton'
import Popup from '../Popup/Popup'
import CommunityScore from '../CommunityScore/CommunityScore'
import Tooltip from '../Tooltip/Tooltip'

interface IProps {
  /**
   * Картинка
   */
  image?: string
  /**
   * Название
   */
  name?: string
  /**
   * Ссылка под названием
   */
  url?: string
  /**
   * Отключен переход по ссылке
   */
  disabledUrl?: boolean
  /**
   * Ссылка на детальную страницу
   */
  to?: string
  /**
   * Открыть в новом окне
   */
  _blank?: boolean
  /**
   * Значение КУБ Score
   */
  qualityScore?: number
  /**
   * Значение Community Score
   */
  communityScore?: number
  /**
   * Количество участников
   */
  usersCount?: number
  /**
   * Средняя вовлеченность
   */
  avgER?: number
  /**
   * Средняя количество реакций
   */
  avgInteractions?: number
  /**
   * Статус сообщества в комментарие
   */
  status?: string
  /**
   * Обработчик клика
   */
  onClick?: MouseEventHandler
  /**
   * Комментарий
   */
  comment?: string
  /**
   * Редактирование комментария
   */
  onComment?: MouseEventHandler
  /**
   * Обработчик нажатия на закладку
   */
  onBookmark?: MouseEventHandler
  /**
   * Сообщество в закладках
   */
  isBookmark?: boolean
  /**
   * Кнопка удаления
   */
  onRemove?: MouseEventHandler
  /**
   * Добавление своего сообщества
   */
  onAddMyCommunity?: MouseEventHandler
  /**
   * Добавление своего сообщества
   */
  onAddCompetitor?: MouseEventHandler
  /**
   * Добавление блогера
   */
  onAddInfluencer?: MouseEventHandler
  /**
   * Сообщество не оплачено
   */
  isNotPaid?: boolean
  /**
   * Сообщество добавлено
   */
  isAdded?: boolean
  /**
   * Состояние добавления сообщества
   */
  isLoading?: boolean
  /**
   * Обработчик смены тарифа
   */
  onChangePlan?: MouseEventHandler
}

interface IStates {
  showAddPopup?: boolean
}

/**
 * Элемент-плашка сообщества
 */
export default class Community extends Component<IProps, IStates> {
  state: IStates = {
    showAddPopup: false
  }

  private handleComment = e => {
    if (this.props.onComment) {
      e.stopPropagation()
      e.preventDefault()
      this.props.onComment(e)
    }
  }

  private handleBookmark = e => {
    if (this.props.onBookmark) {
      e.stopPropagation()
      e.preventDefault()
      this.props.onBookmark(e)
    }
  }

  private handleRemove = e => {
    if (this.props.onRemove) {
      e.stopPropagation()
      e.preventDefault()
      this.props.onRemove(e)
    }
  }

  private handleChangePlan = e => {
    if (this.props.onChangePlan) {
      e.stopPropagation()
      e.preventDefault()
      this.props.onChangePlan(e)
    }
  }

  private handleClick = e => {
    const { onClick, onAddMyCommunity, onAddCompetitor, onAddInfluencer } = this.props
    if (onClick) onClick(e)
    else if (onAddMyCommunity || onAddCompetitor || onAddInfluencer) this.setState({ showAddPopup: true })
  }

  render (): JSX.Element {
    const {
      image, name, url, disabledUrl, to, _blank, qualityScore, communityScore, usersCount,
      avgER, avgInteractions, status, comment, onBookmark, isBookmark, onRemove, onComment,
      onAddMyCommunity, onAddCompetitor, onAddInfluencer, isAdded, isLoading, isNotPaid } = this.props

    const socialType = SocialDataUtil.urlToSocialType(url || '') || ''
    const uri = SocialDataUtil.urlToUri(url || '')

    const currentStatus = statusList.find(x => x.id === status)

    const classes = cx(s.element,{
      [s.isNotPaid]: isNotPaid
    })

    return (
      <ServiceBlock white to={to} _blank={_blank} onClick={this.handleClick} className={classes} transparent={isNotPaid} border={isNotPaid}>
        <div className={s.content}>
          <div className={s.container}>

            <div className={s.blockInfo}>
              <Image className={s.image} src={image} round border />
              <div className={s.info}>
                <span className={s.title}>{name}</span>
                <Link className={cx(s.social, { [s.disabledUrl]: disabledUrl })} to={!disabledUrl ? url : ''} newTab onClick={e => !disabledUrl && e.stopPropagation()}>
                  {!isNotPaid && <Icon className={s.socialIcon} icon={`${socialType.toLowerCase()}_colored`} />}
                  {isNotPaid && <Icon className={cx(s.socialIcon, s.socialIconBW)} icon={`${socialType.toLowerCase()}`} />}
                  <span className={s.link}>{uri}</span>
                </Link>
              </div>
            </div>

            <div className={s.blockMetrics}>
              <div className={s.group}>
                {!isNotPaid && communityScore !== undefined && (
                  <div className={s.metric}>
                    <div className={s.value}>
                      <CommunityScore className={s.communityScore} score={communityScore}/>
                      <span className={s.metricValue}>{NumeralUtil.format(communityScore, '0%') || '—'}</span>
                    </div>
                    <span className={s.description}>Community Score</span>
                  </div>
                )}

                {!isNotPaid && qualityScore !== undefined && (
                  <div className={s.metric}>
                    <div className={s.value}>
                      <QualityScore className={s.qualityScore} score={qualityScore}/>
                      <span className={s.metricValue}>{NumeralUtil.format(qualityScore, '0%') || '—'}</span>
                    </div>
                    <span className={s.description}>КУБ Score</span>
                  </div>
                )}

                {!isNotPaid && <div className={s.metric}>
                  <div className={s.value}>
                    <span className={s.metricValue}>{NumeralUtil.format(usersCount, '0.[0a]') || '—'}</span>
                  </div>
                  <span className={s.description}>Подписчики</span>
                </div>}

                {!isNotPaid && avgER !== undefined && (
                  <div className={s.metric}>
                    <div className={s.value}>
                      <span className={s.metricValue}>{NumeralUtil.format(avgER, '0.00%') || '—'}</span>
                    </div>
                    <span className={s.description}>Вовлеченность</span>
                  </div>
                )}

                {!isNotPaid && avgInteractions !== undefined && (
                  <div className={s.metric}>
                    <div className={s.value}>
                      <span className={s.metricValue}>{NumeralUtil.format(avgInteractions, '0.[0a]') || '—'}</span>
                    </div>
                    <span className={s.description}>Реакции</span>
                  </div>
                )}

                {isNotPaid && <div className={s.message}>
                  <Icon className={s.messageIcon} icon='admin' />
                  <div className={s.messageContent}>
                    <span className={s.contentTitle}>Достигнут лимит</span>
                    <span className={s.contentDescription}><Link onClick={this.handleChangePlan} className={s.contentLink}>Измените тариф</Link> для работы с этой страницей</span>
                  </div>
                </div>}

              </div>
            </div>

            <div className={s.blockIcons}>
              {onComment && !(status || comment) &&
                <Tooltip
                  trigger={<Icon className={s.icon} icon='item_edit' onClick={this.handleComment} />}
                  text='Добавить заметку и статус'
                  delay
                />}
              {!isLoading && !isAdded && onBookmark &&
                <Tooltip
                  trigger={<Icon className={cx(s.icon, { [s.bookmarkActive]: isBookmark })} icon={isBookmark ? 'bookmarks_selected' : 'bookmarks_unselected'} onClick={this.handleBookmark} />}
                  text='Добавить или удалить страницу из закладок'
                  delay
                />}
              {!isLoading && !isAdded && (onAddMyCommunity || onAddCompetitor || onAddInfluencer) && (
                <Popup
                  trigger={<Icon className={cx(s.icon, s.addIcon)} icon='plus'/>}
                  maxHeight={390}
                  size='s'
                  open={this.state.showAddPopup}
                  onOpen={() => this.setState({ showAddPopup: true })}
                  onClose={() => this.setState({ showAddPopup: false })}
                >
                  {onAddMyCommunity && <PopupButton onClick={onAddMyCommunity} autoClosePopup>Моя страница</PopupButton>}
                  {onAddCompetitor && <PopupButton onClick={onAddCompetitor} autoClosePopup>Конкурент</PopupButton>}
                  {onAddInfluencer && <PopupButton onClick={onAddInfluencer} autoClosePopup>Блогер</PopupButton>}
                </Popup>
              )}
              {!isLoading && isAdded && <Icon className={s.isAdded} icon='complete' />}
              {isLoading && <Icon className={s.isLoading} icon='loader' />}

              {onRemove &&
                <Tooltip
                  trigger={<Icon className={s.icon} icon='delete' onClick={this.handleRemove} />}
                  text='Удалить страницу'
                  delay
                  red
                />}
            </div>
          </div>
        </div>

        {(currentStatus || comment) && (
          <div className={s.bottom}>
            <Icon className={s.statusIcon} icon={currentStatus?.icon} color={currentStatus?.color}/>
            <span className={s.bottomText}>{comment}</span>
            <Tooltip
              trigger={<Icon className={s.editIcon} icon='edit' onClick={this.handleComment} />}
              text='Редактировать заметку и статус'
              delay
            />
          </div>
        )}
      </ServiceBlock>
    )
  }
}
