import React, { ChangeEventHandler, Component, MouseEventHandler } from 'react'
import cx from 'classnames'
import Icon from '../Icon/Icon'
import MetricPie from '../MetricPie/MetricPie'
import NumeralUtil from '../../../utils/NumeralUtil'
import Image from '../Image/Image'

import './MetricsRow.scss'
import Tooltip from '../../modules/Tooltip/Tooltip'
import ButtonText from '../ButtonText/ButtonText'
import ISocialType from '../../../interfaces/ISocialType'
import SocialDataUtil from '../../../utils/SocialDataUtil'

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
}

/**
 * Элемент MetricsRow.
 * Строка с метриками на странице общей статистики
 */

class MetricsRow extends Component<IProps> {

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
      onClick, loading, isPaid, my, sort, index
    } = this.props

    const sortWithoutSign = String(sort).replace('-', '')

    const classes = cx('metrics-row', {
      'metrics-row--header': header,
      'metrics-row--my': my
    })

    return (
      <div className={classes} onClick={onClick}>

        {header && <>
          <div className='metrics-row__sides'>
            <span className='metrics-row__header-title'/>
          </div>

          <div className='metrics-row__header' onClick={e => this.handleSort(e, 'usersCount')}>
            <span className='metrics-row__header-title'>Подписчики</span>
            {sortWithoutSign === 'usersCount' && <Icon className='metrics-row__header-sort' icon={sort.includes('-') ? 'sort_desc' : 'sort_asc'} />}
          </div>

          <div className='metrics-row__header' onClick={e => this.handleSort(e, 'interactions')}>
            <span className='metrics-row__header-title'>Реакции</span>
            {sortWithoutSign === 'interactions' && <Icon className='metrics-row__header-sort' icon={sort.includes('-') ? 'sort_desc' : 'sort_asc'} />}
          </div>

          <div className='metrics-row__header' onClick={e => this.handleSort(e, 'er')}>
            <span className='metrics-row__header-title'>Вовлечённость</span>
            {sortWithoutSign === 'er' && <Icon className='metrics-row__header-sort' icon={sort.includes('-') ? 'sort_desc' : 'sort_asc'} />}
          </div>

          <div className='metrics-row__header' onClick={e => this.handleSort(e, 'views')}>
            <span className='metrics-row__header-title'>Просмотры</span>
            {sortWithoutSign === 'views' && <Icon className='metrics-row__header-sort' icon={sort.includes('-') ? 'sort_desc' : 'sort_asc'} />}
          </div>

          <div className='metrics-row__header' onClick={e => this.handleSort(e, 'posts')}>
            <span className='metrics-row__header-title'>Посты</span>
            {sortWithoutSign === 'posts' && <Icon className='metrics-row__header-sort' icon={sort.includes('-') ? 'sort_desc' : 'sort_asc'} />}
          </div>

          <div className='metrics-row__sides' onClick={e => this.handleSort(e, 'score')}>
            <span className='metrics-row__header-title'>Score</span>
            {sortWithoutSign === 'score' && <Icon className='metrics-row__header-sort' icon={sort.includes('-') ? 'sort_desc' : 'sort_asc'} />}
          </div>
        </>}

        {!header && <>
        <div className='metrics-row__sides'>
          {!competitors && <Tooltip
            title={name}
            trigger={<Icon className='metrics-row__social-icon' icon={`${socialType.toLowerCase()}_colored`}/>}
          />}

          {competitors && (
            <Tooltip
              title={name}
              trigger={(
                <div className='metrics-row__avatar'>
                  <Image className='metrics-row__avatar-image' round border src={image} noImage={require('./img/no_image.svg')}/>
                  <div className='metrics-row__avatar-social'>
                    <Icon className='metrics-row__avatar-social-bg' icon={`${socialType.toLocaleLowerCase()}_bg`}/>
                    <Icon className='metrics-row__avatar-social-icon' icon={`${socialType.toLocaleLowerCase()}_colored`}/>
                  </div>
                  <div className='metrics-row__avatar-container'>
                  <span className='metrics-row__avatar-container-name'>{name}</span>
                  {index && <span className='metrics-row__avatar-container-index'>#{index}</span>}
                  </div>
                </div>
              )}
            />
          )}
        </div>

        {(loading || !isPaid) &&
          <div className='metrics-row__message'>
            {loading && isPaid && (
              <div className='metrics-row__message'>
                <Icon className='metrics-row__message-loading' icon={'loading_dots'}/>
                <span className='metrics-row__message-text'>Собираем данные по странице</span>
              </div>
              )}

            {!isPaid && (
              <>
                <div className='metrics-row__message'>
                  <Icon className='metrics-row__message-icon' icon={'paid'}/>
                  <span className='metrics-row__message-text'>Страница не оплачена</span>
                </div>
                {/*<ButtonText size='middle' color='blue'>Оплатить</ButtonText>*/}
              </>
            )}
          </div>
        }

        {!loading && isPaid && (
          <>
            <div className='metrics-row__metric'>
              <span className='metrics-row__metric-value'>{NumeralUtil.format(users, '0,0')}</span>
              <div className={cx('metrics-row__delta', { 'metrics-row__delta--red': usersDelta < 0, 'metrics-row__delta--green': usersDelta > 0 })}>
                <Icon className='metrics-row__delta-icon' icon={usersDelta > 0 ? 'stats_up' : 'stats_down'} />
                <span className='metrics-row__delta-value'>{this.getDeltaValue(users, usersDelta)}</span>
              </div>
            </div>

            <div className='metrics-row__metric'>
              <span className='metrics-row__metric-value'>{NumeralUtil.format(interactions, '0,0')}</span>
              <div className={cx('metrics-row__delta', { 'metrics-row__delta--red': interactionsDelta < 0, 'metrics-row__delta--green': interactionsDelta > 0 })}>
                <Icon className='metrics-row__delta-icon' icon={interactionsDelta > 0 ? 'stats_up' : 'stats_down'} />
                {interactions !== null && <span className='metrics-row__delta-value'>{this.getDeltaValue(interactions, interactionsDelta, true)}</span>}
              </div>
            </div>

            <div className='metrics-row__metric'>
              <span className='metrics-row__metric-value'>{NumeralUtil.format(er, '0.00%')}</span>
              <div className={cx('metrics-row__delta', { 'metrics-row__delta--red': erDelta < 0, 'metrics-row__delta--green': erDelta > 0 })}>
                <Icon className='metrics-row__delta-icon' icon={erDelta > 0 ? 'stats_up' : 'stats_down'} />
                {er !== null && <span className='metrics-row__delta-value'>{this.getDeltaValue(er, erDelta, true)}</span>}
              </div>
            </div>

            <div className='metrics-row__metric'>
              <span className='metrics-row__metric-value'>{NumeralUtil.format(views, '0,0')}</span>
              <div className={cx('metrics-row__delta', { 'metrics-row__delta--red': viewsDelta < 0, 'metrics-row__delta--green': viewsDelta > 0 })}>
                <Icon className='metrics-row__delta-icon' icon={viewsDelta > 0 ? 'stats_up' : 'stats_down'} />
                {views !== null && <span className='metrics-row__delta-value'>{this.getDeltaValue(views, viewsDelta, true)}</span>}
              </div>
            </div>

            <div className='metrics-row__metric'>
              <span className='metrics-row__metric-value'>{NumeralUtil.format(posts, '0,0')}</span>
              <div className={cx('metrics-row__delta', { 'metrics-row__delta--red': postsDelta < 0, 'metrics-row__delta--green': postsDelta > 0 })}>
                <Icon className='metrics-row__delta-icon' icon={postsDelta > 0 ? 'stats_up' : 'stats_down'} />
                <span className='metrics-row__delta-value'>{this.getDeltaValue(posts, postsDelta, true)}</span>
              </div>
            </div>

            <div className='metrics-row__sides'>
              <div className='metrics-row__pie'>
                {!!score && <MetricPie score={score} small/>}

                {!score && (
                  <div className='metrics-row__pie-circle'>
                    <Icon className='metrics-row__pie-icon' icon='undetected'/>
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

export default MetricsRow
