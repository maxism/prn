import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import Link from '../../elements/Link/Link'
import Icon from '../../elements/Icon/Icon'

import './SocialInfo.scss'

/**
 * Вид SocialInfo - иконка соцсети с краткой ссылкой на сообщество
 */
class SocialInfo extends Component {
  static propTypes = {
    /**
     * Ссылка на сообщество
     */
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    /**
     * Иконка соцсети
     */
    social: PropTypes.string,
    /**
     * Иконка соцсети цветная или нет
     */
    colored: PropTypes.bool,
    /**
     * Цвет иконки
     */
    color: PropTypes.string,
    /**
     * Функция-обработчик клика
     */
    onClick: PropTypes.func,
    /**
     * Тип (для дополнительных стилей)
     */
    type: PropTypes.oneOf(['sortListItem'])
  }

  static defaultProps = {
    link: true
  }

  /**
   * Обработчик клика по ссылке
   *
   * @param e
   */
  handleClick = e => {
    e.stopPropagation()
    if (this.props.onClick) this.props.onClick(e)
  }

  render () {
    const { social, to, color, colored, type } = this.props
    const classes = cx('social-info', {
      [`social-info--type-${type}`]: type
    })

    let uri = to

    if (!uri) uri = ''

    if (uri.includes('www.youtube.com')) uri = uri.replace('?v=', '/')

    if (uri.indexOf('?') !== -1) uri = uri.split('?')[0]
    if (uri.indexOf('#') !== -1) uri = uri.split('#')[0]
    if (uri.indexOf('&') !== -1) uri = uri.split('&')[0]

    if (uri.charAt(uri.length - 1) === '/') uri = uri.substring(0, uri.length - 1)

    uri = uri.replace('http://www.facebook.com/', '')
    uri = uri.replace('https://www.facebook.com/', '')

    uri = uri.replace('http://facebook.com/', '')
    uri = uri.replace('https://facebook.com/', '')

    uri = uri.replace('http://odnoklassniki.ru/', '')
    uri = uri.replace('https://odnoklassniki.ru/', '')

    uri = uri.replace('http://ok.ru/', '')
    uri = uri.replace('https://ok.ru/', '')

    uri = uri.replace('http://twitter.com/', '')
    uri = uri.replace('https://twitter.com/', '')

    uri = uri.replace('http://vk.com/', '')
    uri = uri.replace('https://vk.com/', '')

    uri = uri.replace('http://instagram.com/', '')
    uri = uri.replace('https://instagram.com/', '')

    uri = uri.replace('http://www.instagram.com/', '')
    uri = uri.replace('https://www.instagram.com/', '')

    uri = uri.replace('http://www.pinterest.com/', '')
    uri = uri.replace('https://www.pinterest.com/', '')

    uri = uri.replace('http://www.youtube.com/', '')
    uri = uri.replace('https://www.youtube.com/', '')

    uri = uri.replace('http://telegram.me/', '')
    uri = uri.replace('https://telegram.me/', '')
    uri = uri.replace('http://t.me/', '')
    uri = uri.replace('https://t.me/', '')

    uri = uri.replace('http://www.tiktok.com/', '')
    uri = uri.replace('https://www.tiktok.com/', '')

    uri = uri.replace('http://zen.yandex.ru/id/', '')
    uri = uri.replace('https://zen.yandex.ru/id/', '')

    uri = uri.replace('http://zen.yandex.ru/', '')
    uri = uri.replace('https://zen.yandex.ru/', '')

    uri = uri.replace('http://dzen.ru/id/', '')
    uri = uri.replace('https://dzen.ru/id/', '')

    uri = uri.replace('http://dzen.ru/', '')
    uri = uri.replace('https://dzen.ru/', '')

    uri = uri.replace('http://rutube.ru/', '')
    uri = uri.replace('https://rutube.ru/', '')

    return (
      <Link className={classes} to={to} onClick={this.handleClick} _blank>
        <Icon
          className='social-info__icon'
          icon={colored ? `${social}_colored` : social}
          color={colored ? '' : color}
        />
        <span className='social-info__text'>
          {uri}
        </span>
      </Link>
    )
  }
}

export default SocialInfo
