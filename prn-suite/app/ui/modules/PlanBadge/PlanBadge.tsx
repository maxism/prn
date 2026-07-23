import React, { Component, MouseEventHandler } from 'react'
import Icon from '../../elements/Icon/Icon'
import Tooltip from '../Tooltip/Tooltip'
import './PlanBadge.scss'

interface IProps {
  buttonOnClick?: MouseEventHandler
}

/**
 * Модуль DateRangePicker
 */
class PlanBadge extends Component<IProps> {
  render (): JSX.Element {
    return (
      <div className='plan-badge'>
        <Tooltip
          trigger={<Icon icon='locker' color='#D9D9D9' />}
          title='Ограниченный функционал'
          text='В текущем тарифе ретроспектива данных ограничена.'
          button='Изменить тариф'
          buttonOnClick={this.props.buttonOnClick}
        >
        </Tooltip>
      </div>
    )
  }
}

export default PlanBadge
