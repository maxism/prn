import React, { Component, ReactNode } from 'react'
import cx from 'classnames'

import s from './TextColor.module.scss'
import eventStack from '../../lib/eventStack'

type TTextColor = 'white' | 'black' | 'light' | 'grey' | 'dark' | 'super-dark' | 'blue' | 'red' | 'green' | 'orange' | 'deep' | 'high'

interface IProps {
  children: ReactNode
  color?: TTextColor | string
  gradientColor?: string
  /**
   * Максимальное количество строк
   */
  maxLines?: number
}

interface IStates {
  htmlToImage: boolean
}

/**
 * Элемент TextColor
 * Выделаяет текст цветом или градиентом
 */
export default class TextColor extends Component<IProps, IStates> {
  state: IStates = {
    htmlToImage: false
  }

  constructor (props) {
    super(props)

    eventStack.sub('htmlToImage', (value) => this.setState({ htmlToImage: value }))
  }

  render (): JSX.Element {
    const { children, color, gradientColor, maxLines } = this.props

    const classes = cx(s.element, {
      [s.gradient]: gradientColor && !this.state.htmlToImage,

      [s.colorWhite]: color === 'white',
      [s.colorBlack]: color === 'black',
      [s.colorLight]: color === 'light',
      [s.colorGrey]: color === 'grey',
      [s.colorDark]: color === 'dark',
      [s.colorSuperDark]: color === 'super-dark',
      [s.colorBlue]: color === 'blue',
      [s.colorRed]: color === 'red',
      [s.colorGreen]: color === 'green',
      [s.colorOrange]: color === 'orange',
      [s.colorDeep]: color === 'deep',
      [s.colorHigh]: color === 'high',

      [s.gradientColorWhite]: gradientColor === 'white',
      [s.gradientColorBlack]: gradientColor === 'black',
      [s.gradientColorLight]: gradientColor === 'light',
      [s.gradientColorGrey]: gradientColor === 'grey',
      [s.gradientColorDark]: gradientColor === 'dark',
      [s.gradientColorSuperDark]: gradientColor === 'super-dark',
      [s.gradientColorBlue]: gradientColor === 'blue',
      [s.gradientColorRed]: gradientColor === 'red',
      [s.gradientColorGreen]: gradientColor === 'green',
      [s.gradientColorOrange]: gradientColor === 'orange',
      [s.gradientColorDeep]: gradientColor === 'deep',
      [s.gradientColorHigh]: gradientColor === 'high',

      [s.maxLines]: maxLines
    }, 'off-html-to-image-textColor')

    let style = {}
    if (color.includes('#')) style['--textColor'] = color
    if ((gradientColor || color).includes('#')) style['--textGradientColor'] = gradientColor || color
    if (maxLines) style['--maxLines'] = maxLines

    return (
      /* @ts-ignore */
      <span className={classes} style={style}>
        {children}
      </span>)
  }
}

