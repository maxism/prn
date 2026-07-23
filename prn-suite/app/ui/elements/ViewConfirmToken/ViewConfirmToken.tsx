import React, { ChangeEventHandler, Component, MouseEventHandler } from 'react'

import './ViewConfirmToken.scss'

import Title from '../Title/Title'
import Segment from '../Segment/Segment'
import Image from '../Image/Image'
import Description from '../Description/Description'
import Toolbar2Group from '../Toolbar2/Toolbar2Group'
import Toolbar2 from '../Toolbar2/Toolbar2'
import InputText from '../InputText/InputText'
import ButtonText from '../ButtonText/ButtonText'

interface IProps {
  groupName: string
  errorMessage: string
  isLoading: boolean
  onSubmit: ChangeEventHandler<HTMLInputElement>
}

interface IState {
  inputText: string
}

/**
 * Содержание модалки добавления токена для мессенджера
 */
class ViewConfirmToken extends Component<IProps, IState> {

  state: IState = {
    inputText: ''
  }

  handleSubmit = (e) => {
    e.target.value = this.state.inputText
    this.props.onSubmit(e)
  }

  render (): JSX.Element {
    const { groupName, errorMessage, isLoading } = this.props
    const { inputText } = this.state

    const url = `https://vk.com/club${groupName}?act=tokens`
    return (
      <div className='view-add-token'>

        <Title size='big' text='Добавление ключа доступа' />

        <Segment size={2}>
          <Description size='big'>
            Чтобы подключить мессенджер, необходимо добавить ключ доступа для вашей страницы. Это нужно для того, чтобы КУБ смог подключиться к ВКонтакте для получения комментариев и личных сообщений.
          </Description>
        </Segment>

        <Segment size={5}>
          <Toolbar2 size='middle'>
            <Toolbar2Group fill>
              <InputText
                label='Ваш ключ доступа'
                value={inputText}
                onChange={e => this.setState({ inputText: e.target.value })}
                error={errorMessage}
              />
              <ButtonText size='big' color='blue' onClick={this.handleSubmit} loading={isLoading} disabled={inputText === ''}>Добавить ключ доступа</ButtonText>
            </Toolbar2Group>
          </Toolbar2>
        </Segment>

        <Segment size={10}>
          <Title size='middle' text='Как получить ключ доступа?' />

          <Segment size={2}>
            <Description size='big'>
              Найти ключ доступа очень просто, главное точно следовать инструкции. Сначала переходим по ссылке:
            </Description>
            <Segment size={5} />
            <a href={url} target='_blank' rel='noreferrer' className='view-add-token__link'>{url}</a>
          </Segment>

          <Segment size={5}>
            <Description size='big'>
              На открывшейся странице нажимаем «Создать ключ».
            </Description>
            <Segment size={3} />
            <Image className='view-add-token__image-one' src={require(`./img/01.png`)} border bigRadius />
          </Segment>

          <Segment size={5}>
            <Description size='big'>
              Выбираем пункты «Разрешить приложению доступ к сообщениям сообщества» для ответов на личные сообщения и «Разрешить приложению доступ к стене сообщества» для ответов на комментарии.
            </Description>
            <Segment size={3} />
            <Image className='view-add-token__image-two' src={require(`./img/02.png`)} border bigRadius />
          </Segment>

          <Segment size={5}>
            <Description size='big'>
              После нажатия кнопки «Создать» вам нужно будет подтвердить действие с помощью приложения или по SMS. Скопируйте полученый ключ доступа и вставьте в поле сверху этой страницы.
            </Description>
            <Segment size={3} />
            <Image className='view-add-token__image-one' src={require(`./img/03.png`)} border bigRadius />
          </Segment>
        </Segment>

      </div>
    )
  }
}

export default ViewConfirmToken
