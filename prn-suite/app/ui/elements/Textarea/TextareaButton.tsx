import React, {Component, MouseEventHandler} from 'react'
import Icon from '../Icon/Icon'

import './Textarea.scss'
import {IIcon} from '../Icon/Icons'

interface IProps {
  icon: IIcon
  onClick: MouseEventHandler
}

/**
 * Элемент TextareaButton
 */
export default class TextareaButton extends Component<IProps> {
  render(): JSX.Element {
    const { icon, onClick } = this.props

    return <Icon className='textarea__button' icon={icon} onClick={onClick} />
  }
}
