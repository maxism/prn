import React, { Component } from 'react'
import cx from 'classnames'

import './CommunityMetric.scss'
import NumeralUtil, {NumeralFormat} from '../../../utils/NumeralUtil'
import Icon from '../Icon/Icon'

interface IProps {
  right?: boolean
  value: number
  deltaValue: number
  format?: NumeralFormat
  score: number
  best?: boolean
}

class CommunityMetric extends Component<IProps> {
  static defaultProps = {
    format: '0,0'
  }

  getDeltaValue = (): string => {
    const { value, deltaValue, format } = this.props
    if (!deltaValue) {
      return 'Нет изменений'
    }

    if (deltaValue) {
      const valuePct = (value !== deltaValue) ? Math.abs(deltaValue / (value - deltaValue)) : 1
      if (valuePct < 0.01) {
        return NumeralUtil.format(Math.max(valuePct, 0.0001), '0.00%')
      }
      return NumeralUtil.format(valuePct, '0,0%')
    }

    return ''
  }

  render (): JSX.Element {
    const { value, deltaValue, format, right, score, best } = this.props
    const classes = cx('community-metric', {
      'community-metric--right': right
    })

    let color = 'd9d9d9'
    if (best && !right) color = '2787f5'
    if (best && right) color = 'ff9f00'

    const deltaValueClasses = cx('community-metric__delta-value', {
      'community-metric__delta-value--red': deltaValue < 0,
      'community-metric__delta-value--grey': deltaValue === 0
    })

    return (
      <div className={classes}>
        <div className='community-metric__top'>
          <div className='community-metric__left'>
            <span className='community-metric__value'>{NumeralUtil.format(value, format)}</span>
            <span className={deltaValueClasses}>
              {Math.sign(deltaValue) < 0 && <Icon className='community-metric__delta-icon-down' icon='stats_down' />}
              {Math.sign(deltaValue) > 0 && <Icon className='community-metric__delta-icon-up' icon='stats_up' />}
              {this.getDeltaValue()}
            </span>
          </div>
          {/*best && <Icon className='community-metric__icon' icon='admin' />*/}
          <span className='community-metric__percent'>{NumeralUtil.format(score, '0,0%')}</span>
        </div>
        <div className='community-metric__progress'>
          <div
            className='community-metric__progress-value'
            style={{ width: `${Math.round(score * 100)}%`, backgroundColor: `#${color}` }}
          />
        </div>
      </div>
    )
  }
}

export default CommunityMetric
