import React, {ChangeEvent, ChangeEventHandler, cloneElement, Component, ReactElement} from 'react'
import cx from 'classnames'

import Icon from '../Icon/Icon'
import Popup from '../Popup/Popup'

import PopupButton from '../Popup/PopupButton'

import s from './Select.module.scss'
import { IIcon } from '../Icon/Icons'
import ScrollView from '../ScrollView/ScrollView'
import InputText from '../InputText/InputText'

export interface ISelectItem {
  id: string
  icon?: IIcon | string
  color?: string
  name: string
  filterName?: string
  level?: number
  disabled?: boolean
}

interface IProps {
  /**
   * Подпись
   */
  label?: string
  /**
   * Значение
   */
  value?: string
  /**
   * Список значений
   */
  list: Array<ISelectItem>
  /**
   * Обработчик выбора
   */
  onSelect: ChangeEventHandler<HTMLInputElement>
  /**
   * Иконка
   */
  icon?: IIcon | string
  /**
   * Максимальная высота списка до появления скролла
   */
  maxHeight?: number
  /**
   * Может быть пустым
   */
  empty?: boolean
  /**
   * Название родителя
   */
  emptyName?: string
  /**
   * Фильтрация списка
   */
  filtered?: boolean
  /**
   * Если элемент на сером фоне фоне
   */
  white?: boolean
  /**
   * Кастомный триггер
   */
  trigger?: ReactElement
}

interface IStates {
  open: boolean
  filter: string
}

/**
 * Элемент выпадающего списка
 */
class Select extends Component<IProps, IStates> {
  state = {
    open: false,
    filter: ''
  }

  handleSelect = (e, value: string) => {
    e.target.value = value

    this.props.onSelect(e)
  }

  componentDidMount(): void {
    this.init()
  }

  componentDidUpdate (): void {
    this.init()
  }

  init = () => {
    if (!this.props.list.find(item => item.id === this.props.value)) {
      if (this.props.list.length && !this.props.empty) this.props.onSelect({ target: { value: this.props.list[0].id } } as ChangeEvent<HTMLInputElement>)
    }
  }

  handleKeyEnter = (e) => {
    const filteredList = this.props.list.filter(item => item.name.concat(item.filterName || '').toLowerCase().includes(this.state.filter.toLowerCase()))
    if (filteredList.length) this.handleSelect(e, filteredList[0].id)

    this.setState({ open: false })

    e.stopPropagation()
    e.preventDefault()
  }

  render (): JSX.Element {
    const { list, value, label, icon, maxHeight, emptyName, filtered, white, trigger } = this.props

    const currentItem = list.find(item => item.id === value)

    const name = currentItem?.name || emptyName || ''
    const currentIcon = currentItem?.icon || ''
    const currentColor = currentItem?.color || ''

    const classes = cx(s.element, {
      [s.opened]: this.state.open,
      [s.white]: white,
      [s.coloredIcon]: currentColor,
      [s.elementTrigger]: !!trigger
    })

    const filteredList = list.filter(item => item.name.concat(item.filterName || '').toLowerCase().includes(this.state.filter.toLowerCase()))

    return (
      // @ts-ignore
      <div className={classes} style={{ '--iconColor': currentColor }}>
        <Popup
          maxHeight={maxHeight}
          size='s'
          onOpen={() => this.setState({ open: true, filter: '' })}
          onClose={() => this.setState({ open: false })}
          open={this.state.open}
          trigger={trigger ? cloneElement(trigger, { className: s.mainTrigger, children: `${label || ''} ${name}` }) : (
            <button className={s.main} type='button'>
              {(icon || currentIcon) && <Icon className={s.icon} icon={icon || currentIcon} />}
              <div className={s.content}>
                {label && <span className={cx(s.label, { [s.placeholder]: !name})}>{label}</span>}
                <span className={s.text}>{name}</span>
              </div>
              <Icon className={s.iconArrow} icon='arrow_down' />
            </button>
          )}>
          {filtered && this.state.open && <InputText className={s.filter} small focus label='Поиск' value={this.state.filter} onChange={e => this.setState({ filter: e.target.value })} onKeyEnter={this.handleKeyEnter} />}
          {filtered && !filteredList.length && (
            <span className={s.noResults}>Ничего не найдено</span>
          )}

          <ScrollView maxHeight={maxHeight} ignoreScrollView={!maxHeight || !filteredList.length}>
            {emptyName && !this.state.filter && <PopupButton active={value === ''} onClick={(e) => this.handleSelect(e, '')} autoClosePopup>{emptyName}</PopupButton>}
            {filteredList.map(item => (
              <PopupButton
                key={item.id}
                icon={item.icon}
                iconColor={item.color}
                active={item.id === value}
                disabled={item.disabled}
                onClick={(e) => this.handleSelect(e, item.id)}
                autoClosePopup
                level={item.level}
              >{item.name}</PopupButton>
            ))}
          </ScrollView>
        </Popup>
      </div>)
  }
}

export default Select
