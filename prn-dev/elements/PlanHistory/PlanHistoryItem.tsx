import React, { Component } from 'react'

import s from './PlanHistory.module.scss'
import Icon from '../Icon/Icon'
import NumeralUtil from '../../utils/NumeralUtil'
import DateUtil from '../../utils/DateUtil'

interface IProps {
  /**
   * Дата
   */
  date: Date
  /**
   * Описание покупки
   */
  text: string
  /**
   * Номер транзакции
   */
  number: string
  /**
   * Дата
   */
  cost: number
}

/**
 * Одна строка из истории платежей
 */
export default class PlanHistoryItem extends Component<IProps> {
  render (): JSX.Element {
    const { date, text, number, cost } = this.props

    return (
      <div className={s.itemElement}>
        <span className={s.date}>{DateUtil.format(date, 'D MMMM Y')}</span>
        <span className={s.text}>{text}</span>
        <span className={s.number}>{number}</span>
        <div className={s.container}>
          <span className={s.cost}>{NumeralUtil.format(cost, '0,0')}</span>
          <Icon className={s.rouble} icon='rouble' />
        </div>
      </div>
    )
  }
}
