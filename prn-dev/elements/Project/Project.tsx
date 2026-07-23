import React, { Component, MouseEventHandler } from 'react'
import cx from 'classnames'

import s from './Project.module.scss'
import Image from '../Image/Image'
import Icon from '../Icon/Icon'
import ServiceBlock from '../ServiceBlock/ServiceBlock'
import InlineTextList from '../InlineTextList/InlineTextList'
import ISocialType from '../../interfaces/ISocialType'
import NumeralUtil from '../../utils/NumeralUtil'
import Link from '../Link/Link'
import Tooltip from '../Tooltip/Tooltip'

interface IProps {
  /**
   * Ссылка
   */
  to?: string
  /**
   * Картинка
   */
  image?: string
  /**
   * Название
   */
  name?: string
  /**
   * Список соц. сетей
   */
  socials?: Array<ISocialType>
  /**
   * Количество моих сообществ в аккаунте
   */
  myCommunitiesCount?: number
  /**
   * Количество сообществ конкурентов в аккаунте
   */
  competitorCommunitiesCount?: number
  /**
   * Количество сообществ блогеров в аккаунте
   */
  influencerCommunitiesCount?: number
  /**
   * Обработчик нажатия на закладку
   */
  onBookmark?: MouseEventHandler
  /**
   * Состояние закладки
   */
  bookmarkState?: string
  /**
   * Неоплаченный проект
   */
  isNotPaid?: boolean
  /**
   * Обработчик смены тарифа
   */
  onChangePlan?: MouseEventHandler
  /**
   * Подсказка предупреждения
   */
  warning?: string
}

/**
 * Элемент-плашка проекта
 */
export default class Project extends Component<IProps> {
  private handleChangePlan = (e) => {
    if (this.props.onChangePlan) {
      e.stopPropagation()
      e.preventDefault()
      this.props.onChangePlan(e)
    }
  }

  render (): JSX.Element {
    const {
      to, image, name, socials,
      myCommunitiesCount, competitorCommunitiesCount, influencerCommunitiesCount, isNotPaid, warning
    } = this.props

    const classes = cx(s.element, {
      [s.isNotPaid]: isNotPaid
    })

    return (
      <ServiceBlock white to={to} className={classes} transparent={isNotPaid} border={isNotPaid}>
        <div className={s.container}>

          <Image className={s.image} src={image} round border ratio='100%' />

          <div className={s.info}>
            <span className={s.title}>{name}</span>

            <InlineTextList className={s.count}>
              { myCommunitiesCount && <span className={s.counter}>{NumeralUtil.format(myCommunitiesCount, '0,0', ['страница', 'страницы', 'страниц'])}</span> }
              { competitorCommunitiesCount && <span className={s.counter}>{NumeralUtil.format(competitorCommunitiesCount, '0,0', ['конкурент', 'конкурента', 'конкурентов'])}</span> }
              { influencerCommunitiesCount && <span className={s.counter}>{NumeralUtil.format(influencerCommunitiesCount, '0,0', ['блогер', 'блогера', 'блогеров'])}</span> }
            </InlineTextList>

            {!isNotPaid && warning && <div className={s.warning}>
              <span className={s.warningText}>{warning}</span>
            </div>}

            {!isNotPaid && <div className={s.social}>
              {socials.map(item =>
                <Icon key={item.toLowerCase()} className={s.socialIcon} icon={`${item.toLowerCase()}_colored`} />
              )}
            </div>}

            {isNotPaid &&
            <div className={s.message}>
              <Icon className={s.messageIcon} icon='admin' />
              <div className={s.messageContent}>
                <span className={s.contentTitle}>Достигнут лимит</span>
                <span className={s.contentDescription}><Link onClick={this.handleChangePlan} className={s.contentLink}>Измените тариф</Link> для работы с этим проектом</span>
              </div>
            </div>}
          </div>

          <div className={s.icons}>
            {/*<Tooltip trigger={<Icon className={s.iconInfo} icon='item_duplicate' />} title='Автоматические отчёты' text='Мы каждую неделю создаём отчёт по проекту и отправляем вам на почту. Изменить частоту отправки можно в настройках.' />*/}
            {/*<div className={s.divider} />*/}
            <Tooltip
              trigger={<Icon className={s.iconSettings} icon='settings' />}
              text='Открыть настройки проекта'
              delay
            />
          </div>

        </div>
      </ServiceBlock>
    )
  }
}
