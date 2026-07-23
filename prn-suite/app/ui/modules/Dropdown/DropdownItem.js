import React, { Component, cloneElement } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import Link from '../../elements/Link/Link'
import Icon from '../../elements/Icon/Icon'
import Image from '../../elements/Image/Image'

/**
 * Элемент DropdownItem
 */
class DropdownItem extends Component {
  static propTypes = {
    /**
     * Содержимое элемента
     * */
    children: PropTypes.node,
    /**
     * Родительская категория
     */
    parent: PropTypes.string,
    /**
     * Количество
     */
    count: PropTypes.oneOfType([PropTypes.number, PropTypes.bool, PropTypes.string]),
    /**
     * Позиция счётчика
     */
    countPosition: PropTypes.oneOf(['right', '']),
    /**
     * Отключён ли
     */
    disabled: PropTypes.bool,
    /**
     * Есть ли разделитель (снизу)
     */
    devider: PropTypes.bool,
    /**
     * Есть ли разделитель (сверху)
     */
    deviderTop: PropTypes.bool,
    /**
     * Заменяющий элемент
     */
    as: PropTypes.node,
    /**
     * Ссылка
     */
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    /**
     * Обработчик onClick, вызывается при клике по пункту
     */
    onClick: PropTypes.func,
    caption: PropTypes.string,
    /**
     * Обработчик onAutoClick, для автоматического закрытия списка, вызывается при клике по пункту
     */
    onAutoClick: PropTypes.func,
    /**
     * Скрыть ли элемент
     */
    hidden: PropTypes.bool,
    /**
     * Жирный
     */
    bold: PropTypes.bool,
    /**
     * Является ли заголовком
     */
    header: PropTypes.bool,
    /**
     * Иконка
     */
    icon: PropTypes.string,
    /**
     * Иконка слева
     */
    frontIcon: PropTypes.string,
    /**
     * Иконка справа
     */
    postIcon: PropTypes.string,
    /**
     * Картинка
     */
    image: PropTypes.string,
    nested: PropTypes.object,
    attention: PropTypes.bool,
    onRemove: PropTypes.func,
    classname: PropTypes.string
  }

  static defaultProps = {
    count: false,
    hidden: false,
    parent: ''
  }

  handleOnClick = (e) => {
    e.stopPropagation()
    if (this.props.onClick) this.props.onClick(e)
    if (this.props.onAutoClick) this.props.onAutoClick(e)
  }

  handleOnRemove = (e) => {
    e.stopPropagation()
    this.props.onRemove()
  }

  render () {
    const {
      to, count, children, disabled, devider, as, countPosition, parent, hidden, icon, postIcon,
      deviderTop, image, attention, header, bold, onRemove, nested, caption, frontIcon, classname
    } = this.props

    const classes = cx('dropdown__item', {
      'dropdown__item--border': devider,
      'dropdown__item--border-top': deviderTop,
      'dropdown__item--disabled': disabled,
      'dropdown__item--bold': bold,
      'dropdown__item--header': header,
      'dropdown__item--attention': attention,
      'dropdown__item--nested': nested,
      hidden: hidden
    }, classname)
    const countClasses = cx('dropdown__count', {
      'dropdown__count--right': countPosition === 'right'
    })

    if (as) return cloneElement(as, { ...this.props, className: classes })

    return (
      <Link className={classes} to={to} onClick={this.handleOnClick}>
        {icon && <Icon className='dropdown__item-icon' icon={icon} />}
        {image && <Image round className='dropdown__item-image' src={image} />}
        <div className='dropdown__item-text-block'>
          <span className='dropdown__item-text'>
            {frontIcon && <Icon className='dropdown__item-front-icon' icon={frontIcon} />}
            {children}
            {parent && <span className='dropdown__item-parent'>{parent}</span>}
          </span>
          {caption && <p className='dropdown__item-caption'>{caption}</p>}
        </div>
        {postIcon && <Icon icon={postIcon} className='dropdown__item-post-icon' />}
        {onRemove &&
          <span className='dropdown__item-remove' onClick={onRemove}>
            <Icon className='dropdown__item-remove-icon' icon='trash' />
          </span>}
        {count !== false && <span className={countClasses}>{count}</span>}
      </Link>
    )
  }
}

export default DropdownItem
