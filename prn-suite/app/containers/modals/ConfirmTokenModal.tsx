import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { Stores } from '../../stores/RootStore'
import withParams, { ParamsProps } from '../../utils/withParams'
import ModalPopup from '../../ui/elements/ModalPopup/ModalPopup'
import { IGlobalParams } from '../../interfaces/IParams'
import ViewConfirmToken from '../../ui/elements/ViewConfirmToken/ViewConfirmToken'
import CommunitiesStore from '../../stores/CommunitiesStore'

interface IState {
  open: boolean
  errorMessage: string
  isLoading: boolean
}

interface IProps {
  params?: ParamsProps<IGlobalParams>
  communitiesStore?: CommunitiesStore
}

/**
 * Модалка добавления токена для мессенджера
 */
@withParams
@inject(Stores.COMMUNITIES_STORE)
@observer
class ConfirmTokenModal extends Component<IProps, IState> {
  constructor (props: IProps) {
    super(props)
  }

  public state: IState = {
    open: false,
    errorMessage: '',
    isLoading: false
  }

  componentDidUpdate (prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {
    const { params } = this.props

    if (params.communityID && params.confirmToken && !prevState.open && !this.state.open) this.setState({ open: true })
    if ((!params.communityID || !params.confirmToken) && prevState.open && this.state.open) this.setState({ open: false })
  }

  handleClose = () => {
    this.props.params.changeParams({ confirmToken: undefined })
  }

  handleSubmit = async (accessToken: string) => {
    const { params, communitiesStore } = this.props
    this.setState({ isLoading: true })
    const result = await communitiesStore.registerCallback(params.communityID, accessToken)
    if (result !== true) {
      this.setState({ errorMessage: result as string })
    } else {
      this.handleClose()
    }
    this.setState({ isLoading: false })
  }

  formatErrorMessage = () => {
    const errorMessage = this.state.errorMessage
    let message = ''
    switch (errorMessage) {
      case 'Community admin rights required':
        message = 'Вы не являетеесь администратором сообщества'
        break
      case 'No access':
        message = 'Нет необходимых прав для применения ключа'
        break
      case 'Invalid token':
        message = 'Неверный токен'
        break
    }
    return message
  }

  render (): JSX.Element {
    const { params, communitiesStore } = this.props
    const { isLoading } = this.state

    const community = communitiesStore.getCommunityByCommunityID(params.communityID)
    if (!community) return null

    return (
      <ModalPopup wide open={this.state.open} onCloseClick={this.handleClose}>
        <ViewConfirmToken
          groupName={community.groupID}
          errorMessage={this.formatErrorMessage()}
          isLoading={isLoading}
          onSubmit={(e) => this.handleSubmit(e.target.value)}
        />
      </ModalPopup>
    )
  }
}

export default ConfirmTokenModal
