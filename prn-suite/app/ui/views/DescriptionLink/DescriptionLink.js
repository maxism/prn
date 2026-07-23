import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

import Icon from '../../elements/Icon/Icon'

import './DescriptionLink.scss'

/**
 * Элемент DescriptionLink
 * Ссылка с описанием
 */
class DescriptionLink extends Component {
  static propTypes = {
    /**
     * Заголовок
     */
    title: PropTypes.string,
    /**
     * Описание
     */
    description: PropTypes.string,
    /**
     * Иконка
     */
    icon: PropTypes.string,
    /**
     * Url
     */
    to: PropTypes.string
  }

  static contextTypes = {
    i18n: PropTypes.object.isRequired
  }

  render () {
    const { title, description, icon } = this.props
    let { to } = this.props
    const { locale } = this.context && (this.context.i18n || {})
    to = to && to.replace('/:locale', `/${locale}`)

    return (
      <NavLink to={to} className='description-link'>
        <div className='description-link__main'>
          <span className='description-link__title'>{title}</span>
          <span className='description-link__description'>{description}</span>
        </div>
        <Icon className='description-link__icon' icon={icon} />
      </NavLink>)
  }
}

export default DescriptionLink
