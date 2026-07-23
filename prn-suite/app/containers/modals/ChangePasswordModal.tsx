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

interface IState {
  open: boolean
}

interface IProps {
  params?: ParamsProps<IGlobalParams>
  profileStore?: ProfileStore
}

/**
 * Модалка смены пароля
 */

@withParams
@inject(Stores.PROFILE_STORE)
@observer
class ChangePasswordModal extends Component<IProps, IState> {

  public state: IState = {
    open: false
  }

  componentDidUpdate (prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {
    const { params } = this.props

    if (params.changePassword && !prevState.open && !this.state.open) this.setState({ open: true })
    if (!params.changePassword && prevState.open && this.state.open) this.setState({ open: false })
  }

  handleClose = () => {
    this.props.params.changeParams({ changePassword: undefined })
  }

  render (): JSX.Element {
    const { profileStore } = this.props

    return (
      <ModalPopup open={this.state.open} onCloseClick={this.handleClose} wide>

        <Title size='big' text='Изменение пароля' />

        <Segment size={2}>
          <Description size='big'>
            Придумайте себе новый пароль, если по каким-то причинам это необходимо сделать. Чтобы обезопасить это действие — необходимо указать и ваш текущий пароль.
          </Description>
        </Segment>

        <Segment size={5}>
          <Form onSubmit={() => alert('Отправлен новый пароль')}>
              <FormRow>
                <InputText
                  label='Текущий пароль'
                  name='old_password'
                  type='password'
                  value={profileStore.passwordForm.old_password.value}
                  error={profileStore.passwordForm.old_password.error}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => profileStore.passwordForm.old_password.change(e.target.value)}
                />
                <ButtonText to='/reset-password' color='transparent'>Я не помню пароль</ButtonText>
              </FormRow>

              <FormRow>
                <InputText
                  label='Новый пароль'
                  name='new_password'
                  type='password'
                  value={profileStore.passwordForm.new_password.value}
                  error={profileStore.passwordForm.new_password.error}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => profileStore?.passwordForm.new_password.change(e.target.value)}
                />
              </FormRow>

              <FormRow>
                <InputText
                  label='Подтверждение пароля'
                  name='new_password2'
                  type='password'
                  value={profileStore.passwordForm.new_password2.value}
                  error={profileStore.passwordForm.new_password2.error}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => profileStore?.passwordForm.new_password2.change(e.target.value)}
                />
              </FormRow>
              <Segment size={1}/>
              <FormRow padding='small'>
                <ButtonText onClick={() => profileStore.changePassword()} color='blue'>Сохранить новый пароль</ButtonText>
              </FormRow>
            </Form>
        </Segment>

      </ModalPopup>
    )
  }
}

export default ChangePasswordModal
