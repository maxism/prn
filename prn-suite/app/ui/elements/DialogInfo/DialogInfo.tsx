import React, { Component, MouseEventHandler } from 'react'

import './DialogInfo.scss'
import Image from '../Image/Image'
import Icon from '../Icon/Icon'
import { IDialog } from '../../../stores/MessengerStore'
import ButtonText from '../ButtonText/ButtonText'

interface IProps {
  dialog: IDialog
  onClick: MouseEventHandler
}

class DialogInfo extends Component<IProps> {

  render (): JSX.Element {
    const { dialog, onClick } = this.props
    const { name, avatar, url } = dialog.from
    const socialType = dialog.socialType.toLowerCase()

    return (
      <div className='dialog-info'>
        <div className='dialog-info__user'>
          <Image className='dialog-info__user-avatar' round border src={ avatar }/>
          <div className='dialog-info__user-info'>
            <span className='dialog-info__user-name'>{ name }</span>
            <a className='dialog-info__user-social' href={url} target='_blank'>
              <Icon className='dialog-info__user-icon' icon={`${socialType}_colored`}/>
              { url }
            </a>
          </div>
        </div>

        <div className='dialog-info__metrics'>
          <ButtonText
            size='small'
            onClick={onClick}
          >
            { (dialog.dialogStatus === 'closed' ? 'Открыть' : 'Закрыть') + ' обращение' }
          </ButtonText>
        </div>
      </div>
    )
  }
}

export default DialogInfo
