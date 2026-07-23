import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import Link from '../Link/Link'
import Icon from '../Icon/Icon'

import './Label.scss'

/**
 * 'Элемент Label - Метка
 */
class Label extends Component {
  static propTypes = {
    /**
     * Текст метки
     */
    children: PropTypes.string,
    /**
     * Дополнительные классы
     */
    className: PropTypes.string,
    /**
     * Размер метки
     */
    size: PropTypes.string,
    /**
     * Тип метки
     */
    type: PropTypes.string,
    visibility: PropTypes.string,
    /**
     * Цвет метки
     */
    color: PropTypes.string,
    /**
     * Обработчик onClick, при клике на название
     */
    onClick: PropTypes.func,
    /**
     * Обработчик onRemove
     */
    onRemove: PropTypes.func
  }

  getType (type) {
    if (type === 'private') {
      return 'person'
    }

    return 'global'
  }

  handleClick = e => {
    e.stopPropagation()
    this.props.onClick()
  }

  handleOnRemove = e => {
    e.stopPropagation()
    this.props.onRemove()
  }

  render () {
    const { children, className, size, color, visibility, onClick, type, onRemove } = this.props
    const labelVisibility = this.getType(visibility)

    const classes = cx('label', {
      [`label--${size}`]: size,
      [`label--${type}`]: type
    }, className)

    if (type === 'add') {
      return (
        <span className={classes} onClick={onClick}>
          <Icon icon='add' className='label__icon' />
          {children && <span className='label__add-text'>{children}</span>}
        </span>)
    }

    return (
      <span className={classes} onClick={this.handleClick}>
        <span className='label__content'>
          {color && <span className='label__color' style={{ backgroundColor: color }} />}
          {visibility && <Icon className='label__visibility' icon={labelVisibility} />}
          {children && <span className='label__text'>{children}</span>}
        </span>
        {onRemove && <Link className='label__remove' onClick={this.handleOnRemove}><Icon icon='close_circle' className='label__icon' /></Link>}
      </span>
    )
  }
}

export default Label
