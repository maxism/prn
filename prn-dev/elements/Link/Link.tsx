import React, {Component, MouseEventHandler, ReactNode} from 'react'
import { withRouter, SingletonRouter } from 'next/router'
import NavLink from 'next/link'
import cx from 'classnames'
import qs from 'qs'

import s from './Link.module.scss'
import { IIcon } from '../Icon/Icons'
import Icon from '../Icon/Icon'

interface IProps {
  /**
   * Иконка
   */
  icon?: IIcon | string
  /**
   * Ссылка
   */
  to?: string
  /**
   * Текст
   */
  children?: ReactNode
  /**
   * Открывать в новом окне
   */
  newTab?: boolean
  /**
   * Обработчик клика
   */
  onClick?: MouseEventHandler
  /**
   * Классы
   */
  className?: string
  /**
   * Класс активной ссылки
   */
  activeClassName?: string
  /**
   * SingletonRouter
   */
  router?: SingletonRouter
  /**
   * Точное соответствие пути для активной кнопки по url
   */
  exact?: boolean
  /**
   * Убрать стандартный синий цвет
   */
  noColor?: boolean
}

/**
 * Элемент Link
 */
@(withRouter as any)
export default class Link extends Component<IProps> {
  render (): JSX.Element {
    let { children, icon, to, onClick, newTab, router, className, activeClassName, exact, noColor } = this.props

    const scroll = !String(to).includes('scroll=false')
    to = String(to || '').replace('&scroll=false', '').replace('scroll=false', '')
    if (to.endsWith('?')) to = to.substring(0, to.length - 1)
    if (to.startsWith('?')) {
      let path = router.asPath.includes('?') ?  router.asPath.slice(0, router.asPath.indexOf('?')) :  router.asPath

      // console.log(path)

      // console.log(router)

      path = path.concat('?').concat(qs.stringify({ ...router.query, ...qs.parse(to.slice(1))}, { encode: false }))
      // console.log('path', path)
      to = path
    }

    const uri = String(to || '').includes('?') ? to.split('?')[0] : to
    const active = exact ? router.asPath === uri : router.asPath.startsWith(uri)

    const classes = cx(s.element, className, {
      [s.active]: active,
      [activeClassName || '']: active,
      [s.noColor]: noColor
    })

    if (to) return <NavLink href={to} scroll={scroll} as={to}><a target={newTab && '_blank'} onClick={onClick} className={classes}>{icon && <Icon icon={icon} />}{children}</a></NavLink>
    else return <div onClick={onClick} className={cx(s.element, classes)}>{icon && <Icon icon={icon} />}{children}</div>
  }
}
