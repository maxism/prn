import React, { Component } from 'react'
import cx from 'classnames'

import './Switch.scss'
import Icon from '../Icon/Icon'

interface IProps {
  active?: boolean
  loading?: boolean
}

/**
 * Элемент Switch.
 * Переключатель
 */

class Switch extends Component<IProps> {
  render (): JSX.Element {

    const { active, loading } = this.props
    const classes = cx('switch', {
      'switch--active': active,
      'switch--loading': loading
    })

    return (
      <div className={classes}>
        <div className='switch__circle' />
        {loading && <Icon className='switch__loader' icon='loading_dots_square'/>}
      </div>
    )
  }
}

export default Switch
