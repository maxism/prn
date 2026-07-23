import React, { Component } from 'react'
import { throttle } from 'lodash'
import eventStack from '../../../lib/eventStack'
import uuid from '../../behaviors/Uuid/Uuid'
import cx from 'classnames'
import Icon from '../Icon/Icon'

import './ScrollUp.scss'

interface IStates {
  isShow: boolean
}

class ScrollUp extends Component<{}, IStates> {
  private uuid: string
  private _throttleHandleUpdate: Function

  state = {
    isShow: false
  }

  constructor (props) {
    super(props)
    this.uuid = uuid()
  }

  componentDidMount (): void {
    this._throttleHandleUpdate = throttle(this.handleUpdate, 100)

    eventStack.sub('scroll', this._throttleHandleUpdate, 'Popup', this.uuid)
    eventStack.sub('resize', this._throttleHandleUpdate, 'Popup', this.uuid)
  }

  componentWillUnmount (): void {
    eventStack.unsub('scroll', this._throttleHandleUpdate, 'Popup', this.uuid)
    eventStack.unsub('resize', this._throttleHandleUpdate, 'Popup', this.uuid)
  }

  handleUpdate = (e) => {
    if (window.pageYOffset > 100) {
      if (!this.state.isShow) this.setState({ isShow: true })
    } else {
      if (this.state.isShow) this.setState({ isShow: false })
    }
  }

  render (): JSX.Element {

    const classes = cx('scroll-up', {
      'scroll-up--show': this.state.isShow
    })

    return (
      <div className={classes} onClick={e => window.scrollTo(0, 0)}>
        <Icon className='scroll-up__icon' icon='up' />
      </div>
    )
  }
}

export default ScrollUp
