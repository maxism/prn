import React, { Component, MouseEventHandler } from 'react'
import DayPicker from 'react-day-picker'
import MomentLocaleUtils from 'react-day-picker/moment'
import moment from 'moment'
import periods from './periods'
import cx from 'classnames'

import Icon from '../../elements/Icon/Icon'
import Popup from '../../elements/Popup/Popup'

import './DateRangePicker.scss'
import PlanBadge from '../PlanBadge/PlanBadge'
import ButtonText from '../../elements/ButtonText/ButtonText'

interface IProps {
  /**
   * Дата начала
   */
  from: string
  /**
   * Дата конца
   */
  to: string
  /**
   * Обработчик изменения периода
   */
  onChangePeriod: (from: string, to: string) => void
  /**
   * Обработчик клика на заблокированый функционал
   */
  onBlockButtonClick?: MouseEventHandler
  /**
   * Ретроспектива
   */
  retrospectives?: number
  /**
   * Колбек премиума
   */
  onPremium?: () => void
}

/**
 * Модуль DateRangePicker
 */
class DateRangePicker extends Component<IProps> {
  state = {
    open: false,
    from: moment().toDate(),
    to: moment().toDate(),
    enteredTo: moment().toDate(),
    blockedBefore: undefined
  }

  handleOpen = () => {
    this.setState({
      open: true,
      from: moment(this.props.from, 'DD.MM.YYYY').toDate(),
      to: moment(this.props.to, 'DD.MM.YYYY').toDate(),
      enteredTo: moment(this.props.to, 'DD.MM.YYYY').toDate(),
      blockedBefore: moment().subtract(this.props.retrospectives || 12, 'months').toDate()
    })
  }

  handleDayClick = (day) => {
    if (this.state.blockedBefore && moment(day).isBefore(this.state.blockedBefore)) {
      this.props.onPremium()

      return
    }

    const { to } = this.state
    if (to) {
      this.setState({
        from: day,
        to: null,
        enteredTo: null
      })
      return
    }

    this.setState({ open: false })
    if (moment(day).isAfter(moment(this.state.from))) this.props.onChangePeriod(moment(this.state.from).format('DD.MM.YYYY'), moment(day).format('DD.MM.YYYY'))
    else this.props.onChangePeriod(moment(day).format('DD.MM.YYYY'), moment(this.state.from).format('DD.MM.YYYY'))
  }

  handleDayMouseEnter = (day) => {
    const { to } = this.state
    if (!to) {
      this.setState({
        enteredTo: day
      })
    }
  }

  handleChangePeriod = (from: string, to: string) => {
    if (this.state.blockedBefore && moment(from, 'DD.MM.YYYY').isBefore(this.state.blockedBefore)) {
      this.props.onPremium()
      return
    }
    this.setState({ open: false })
    this.props.onChangePeriod(from, to)
  }

  render (): JSX.Element {
    const { onBlockButtonClick, onPremium } = this.props
    const { from, enteredTo } = this.state
    const modifiers = { start: from, end: enteredTo }
    const selectedDays = [{ from, to: enteredTo }]

    const period = periods.getPeriodByFromTo(this.props.from, this.props.to)

    if (this.state.blockedBefore && moment(period.from, 'DD.MM.YYYY').isBefore(this.state.blockedBefore)) {
      const p = periods.getPeriodByName('last30Days')
      this.handleChangePeriod(p.from, p.to)

      onPremium()
    }

    const classes = cx('date-range-picker', {
      'date-range-picker--opened': this.state.open
    })

    return (
      <div className={classes}>
        <Popup
          size='auto'
          trigger={(
            <div className='date-range-picker__body'>
              <Icon icon='d_calendar' className='date-range-picker__icon' />
              <div className='date-range-picker__main'>
                <span className='date-range-picker__title'>{period.title}</span>
                <span className='date-range-picker__description'>
                  {period.description}
                </span>
              </div>
              <Icon icon='down' className='date-range-picker__down' />
            </div>
          )}
          open={this.state.open}
          onOpen={this.handleOpen}
          onClose={() => this.setState({ open: false })}
        >
          <div className='date-range-picker__left'>
            {/*{isBlocked && (*/}
            {/*  <div className='date-range-picker__demo'>*/}
            {/*    <Icon className='date-range-picker__demo-icon' icon='locker' />*/}
            {/*    <span className='date-range-picker__demo-title'>Платный функционал</span>*/}
            {/*    <span className='date-range-picker__demo-description'>В бесплатном доступе ретроспектива данных ограничена одним месяцем. Данные за всё время и произвольный выбор периодна будут доступны после оформления подписки.</span>*/}
            {/*    <ButtonText size='small' color='blue' onClick={onBlockButtonClick}>Оформить подписку</ButtonText>*/}
            {/*  </div>*/}
            {/*)}*/}
            {/*@ts-ignore*/}
            <DayPicker
              firstDayOfWeek={1}
              showWeekDays={false}
              locale='ru'
              localeUtils={MomentLocaleUtils}
              numberOfMonths={2}
              showOutsideDays={false}
              // fixedWeeks
              selectedDays={selectedDays}
              modifiers={modifiers}
              // disabledDays={{ before: this.state.blockedBefore }}
              onDayClick={this.handleDayClick}
              onDayMouseEnter={this.handleDayMouseEnter}
              month={moment(this.props.from || '01.01.2021', 'DD.MM.YYYY').toDate()}
            />
          </div>
          <div className='date-range-picker__right'>
            {['last7Days', 'last2Weeks', 'last30Days', 'lastMonth', 'currentYear'].map(name => periods.getPeriodByName(name)).map(period => (
              <button
                key={period.name}
                onClick={() => this.handleChangePeriod(period.from, period.to)}
                className={cx('date-range-picker__button', {
                  'date-range-picker__button--active': period.from === this.props.from && period.to === this.props.to,
                  // 'date-range-picker__button--disabled': this.state.blockedBefore && moment(period.from, 'DD.MM.YYYY').isBefore(this.state.blockedBefore)
                })}
              >
                <div className='date-range-picker__button-contaner'>
                  {period.title}
                  <span>{period.description}</span>
                </div>
                {/*{this.state.blockedBefore && moment(period.from, 'DD.MM.YYYY').isBefore(this.state.blockedBefore) &&*/}
                {/*  <PlanBadge buttonOnClick={onBlockButtonClick}/>*/}
                {/*}*/}
              </button>
            ))}
          </div>
        </Popup>
      </div>
    )
  }
}

export default DateRangePicker
