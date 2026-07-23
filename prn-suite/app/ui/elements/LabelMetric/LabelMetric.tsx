import React, { Component, ReactNode } from 'react'

import cx from 'classnames'
import Tooltip from '../../modules/Tooltip/Tooltip'
import Icon from '../Icon/Icon'
import { IIcon } from '../Icon/Icons'

import './LabelMetric.scss'

interface IProps {
  /**
   * Иконка
   */
  icon: IIcon | string
  /**
   * Цвет иконки
   */
  iconColor?: 'green' | 'yellow' | 'orange' | 'red' | string
  /**
   * Название метрики
   */
  title: string
  /**
   * Заголовок подсказки
   */
  tooltipTitle?: string
  /**
   * Текст подсказки
   */
  tooltipText?: ReactNode
  /**
   * Мелкий текст в подсказке
   */
  tooltipDescription?: ReactNode
  /**
   * Кнопка в подсказке
   */
  tooltipButton?: string
  /**
   * Кнопка закрытия в подсказке
   */
  tooltipClose?: boolean
  /**
   * Бейдж
   */
  badge?: string | number
}

/**
 * Элемент Metric
 * Метрика
 */
class LabelMetric extends Component<IProps> {

  static defaultProps = {
    // format: '0,0'
  }

  render (): JSX.Element {
    let { icon, iconColor, title, tooltipText, tooltipDescription,
      tooltipButton, tooltipTitle, tooltipClose, badge } = this.props

    const classes = cx('label-metric', {
      //
    })

    return (
      <div className={classes}>
        <div className='label-metric__top'>
          <Icon icon={icon} color={iconColor} className='label-metric__icon' />
          <span className='label-metric__title'>{title}</span>
          {badge && <span className='label-metric__badge'>{badge}</span>}
          {tooltipText && <Tooltip
            trigger={<Icon className='label-metric__helpIcon' icon='help' />}
            title={tooltipTitle}
            text={tooltipText}
            description={tooltipDescription}
            button={tooltipButton}
            close={tooltipClose}
          >
          </Tooltip>}
        </div>
      </div>
    )
  }
}

export default LabelMetric
