import React, { Component, Children, cloneElement } from 'react'
import PropTypes from 'prop-types'
import isDescendant from 'is-descendant'
import cx from 'classnames'

import _ from 'lodash'
import uuid from '../../behaviors/Uuid/Uuid'
import eventStack from '../../../lib/eventStack'
import keyboardKey from '../../../lib/keyboardKey'

import Icon from '../../elements/Icon/Icon'

import DropdownList from './DropdownList'
import DropdownItem from './DropdownItem'
import DropdownButton from './DropdownButton'
import DropdownLink from './DropdownLink'
import DropdownSearchItem from './DropdownSearchItem/DropdownSearchItem'
import DropdownCalendar from './DropdownCalendar/DropdownCalendar'
import DropdownMobileBlock from './DropdownMobileBlock/DropdownMobileBlock'
import DropdownBody from './DropdownBody/DropdownBody'
import DropdownHeader from './DropdownHeader/DropdownHeader'
import DropdownFooter from './DropdownFooter/DropdownFooter'
import DropdownGroup from './DropdownGroup/DropdownGroup'
import DropdownTrigger from './DropdownTrigger/DropdownTrigger'
import DropdownSmallTrigger from './DropdownSmallTrigger/DropdownSmallTrigger'

import './Dropdown.scss'

/**
 * Модуль Dropdown - Выпадающий список
 */
class Dropdown extends Component {
  static propTypes = {
    /**
     * Список элементов выпадающего списка
     */
    children: PropTypes.node.isRequired,
    /**
     * Обработчик onClick, вызывается при клике на trigger
     */
    onClick: PropTypes.func,
    /**
     * Автоматически закрывать при клике на элементы списка
     */
    autoClose: PropTypes.bool,
    /**
     * Обработчик onClose, вызывается при закрытии списка
     */
    onClose: PropTypes.func,
    /**
     * Обработчик onMount, вызывается при монтировании компонента
     */
    onMount: PropTypes.func,
    /**
     * Обработчик onOpen, вызывается при открытии списка
     */
    onOpen: PropTypes.func,
    onRef: PropTypes.func,
    /**
     * Обработчик onUnmount, вызывается при размонтировании компонента
     */
    onUnmount: PropTypes.func,
    /**
     * Текущее состояние выпадающего списка
     */
    open: PropTypes.bool,
    /**
     * Позиция списка
     */
    position: PropTypes.oneOf(['auto', 'top-left', 'top-right', 'bottom-left', 'bottom-right']),
    /**
     * Размер
     */
    size: PropTypes.oneOf(['one-third', 'two-thirds', 'container', 'container-mobile', 'window']),
    /**
     * Величина закругления
     */
    curve: PropTypes.oneOf(['small', 'medium', '', 'big']),
    /**
     * Состояние загрузки
     */
    loading: PropTypes.bool,
    /**
     * Триггер, передается кнопка для управления выпадающим списком
     */
    trigger: PropTypes.node,
    /**
     * Является ли компонент внутренне контролируемым
     */
    control: PropTypes.bool,
    /**
     * Стиль оформления
     */
    type: PropTypes.string,
    backText: PropTypes.string,
    /**
     * Для триггера
     */
    icon: PropTypes.string,
    /**
     * Цвет иконки
     */
    iconColor: PropTypes.string,
    /**
     * Верхняя подпись
     */
    label: PropTypes.string,
    /**
     * Флаг убирающий верхнюю подпись
     */
    noLabel: PropTypes.string,
    /**
     * Наименование дропдауна (под верхней подписью)
     */
    name: PropTypes.string,
    caption: PropTypes.string,
    /**
     * Флаг - состояние disabled
     */
    disabled: PropTypes.bool,
    smallTrigger: PropTypes.bool
  }

  static defaultProps = {
    position: 'auto',
    control: false,
    autoClose: false,
    curve: 'medium'
  }

  state = {
    open: this.props.open,
    position_y: 'bottom',
    position_x: 'left',
    container: {
      offsets: {
        left: 0,
        right: 0
      },
      width: 0
    },
    width: 0,
    listNestedIndex: false,
    itemNestedIndex: false
  }

  static List = DropdownList
  static Item = DropdownItem
  static Button = DropdownButton
  static Link = DropdownLink
  static SearchItem = DropdownSearchItem
  static Calendar = DropdownCalendar
  static MobileBlock = DropdownMobileBlock
  static Body = DropdownBody
  static Header = DropdownHeader
  static Footer = DropdownFooter
  static Group = DropdownGroup
  static Trigger = DropdownTrigger

  componentDidMount () {
    this.uuid = uuid()
    this.renderDropdown()
  }

  componentDidUpdate (prevProps, prevState) {
    this.renderDropdown()

    // Если открывается - монтируем компонент
    if (!prevProps.open && this.props.open) {
      this.mountDropdown()
    }

    // Если закрывается - демонтируем компонент
    if (prevState.open && !this.state.open) {
      this.unmountDropdown()
    }
  }

  componentWillUnmount () {
    this.unmountDropdown()
  }

  handleDocumentClick = (e) => {
    if (e.target.classList.contains('notDropdownClosing')) return
    if (e.target.matches('.report-select-item *')) return
    if (e.target.matches('.dropdown__item--nested *')) return
    if (e.target.matches('.notify-item__btn--remove *')) return
    if (e.target.matches('.notify-block__remove *')) return
    if (e.target.matches('.notify-block__content *')) return
    if (e.target.matches('.dropdown__link')) return
    if (e.target.matches('.dropdown-trigger *')) return
    if (!isDescendant(this.ref, e.target)) this.close(e)
  }

  handleEscape = (e) => {
    if (keyboardKey.getCode(e) !== keyboardKey.Escape) return

    this.close(e)
  }

  handleTriggerClick = (e) => {
    const { trigger, control, open, onClick } = this.props
    e.stopPropagation()
    if (trigger) {
      _.invoke(trigger, 'props.onClick', e)
    }
    if (!trigger && !control) {
      onClick()
    }

    if ((this.state.open && control) || open) this.close(e)
    else if (!open) this.open(e)
  }

  open = (e) => {
    const { onOpen } = this.props
    if (onOpen) onOpen(e, this.props)

    this.handleUpdate()

    this.setState({ open: true })
  }

  close = (e) => {
    const { onClose } = this.props
    if (onClose) onClose(e, this.props)
    this.setState({ open: false })
  }

  renderDropdown () {
    if (!this.state.open) return
    this.mountDropdown()
  }

  mountDropdown = () => {
    eventStack.sub('click', this.handleDocumentClick, 'Dropdown', this.uuid)
    eventStack.sub('keydown', this.handleEscape, 'Dropdown', this.uuid)
    eventStack.sub('scroll', this.handleUpdate, 'Dropdown', this.uuid)
    eventStack.sub('resize', this.handleUpdate, 'Dropdown', this.uuid)
    _.invoke(this.props, 'onMount', null, this.props)
  }

  unmountDropdown = () => {
    eventStack.unsub('click', this.handleDocumentClick, 'Dropdown', this.uuid)
    eventStack.unsub('keydown', this.handleEscape, 'Dropdown', this.uuid)
    eventStack.unsub('scroll', this.handleUpdate, 'Dropdown', this.uuid)
    eventStack.unsub('resize', this.handleUpdate, 'Dropdown', this.uuid)
    _.invoke(this.props, 'onUnmount', null, this.props)
  }

  update = () => {
    const { position_y, position_x } = this.state
    const { size } = this.props

    this.ticking = false

    if (size === 'container' || size === 'container-mobile') {
      const parent = this.refList.closest('.container, .container-flex')
      const maxWidth = parseInt(getComputedStyle(parent, null).width, 10) -
        parseInt(getComputedStyle(parent, null).paddingLeft) - parseInt(getComputedStyle(parent, null).paddingRight)
      this.setState({
        container: {
          offsets: {
            left: parseInt(getComputedStyle(parent, null).paddingLeft),
            right: parseInt(getComputedStyle(parent, null).paddingRight)
          },
          left: 0,
          right: 0,
          width: maxWidth
        }
      })
    }
    if (size === 'one-third') {
      const parent = this.refList.closest('.container, .container-flex')
      const maxWidth = parseInt(getComputedStyle(parent, null).width, 10) -
        parseInt(getComputedStyle(parent, null).paddingLeft) - parseInt(getComputedStyle(parent, null).paddingRight)
      let elementWidth = maxWidth
      if (screen.width >= 550 && screen.width <= 1023) {
        elementWidth = Math.max((maxWidth - 30) / 2, 350)
      }
      if (screen.width >= 1024) {
        elementWidth = (maxWidth - 60) / 3
      }

      this.setState({
        container: {
          offsets: {
            left: parseInt(getComputedStyle(parent, null).paddingLeft),
            right: parseInt(getComputedStyle(parent, null).paddingRight)
          },
          width: maxWidth
        },
        width: elementWidth
      })
    }

    if (this.refList) {
      // Определение направления выпадания списка
      let new_position_y = position_y
      let new_position_x = position_x
      const rect = this.ref.getBoundingClientRect()
      const { top, left, height, width } = this.refList.getBoundingClientRect()

      if (
        position_y === 'bottom' &&
        Math.round(top) + Math.round(height) >= window.innerHeight &&
        Math.round(top) - Math.round(height) - 10 - rect.height >= 0
      ) new_position_y = 'top'
      else if (
        position_y === 'top' &&
        Math.round(top) <= 0
      ) new_position_y = 'bottom'

      if (
        position_x === 'left' &&
        Math.round(left) + Math.round(width) >= window.innerWidth &&
        Math.round(left) - Math.round(width) - 10 - rect.height >= 0
      ) new_position_x = 'right'
      if (
        position_x === 'right' &&
        Math.round(left) <= 0
      ) new_position_x = 'left'

      if (new_position_x !== position_x || new_position_y !== position_y) {
        this.setState({
          position_x: new_position_x,
          position_y: new_position_y
        })
      }
    }
  }

  handleUpdate = (e) => {
    if (!this.ticking) {
      this.ticking = true
      requestAnimationFrame(() => this.update(e))
    }
  }

  handleRef = c => (this.ref = c)
  handleRefList = c => (this.refList = c)

  handleNestedOpen = (data) => {
    this.setState({
      listNestedIndex: data.listIndex,
      itemNestedIndex: data.itemIndex
    })
  }

  handleNestedClose = () => {
    this.setState({
      listNestedIndex: false,
      itemNestedIndex: false
    })
  }

  handleOnRef = c => {
    if (this.props.onRef) this.handleRef(c)
  }

  generateStyles = size => {
    if (!size) {
      return {}
    }

    const { container, width } = this.state
    let rect = {}
    let triggerMargin = 0
    if (this.refList) {
      const trigger = this.refList && this.refList.previousElementSibling
      triggerMargin = parseInt(getComputedStyle(trigger, null).marginLeft, 10)
      rect = trigger.getBoundingClientRect()
    }

    if (size === 'container') {
      return {
        width: `${container.width}px`
      }
    }

    if (size === 'container-mobile' && innerWidth < 1024) {
      const orientation = rect.left < window.innerWidth / 2 ? 'left' : 'right'
      let right = rect.right - container.width - rect.width
      if (rect.right > container.width) right += rect.right - container.width

      return {
        left: orientation === 'left' ? `-${rect.left - container.offsets.left + triggerMargin}px` : 'auto',
        right: orientation === 'right' ? `${right}px` : 'auto'
      }
    }
    if (size === 'one-third') {
      const orientation = rect.left < window.innerWidth / 2 ? 'left' : 'right'
      let right = rect.right - container.width - rect.width
      if (rect.right > container.width) right += rect.right - container.width
      if (screen.width < 550) {
        return {
          left: orientation === 'left' ? `-${rect.left - container.offsets.left + triggerMargin}px` : 'auto',
          right: orientation === 'right' ? `${right}px` : 'auto',
          width: `${width}px`
        }
      }

      return {
        left: orientation === 'left' ? '0' : 'auto',
        right: orientation === 'right' ? '0' : 'auto',
        width: `${width}px`
      }
    }

    return {}
  }

  render () {
    const {
      trigger, open, children, size, control, position, autoClose, curve, loading,
      type, backText, label, name, icon, iconColor, noLabel, disabled, caption, smallTrigger
    } = this.props
    const { position_y, position_x } = this.state

    const classes = cx('dropdown', {
      [`dropdown--size-${size}`]: size,
      'dropdown--open': (this.state.open === true && control) || (open === true && !control),
      [`dropdown--${position_y}-${position_x}`]: position === 'auto',
      [`dropdown--${position}`]: position !== 'auto',
      [`dropdown--curve-${curve}`]: curve,
      [`dropdown--type-${type}`]: type
    })

    const list = []
    Children.forEach(children, (child, listIndex) => {
      const items = []
      Children.forEach(child.props.children, (item, itemIndex) => {
        if (item) {
          if (this.state.listNestedIndex !== false && this.state.itemNestedIndex !== false) {
            if (this.state.listNestedIndex === listIndex && this.state.itemNestedIndex === itemIndex) {
              list.push(<Dropdown.Link onClick={this.handleNestedClose} back><Icon icon='arrow_left' />{backText}</Dropdown.Link>)
              items.push(item.props.nested)
            }
          } else if (item.props.nested) {
            items.push(cloneElement(item, { key: itemIndex, onClick: () => this.handleNestedOpen({ listIndex, itemIndex }) }))
          } else if (autoClose) {
            items.push(cloneElement(item, { key: itemIndex, onAutoClick: this.close }))
          } else items.push(item)
        }
      })

      list.push(<DropdownList key={listIndex} {...child.props}>{items}</DropdownList>)
    })

    if (loading) {
      return (
        <div className='dropdown__wrap' ref={this.handleRef}>
          <Icon icon='loader' />
        </div>
      )
    }

    return (
      <div className='dropdown__wrap' ref={this.handleRef}>
        {trigger && cloneElement(trigger, { onClick: this.handleTriggerClick })}
        {!trigger && !smallTrigger &&
          <Dropdown.Trigger
            opened={open === true}
            onClick={this.handleTriggerClick}
            icon={icon}
            iconColor={iconColor}
            label={label}
            noLabel={noLabel}
            name={name}
            caption={caption}
            disabled={disabled}
          />}
        {!trigger && smallTrigger &&
          <DropdownSmallTrigger
            onClick={this.handleTriggerClick}
            name={name}
            opened={open === true}
          />}

        <div className={classes} ref={this.handleRefList} style={this.generateStyles(size)}>
          {list}
        </div>

      </div>
    )
  }
}

export default Dropdown
