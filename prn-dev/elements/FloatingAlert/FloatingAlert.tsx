import React, { Component, MouseEventHandler, ReactNode } from 'react'

import Icon from '../Icon/Icon'

import s from './FloatingAlert.module.scss'
import { IIcon } from '../Icon/Icons'
import ButtonText from '../ButtonText/ButtonText'

interface IProps {
  children?: ReactNode
  icon?: IIcon | string
  title?: string
  text?: string
  onClose?: MouseEventHandler
  buttonText?: string
  onClick?: MouseEventHandler
}

interface IStates {
  open: boolean
}

class FloatingAlert extends Component<IProps, IStates> {
  state: IStates = {
    open: true
  }

  componentDidUpdate (prevProps: Readonly<IProps>): void {
    if (prevProps.icon !== this.props.icon || prevProps.title !== this.props.title || prevProps.text !== this.props.text) {
      this.setState({ open: true })
    }
  }

  handleClose = (e) => {
    this.setState({ open: false })
    this.props.onClose(e)
  }

  render (): JSX.Element {
    const { icon, title, text, children, onClose, buttonText, onClick } = this.props

    if (!this.state.open) return null

    return (
      <div className={s.element}>
        <div className={s.container}>
          <div className={s.left}>
            <Icon className={s.iconMain} icon={icon} />
            <div className={s.main}>
              <span className={s.title}>{title}</span>
              <span className={s.text}>{text}</span>
            </div>
          </div>
          <div className={s.right}>
            {children}
            {onClose && <Icon onClick={(e) => this.handleClose(e)} className={s.iconRight} icon='error' />}
            {onClick && <ButtonText onClick={(e) => onClick(e)}>{buttonText}</ButtonText>}
          </div>
        </div>
      </div>
    )
  }
}

export default FloatingAlert
