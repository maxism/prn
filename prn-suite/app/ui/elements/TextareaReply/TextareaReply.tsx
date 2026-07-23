import React, { ChangeEventHandler, Component, MouseEventHandler } from 'react'

import './TextareaReply.scss'
import Textarea from '../Textarea/Textarea'
import Icon from '../Icon/Icon'
import TextareaButton from '../Textarea/TextareaButton'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'

interface IProps {
  replyText: string
  quoteText: string
  onCancelQuote: MouseEventHandler
  onChangeReplyText: ChangeEventHandler<HTMLInputElement>
  onAddEmoji?: ChangeEventHandler<IEmoji>
}

interface IState {
  requireEmojiUpdate: boolean
  showEmoji: boolean
}

interface IEmoji {
  id: string
  name: string
  short_name: Array<string>
  colons: string
  unified: string
  skin: string
  native: string
}

/**
 * Блок TextareaReply
 */
export default class TextareaReply extends Component<IProps, IState> {

  state = {
    requireEmojiUpdate: false,
    showEmoji: false
  }

  handleDocumentClick = (event) => {
    const { requireEmojiUpdate, showEmoji } = this.state
    let isEmojiClassFound = false
    event &&
    event.path &&
    event.path.forEach(elem => {
      if (elem && elem.classList) {
        const data = elem.classList.value
        if (data.includes('emoji')) {
          isEmojiClassFound = true
        }
      }
    })

    if (requireEmojiUpdate) {
      this.setState({ showEmoji: !showEmoji, requireEmojiUpdate: false })
    } else if (!isEmojiClassFound) {
      this.setState({ showEmoji: false })
    }
  }

  componentDidMount (): void {
    document.addEventListener('click', this.handleDocumentClick)
  }

  componentWillUnmount (): void {
    document.removeEventListener('click', this.handleDocumentClick)
  }

  render (): JSX.Element {
    const { replyText, onChangeReplyText, quoteText, onCancelQuote, onAddEmoji } = this.props
    return (
      <div className='reply-textarea'>

        {quoteText && (
          <div className='reply-textarea__quote'>

            <div className='reply-textarea__quote-container'>
              <span className='reply-textarea__quote-label'>Вы отвечаете на это сообщение</span>
              <div className='reply-textarea__quote-content'>
                <div className='reply-textarea__quote-marker'/>
                <pre className='reply-textarea__quote-text'>{quoteText}</pre>
              </div>
            </div>

            <Icon className='reply-textarea__quote-icon' icon='close_circle' onClick={onCancelQuote}/>
          </div>
        )}
        <Textarea
          placeholder='Ответить...'
          value={replyText}
          onChange={onChangeReplyText}
        >
          <TextareaButton icon='tone' onClick={() => this.setState({ requireEmojiUpdate: true })} />
        </Textarea>
        {this.state.showEmoji && <Picker className='emoji' set='apple' onSelect={onAddEmoji} title='Pick your emoji…' emoji='point_up' style={{ position: 'absolute', bottom: '60px', right: '60px' }} />}
      </div>)
  }
}
