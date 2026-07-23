import React, { Children, Component, MouseEventHandler, ReactNode } from 'react'
import format from '../../../lib/format'
import cx from 'classnames'

import Icon from '../Icon/Icon'

import './DialogMessage.scss'
import Image from '../Image/Image'

interface IProps {
  type: string
  time?: Date
  status?: string
  image?: string
  url?: string
  children: ReactNode
  quoteText?: string
  onReply?: MouseEventHandler
  onRepeat?: MouseEventHandler
}

/**
 * Элемент DialogMessage
 */
export default class DialogMessage extends Component<IProps> {
  render (): JSX.Element {
    const { type, image, url, children, status, quoteText, onReply, onRepeat } = this.props
    let { time = '' } = this.props

    if (type === 'post') time = format.dateTime(time)
    else if (time) time = format.dateTime(time, 'HH:mm')

    const classes = cx('message', {
      [`message--${type}`]: type
    })
    return (
      <div className={classes}>

        <div className='message__bubble'>
          {quoteText &&
            <div className='message__quote'>
              <div className='message__quote-marker'/>
              <pre className='message__quote-text'>
                {quoteText}
              </pre>
            </div>
          }

          <div className='message__content'>
            {image && <Image border className='message__image' src={image} noImage={require('./img/no_image.svg')}/>}

            <div className={`message__container ${type === 'date' && 'message__container--date'}`}>
              {children && <pre className='message__text'>{children}</pre>}
              {type === 'post' && <a className='message__url' href={url}>Опубликовано {time}</a>}
            </div>
          </div>
        </div>

        <div className='message__info'>
          {['message', 'reply'].includes(type) && <span className='message__time'>{time}</span>}

          {type === 'message' &&
            <div className='message__status'>
              <Icon className='message__status-icon--reply' icon='reply' onClick={onReply}/>
            </div>
          }

          {type === 'reply' &&
            <div className='message__status'>
              {status === 'process' && <Icon className='message__status-icon--process' icon='loader'/>}
              {status === 'publish' && <Icon className='message__status-icon--publish' icon='check'/>}
              {status === 'done' && <Icon className='message__status-icon--done' icon='check'/>}
              {status === 'error' &&
                <div className='message__error' onClick={onRepeat}>
                  <div className='message__error-url'>
                    <span>Повторить отправку</span>
                    <Icon className='message__status-icon--repeat' icon='back'/>
                  </div>
                </div>
              }
          </div>
          }
        </div>
      </div>
    )
  }
}
