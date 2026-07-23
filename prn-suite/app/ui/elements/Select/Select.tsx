import React, { ChangeEvent, ChangeEventHandler, Component } from 'react'
import cx from 'classnames'

import Icon from '../Icon/Icon'
import Popup from '../Popup/Popup'
import PopupButton from '../Popup/PopupButton'
import BadgeCount from '../BadgeCount/BadgeCount'
import InputText from '../InputText/InputText'

import './Select.scss'
import ButtonText from '../ButtonText/ButtonText'
import ObjectUtil from '../../../utils/ObjectUtil'

export interface ISelectItem {
  id: string
  icon?: string
  name: string
  subName?: string
  disabled?: boolean
  badge?: string
}

interface IProps {
  list: Array<ISelectItem>
  value?: string
  onSelect: ChangeEventHandler<HTMLInputElement>
  label?: string
  icon?: string
  /**
   *  Прокрутка внутри списка
   */
  scrolling?: boolean
  /**
   * Максимальная высота списка до появления скролла
   */
  maxHeight?: number
  /**
   * Список поддерживает фильтр
   */
  filtered?: boolean | number
  /**
   * Показывать все результаты в вывадающем списке
   */
  showAllItems?: boolean
  /**
   * Список может быть пустым и тогда называется
   */
  emptyName?: string
  /**
   * Максимальная ширина поля
   */
  maxWidth?: number
}

interface IStates {
  open: boolean
  filter: string
}

/**
 * Блок MessengerSelect
 */
class Select extends Component<IProps, IStates> {
  state = {
    open: false,
    filter: ''
  }

  handleSelect = (e, value: string) => {
    e.target.value = value

    this.props.onSelect(e)
    this.setState({ filter: '' })
  }

  handleClear = (e) => {
    e.stopPropagation()
    this.handleSelect(e, '')
  }

  componentDidUpdate (prevProps: Readonly<IProps>, prevState: Readonly<{}>, snapshot?: any): void {
    if (!this.props.emptyName && !this.props.list.find(item => item.id === this.props.value)) {
      if (this.props.list.length) this.props.onSelect({ target: { value: this.props.list[0].id } } as ChangeEvent<HTMLInputElement>)
    }
  }

  render (): JSX.Element {
    const {
      list, value, label, icon,
      scrolling, maxHeight, filtered, emptyName, maxWidth, showAllItems
    } = this.props

    const { open, filter } = this.state

    const name = list.find(item => item.id === value)?.name || ''
    const badge = list.find(item => item.id === value)?.badge || ''

    const classes = cx('select', {
      'select--label': label,
      'select--opened': open
    })

    let filteredList = list.filter(v => String(v.name).toLowerCase().includes(filter.toLowerCase()))
    if (filtered && !showAllItems) filteredList = filteredList.slice(0, Number(filtered) || 100)

    return (
      <div className={classes}>
        <Popup
          scrolling={scrolling}
          maxHeight={maxHeight}
          size='small'
          onOpen={() => this.setState({ open: true })}
          onClose={() => this.setState({ open: false })}
          open={open}
          trigger={(
            <button className='select__main' style={ObjectUtil.removeUndefined({ maxWidth: maxWidth ? maxWidth : undefined, minWidth: maxWidth ? maxWidth : undefined })}>
              <Icon icon={icon} />
              <div className='select__content'>
                {label && <span className='select__label'>{label}</span>}
                <div className='select__value-group'>
                  <span className='select__value'>{name || emptyName}</span>
                  {badge && <BadgeCount className='select__badge'>{badge}</BadgeCount>}
                </div>
              </div>
              {(!emptyName || !name) && <Icon className='select__icon' icon='down' />}
              {emptyName && name && <Icon className='select__iconClear' icon='close_circle' onClick={this.handleClear} />}
            </button>
          )}
          fixedChildren={open && filtered && (
            <InputText
              className='select__filter'
              icon='search'
              label='Фильтр'
              value={filter}
              onChange={e => this.setState({ filter: e.target.value })}
              focus
            />
          )}
        >
          {filteredList.map(item => (
            <PopupButton
              key={item.id}
              icon={item.icon}
              active={item.id === value}
              disabled={item.disabled}
              badge={item.badge}
              onClick={(e) => this.handleSelect(e, item.id)} autoClosePopup
              description={item.subName}
            >{item.name}</PopupButton>
          ))}
        </Popup>
      </div>)
  }
}

export default Select
