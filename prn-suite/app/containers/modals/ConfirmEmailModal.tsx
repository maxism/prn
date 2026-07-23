import { inject, observer } from 'mobx-react'
import React, { ChangeEvent, Component } from 'react'
import { Stores } from '../../stores/RootStore'
import withParams, { ParamsProps } from '../../utils/withParams'
import ModalPopup from '../../ui/elements/ModalPopup/ModalPopup'
import { IGlobalParams } from '../../interfaces/IParams'
import ProfileStore from '../../stores/ProfileStore'
import Title from '../../ui/elements/Title/Title'
import Segment from '../../ui/elements/Segment/Segment'
import Description from '../../ui/elements/Description/Description'
import Form from '../../ui/collections/Form/Form'
import FormRow from '../../ui/collections/Form/FormRow'
import InputText from '../../ui/elements/InputText/InputText'
import ButtonText from '../../ui/elements/ButtonText/ButtonText'
import NumeralUtil from '../../utils/NumeralUtil'

interface IState {
  open: boolean
  cancel: boolean
  confirmCountdown: number
}

interface IProps {
  params?: ParamsProps<IGlobalParams>
  profileStore?: ProfileStore
}

/**
 * Модалка подтверждения почты
 */
@withParams
@inject(Stores.PROFILE_STORE)
@observer
class ConfirmEmailModal extends Component<IProps, IState> {
  constructor (props: IProps) {
    super(props)

    props.profileStore.profileForm.setData(props.profileStore.profile)
  }

  public state: IState = {
    open: false,
    cancel: false,
    confirmCountdown: 15
  }

  sendConfirm = async () => {
    if (await this.props.profileStore.sendConfirmEmail()) this.setState({ confirmCountdown: 30 })
  }

  render (): JSX.Element {
    const { profileStore } = this.props
    const { confirmCountdown } = this.state

    return (
      <ModalPopup wide open={this.state.open} onCloseClick={() => this.setState({ open: false, cancel: true })}>

        <Title size='big' text='Подтверждение почты' />

        <Segment size={2}>
          <Description size='big'>
            Для работы в сервисе необходимо подтвердить адрес электронной почты. Мы уже отправили вам письмо с подтверждением, но если вы его не нашли, то можете отправить ещё одно.
          </Description>
        </Segment>

        {!!confirmCountdown && (
          <Segment size={5}>
            <Title size='small' green text={`Письмо отправлено на ${profileStore.profileForm.email.value}`} />
            <Description size='small'>
              {`Отправить повторно можно будет через ${NumeralUtil.format(confirmCountdown, '0,0', ['секунду', 'секунды', 'секунд'])}`}
            </Description>
          </Segment>
        )}

        {!confirmCountdown && (
          <Segment size={5}>
            <Form onSubmit={() => profileStore.login()}>
              <FormRow>
                <InputText
                  label='Адрес e-mail'
                  name='email'
                  value={profileStore.profileForm.email.value}
                  error={profileStore.profileForm.email.error}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => profileStore.profileForm.email.change(e.target.value)}
                  disabled={!!confirmCountdown}
                />
                <ButtonText color='blue' onClick={() => this.sendConfirm()} disabled={!!confirmCountdown} loading={profileStore.isLoading}>Отправить подтверждение</ButtonText>
              </FormRow>
            </Form>
          </Segment>
        )}

      </ModalPopup>
    )
  }
}

export default ConfirmEmailModal
