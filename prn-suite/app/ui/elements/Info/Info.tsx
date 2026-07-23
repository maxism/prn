import React, { Component, MouseEventHandler } from 'react'
import cx from 'classnames'

import './Info.scss'
import Icon from '../Icon/Icon'
import Tooltip from '../../modules/Tooltip/Tooltip'

interface IProps {
  title: string
  text: string
  description?: string
  green?: boolean
  onRemove?: MouseEventHandler
  rouble?: boolean
  wide?: boolean
  warning?: boolean

  /**
   * Заголовок подсказки
   */
  tooltipTitle?: string
  /**
   * Текст подсказки
   */
  tooltipText?: string
  /**
   * Мелкий текст в подсказке
   */
  tooltipDescription?: string
  /**
   * Кнопка в подсказке
   */
  tooltipButton?: string
  /**
   * Кнопка закрытия в подсказке
   */
  tooltipClose?: boolean
}

class Info extends Component<IProps> {
  render (): JSX.Element {
    const { title, text, green, warning, rouble, wide, tooltipTitle, tooltipText, tooltipDescription, tooltipButton, tooltipClose } = this.props
    const classes = cx('info', {
      'info--red': warning,
      'info--wide': wide,
      'info--green': green
    })

    return (
      <div className={classes}>
        <div className='info__top'>
          <div className='info__title'>
            <span className='info__label'>{title}</span>
            {tooltipText && <Tooltip
              trigger={<Icon className='info__help' icon='help' />}
              title={tooltipTitle}
              text={tooltipText}
              description={tooltipDescription}
              button={tooltipButton}
              close={tooltipClose}
            >
            </Tooltip>}
          </div>
        </div>
        <div className='info__main'>
          <span className='info__text'>{text}</span>
          {rouble && <Icon className='info__rouble' icon='rouble' />}
          {warning && <Icon className='info__attention' icon='attention_nt'/>}
        </div>
      </div>
    )
  }
}

export default Info
