import React, { Component  } from 'react'
import cx from 'classnames'

import s from './CommunityScore.module.scss'
import Icon from '../Icon/Icon'

interface IProps {
  className: string
  /**
   * Болшой размер индикатора для метрик
   */
  big?: boolean
  /**
   * Значение score
   */
  score: number
}

/**
 * Индикатор Community Score
 */
export default class CommunityScore extends Component<IProps> {

  render (): JSX.Element {

    const { className, big, score } = this.props

    const classes = cx(s.element, {
      [s.big]: big,
      [s.scoreA]: score > 0.7,
      [s.scoreB]: score > 0.5,
      [s.scoreC]: score > 0.3,
      [s.scoreD]: score !== null && score >= 0
    }, className)

    return (
      <div className={classes}>
        <Icon icon='circle' className={s.section} />
      </div>
    )
  }
}
