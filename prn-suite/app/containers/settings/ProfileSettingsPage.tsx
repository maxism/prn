import { inject, observer } from 'mobx-react'
import React, { ChangeEvent, Component } from 'react'
import ProfileStore from '../../stores/ProfileStore'
import { Stores } from '../../stores/RootStore'
import Form from '../../ui/collections/Form/Form'
import FormRow from '../../ui/collections/Form/FormRow'
import ButtonText from '../../ui/elements/ButtonText/ButtonText'
import InputText from '../../ui/elements/InputText/InputText'
import Segment from '../../ui/elements/Segment/Segment'
import Title from '../../ui/elements/Title/Title'
import LiteLayout from '../layouts/LiteLayout'
import Description from '../../ui/elements/Description/Description'
import withParams, { ParamsProps } from '../../utils/withParams'
import { IGlobalParams } from '../../interfaces/IParams'
import { Helmet } from 'react-helmet'

interface IProps {
  params?: ParamsProps<IGlobalParams>
  profileStore?: ProfileStore
}

@withParams
@inject(Stores.PROFILE_STORE)
@observer
class ProfileSettingsPage extends Component<IProps> {
  constructor (props: IProps) {
    super(props)

    props.profileStore.profileForm.setData(props.profileStore.profile)
  }

  render (): JSX.Element {
    const { profileStore, params } = this.props
    const confirmedEmail = profileStore.profileForm.confirmedEmail.value
    return (
      <LiteLayout>
        {/*@ts-ignore*/}
        <Helmet>
          <title>Настройки профиля — КУБ Suite</title>
        </Helmet>

        <Segment size={3}>
          <Title text='Настройки профиля' />
          <Segment size={3} />
          <Description size='big'>
            Здесь осуществляется контроль вашего аккаунта для продуктов КУБ. Все основные настройки профиля.
          </Description>
        </Segment>

        <Segment size={10}>
          <Title size='middle'>Персональные данные</Title>
          <Segment size={2} />
          <Description size='big'>
            Для полноценного и комфортного использования сервисов КУБ — заполните все поля и поддерживайте актуальную информацию.
          </Description>
        </Segment>

        <Segment size={3}>
          <Form onSubmit={() => profileStore.update()}>
            <FormRow>
              <InputText
                label='Имя'
                name='name'
                value={profileStore.profileForm.name.value}
                error={profileStore.profileForm.name.error}
                onChange={e => profileStore.profileForm.name.change(e.target.value)}
              />
              <InputText
                label='Компания'
                name='company'
                value={profileStore.profileForm.company.value}
                error={profileStore.profileForm.company.error}
                onChange={e => profileStore.profileForm.company.change(e.target.value)}
              />
            </FormRow>

            <FormRow>
              <InputText
                label='Номер телефона'
                name='phone'
                value={profileStore.profileForm.phone.value}
                error={profileStore.profileForm.phone.error}
                onChange={e => profileStore.profileForm.phone.change(e.target.value)}
              />
              <InputText
                label='Должность'
                name='post'
                value={profileStore.profileForm.post.value}
                error={profileStore.profileForm.post.error}
                onChange={e => profileStore.profileForm.post.change(e.target.value)}
              />
            </FormRow>

            <FormRow>
              <InputText
                label='Адрес e-mail'
                name='email'
                value={profileStore.profileForm.email.value}
                readOnly={confirmedEmail}
                onChange={e => !confirmedEmail && profileStore.profileForm.email.change(e.target.value)}
                error={profileStore.profileForm.email.error}
              />
              <InputText
                label='Страна'
                name='country'
                value={profileStore.profileForm.country.value}
                error={profileStore.profileForm.country.error}
                onChange={e => profileStore.profileForm.country.change(e.target.value)}
              />
            </FormRow>
            <Segment size={1}/>
            <FormRow>
              <ButtonText onClick={() => profileStore.update()} color='blue'>Сохранить изменения</ButtonText>
            </FormRow>
          </Form>
        </Segment>

        <Segment size={10}>
          <Title size='middle'>Изменение пароля</Title>
          <Segment size={2} />
          <Description size='big'>
            Здесь вы можете изменить свой пароль, если по каким-то причинам это необходимо сделать. Главное — запомнить новый пароль.
          </Description>
        </Segment>

        <Segment size={3}>
          <ButtonText onClick={() => params.changeParams({ changePassword: true })} color='blue'>Изменить пароль</ButtonText>
        </Segment>

        <Segment size={10} />
      </LiteLayout>
    )
  }
}

export default ProfileSettingsPage
