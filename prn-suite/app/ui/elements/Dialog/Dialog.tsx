import React, { Component, MouseEventHandler } from 'react'
import cx from 'classnames'
import format from '../../../lib/format'

import Icon from '../Icon/Icon'
import shortNameUtil from '../../../utils/shortNameUtil'

import './Dialog.scss'
import Image from '../Image/Image'

interface IProps {
  image: string
  socialType: string
  name: string
  type: string
  author: string
  text: string
  status: string
  time: Date
  active: boolean
  onClick: MouseEventHandler
}

/**
 * Элемент Dialog
 */
export default class Dialog extends Component<IProps> {
  render (): JSX.Element {
    const { image, socialType, name, type, author, text, status, time, active, onClick } = this.props

    const initials = shortNameUtil.getName(name)

    const classes = cx('dialog', {
      'dialog--active': active
    })

    return (
      <div className={classes} onClick={onClick}>

        <div className='dialog__avatar'>
          <Image className='dialog__image' round border src={image} noImage={require('./img/no_image.svg')}/>
          <div className='dialog__social'>
            <Icon className='dialog__social-bg' icon={`${socialType.toLocaleLowerCase()}_bg`}/>
            <Icon className='dialog__social-icon' icon={socialType.toLocaleLowerCase()}/>
          </div>
        </div>

        <div className='dialog__content'>
          <div className='dialog__row'>
            <span className='dialog__name'>{name}</span>
            <span className='dialog__time'>{format.dateTime2(time)}</span>
          </div>

          <div className='dialog__row'>
            <div className='dialog__text'>
              <span className='dialog__author'>{author}</span>
              {text}
            </div>

            <div className='dialog__status'>
              {/* todo: сделать новый статус "new", opened оставить (должен быть без иконки) */}
              {status === 'opened' && <Icon className='dialog__status-new' icon='dot'/>}
              {status === 'error' && <Icon className='dialog__status-error' icon='cross'/>}
              {status === 'closed' && <Icon className='dialog__status-closed' icon='check'/>}
              {/* todo: process переименовать на sending */}
              {status === 'process' && <Icon className='dialog__status-sending' icon='loading_dots_square'/>}
            </div>
          </div>
        </div>

        {/*  <div className='dialog__initials'>{!image ? initials : ''}</div>*/}

      </div>
    )
  }
}
