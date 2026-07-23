import React, { Component, MouseEventHandler, ReactNode } from 'react'
import eventStack from '../../lib/eventStack'
import Icon from '../Icon/Icon'
import cx from 'classnames'

import s from './ModalPopup.module.scss'
import Segment from '../Segment/Segment'
import Container from '../Container/Container'
import BlockGroup from '../Block/BlockGroup'
import Loader from '../Loader/Loader'

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
   * Скрыть кнопку закрытия модалки
   */
  hideClose?: boolean
  /**
   * Событие при открытии модального окна
   */
  onOpen?: MouseEventHandler
}

interface IStates {
  isLoading: boolean
}

class ModalPopup extends Component<IProps, IStates> {
  state: IStates = {
    isLoading: true
  }

  componentDidMount (): void {
    this.init()
  }

  componentDidUpdate (prevProps: Readonly<IProps>): void {
    this.init(prevProps)
  }

  async init (prevProps: Readonly<IProps> = undefined): Promise<void> {
    if (prevProps?.open !== this.props.open) {
      if (this.props.open) {
        document.body.classList.add('no-scroll')
        eventStack.sub('keyup', this.keyPress, 'ModalPopup')
        if (this.props.onOpen) await this.props.onOpen(null)
        this.setState({ isLoading: false })
      } else if (!document.location.href.includes('modal=')) {
        if (prevProps !== undefined) document.body.classList.remove('no-scroll') // Исключая первую инициализацию
        eventStack.unsub('keyup', this.keyPress, 'ModalPopup')
        this.setState({ isLoading: true })
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
    const { children, onCloseClick, open, hideClose } = this.props

    const classes = cx(s.element, {
      [s.open]: open,
      [s.hideClose]: hideClose
    })

    return (
      <div className={classes} onMouseDown={this.handleClose}>

        <Segment onMouseDown={this.handleClose}>
          <Container>
            <BlockGroup center>
              {this.state.isLoading && open && <Loader />}
              {!this.state.isLoading && (
                <div className={s.modal}>
                  {onCloseClick && <div className={s.close}><Icon className={s.icon} icon='error' onClick={onCloseClick} /></div>}
                  {children}
                </div>
              )}
            </BlockGroup>
          </Container>
        </Segment>

      </div>
    )
  }
}

export default ModalPopup
