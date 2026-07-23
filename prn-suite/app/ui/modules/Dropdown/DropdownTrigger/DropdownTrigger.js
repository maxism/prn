import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import Icon from '../../../elements/Icon/Icon'

import './DropdownTrigger.scss'

class DropdownTrigger extends Component {
  static propTypes = {
    /**
     * Состояние открыт/закрыт
     */
    opened: PropTypes.bool,
    /**
     * Иконка слева
     */
    icon: PropTypes.string,
    /**
     * Цвет иконки слева
     */
    iconColor: PropTypes.string,
    /**
     * Field name у кнопки-триггера
     */
    label: PropTypes.string,
    /**
     * Разновидность стилизации кнопки c Field name снизу
     */
    labelBottom: PropTypes.bool,
    /**
     * Значение кнопки
     */
    name: PropTypes.string,
    /**
     * Disabled у кнопки
     */
    disabled: PropTypes.bool,
    /**
     * Подпись кнопки
     */
    caption: PropTypes.string,
    onClick: PropTypes.func,
    classname: PropTypes.string
  }

  static defaultProps = {
    label: '',
    caption: ''
  }

  render () {
    const { opened, onClick, name, label, icon, labelBottom, disabled, iconColor, classname, caption } = this.props

    const classes = cx('dropdown-trigger', {
      'dropdown-trigger--no-label': !label.length && !caption.length,
      'dropdown-trigger--label-bottom': labelBottom,
      'dropdown-trigger--disabled': disabled,
      [`dropdown-trigger--${iconColor}`]: iconColor
    }, classname)

    return (
      <button
        className={classes}
        onClick={onClick}
        type='button'
        disabled={disabled}
      >
        <div className='dropdown-trigger__main'>
          {icon && <Icon className='dropdown-trigger__icon' color={iconColor} icon={icon} />}
          <div className='dropdown-trigger__text'>
            {label && <p className='dropdown-trigger__label'>{label}</p>}
            <p className='dropdown-trigger__name'>{name}</p>
            {caption && <p className='dropdown-trigger__caption'>{caption}</p>}
          </div>
          <Icon className='dropdown-trigger__icon-close' icon={opened ? 'up' : 'down'} />
        </div>

      </button>
    )
  }
}

export default DropdownTrigger
