import React, { Component, MouseEventHandler } from 'react'
import cx from 'classnames'

import Image from '../Image/Image'
import CommunityUrl from '../../views/CommunityUrl/CommunityUrl'
import NumeralUtil, {NumeralFormat} from '../../../utils/NumeralUtil'

import './CommunityStats.scss'
import Icon from '../Icon/Icon'
import QualityScoreUtil from '../../../utils/QualityScoreUtil'
import SocialDataUtil from '../../../utils/SocialDataUtil'

interface ICommunityMetric {
  name: string
  type?: 'qualityScore' | 'audience'
  value: number | string | Array<number | string>
  format?: NumeralFormat
  isHide?: boolean
}

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
   * Верифицированное сообщество
   */
  isVerified?: boolean
  /**
   * Ссылка на сообщество
   */
  url: string
  /**
   * Обработчик клика
   */
  onClick?: MouseEventHandler
  /**
   * Неактивное состояние
   */
  disabled?: boolean
  /**
   * Метрики
   */
  metrics: Array<ICommunityMetric>
}

/**
 * Элемент CommunityStats
 * Сообщество со статистикой
 */
export default class CommunityStats extends Component<IProps> {

  render (): JSX.Element {
    const {
      image, name, isVerified, url, onClick, disabled,
      metrics
    } = this.props

    const classes = cx('communityStats', {
      'communityStats--disabled': disabled,
    })

    const renderMetric = (metric: ICommunityMetric) => {
      if (metric.type === 'qualityScore') {
        return (
          <div className='communityStats__metric'>
            <div className='communityStats__metric__value'>
              <Icon  icon='circle' color={QualityScoreUtil.getColor(Number(metric.value))} />
              <span>{NumeralUtil.format(Number(metric.value), metric.format || '0%')}</span>
            </div>
            <span className='communityStats__metric__name'>{metric.name}</span>
          </div>
        )
      }

      if (metric.type === 'audience') {
        return (
          <div className='communityStats__metric'>
            <div className='communityStats__metric__value'>
              {SocialDataUtil.getAgeRangeName(metric.value[1]) && (
                <>
                  {metric.value[0] < 0.4 && <Icon icon='woman' />}
                  {metric.value[0] >= 0.4 && metric.value[0] <= 0.6 && (
                    <><Icon icon='man' /><Icon icon='woman' /></>
                  )}
                  {metric.value[0] > 0.6 && <Icon  icon='man' />}
                </>
              )}
              <span>{SocialDataUtil.getAgeRangeName(metric.value[1])}</span>
            </div>
            <span className='communityStats__metric__name'>
              <Icon className='communityStats__metric__country' icon={`flag_${String(metric.value[2]).toLowerCase()}`} />
              {metric.value[3]}
            </span>
          </div>
        )
      }

      return (
        <div className='communityStats__metric'>
          <div className='communityStats__metric__value'>
            <span>{metric.value !== null ? NumeralUtil.format(Number(metric.value), metric.format || '0.[0a]') : '—'}</span>
          </div>
          <span className='communityStats__metric__name'>{metric.name}</span>
        </div>
      )
    }

    return (
      <div className={classes} onClick={onClick}>
        <Image className='communityStats__image' round border src={image} noImage={require('./img/no_image.svg')} />
        <div className='communityStats__main'>
          <div className='communityStats__title'>
            <span className='communityStats__name'>{name}</span>
            {isVerified && <Icon icon='success_circle' className='communityStats__verified' />}
          </div>
          <div className='communityStats__description'>
            <CommunityUrl to={url} />
          </div>
        </div>
        <div className='communityStats__right'>
          {metrics.filter(item => !item.isHide).map(metric => renderMetric(metric))}
        </div>
      </div>)
  }
}
