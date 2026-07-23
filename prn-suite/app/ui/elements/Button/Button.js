import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import _ from 'lodash'

import Icon from '../Icon/Icon'
import Image from '../Image/Image'
import Link from '../../elements/Link/Link'

import './Button.scss'

/**
 * Элемент Button
 */
class Button extends Component {
  static propTypes = {
    /**
     * Текст
     */
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    /**
     *  Альтернативный текст (Для мобайла, основной текст скрывается)
     */
    altText: PropTypes.string,
    /**
     * Размер
     */
    size: PropTypes.oneOf(['extra-large', 'big', 'big-square', 'medium', 'medium-square', 'social', 'small',
      'small-square', 'menu', 'caption', 'small-tooltip']),
    /**
     * Размер шрифта
     */
    textSize: PropTypes.string,
    /**
     * Цвет
     */
    color: PropTypes.oneOf(['default', 'white', 'empty', 'transparent', 'gray', 'grey', 'light-grey', 'alt-gray', 'alt-grey',
      'light-gray', 'dark-blue', 'hv-red', 'pi', 'vk', 'inst', 'yt', 'fb', 'tw', 'gp',
      'ok', 'warning', 'orange', 'light-orange', 'pink', 'green', 'sky',
      'ultra-light-gray', 'ultra-light-grey', 'white-invert']),
    /**
     * TextColor
     */
    textColor: PropTypes.string,
    /**
     * Цвет бордера
     */
    borderColor: PropTypes.oneOf(['white', 'black', 'default', 'gray', 'grey', 'light-grey', 'light-gray']),
    /**
     * Размер бордерРадиуса
     */
    borderRadius: PropTypes.oneOf(['big', 'medium', 'small']),
    /**
     * Цвет кнопки при наведении
     */
    hoverColor: PropTypes.oneOf(['dark-blue', 'red', 'grey']),
    /**
     * Жирный шрифт
     */
    bold: PropTypes.bool,
    /**
     * Выравнивание по вертикали
     */
    valign: PropTypes.oneOf(['center', 'top', 'bottom']),
    /**
     * Выравнивание по горизонтали
     */
    halign: PropTypes.oneOf(['left', 'center', 'right', 'between', 'around']),
    /**
     * Иконка
     */
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    /**
     * Картинка
     */
    image: PropTypes.string,
    /**
     * Иконка справа
     */
    postIcon: PropTypes.string,
    /**
     * Цвет иконки
     */
    iconColor: PropTypes.string,
    /**
     * Значок закладки
     */
    bookmark: PropTypes.bool,
    /**
     * Сортировка
     */
    sort: PropTypes.string,
    /**
     * Выбрана ли данная кнопка сортировки
     */
    sortSelected: PropTypes.bool,
    /**
     * Значок добавленной закладки
     */
    bookmarkAdd: PropTypes.bool,
    /**
     * Подпись
     */
    caption: PropTypes.string,
    /**
     * Счетчик
     */
    count: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    /**
     * Является ли кнопка не активной
     */
    disabled: PropTypes.bool,
    /**
     * Является ли кнопка не активной (белая)
     */
    disabledWhite: PropTypes.bool,
    /**
     * Состояние загрузки
     */
    loading: PropTypes.bool,
    /**
     * Является ли кнопка активной
     */
    active: PropTypes.bool,
    /**
     * Ссылка
     */
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    /**
     * Ссылка mailto:
     */
    mailto: PropTypes.string,
    /**
     * Ссылка tel:
     */
    tel: PropTypes.string,
    /**
     * Открыть ссылку в новом окне
     */
    _blank: PropTypes.bool,
    /**
     * Кнопка на мобильном мконкой, на десктопе текстом
     */
    mobile: PropTypes.bool,
    /**
     * Дополнительные классы
     */
    className: PropTypes.string,
    /**
     * Является ли кнопка растянутой
     */
    wide: PropTypes.bool,
    /**
     * Является ли кнопка растянутой
     */
    fullWidth: PropTypes.bool,
    /**
     * Кнопка является элементом button типа reset
     */
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    /**
     * Обработчик onRef
     */
    onRef: PropTypes.func,
    /**
     * Точное соответствие для url
     */
    exact: PropTypes.bool,
    /**
     * Нижняя подсветка
     */
    bottomShadow: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    attention: PropTypes.bool,
    trancuate: PropTypes.bool,
    /**
     * Для дополнительных стилей оформления
     */
    extensibleType: PropTypes.string
  }

  static defaultProps = {
    to: '',
    _blank: false,
    disabled: false,
    loading: false,
    size: 'medium',
    type: 'button',
    halign: 'center'
  }

  static contextTypes = {
    i18n: PropTypes.object.isRequired
  }

  handleClick = (e) => {
    const { disabled } = this.props

    if (disabled) {
      e.preventDefault()
      return
    }

    _.invoke(this.props, 'onClick', e, this.props)
  }

  handleOnRef = (c) => {
    if (this.props.onRef) this.props.onRef(c)
  }

  render () {
    const {
      className, size, textSize, color, textColor, hoverColor, bold, count, bookmark, bookmarkAdd, icon, image, _blank, mailto, tel, active, wide, fullWidth, type,
      children, altText, caption, iconColor, loading, disabled, attention, trancuate, extensibleType,
      postIcon, halign, valign, mobile, borderColor, sort, sortSelected, exact, bottomShadow, borderRadius, disabledWhite
    } = this.props

    let { to } = this.props
    const { locale } = this.context && (this.context.i18n || {})
    to = to && to.replace('/:locale', `/${locale}`)

    const classes = cx('ui button', className, {
      [size]: size,
      [color]: color,
      [`border-radius--${borderRadius}`]: borderRadius,
      [`hover--${hoverColor}`]: hoverColor,
      [`text--${textColor}`]: textColor,
      [`text--size-${textSize}`]: textSize,
      [`h-${halign}`]: halign,
      [`v-${valign}`]: valign,
      mobile: mobile,
      'disabled-white': disabledWhite,
      active: active,
      wide: wide,
      fullWidth: fullWidth,
      loading: loading,
      bookmark: bookmark,
      'bookmark--add': bookmarkAdd,
      bold: bold,
      [`border--${borderColor}`]: borderColor,
      [`sort--${sort}`]: sort,
      'sort--selected': sortSelected,
      attention: attention,
      trancuate: trancuate,
      [`button--extType-${extensibleType}`]: extensibleType
    })

    if (mailto) {
      return (
        <Link className={classes} mailto={mailto}>
          {icon && <Icon icon={icon} color={iconColor} />}
          {image && <Image className='button__image' src={image} />}
          {altText && <span className='button__altText'>{altText}</span>}
          {(children || caption) &&
            <div className='button__text-block'>
              {children && <span className='button__text'>{children}</span>}
              {caption && <span className='button__caption'>{caption}</span>}
            </div>}
          {count && <span className='button__count'>{count}</span>}
          {postIcon && <Icon className='post-icon' icon={postIcon} color={iconColor} />}
        </Link>)
    }

    if (tel) {
      return (
        <Link className={classes} tel={tel}>
          {icon && <Icon icon={icon} color={iconColor} />}
          {image && <Image className='button__image' src={image} />}
          {altText && <span className='button__altText'>{altText}</span>}
          {(children || caption) &&
            <div className='button__text-block'>
              {children && <span className='button__text'>{children}</span>}
              {caption && <span className='button__caption'>{caption}</span>}
            </div>}
          {count && <span className='button__count'>{count}</span>}
          {postIcon && <Icon className='post-icon' icon={postIcon} color={iconColor} />}
        </Link>
      )
    }

    if (to) {
      if (_blank) {
        return (
          <a
            className={classes}
            href={to}
            rel='noreferrer noopener'
            target='_blank'
            ref={this.handleOnRef}
          >
            {icon && <Icon icon={icon} color={iconColor} />}
            {image && <Image className='button__image' src={image} />}
            {altText && <span className='button__altText'>{altText}</span>}
            {(children || caption) &&
              <div className='button__text-block'>
                {children && <span className='button__text'>{children}</span>}
                {caption && <span className='button__caption'>{caption}</span>}
              </div>}
            {count && <span className='button__count'>{count}</span>}
            {postIcon && <Icon className='post-icon' icon={postIcon} color={iconColor} />}
          </a>
        )
      } else {
        return (
          <Link
            className={classes}
            activeClassName='active'
            exact={exact}
            to={to}
            onClick={this.handleClick}
            onRef={this.handleOnRef}
          >
            {icon && <Icon icon={icon} color={iconColor} />}
            {image && <Image className='button__image' src={image} />}
            {altText && <span className='button__altText'>{altText}</span>}
            {(children || caption) &&
              <div className='button__text-block'>
                {children && <span className='button__text'>{children}</span>}
                {caption && <span className='button__caption'>{caption}</span>}
              </div>}
            {count && <span className='button__count'>{count}</span>}
            {postIcon && <Icon className='post-icon' icon={postIcon} color={iconColor} />}
          </Link>
        )
      }
    } else {
      return (
        <button
          className={classes}
          type={type}
          disabled={disabled || disabledWhite}
          onClick={this.handleClick}
          ref={this.handleOnRef}
          style={bottomShadow ? {
            boxShadow: `0 -3px ${bottomShadow} inset`
          } : {}}
        >
          {icon && <Icon icon={icon} color={iconColor} />}
          {image && <Image className='button__image' src={image} />}
          {altText && <span className='button__altText'>{altText}</span>}
          {(children || caption) &&
            <div className='button__text-block'>
              {children && <span className='button__text'>{children}</span>}
              {caption && <span className='button__caption'>{caption}</span>}
            </div>}
          {count && <span className='button__count'>{count}</span>}
          {postIcon && <Icon className='post-icon' icon={postIcon} color={iconColor} />}
        </button>
      )
    }
  }
}

export default Button
