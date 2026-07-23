import React, { Component } from 'react'
import cx from 'classnames'
import './Notification.scss'
import Image from '../Image/Image'
import Icon from '../Icon/Icon'

export type TNotification = 'default' | 'attention' | 'error' | 'success'

interface IProps {
  /**
   * Тип нотификации
   */
  type: TNotification
  /**
   * Заголовок нотификации
   */
  title: string
  /**
   * Текст нотификации
   */
  text: string
  /**
   *  Аватар / изображение
   */
  image?: string
  /**
   * Иконка социальной сети
   */
  socialType?: string
}

/**
 * Элемент Notification
 */
class Notification extends Component<IProps> {

  static defaultProps = {
    type: 'default'
  }

  render (): JSX.Element {
    const { type, title, text, image, socialType } = this.props

    const classes = cx('notification', {
      'notification--default': type === 'default',
      'notification--attention': type === 'attention',
      'notification--error': type === 'error',
      'notification--success': type === 'success',
      'notification--with-image': image
    })

    return (
      <div className={classes}>
        {image &&
        <div className='notification__avatar'>
          <Image className='notification__image' border round src={image}/>
          {socialType &&
          <div className='notification__social'>
            <Icon className='notification__social-bg' icon={`${socialType.toLowerCase()}_bg`}/>
            <Icon className='notification__social-icon' icon={`${socialType.toLowerCase()}_colored`}/>
          </div>
          }
        </div>
        }
        <div className='notification__main'>
          <p className='notification__title'>
            {title}
          </p>
          <p className='notification__text'>
            {text}
          </p>
        </div>
      </div>
    )
  }
}

export default Notification
