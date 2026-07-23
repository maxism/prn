import React, { ChangeEventHandler, Component, MouseEventHandler } from 'react'
import cx from 'classnames'
import Icon from '../Icon/Icon'
import MetricPie from '../MetricPie/MetricPie'
import NumeralUtil from '../../../utils/NumeralUtil'
import Image from '../Image/Image'

import './InfluencersMetricsRow.scss'
import Tooltip from '../../modules/Tooltip/Tooltip'
import ISocialType from '../../../interfaces/ISocialType'
import ReactCountryFlag from 'react-country-flag'

const agesList = {
  '0_18': 'до 18',
  '18_21': '18-21',
  '21_24': '21-24',
  '24_27': '24-27',
  '27_30': '27-30',
  '30_35': '30-35',
  '35_45': '35-45',
  '45_100': 'от 45'
}

interface IProps {
  image?: string
  name?: string
  socialType?: ISocialType
  header?: boolean
  competitors?: boolean

  users?: number
  interactions?: number
  er?: number
  views?: number
  posts?: number
  score?: number

  usersDelta?: number
  interactionsDelta?: number
  erDelta?: number
  viewsDelta?: number
  postsDelta?: number

  onClick?: MouseEventHandler

  loading?: boolean
  isPaid?: boolean

  /**
   * Помечено как мое сообщества
   */
  my?: boolean
  /**
   * Сортировка по столбцу
   */
  sort?: string
  /**
   * Обработчик изменения сортировки в таблице
   */
  onSort?: ChangeEventHandler<HTMLInputElement>
  index?: number

  country?: string
  city?: string
  age?: string
  gender?: string
  pctFakeFollowers?: number
}

/**
 * Элемент MetricsRow.
 * Строка с метриками на странице общей статистики
 */

class InfluencersMetricsRow extends Component<IProps> {

  getDeltaValue = (value, deltaValue, deltaPercent = false): string => {
    if (!deltaValue) {
      return 'Нет изменений'
    }
    if (!deltaPercent && deltaValue) {
      return NumeralUtil.format(Math.abs(deltaValue), '0,0')
    }
    if (deltaPercent && deltaValue) {
      const valuePct = (value !== deltaValue) ? Math.abs(deltaValue / (value - deltaValue)) : 1
      if (valuePct < 0.01) {
        return NumeralUtil.format(Math.max(valuePct, 0.0001), '0.00%')
      }
      return NumeralUtil.format(valuePct, '0,0%')
    }

    return ''
  }

  handleSort = (e, value: string) => {
    const isDesc = this.props.sort.includes('-')
    const sort = this.props.sort.replace('-', '')

    if (sort !== value) e.target.value = `-${value}`
    else e.target.value = `${!isDesc ? '-' : ''}${value}`

    this.props.onSort(e)
  }

  render (): JSX.Element {

    const {
      image, socialType, header, competitors, name,
      users, interactions, er, views, posts, score,
      usersDelta, interactionsDelta, erDelta, viewsDelta, postsDelta,
      onClick, loading, isPaid, my, sort, index,
      country, city, age, gender, pctFakeFollowers
    } = this.props

    const sortWithoutSign = String(sort).replace('-', '')

    const classes = cx('influencers-metrics-row', {
      'influencers-metrics-row--header': header,
      'influencers-metrics-row--my': my
    })

    return (
      <div className={classes} onClick={onClick}>

        {header && <>
          <div className='influencers-metrics-row__sides'>
            <span className='influencers-metrics-row__header-title'/>
          </div>

          <div className='influencers-metrics-row__header' onClick={e => this.handleSort(e, 'usersCount')}>
            <span className='influencers-metrics-row__header-title'>Подписчики</span>
            {sortWithoutSign === 'usersCount' && <Icon className='influencers-metrics-row__header-sort' icon={sort.includes('-') ? 'sort_desc' : 'sort_asc'} />}
          </div>

          {/*<div className='influencers-metrics-row__header' onClick={e => this.handleSort(e, 'avgInteractions')}>*/}
          {/*  <span className='influencers-metrics-row__header-title'>*/}
          {/*    Реакции*/}
          {/*    <Tooltip*/}
          {/*      trigger={<Icon className='metric__icon' icon='help' />}*/}
          {/*      text='Среднее количество реакций на один пост за 2 месяца'*/}
          {/*    />*/}
          {/*  </span>*/}
          {/*  {sortWithoutSign === 'avgInteractions' && <Icon className='influencers-metrics-row__header-sort' icon={sort.includes('-') ? 'sort_desc' : 'sort_asc'} />}*/}
          {/*</div>*/}

          <div className='influencers-metrics-row__header' onClick={e => this.handleSort(e, 'avgER')}>
            <span className='influencers-metrics-row__header-title'>
              Вовлечённость
              <Tooltip
                  trigger={<Icon className='metric__icon' icon='help' />}
                  text='Средняя вовлеченность на один пост за 2 месяца'
              />
            </span>
            {sortWithoutSign === 'avgER' && <Icon className='influencers-metrics-row__header-sort' icon={sort.includes('-') ? 'sort_desc' : 'sort_asc'} />}
          </div>

          <div className='influencers-metrics-row__header' onClick={e => this.handleSort(e, 'usersCount')}>
            <span className='influencers-metrics-row__header-title'>
              Аудитория
              <Tooltip
                  trigger={<Icon className='metric__icon' icon='help' />}
                  text='Аудитория страницы'
              />
            </span>
            {sortWithoutSign === 'usersCount' && <Icon className='influencers-metrics-row__header-sort' icon={sort.includes('-') ? 'sort_desc' : 'sort_asc'} />}
          </div>

          <div className='influencers-metrics-row__header' onClick={e => this.handleSort(e, 'pctFakeFollowers')}>
            <span className='influencers-metrics-row__header-title'>
              % ботов
              <Tooltip
                  trigger={<Icon className='metric__icon' icon='help' />}
                  text='Показывает % подозрительной и неактивной аудитории'
              />
            </span>
            {sortWithoutSign === 'pctFakeFollowers' && <Icon className='influencers-metrics-row__header-sort' icon={sort.includes('-') ? 'sort_desc' : 'sort_asc'} />}
          </div>

          <div className='influencers-metrics-row__sides' onClick={e => this.handleSort(e, 'qualityScore')}>
            <span className='influencers-metrics-row__header-title'>
              Качество
              <Tooltip
                  trigger={<Icon className='metric__icon' icon='help' />}
                  text='Показатель качества страницы блогера. Значение от 0 до 100'
              />
            </span>
            {sortWithoutSign === 'qualityScore' && <Icon className='influencers-metrics-row__header-sort' icon={sort.includes('-') ? 'sort_desc' : 'sort_asc'} />}
          </div>
        </>}

        {!header && <>
        <div className='influencers-metrics-row__sides'>
          {!competitors && <Tooltip
            title={name}
            trigger={<Icon className='influencers-metrics-row__social-icon' icon={`${socialType.toLowerCase()}_colored`}/>}
          />}

          {competitors && (
            <Tooltip
              title={name}
              trigger={(
                <div className='influencers-metrics-row__avatar'>
                  <Image className='influencers-metrics-row__avatar-image' round border src={image} noImage={require('./img/no_image.svg')}/>
                  <div className='influencers-metrics-row__avatar-social'>
                    <Icon className='influencers-metrics-row__avatar-social-bg' icon={`${socialType.toLocaleLowerCase()}_bg`}/>
                    <Icon className='influencers-metrics-row__avatar-social-icon' icon={`${socialType.toLocaleLowerCase()}_colored`}/>
                  </div>
                  <div className='influencers-metrics-row__avatar-container'>
                  <span className='influencers-metrics-row__avatar-container-name'>{name}</span>
                  {index && <span className='influencers-metrics-row__avatar-container-index'>#{index}</span>}
                  </div>
                </div>
              )}
            />
          )}
        </div>

        {(loading || !isPaid) &&
          <div className='influencers-metrics-row__message'>
            {loading && isPaid && (
              <div className='influencers-metrics-row__message'>
                <Icon className='influencers-metrics-row__message-loading' icon={'loading_dots'}/>
                <span className='influencers-metrics-row__message-text'>Собираем данные по странице</span>
              </div>
              )}

            {!isPaid && (
              <>
                <div className='influencers-metrics-row__message'>
                  <Icon className='influencers-metrics-row__message-icon' icon={'paid'}/>
                  <span className='influencers-metrics-row__message-text'>Страница не оплачена</span>
                </div>
                {/*<ButtonText size='middle' color='blue'>Оплатить</ButtonText>*/}
              </>
            )}
          </div>
        }

        {!loading && isPaid && (
          <>
            <div className='influencers-metrics-row__metric'>
              <span className='influencers-metrics-row__metric-value'>{NumeralUtil.format(users, '0,0')}</span>
              {/*<div className={cx('influencers-metrics-row__delta', { 'influencers-metrics-row__delta--red': usersDelta < 0, 'influencers-metrics-row__delta--green': usersDelta > 0 })}>*/}
              {/*  <Icon className='influencers-metrics-row__delta-icon' icon={usersDelta > 0 ? 'stats_up' : 'stats_down'} />*/}
              {/*  <span className='influencers-metrics-row__delta-value'>{this.getDeltaValue(users, usersDelta)}</span>*/}
              {/*</div>*/}
            </div>

            {/*<div className='influencers-metrics-row__metric'>*/}
            {/*  <span className='influencers-metrics-row__metric-value'>{NumeralUtil.format(interactions, '0,0')}</span>*/}
            {/*  /!*<div className={cx('influencers-metrics-row__delta', { 'influencers-metrics-row__delta--red': interactionsDelta < 0, 'influencers-metrics-row__delta--green': interactionsDelta > 0 })}>*!/*/}
            {/*  /!*  <Icon className='influencers-metrics-row__delta-icon' icon={interactionsDelta > 0 ? 'stats_up' : 'stats_down'} />*!/*/}
            {/*  /!*  {interactions !== null && <span className='influencers-metrics-row__delta-value'>{this.getDeltaValue(interactions, interactionsDelta, true)}</span>}*!/*/}
            {/*  /!*</div>*!/*/}
            {/*</div>*/}

            <div className='influencers-metrics-row__metric'>
              <span className='influencers-metrics-row__metric-value'>{NumeralUtil.format(er, '0.00%')}</span>
              {/*<div className={cx('influencers-metrics-row__delta', { 'influencers-metrics-row__delta--red': erDelta < 0, 'influencers-metrics-row__delta--green': erDelta > 0 })}>*/}
              {/*  <Icon className='influencers-metrics-row__delta-icon' icon={erDelta > 0 ? 'stats_up' : 'stats_down'} />*/}
              {/*  {er !== null && <span className='influencers-metrics-row__delta-value'>{this.getDeltaValue(er, erDelta, true)}</span>}*/}
              {/*</div>*/}
            </div>

            <div className='influencers-metrics-row__metric'>
              <span className='influencers-metrics-row__metric-smallValue'>
                <ReactCountryFlag countryCode={country} style={{ fontSize: '20px' }} /> <span>{city}</span>
              </span>
              <span className='influencers-metrics-row__metric-smallValue'>
                {['m', 'mf'].includes(gender) && <Icon icon='man' />}
                {['f', 'mf'].includes(gender) && <Icon icon='woman' />}
                <span>{agesList[age]}</span>
              </span>
              {/*<div className={cx('influencers-metrics-row__delta', { 'influencers-metrics-row__delta--red': viewsDelta < 0, 'influencers-metrics-row__delta--green': viewsDelta > 0 })}>*/}
              {/*  <Icon className='influencers-metrics-row__delta-icon' icon={viewsDelta > 0 ? 'stats_up' : 'stats_down'} />*/}
              {/*  {views !== null && <span className='influencers-metrics-row__delta-value'>{this.getDeltaValue(views, viewsDelta, true)}</span>}*/}
              {/*</div>*/}
            </div>

            <div className='influencers-metrics-row__metric'>
              <span className='influencers-metrics-row__metric-value'>{NumeralUtil.format(pctFakeFollowers || null, '0%')}</span>
              {/*<div className={cx('influencers-metrics-row__delta', { 'influencers-metrics-row__delta--red': postsDelta < 0, 'influencers-metrics-row__delta--green': postsDelta > 0 })}>*/}
              {/*  <Icon className='influencers-metrics-row__delta-icon' icon={postsDelta > 0 ? 'stats_up' : 'stats_down'} />*/}
              {/*  <span className='influencers-metrics-row__delta-value'>{this.getDeltaValue(posts, postsDelta, true)}</span>*/}
              {/*</div>*/}
            </div>

            <div className='influencers-metrics-row__sides'>
              <div className='influencers-metrics-row__pie'>
                {!!score && <MetricPie score={score} small/>}

                {!score && (
                  <div className='influencers-metrics-row__pie-circle'>
                    <Icon className='influencers-metrics-row__pie-icon' icon='undetected'/>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </>}
      </div>
    )
  }
}

export default InfluencersMetricsRow
