import React, { Component } from 'react'
import { DayPicker } from 'react-day-picker'
import moment from 'moment'
import periods from './periods'
import ru from 'date-fns/locale/ru'
import cx from 'classnames'

import Icon from '../../elements/Icon/Icon'
import Popup from '../../elements/Popup/Popup'

import 'react-day-picker/dist/style.css'
import s from './DateRangePicker.module.scss'
import AppUtil from '../../utils/AppUtil'
import PopupButton from '../Popup/PopupButton'

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
    customPeriod: false
  }

  componentDidMount() {
    if (AppUtil.isClientSide && !this.props.from && !this.props.to) {
      // todo: Реализовать возможность сохранения последнего выбранного периода и восстановления его. В настройках можно передать имя сохранения
      const defaultPeriod = periods.getPeriodByName('last30Days')
      this.handleChangePeriod(defaultPeriod.from, defaultPeriod.to)
    }
  }

  handleOpen = () => {
    this.setState({
      open: true,
      from: moment(this.props.from, 'DD.MM.YYYY').toDate(),
      to: moment(this.props.to, 'DD.MM.YYYY').toDate(),
      enteredTo: moment(this.props.to, 'DD.MM.YYYY').toDate(),
      customPeriod: false
    })
  }

  handleDayClick = (day) => {
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
    this.setState({ open: false })
    this.props.onChangePeriod(from, to)
  }

  render (): JSX.Element {
    const { from, enteredTo, customPeriod } = this.state
    const selectedDays = [{ from, to: enteredTo }]

    const period = periods.getPeriodByFromTo(this.props.from, this.props.to)

    const classes = cx(s.element, {
      [s.opened]: this.state.open
    })

    // console.log(from)

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
          {!customPeriod && (
            <>
              {['last7Days', 'last2Weeks', 'last30Days', 'lastMonth', 'currentYear'].map(name => periods.getPeriodByName(name)).map(period => (
                <PopupButton
                  key={period.name}
                  onClick={() => this.handleChangePeriod(period.from, period.to)}
                  active={period.from === this.props.from && period.to === this.props.to}
                >
                  {period.title}
                </PopupButton>
              ))}
              <PopupButton onClick={() => this.setState({ customPeriod: true })}>Произвольный период</PopupButton>
            </>
          )}
          {customPeriod && (
            // @ts-ignore
            <DayPicker
              mode='single'
              locale={ru}
              selected={selectedDays}
              onDayClick={this.handleDayClick}
              onDayMouseEnter={this.handleDayMouseEnter}
              defaultMonth={moment(from || '01.01.2021', 'DD.MM.YYYY').toDate()}
              modifiersClassNames={{
                // Документация по стилям https://react-day-picker.js.org/basics/styling
                selected: s.dayPickerSelected,
                today: s.dayPickerToday
              }}
            />
          )}
        </Popup>
      </div>
    )
  }
}

export default DateRangePicker
