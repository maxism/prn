import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Image from '../Image/Image'

import './HeaderAccount.scss'

/**
 * Элемент HeaderAccount
 */
class HeaderAccount extends Component {
  static propTypes = {
    /**
     * Название
     */
    name: PropTypes.string,
    /**
     * Картинка
     */
    image: PropTypes.string,
    /**
     * Описание
     */
    description: PropTypes.string,
    /**
     * Содержимое элемента
     */
    onClick: PropTypes.func
  }

  render () {
    const { name, image, onClick } = this.props
    return (
      <div className='header-account' onClick={onClick}>
          <span className='header-account__name'>{name}</span>
          <Image className='header-account__image' round border src={image} noImage={require('./img/person.svg')} />
      </div>
    )
  }
}

export default HeaderAccount
