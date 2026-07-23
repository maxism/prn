import React, {Component, MouseEventHandler} from 'react'

import './MetricPieButton.scss'
import Icon from '../Icon/Icon'

interface IProps {
  onClick: MouseEventHandler
}

class MetricPieButton extends Component<IProps> {
  render (): JSX.Element {

    return (
      <div className='metric-pie-button' onClick={this.props.onClick}>
        <Icon className='metric-pie-button__icon' icon='add' />
        {/*<span className='metric-pie-button__label'>Label</span>*/}
      </div>
    )

  }
}

export default MetricPieButton
