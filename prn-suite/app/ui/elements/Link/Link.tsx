import React, { Component, MouseEventHandler, ReactNode, RefObject } from 'react'
import cx from 'classnames'

import { NavLink, Link as ReactLink } from 'react-router-dom'

import './Link.scss'

interface IProps {
  /**
   * Дополнительные классы
   */
  className?: string,
  /**
   * Активная ссылка
   */
  active?: boolean,
  /**
   * Аттрибут style
   */
  style?: object,
  /**
   * Ссылка
   */
  to?: string,
  /**
   * Ссылка mailto:
   */
  mailto?: string,
  /**
   * Ссылка tel:
   */
  tel?: string,
  /**
   * Аттрибут download
   */
  download?: boolean,
  /**
   * Открывается ли ссылка в новом окне
   */
  _blank?: boolean,
  /**
   * Аттрибут Title
   */
  title?: string,
  /**
   * Обработчик клика
   */
  onClick?: MouseEventHandler,
  /**
   * Текст ссылки
   */
  children?: ReactNode
  /**
   * Точное соответствие для url
   */
  exact?: boolean
  /**
   * Отступ, если элемент находится в форме
   */
  inForm?: boolean
}

/**
 * Элемент Link
 */
class Link extends Component<IProps> {
  private ref: RefObject<any>

  static defaultProps = {
    to: '',
    _blank: false
  }

  constructor (props) {
    super(props)
    this.ref = React.createRef()
  }

  render (): JSX.Element {
    const { className, active, mailto, tel, download, _blank, title, children, onClick, style, exact, inForm } = this.props
    let { to } = this.props
    const { locale } = this.context && (this.context.i18n || {})
    to = to && to.replace('/:locale', `/${locale}`)

    const classes = cx('link', className, {
      'link--active': active,
      'link--in-form': inForm
    })

    if (mailto) return <a title={title} style={style} href={`mailto:${mailto}`} className={classes} ref={this.ref} onClick={onClick}>{children}</a>
    if (tel) return <a title={title} style={style} href={`tel:${tel}`} className={classes} ref={this.ref} onClick={onClick}>{children}</a>
    if (to) {
      if (_blank) {
        return (
          <a
            title={title}
            style={style}
            href={to}
            target='_blank'
            rel='noopener noreferrer'
            className={classes}
            ref={this.ref}
            onClick={onClick}
          >
            {children}
          </a>)
      }
      if (to.indexOf('http://') !== -1 || to.indexOf('https://') !== -1) {
        return <a title={title} style={style} href={to} onClick={onClick} className={classes} ref={this.ref} download={download}>{children}</a>
      } else if (this.ref) {
        return <ReactLink exact={exact} title={title} style={style} to={to} className={classes} activeClassName='active' onClick={onClick} innerRef={this.ref}>{children}</ReactLink>
      } else {
        return <NavLink exact={exact} title={title} style={style} to={to} className={classes} activeClassName='active' onClick={onClick}>{children}</NavLink>
      }
    } else return <span title={title} style={style} className={classes} onClick={onClick} ref={this.ref}>{children}</span>
  }
}

export default Link
