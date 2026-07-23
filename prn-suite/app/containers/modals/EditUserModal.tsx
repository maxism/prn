import { inject, observer } from 'mobx-react'
import React, { ChangeEvent, Component } from 'react'
import { Stores } from '../../stores/RootStore'
import withParams, { ParamsProps } from '../../utils/withParams'
import ModalPopup from '../../ui/elements/ModalPopup/ModalPopup'
import { IGlobalParams } from '../../interfaces/IParams'
import ProfileStore from '../../stores/ProfileStore'
import Title from '../../ui/elements/Title/Title'
import Segment from '../../ui/elements/Segment/Segment'
import Form from '../../ui/collections/Form/Form'
import FormRow from '../../ui/collections/Form/FormRow'
import InputText from '../../ui/elements/InputText/InputText'
import ButtonText from '../../ui/elements/ButtonText/ButtonText'
import UsersStore from '../../stores/UsersStore'
import DateUtil from '../../utils/DateUtil'
import Select from '../../ui/elements/Select/Select'
import Link from '../../ui/elements/Link/Link'

interface IState {
  open: boolean
  q: string
  email: string
  activeToDate: string
  isCardAttached: string
  planName: string
  planProjects: string
  planCommunities: string
  planCompetitors: string
  planInfluencers: string
  planRetrospectives: string
  planPriority: string
  planPostGrade: string
  planCommunityScore: string
  planQualityScore: string
  planTopRating: string
  planIndexLevel: string
  planPrice: string
  planPeriod: string
}

interface IProps {
  params?: ParamsProps<IGlobalParams>
  profileStore?: ProfileStore
  usersStore?: UsersStore
}

/**
 * Модалка подтверждения почты
 */
@withParams
@inject(Stores.PROFILE_STORE, Stores.USERS_STORE)
@observer
class EditUserModal extends Component<IProps, IState> {
  componentDidUpdate (prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {
    const { params, usersStore } = this.props

    if (params.editUser && !prevState.open && !this.state.open) {
      this.setState({
        open: true,
        email: '',
        activeToDate: '',
        isCardAttached: '',
        planName: '',
        planProjects: '',
        planCommunities: '',
        planCompetitors: '',
        planInfluencers: '',
        planRetrospectives: '',
        planPriority: '',
        planPostGrade: '',
        planCommunityScore: '',
        planQualityScore: '',
        planTopRating: '',
        planIndexLevel: '',
        planPrice: '',
        planPeriod: ''
      })
    }
    if (!params.editUser && prevState.open && this.state.open) this.setState({ open: false })
  }

  handleLoad = async () => {
    const { usersStore } = this.props
    await usersStore.loadUser(this.state.q)

    // this.props.params.changeParams({ editUser: undefined })
  }

  handleSubmit = async () => {
    await this.props.usersStore.updateUser(this.props.usersStore.selectUser.email, this.state)
  }

  public state: IState = {
    open: false,
    q: '',
    email: '',
    activeToDate: '',
    isCardAttached: '',
    planName: '',
    planProjects: '',
    planCommunities: '',
    planCompetitors: '',
    planInfluencers: '',
    planRetrospectives: '',
    planPriority: '',
    planPostGrade: '',
    planCommunityScore: '',
    planQualityScore: '',
    planTopRating: '',
    planIndexLevel: '',
    planPrice: '',
    planPeriod: ''
  }

  render (): JSX.Element {
    const { profileStore, usersStore } = this.props

    return (
      <ModalPopup wide open={this.state.open} onCloseClick={() => this.props.params.changeParams({ editUser: undefined })}>

        <Title size='big' text='Настройки пользователя' />

        <Segment size={5}>
          <Form onSubmit={() => {/**/}}>
            <FormRow>
              <InputText
                label='Email пользователя'
                value={this.state.q}
                onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({ q: e.target.value })}
              />
              <ButtonText color='blue' onClick={this.handleLoad} loading={usersStore.isLoading}>Найти</ButtonText>
              {usersStore.selectUser && <Link _blank to={`https://prns.c-cube.ru?token=${usersStore.selectUser.token}`}>Перейти в пользователя</Link>}
            </FormRow>
            <Segment size={1}/>
            {usersStore.selectUser && (
              <>
                <FormRow>
                  <InputText
                    label='ID пользователя'
                    value={usersStore.selectUser?.userID}
                    readOnly
                  />
                  <InputText
                    label='Последний вход'
                    value={DateUtil.format(usersStore.selectUser?.timeLogin, 'DD.MM.YYYY HH:mm:SS')}
                    readOnly
                  />
                </FormRow>
                <FormRow>
                  <InputText
                    label='Email'
                    value={usersStore.selectUser?.email}
                    readOnly
                  />
                  <InputText
                    label='Новый Email'
                    value={this.state.email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({ email: e.target.value })}
                  />
                </FormRow>
                <FormRow>
                  <InputText
                    label='Карта'
                    value={usersStore.selectUser?.isCardAttached ? 'Привязана' : 'Не привязана'}
                    readOnly
                  />
                  <Select
                    label='Привязка карты'
                    list={[{ id: '', name: 'Без изменений' }, { id: 'true', name: 'Привязана' }, { id: 'false', name: 'Не привязана' }]}
                    value={this.state.isCardAttached}
                    onSelect={(e: ChangeEvent<HTMLInputElement>) => this.setState({ isCardAttached: e.target.value })}
                  />
                </FormRow>
                <FormRow>
                  <InputText
                    label='Карта'
                    value={usersStore.selectUser?.isCardValid ? 'Рабочая' : 'Нет денег / Не рабочая'}
                    readOnly
                  />
                </FormRow>
                <FormRow>
                  <InputText
                    label='Тариф'
                    value={usersStore.selectUser?.planName}
                    readOnly
                  />
                  <InputText
                    label='Новый тариф'
                    value={this.state.planName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({ planName: e.target.value })}
                  />
                </FormRow>
                <FormRow>
                  <InputText
                    label='Доступ до'
                    value={DateUtil.format(usersStore.selectUser?.activeToDate, 'DD.MM.YYYY')}
                    readOnly
                  />
                  <InputText
                    label='Новый доступ до'
                    value={this.state.activeToDate}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({ activeToDate: e.target.value })}
                  />
                </FormRow>
                <FormRow>
                  <InputText
                    label='Проектов'
                    value={String(usersStore.selectUser?.planProjects)}
                    readOnly
                  />
                  <InputText
                    label='Проектов'
                    value={this.state.planProjects}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({ planProjects: e.target.value })}
                  />
                </FormRow>
                <FormRow>
                  <InputText
                    label='Моих страниц в проекте'
                    value={String(usersStore.selectUser?.planCommunities)}
                    readOnly
                  />
                  <InputText
                    label='Моих страниц в проекте'
                    value={this.state.planCommunities}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({ planCommunities: e.target.value })}
                  />
                </FormRow>
                <FormRow>
                  <InputText
                    label='Конкурентов в проекте'
                    value={String(usersStore.selectUser?.planCompetitors)}
                    readOnly
                  />
                  <InputText
                    label='Конкурентов в проекте'
                    value={this.state.planCompetitors}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({ planCompetitors: e.target.value })}
                  />
                </FormRow>
                <FormRow>
                  <InputText
                    label='Блогеров в проекте'
                    value={String(usersStore.selectUser?.planInfluencers)}
                    readOnly
                  />
                  <InputText
                    label='Блогеров в проекте'
                    value={this.state.planInfluencers}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({ planInfluencers: e.target.value })}
                  />
                </FormRow>
                <FormRow>
                  <InputText
                    label='Ретроспектива'
                    value={String(usersStore.selectUser?.planRetrospectives)}
                    readOnly
                  />
                  <InputText
                    label='Ретроспектива'
                    value={this.state.planRetrospectives}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({ planRetrospectives: e.target.value })}
                  />
                </FormRow>
                <FormRow>
                  <InputText
                    label='Приоритет'
                    value={String(usersStore.selectUser?.planPriority)}
                    readOnly
                  />
                  <InputText
                    label='Приоритет'
                    value={this.state.planPriority}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({ planPriority: e.target.value })}
                  />
                </FormRow>
                <FormRow>
                  <InputText
                    label='Грейды постов'
                    value={usersStore.selectUser?.planPostGrade ? 'Включены' : 'Отключены'}
                    readOnly
                  />
                  <Select
                    label='Грейды постов'
                    list={[{ id: '', name: 'Без изменений' }, { id: 'true', name: 'Включены' }, { id: 'false', name: 'Отключены' }]}
                    value={this.state.planPostGrade}
                    onSelect={(e: ChangeEvent<HTMLInputElement>) => this.setState({ planPostGrade: e.target.value })}
                  />
                </FormRow>
                <FormRow>
                  <InputText
                    label='Community Score'
                    value={usersStore.selectUser?.planCommunityScore ? 'Включены' : 'Отключены'}
                    readOnly
                  />
                  <Select
                    label='Community Score'
                    list={[{ id: '', name: 'Без изменений' }, { id: 'true', name: 'Включены' }, { id: 'false', name: 'Отключены' }]}
                    value={this.state.planCommunityScore}
                    onSelect={(e: ChangeEvent<HTMLInputElement>) => this.setState({ planCommunityScore: e.target.value })}
                  />
                </FormRow>
                <FormRow>
                  <InputText
                    label='Quality Score'
                    value={usersStore.selectUser?.planQualityScore ? 'Включены' : 'Отключены'}
                    readOnly
                  />
                  <Select
                    label='Quality Score'
                    list={[{ id: '', name: 'Без изменений' }, { id: 'true', name: 'Включены' }, { id: 'false', name: 'Отключены' }]}
                    value={this.state.planQualityScore}
                    onSelect={(e: ChangeEvent<HTMLInputElement>) => this.setState({ planQualityScore: e.target.value })}
                  />
                </FormRow>
                <FormRow>
                  <InputText
                    label='Топ рейтинга'
                    value={String(usersStore.selectUser?.planTopRating)}
                    readOnly
                  />
                  <InputText
                    label='Топ рейтинга'
                    value={this.state.planTopRating}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({ planTopRating: e.target.value })}
                  />
                </FormRow>
                <FormRow>
                  <InputText
                    label='Уровень индекса'
                    value={String(usersStore.selectUser?.planIndexLevel)}
                    readOnly
                  />
                  <InputText
                    label='Уровень индекса'
                    value={this.state.planIndexLevel}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({ planIndexLevel: e.target.value })}
                  />
                </FormRow>
                <FormRow>
                  <InputText
                    label='Стоимость тарифа в месяц'
                    value={String(usersStore.selectUser?.planPrice)}
                    readOnly
                  />
                  <InputText
                    label='Стоимость тарифа в месяц'
                    value={this.state.planPrice}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({ planPrice: e.target.value })}
                  />
                </FormRow>
                <FormRow>
                  <InputText
                    label='Период оплаты, месяцев'
                    value={String(usersStore.selectUser?.planPeriod)}
                    readOnly
                  />
                  <InputText
                    label='Период оплаты, месяцев'
                    value={this.state.planPeriod}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({ planPeriod: e.target.value })}
                  />
                </FormRow>

                <FormRow>
                  <ButtonText color='blue' onClick={this.handleSubmit} loading={usersStore.isUpdating}>Применить</ButtonText>
                </FormRow>
              </>
            )}
          </Form>
        </Segment>

      </ModalPopup>
    )
  }
}

export default EditUserModal
