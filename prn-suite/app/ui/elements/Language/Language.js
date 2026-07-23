import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Image from '../../elements/Image/Image'
import Link from '../../elements/Link/Link'
import Dropdown from '../../modules/Dropdown/Dropdown'

import './Language.scss'
import icons from './icons'

/**
 * Элемент Language
 */
class Language extends Component {
  static propTypes = {
    /**
     * Язык
     */
    locale: PropTypes.oneOf(['ru', 'en', 'de']).isRequired,
    /**
     * Обработчик onChange, вызывается при изменении языка
     */
    onChange: PropTypes.func
  }

  state = {
    open: false
  }

  handleChange = (locale) => {
    if (this.props.onChange) this.props.onChange(locale)

    this.handleClose()
  }

  handleOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  renderItem (type, locale) {
    let name, icon

    if (locale === 'ru') {
      name = 'Русский'
      icon = 'russian'
    }
    if (locale === 'en') {
      name = 'English'
      icon = 'english'
    }

    return (
      <Link to='' className={`language__${type}`} onClick={() => type !== 'main' && this.handleChange(locale)}>
        <Image
          className='language__ico'
          src={icons[icon]}
          alt={name}
        />
        {name}
      </Link>
    )
  }

  render () {
    const { locale } = this.props

    const locales = ['ru', 'en']

    return (
      <Dropdown
        className='language'
        position='top-right'
        onOpen={this.handleOpen}
        onClose={this.handleClose}
        trigger={this.renderItem('main', locale)}
        open={this.state.open}
      >
        <Dropdown.List>
          {locales.map(locale => <Dropdown.Item key={locale} as={this.renderItem('item', locale)} />)}
        </Dropdown.List>
      </Dropdown>
    )
  }
}

export default Language
