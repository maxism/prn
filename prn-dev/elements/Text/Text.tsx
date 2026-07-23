import React, {Component, MouseEventHandler, ReactNode} from 'react'
import cx from 'classnames'

import s from './Text.module.scss'

type Size = 'xs' | 's' | 'm' | 'l' | 'xl'

interface IProps {
  className?: string
  children: ReactNode
  size?: Size
  center?: boolean
  right?: boolean
  /**
   * Вертикальное выравнивание текста поцентру
   */
  middle?: boolean
  /**
   * Полужирный
   */
  semibold?: boolean
  /**
   * Жирный
   */
  bold?: boolean
  /**
   * Обработчик клика
   */
  onClick?: MouseEventHandler
  /**
   * Максимальная ширина
   */
  maxWidth?: number | boolean | string
  /**
   * Максимальное количество строк
   */
  maxLines?: number
  paddingLeft?: number
}

/**
 * Элемент Text
 * Выводит текст или абзацы текста
 */
export default class Text extends Component<IProps> {
  static defaultProps = {
    size: 'm',
    paddingLeft: 0
  }

  render (): JSX.Element {
    let { children, size, center, right, middle, semibold, bold, className, onClick, maxWidth, maxLines, paddingLeft } = this.props

    // todo: Может выступать в виде span или p

    const classes = cx(s.element, className, {
      [s.xs]: size === 'xs',
      [s.s]: size === 's',
      [s.m]: size === 'm',
      [s.l]: size === 'l',
      [s.xl]: size === 'xl',
      [s.center]: center,
      [s.right]: right,
      [s.middle]: middle,
      [s.semibold]: semibold,
      [s.bold]: bold,
      [s.maxLines]: maxLines
    })

    /*const list = Children.map(this.props.children, child => {
      if (typeof child === 'string') {
        const paragraphs = child.split('\\n')
        return paragraphs.map((paragraph, p) => {
          const lines = paragraph.split('\\r')
          return (<p className={s.p} key={p}>{lines.map((line, l) => {
            const bulls = line.split('\\b')
            return (<span className={s.l} key={`${p}_${l}`}>
              {bulls.map((bull, b) => (
                <>{bull.trim()}{(b < bulls.length - 1) && <span className={s.bull}>&bull;</span>}</>
              ))}
            </span>)})}</p>)
        })
      }
      return child
    })*/

    if (maxWidth === true) maxWidth = '100%'

    // @ts-ignore
    return (<span className={classes} onClick={onClick} style={{ maxWidth: String(maxWidth), '--maxLines': maxLines, '--paddingLeft': `${paddingLeft}px` }}>{children}</span>)
  }
}

