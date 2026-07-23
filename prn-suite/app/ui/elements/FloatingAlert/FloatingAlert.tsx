import React, { Component, MouseEventHandler } from 'react'

import './FloatingAlert.scss'
import Icon from '../Icon/Icon'

interface IProps {
  icon?: string
  title?: string
  text?: string
  onClose?: MouseEventHandler
}

interface IStates {
  open: boolean
}

class FloatingAlert extends Component<IProps, IStates> {
  state: IStates = {
    open: true
  }

  componentDidUpdate (prevProps: Readonly<IProps>, prevState: Readonly<{}>, snapshot?: any): void {
    if (prevProps.icon !== this.props.icon || prevProps.title !== this.props.title || prevProps.text !== this.props.text) {
      this.setState({ open: true })
    }
  }

  handleClose = (e) => {
    this.setState({ open: false })
    this.props.onClose(e)
  }

  render (): JSX.Element {
    const { icon, title, text, children, onClose } = this.props

    if (!this.state.open) return null

    return (
      <div className='floating-alert'>
        <Icon className='floating-alert__icon-main' icon={icon} />
        <div className='floating-alert__main'>
          <span className='floating-alert__title'>{title}</span>
          <span className='floating-alert__text'>{text}</span>
        </div>
        <div className='floating-alert__right'>
          { children }
          {onClose && <Icon onClick={(e) => this.handleClose(e)} className='floating-alert__icon-right' icon='close_circle' />}
        </div>
      </div>
    )
  }
}

export default FloatingAlert
