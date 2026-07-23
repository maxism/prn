import React, { Component, MouseEventHandler, ReactNode } from 'react'
import eventStack from '../../../lib/eventStack'
import Icon from '../Icon/Icon'
import cx from 'classnames'

import './ModalPopup.scss'
import PropsUtil from '../../../utils/PropsUtil'

interface IProps {
  /**
   * Тело попапа
   */
  children: ReactNode
  /**
   * Обработчик клика кнопки закрытия
   */
  onCloseClick?: MouseEventHandler
  /**
   * Показать модальное окно
   */
  open?: boolean
  /**
   * Широкое модальное окно
   */
  wide?: boolean
}

class ModalPopup extends Component<IProps> {
  componentDidUpdate (prevProps: Readonly<IProps>, prevState: any, snapshot?: any): void {

    if (prevProps.open !== this.props.open) {
      if (this.props.open) {
        document.body.classList.add('no-scroll')
        eventStack.sub('keyup', this.keyPress, 'ModalPopup')
      } else {
        document.body.classList.remove('no-scroll')
        eventStack.unsub('keyup', this.keyPress, 'ModalPopup')
      }
    }
  }

  keyPress = (e) => {
    if (e.code === 'Escape' && this.props.onCloseClick) this.props.onCloseClick(e)
  }

  handleClose = (e) => {
    if (e.clientX < e.target.clientWidth && e.clientY < e.target.clientHeight) this.props.onCloseClick(e)
  }

  render (): JSX.Element {
    const { children, onCloseClick, open, wide } = this.props

    const classes = cx('modal-popup', {
      'modal-popup--open': open,
      'modal-popup--wide': wide
    })

    return (
      <div className={classes} onMouseDown={this.handleClose}>
        <div className='modal-popup__content' onClick={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()}>
          {children}
        </div>
        {onCloseClick && <div className='modal-popup__close'><Icon className='modal-popup__close-icon' icon='close_circle' onClick={onCloseClick} /></div>}
      </div>
    )
  }
}

export default ModalPopup
