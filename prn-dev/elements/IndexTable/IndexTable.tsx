import React, {Component, MouseEventHandler} from 'react'
import cx from 'classnames'

import ISocialType from '../../interfaces/ISocialType'
import s from './IndexTable.module.scss'
import BlockGroup from '../Block/BlockGroup'
import Block from '../Block/Block'
import SocialDataUtil from '../../utils/SocialDataUtil'
import NumeralUtil from '../../utils/NumeralUtil'
import Icon from '../Icon/Icon'

interface IIndexTableItem {
  index: number
  socialType: ISocialType
  deltaWeek: number
  deltaMonth: number
  onClick: MouseEventHandler
}

interface IProps {
  /**
   * Данные
   */
  data: Array<IIndexTableItem>
}

/**
 * Элемент Image
 */
export default class IndexTable extends Component<IProps> {
  getDelta = (num: number): { delta: number | string, direction: string } => {
    let delta: number | string = num
    let direction = ''
    if (Number(delta) > 0) direction = 'stats_up'
    if (Number(delta) < 0) {
      direction = 'stats_down'
      delta = -delta
    }

    if (delta !== undefined) delta = NumeralUtil.format(Number(delta), '0%')

    if (['0', '0%', '0.0%'].includes(String(delta))) {
      delta = 0
      direction = ''
    }

    if (String(delta).length > 5) delta = '9999+%'

    return {
      delta,
      direction
    }
  }

  render (): JSX.Element {
    let { data } = this.props

    return (
      <BlockGroup>
        <Block>
          <div className={s.element}>
            <div className={s.containerHeader}>
              <span className={cx(s.sizeSocial, s.title)}>Индекс социальной сети</span>
              <span className={cx(s.sizeDelta, s.title)}>За неделю</span>
              <span className={cx(s.sizeDelta, s.title)}>За месяц</span>
            </div>

            {data.map(item => (
              <div className={s.socialItem} key={item.socialType} onClick={item.onClick}>

                <div className={cx(s.sizeSocial, s.progressBar)}>
                  <div className={s.progressBarValue} style={{ width: `${item.index}%` }}>
                    <span className={s.index}>{NumeralUtil.format(item.index, '0.0')}</span>
                    <span className={s.value}>{SocialDataUtil.getSocialTypeName(item.socialType)}</span>
                  </div>
                </div>

                <div className={cx(s.sizeDelta, s.containerDelta)}>
                  <span className={s.nameWeek}>За неделю</span>
                  {this.getDelta(item.deltaWeek).delta && (
                    <div className={s.containerDeltaValue}>
                      <Icon className={cx(s.deltaIcon, { [s.up]: this.getDelta(item.deltaWeek).direction === 'stats_up', [s.down]: this.getDelta(item.deltaWeek).direction === 'stats_down'})} icon={this.getDelta(item.deltaWeek).direction} />
                      <span className={cx(s.deltaValue, { [s.up]: this.getDelta(item.deltaWeek).direction === 'stats_up', [s.down]: this.getDelta(item.deltaWeek).direction === 'stats_down'})}>{this.getDelta(item.deltaWeek).delta}</span>
                    </div>
                  ) || '—'}
                </div>

                <div className={cx(s.sizeDelta, s.containerDelta)}>
                  <span className={s.nameWeek}>За месяц</span>
                  {this.getDelta(item.deltaMonth).delta && (
                    <div className={s.containerDeltaValue}>
                      <Icon className={cx(s.deltaIcon, { [s.up]: this.getDelta(item.deltaMonth).direction === 'stats_up', [s.down]: this.getDelta(item.deltaMonth).direction === 'stats_down'})} icon={this.getDelta(item.deltaMonth).direction} />
                      <span className={cx(s.deltaValue, { [s.up]: this.getDelta(item.deltaMonth).direction === 'stats_up', [s.down]: this.getDelta(item.deltaMonth).direction === 'stats_down'})}>{this.getDelta(item.deltaMonth).delta}</span>
                    </div>
                  ) || '—'}
                </div>
              </div>
            ))}
          </div>
        </Block>
      </BlockGroup>
    )
  }
}
