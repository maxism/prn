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
import AccountsStore from '../../stores/AccountsStore'
import InputImage from '../../ui/elements/InputImage/InputImage'

interface IState {
  open: boolean
  name: string
  image: string
}

interface IProps {
  params?: ParamsProps<IGlobalParams>
  profileStore?: ProfileStore
  accountsStore?: AccountsStore
}

/**
 * Модалка подтверждения почты
 */
@withParams
@inject(Stores.PROFILE_STORE, Stores.ACCOUNTS_STORE)
@observer
class EditProjectModal extends Component<IProps, IState> {
  componentDidUpdate (prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {
    const { params, accountsStore } = this.props

    if (params.editProject && !prevState.open && !this.state.open) {
      this.setState({
        open: true,
        name: accountsStore.currentAccount.name,
        image: accountsStore.currentAccount.image
      })
    }
    if (!params.editProject && prevState.open && this.state.open) this.setState({ open: false })
  }

  handleSubmit = async () => {
    const { accountsStore } = this.props
    await accountsStore.updateAccount(accountsStore.currentAccount.accountID, {
      name: this.state.name,
      image: this.state.image
    })

    this.props.params.changeParams({ editProject: undefined })
  }

  public state: IState = {
    open: false,
    name: '',
    image: ''
  }

  render (): JSX.Element {
    const { profileStore, accountsStore } = this.props

    return (
      <ModalPopup wide open={this.state.open} onCloseClick={() => this.props.params.changeParams({ editProject: undefined })}>

        <Title size='big' text='Настройки проекта' />

        <Segment size={5}>
          <Form onSubmit={this.handleSubmit}>
            <FormRow>
              <InputText
                label='Название проекта'
                value={this.state.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({ name: e.target.value })}
              />
            </FormRow>
            <FormRow>
              <InputImage
                label='Картинка'
                value={this.state.image}
                uploadToken={profileStore.token}
                onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({ image: e.target.value })}
              />
            </FormRow>
            <Segment size={1}/>
            <FormRow>
              <ButtonText color='blue' onClick={this.handleSubmit} loading={accountsStore.isUpdating}>Применить</ButtonText>
            </FormRow>
          </Form>
        </Segment>

      </ModalPopup>
    )
  }
}

export default EditProjectModal
