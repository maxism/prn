import React, {ChangeEventHandler, Component, MouseEventHandler, ReactNode} from 'react'
import cx from 'classnames'

import s from './SettingsInfo.module.scss'
import Image from '../Image/Image'
import Icon from '../Icon/Icon'
import InlineTextList from '../InlineTextList/InlineTextList'
import Row from '../Row/Row'
import Tooltip from '../Tooltip/Tooltip'
import ButtonTagGroup from '../ButtonTag/ButtonTagGroup'
import ButtonTag from '../ButtonTag/ButtonTag'
import Uuid from '../Uuid/Uuid'
import APIClient from '../../lib/APIClient'
import ISocialType from '../../interfaces/ISocialType'
import NumeralUtil from '../../utils/NumeralUtil'
import InlineTextListItem from '../InlineTextList/InlineTextListItem'
import DateUtil from '../../utils/DateUtil'
import moment from 'moment'
import {IPlan, PlanStatus} from '../../stores/ProfileStore'

type IType = 'user' | 'project'

interface IProps {
  /**
   * Токен пользователя для загрузки картинки
   */
  token: string
  /**
   * Определение сущности (пользователь/проект)
   */
  type: IType
  /**
   * Название
   */
  name: string
  /**
   * Картинка
   */
  image: string
  /**
   * Вложенные компоненты
   */
  children?: ReactNode
  /**
   * Соц.сети проекта
   */
  socials?: Array<ISocialType>
  /**
   * Количество проектов у пользователя
   */
  projectsCount?: number
  /**
   * Количество сообществ пользователя
   */
  myCommunitiesCount?: number
  /**
   * Количество сообществ конкурентов
   */
  competitorCommunitiesCount?: number
  /**
   * Количество сообществ блогеров
   */
  influencerCommunitiesCount?: number
  /**
   * Тариф
   */
  plan?: IPlan
  /**
   * Изменение картинки
   */
  onChange?: ChangeEventHandler<HTMLInputElement>
  /**
   * Удаление проекта
   */
  onDelete?: MouseEventHandler
  /**
   * Выход из аккаунта
   */
  onLogout?: MouseEventHandler
  /**
   * Теги
   */
  tags?: Array<string>
  /**
   * Проект не оплачено
   */
  isNotPaid?: boolean
  /**
   * Подсказка предупреждения
   */
  warning?: string
  /**
   * Обработчик выбора метода оплаты
   */
  onSelectPaymentMethod?: MouseEventHandler
}

/**
 * Информация о пользователе или проекте в настройках
 */
export default class SettingsInfo extends Component<IProps> {
  state = {
    uuid: Uuid()
  }

  handleChange = async (e) => {
    const { token, onChange } = this.props
    const imageUrl = await APIClient.uploadToCDN(e.target.files[0], token)

    e.target = {
      value: imageUrl
    }
    if (onChange) onChange(e)
  }

  renderPaymentStatus = (): JSX.Element => {
    const { onSelectPaymentMethod } = this.props
    const { planStatus, activeToDate, isCardAttached, current, next } = this.props.plan

    if (!planStatus || planStatus === PlanStatus.PAID || planStatus === PlanStatus.PREPAY) {
      if (current.name === next.name) {
        let text = !isCardAttached ? 'Карта не привязана.\n' : ''
        text += `Следующий платёж ${DateUtil.format(activeToDate, 'DD.MM.YYYY')}`
        return <span className={s.planText}>{text}</span>
      } else {
        const text = `Ваш тариф будет изменён на ${next.name.toUpperCase()} ${DateUtil.format(activeToDate, 'DD.MM.YYYY')}`
        return <span className={s.planText}>{text}</span>
      }
    }

    if (planStatus === PlanStatus.PAY || planStatus === PlanStatus.PAY_7) {
      const date = DateUtil.format(moment(activeToDate).add(planStatus === PlanStatus.PAY ? 7 : 14, 'days').toDate(), 'D MMMM Y')
      return (
        <>
          <span className={s.planText}>{`Проблема с оплатой. Следующая попытка ${date}. Проверьте способ оплаты.`}</span>
          <Tooltip trigger={<Icon className={s.planHelp} icon='help' />} title='Подписка не оплачена' text={`При продлении подписки на следующий месяц возникли трудности. Мы попробуем произвести оплату повторно ${date}.`} button='Способы оплаты' buttonOnClick={onSelectPaymentMethod} />
        </>)
    }

    if (planStatus === PlanStatus.PAY_14 || planStatus === PlanStatus.PAY_15) {
      const date = DateUtil.format(moment(activeToDate).add(15, 'days').toDate())
      return (
        <>
          <span className={s.planText}>{`Проблема с оплатой. Проверьте способ оплаты.`}</span>
          <Tooltip trigger={<Icon className={s.planHelp} icon='help' />} title='Подписка не оплачена' text={`При продлении подписки на следующий месяц возникли трудности. С ${date} будет дейтсовать бесплатный тариф`} button='Способы оплаты' buttonOnClick={onSelectPaymentMethod} />
        </>
      )
    }
  }

  renderUser = (): JSX.Element => {
    const {
      name, plan, children, onLogout,
      projectsCount, myCommunitiesCount, competitorCommunitiesCount, influencerCommunitiesCount
    } = this.props

    const { isCardAttached, isPlanValid, current } = plan

    const classes = cx(s, {
      [s.planNameGreen]: isCardAttached && isPlanValid,
      [s.planNameOrange]: !isCardAttached,
      [s.planNameRed]: !isPlanValid
    })

    return (
      <>
        <div className={s.container}>
          <span className={s.title}>Пользователь</span>
          <span className={s.name}>{name}</span>
          <div className={s.addition}>

            <InlineTextList semibold hide>
              { projectsCount && <InlineTextListItem>{NumeralUtil.format(projectsCount, '0,0', ['проект', 'проекта', 'проектов'])}</InlineTextListItem> }
              { myCommunitiesCount && <InlineTextListItem>{NumeralUtil.format(myCommunitiesCount, '0,0', ['страница', 'страницы', 'страниц'])}</InlineTextListItem> }
              { competitorCommunitiesCount && <InlineTextListItem>{NumeralUtil.format(competitorCommunitiesCount, '0,0', ['конкурент', 'конкурента', 'конкурентов'])}</InlineTextListItem> }
              { influencerCommunitiesCount && <InlineTextListItem>{NumeralUtil.format(influencerCommunitiesCount, '0,0', ['блогер', 'блогера', 'блогеров'])}</InlineTextListItem> }
            </InlineTextList>

            <Row padding='m' />

            <div className={s.planContainer}>
              <div className={s.planInfoContainer}>
                <span className={classes}>{current.name.toUpperCase()}</span>
                {current.name !== 'free' && <div className={s.planDivider} />}
              </div>
              {current.name !== 'free' && <div className={s.planTextContainer}>{ this.renderPaymentStatus() }</div>}
            </div>

            <Row padding='m' />

            {children}

          </div>
        </div>

        <div className={s.controls}>
          <div className={s.controlsContainer}>
            <Icon className={s.icon} icon='logout' onClick={onLogout}/><span className={s.label}>Выход</span>
          </div>
        </div>
      </>)
  }

  renderProject = (): JSX.Element => {
    const {
      name, children, socials, onDelete,
      myCommunitiesCount, competitorCommunitiesCount, influencerCommunitiesCount, tags, isNotPaid, warning
    } = this.props

    return (
      <>
        <div className={s.container}>
          {!isNotPaid && !warning && <span className={s.title}>Проект</span>}
          {isNotPaid && <div className={s.isNotPaid}><span className={s.isNotPaidText}>Доступ к проекту ограничен</span></div>}
          {!isNotPaid && warning && <div className={s.warning}><span className={s.warningText}>{warning}</span></div>}
          <span className={s.name}>{name}</span>
          <div className={s.addition}>

            <InlineTextList semibold hide>
              { myCommunitiesCount && <InlineTextListItem>{NumeralUtil.format(myCommunitiesCount, '0,0', ['страница', 'страницы', 'страниц'])}</InlineTextListItem> }
              { competitorCommunitiesCount && <InlineTextListItem>{NumeralUtil.format(competitorCommunitiesCount, '0,0', ['конкурент', 'конкурента', 'конкурентов'])}</InlineTextListItem> }
              { influencerCommunitiesCount && <InlineTextListItem>{NumeralUtil.format(influencerCommunitiesCount, '0,0', ['блогер', 'блогера', 'блогеров'])}</InlineTextListItem> }
            </InlineTextList>

            <Row padding='m' />

            <div className={s.socialContainer}>
              {socials.map(item =>
                <Icon
                  key={item.toLowerCase()}
                  className={s.socialIcon}
                  icon={`${item.toLowerCase()}_colored`}
                />)
              }
            </div>

            <Row padding='m' />

            <ButtonTagGroup className={s.projectTags}>
              {tags?.map(tag => <ButtonTag key={tag}>{tag}</ButtonTag>)}
            </ButtonTagGroup>

            {children}

          </div>
        </div>

        <div className={s.controls}>
          {onDelete && <div className={s.controlsContainer} onClick={onDelete}><Icon className={s.icon} icon='delete' /><span className={s.label}>Удалить</span></div>}
        </div>
      </>)
  }

  render (): JSX.Element {

    const { image, type } = this.props

    const classes = cx(s.element, {
      [s.user]: type === 'user',
      [s.project]: type === 'project'
    })

    return (
      <div className={classes}>
        <label className={s.image} htmlFor={this.state.uuid}>
          <Image src={image} round border ratio='100%'>
            <div className={s.editImage}>
              <Icon className={s.editIcon} icon='edit' />
              <span className={s.editText}>Изменить</span>
            </div>
          </Image>
          <input
            id={this.state.uuid}
            type='file'
            accept='.jpg, .jpeg, .png'
            onChange={this.handleChange}
            className={s.hideImage}
          />
        </label>

        { type === 'user' && this.renderUser() }
        { type === 'project' && this.renderProject() }

      </div>
    )
  }
}
