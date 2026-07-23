import React, { Component } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import Notification, { TNotification } from '../Notification/Notification'
import './Notifications.scss'

interface INotification {
  type: TNotification
  title: string
  text: string
  image?: string
  timeout?: number
  socialType?: string
}

/**
 * Элемент Notifications
 */
class Notifications extends Component {
  static show = (data: INotification) => {
    toast(
      <Notification
        title={data.title}
        text={data.text}
        type={data.type}
        image={data.image}
        socialType={data.socialType}
      />, {
        autoClose: data.timeout || 5000
      }
    )
  }

  render (): JSX.Element {
    return (
      <ToastContainer
        className='notifications'
        position='bottom-left'
        hideProgressBar
        closeButton={false}
        newestOnTop={false}
        draggable
      />
    )
  }
}

export default Notifications
