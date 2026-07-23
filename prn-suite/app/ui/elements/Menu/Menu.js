import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Container from '../Container/Container'
import MenuGroup from './MenuGroup/MenuGroup'
import MenuLink from './MenuLink/MenuLink'
import MenuMain from './MenuMain/MenuMain'
import MenuProfile from './MenuProfile/MenuProfile'
import MenuLogo from './MenuLogo/MenuLogo'
import MenuProduct from './MenuProduct/MenuProduct'
import MenuProducts from './MenuProducts/MenuProducts'

import './Menu.scss'

/**
 * Элемент Меню
 */
class Menu extends Component {
  static propTypes = {
    /**
     * Содержимое элемента
     * */
    children: PropTypes.node
  }

  static defaultProps = {
    open: false
  }

  static Group = MenuGroup
  static Link = MenuLink
  static Main = MenuMain
  static Profile = MenuProfile
  static Logo = MenuLogo
  static Product = MenuProduct
  static Products = MenuProducts

  render () {
    const { children } = this.props

    return (
      <div className='menu'>
        <Container>
          {children}
        </Container>
      </div>
    )
  }
}

export default Menu
