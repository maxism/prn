import React, { Component, MouseEventHandler, ReactNode } from 'react'
import cx from 'classnames'
import { SingletonRouter, withRouter } from 'next/router'

import Icon from '../Icon/Icon'
import { IIcon } from '../Icon/Icons'
import BaseButtonText from '../ButtonText/BaseButtonText'

import s from './ButtonTag.module.scss'

type ISize = 'm' | 's'
type IColor = 'grey' | 'dark' | 'orange' | 'green' | 'blue' | 'red' | string

interface IProps {
  router?: SingletonRouter
  /**
   *
   */
  colorBackground?: boolean
  /**
   * Иконка
   */
  icon?: IIcon | string
  /**
   * Текст кнопки
   */
  children?: ReactNode
  /**
   * Выделить текст
   */
  highlight?: string
  /**
   * Размер
   */
  size?: ISize
  /**
   * Бейдж
   */
  badge?: boolean
  /**
   * Счетчик количества
   */
  count?: number | string
  /**
   * Цвет
   */
  color?: IColor
  /**
   * Активна ли кнопка
   */
  disabled?: boolean
  /**
   * Обработчик клика
   */
  onClick?: MouseEventHandler
  /**
   * Ссылка
   */
  to?: string
  /**
   * Состояние активной кнопки (нажатой)
   */
  active?: boolean
  /**
   * Дополнительные классы
   */
  className?: string
  /**
   * Точное соответствие пути для активной кнопки по url
   */
  exact?: boolean
  /**
   * Открыть ссылку в новом окне
   */
  _blank?: boolean
  /**
   * indexGrade
   */
  indexGrade?: number
}

/**
 * Элемент ButtonText
 * Кнопка
 */
@(withRouter as any)
class ButtonTag extends Component<IProps> {

  static defaultProps = {
    size: 'm',
    color: 'grey'
  }

  render (): JSX.Element {
    const { router, children, highlight, onClick, to, size, badge, count, colorBackground, color, icon, disabled, active, className, exact, _blank, indexGrade } = this.props

    const classes = cx(s.element, {
      [s.colorBackground]: colorBackground,
      [s.sizeM]: size === 'm',
      [s.sizeS]: size === 's',
      [s.badge]: badge,
      [s.colorGrey]: color === 'grey',
      [s.colorDark]: color === 'dark',
      [s.colorOrange]: color === 'orange',
      [s.colorGreen]: color === 'green',
      [s.colorBlue]: color === 'blue',
      [s.colorRed]: color === 'red',
      [s.active]: active || (exact ? router.asPath === to : router.asPath.startsWith(to)),
      [s.disabled]: disabled,
    }, className)

    let highlightChildren = String(children)
    String(highlight).split(' ').filter(item => item.trim()).forEach(word => {
      highlightChildren = highlightChildren.replace(new RegExp(word,'i'), `<strong>${word}</strong>`)
    })

    let grade = ''
    if (indexGrade !== undefined) {
      if (indexGrade <= -2) grade = 'd'
      if (indexGrade > -2) grade = 'c'
      if (indexGrade > 0) grade = 'b'
      if (indexGrade > 2) grade = 'a'
      if (indexGrade > 10) grade = 'a_plus'
    }

    return (
      <BaseButtonText to={!disabled && to} className={classes} _blank={_blank} onClick={!disabled ? onClick : () => {}}>
        <>
          {icon && <Icon className={cx(s.icon, { [s.onlyIcon]: !children })} icon={icon} />}
          {grade === 'a_plus' && <Icon className={s.icon} icon='grade_a_plus_colored' />}
          {grade === 'a' && <Icon className={s.icon} icon='grade_a_colored' />}
          {grade === 'b' && <Icon className={s.icon} icon='grade_b_colored' />}
          {grade === 'c' && <Icon className={s.icon} icon='grade_c_colored' />}
          {grade === 'd' && <Icon className={s.icon} icon='grade_d_colored' />}
          {children && (
            <>
              {!highlight && <span>{children}</span>}
              {highlight && <span dangerouslySetInnerHTML={{ __html: highlightChildren }} />}
            </>
          )}
          {count !== undefined && <div className={s.countBlock}><span className={s.count}>{count}</span></div>}
        </>
      </BaseButtonText>
    )
  }
}

export default ButtonTag
