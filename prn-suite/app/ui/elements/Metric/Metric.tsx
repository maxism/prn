import React, { Component, MouseEventHandler, ReactNode } from 'react'

import './Metric.scss'
import cx from 'classnames'
import NumeralUtil, { NumeralFormat } from '../../../utils/NumeralUtil'
import Tooltip from '../../modules/Tooltip/Tooltip'
import Icon from '../Icon/Icon'

interface IProps {
  /**
   * Размер блока
   */
  big?: boolean
  active?: boolean

  value?: number | string
  deltaValue?: number
  format?: NumeralFormat
  deltaFormat?: NumeralFormat
  /**
   * Прирост отображать в процентах
   */
  deltaPercent?: boolean

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
   * Событие клика
   */
  onClick?: MouseEventHandler
}

/**
 * Элемент Metric
 * Метрика
 */
class Metric extends Component<IProps> {

  static defaultProps = {
    format: '0,0'
  }

  getDeltaValue = (): string => {
    const { value, deltaValue, deltaPercent, format, deltaFormat } = this.props
    if (!deltaValue) {
      return 'Нет изменений'
    }
    if (!deltaPercent && deltaValue) {
      return NumeralUtil.format(Math.abs(deltaValue), deltaFormat || `${format}` as NumeralFormat)
    }
    if (deltaPercent && deltaValue) {
      if (typeof value === 'number') {
        const valuePct = (value !== deltaValue) ? Math.abs(deltaValue / (value - deltaValue)) : 1
        if (valuePct < 0.01) {
          return NumeralUtil.format(Math.max(valuePct, 0.0001), '0.00%')
        }
        return NumeralUtil.format(valuePct, '0,0%')
      } else {
        return deltaValue.toString()
      }
    }

    return ''
  }

  render (): JSX.Element {
    const { active, big, title, value, deltaValue, format, tooltipText,
      tooltipDescription, tooltipButton, tooltipTitle, tooltipClose, onClick } = this.props

    const classes = cx('metric', {
      'metric--big': big,
      'metric--active': active,
      'metric--red-delta-value': deltaValue < 0,
      'metric--grey-delta-value': !deltaValue || deltaValue === 0
    })

    return (
      <div className={classes} onClick={onClick}>
        <div className='metric__top'>
          <span className='metric__title'>{title}</span>
          {tooltipText && <Tooltip
            trigger={<Icon className='metric__icon' icon='help' />}
            title={tooltipTitle}
            text={tooltipText}
            description={tooltipDescription}
            button={tooltipButton}
            close={tooltipClose}
          >
          </Tooltip>}
        </div>
        {value !== undefined && <span className='metric__value'>{typeof value === 'number' ? NumeralUtil.format(value, format) : value}</span>}
        {deltaValue !== undefined && <div className='metric__delta'>
          {Math.sign(deltaValue) < 0 && <Icon className='metric__delta-icon-down' icon='stats_down' />}
          {Math.sign(deltaValue) > 0 && <Icon className='metric__delta-icon-up' icon='stats_up' />}
          <span className='metric__delta-value'>{this.getDeltaValue()}</span>
        </div>}
      </div>
    )
  }
}

export default Metric
