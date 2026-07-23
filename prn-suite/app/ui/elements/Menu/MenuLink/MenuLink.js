import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import Icon from '../../Icon/Icon'
import Link from '../../Link/Link'
import Tooltip from '../../../modules/Tooltip/Tooltip'

import './MenuLink.scss'

/**
 * Элемент MenuLink
 */
class MenuLink extends Component {
  static propTypes = {
    /**
     * Содержимое элемента
     */
    children: PropTypes.node,
    /**
     * Дополнительные классы
     */
    className: PropTypes.string,
    /**
     * Иконка
     */
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    /**
     * Является ли элемент элемент активным
     */
    active: PropTypes.bool,
    /**
     * Ссылка
     */
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    exact: PropTypes.bool,
    /**
     * Обработчик OnClick, вызывается при нажатии на кнопку
     */
    onClick: PropTypes.func,
    /**
     * Открывать в новом окне
     */
    _blank: PropTypes.bool,
    /**
     * Disabled-состояние пункта меню
     */
    disabled: PropTypes.bool,
    /**
     * Текст тултипа пункта меню
     */
    tooltipText: PropTypes.string
  }

  static defaultProps = {
    to: ''
  }

  render () {
    const { className, icon, to, active, children, onClick, _blank, exact, disabled, tooltipText } = this.props

    const classes = cx('menu-link', className, {
      active: active,
      'menu-link--disabled': disabled
    })

    if (disabled) {
      return (
        <Tooltip
          className={classes}
          interactive
          trigger={
            <Link _blank={false} className={classes}>
              {typeof icon === 'string' ? <Icon icon={icon} /> : icon}
              {children && <span className='menu-link__text'>{children}</span>}
            </Link>
          }
        >
          <p>{tooltipText}</p>
        </Tooltip>
      )
    }

    return (
      <Link _blank={_blank} to={to} className={classes} onClick={onClick} exact={exact}>
        {typeof icon === 'string' ? <Icon icon={icon} /> : icon}
        {children && <span className='menu-link__text'>{children}</span>}
      </Link>
    )
  }
}

export default MenuLink
