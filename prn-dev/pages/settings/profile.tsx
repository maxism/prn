import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

import ButtonText from '../../elements/ButtonText/ButtonText'
import Title from '../../elements/Title/Title'
import {IStoreContext, Stores} from '../../stores/RootStore'
import ProfileStore from '../../stores/ProfileStore'
import Form from '../../elements/Form/Form'
import FormRow from '../../elements/Form/FormRow'
import InputText from '../../elements/InputText/InputText'
import Meta from '../../components/Meta'
import Row from '../../elements/Row/Row'
import Col from '../../elements/Col/Col'
import Text from '../../elements/Text/Text'
import SettingsLayout from './_SettingsLayout'
import Link from '../../elements/Link/Link'
import Select from '../../elements/Select/Select'
import RouterUtil from '../../utils/RouterUtil'
import { SingletonRouter, withRouter } from 'next/router'
import AccessDeniedPage from '../../components/AccessDeniedPage'

interface IProps {
  router: SingletonRouter
  profileStore?: ProfileStore
}

interface IStates {
  showChangePassword?: boolean
}

@(withRouter as any)
@inject(Stores.PROFILE_STORE)
@observer
export default class SettingsProfilePage extends Component<IProps, IStates, any> {
  state: IStates = {
    showChangePassword: false
  }

  constructor (props: IProps) {
    super(props)
  }

  static async getInitialProps (ctx: IStoreContext): Promise<Partial<any>> {
    const { profileStore } = ctx.store

    if (profileStore.isAuth) {
      profileStore.profileForm.setData({
        email: profileStore.profile.email,
        picture: profileStore.profile.picture,
        name: profileStore.profile.name,
        phone: profileStore.profile.phone,
        company: profileStore.profile.company,
        post: profileStore.profile.post,
        city: profileStore.profile.city,
        representative: profileStore.profile.representative
      })
    }

    return {}
  }

  handleChangePassword = () => {
    this.props.profileStore.changePasswordForm.setData({ password: '', newPassword: '', newPassword2: '' })
    this.props.profileStore.changePasswordForm.clearCompleted()
    this.setState({ showChangePassword: true })
  }

  render (): JSX.Element {
    const { router, profileStore } = this.props

    if (!profileStore.isAuth) return <AccessDeniedPage />

    const isElamaPartner = profileStore.profile?.email?.includes('_oidc_elama@c-cube.ru')

    return (
      <SettingsLayout>

        <Meta
          title='Профиль'
        />

        <Row padding='xxl'>
          <Col size={12}>
            <Title>Персональные данные</Title>
          </Col>
        </Row>
        <Row padding='m'>
          <Col size={12}>
            <Text semibold>Для полноценного и комфортного использования сервисов КУБ — заполните все поля и поддерживайте актуальную информацию.</Text>
          </Col>
        </Row>

        <Row padding='xl'>
          <Col size={8}>
            <Form onSubmit={() => profileStore.update()}>
              <FormRow>
                <InputText
                  white
                  label='Имя'
                  name='name'
                  value={profileStore.profileForm.name.value}
                  error={profileStore.profileForm.name.error}
                  onChange={e => profileStore?.profileForm.name.change(e.target.value)}
                  readOnly={isElamaPartner}
                />
              </FormRow>
              <FormRow>
                <InputText
                  white
                  label='Номер телефона'
                  name='phone'
                  value={profileStore.profileForm.phone.value}
                  error={profileStore.profileForm.phone.error}
                  onChange={e => profileStore?.profileForm.phone.change(e.target.value)}
                />
              </FormRow>
              {!isElamaPartner && (
                <FormRow>
                  <InputText
                    white
                    label='Адрес email'
                    name='email'
                    value={profileStore.profileForm.email.value}
                    complete={profileStore.profile?.confirmedEmail}
                    warning={!profileStore.profile?.confirmedEmail && 'Почта не подтверждена'}
                    error={profileStore.profileForm.email.error}
                    onChange={e => profileStore?.profileForm.email.change(e.target.value)}
                    readOnly={profileStore?.profile.confirmedEmail}
                  />
                  {!profileStore.profile?.confirmedEmail && (
                    <>
                      {profileStore.isSentConfirmEmail && <Text>Письмо отправлено</Text>}
                      {!profileStore.isSentConfirmEmail && <Link onClick={() => profileStore.sendConfirmEmail()}>Подтвердить</Link>}
                    </>
                  )}
                </FormRow>
              )}
              <FormRow>
                <Select
                  white
                  label='Сфера деятельности'
                  list={[{ id: 'freelance', name: 'SMM / Фрилансер'}, { id: 'agency', name: 'Агентство'}]}
                  value={profileStore?.profileForm.representative.value}
                  onSelect={e => profileStore?.profileForm.representative.change(e.target.value)}
                />
              </FormRow>
              <FormRow buttons>
                <ButtonText type='submit' size='l' loading={profileStore.isLoading}>Сохранить изменения</ButtonText>
              </FormRow>
            </Form>
          </Col>
        </Row>

        {!isElamaPartner && (
          <>
            <Row padding='xxl'>
              <Col size={12}>
                <Title>Изменение пароля</Title>
              </Col>
            </Row>
            <Row padding='m'>
              <Col size={12}>
                <Text semibold>Здесь вы можете изменить свой пароль, если по каким-то причинам это необходимо сделать. Инструкции появятся после нажатия кнопки.</Text>
              </Col>
            </Row>
            <Row>
              <Col size={8}>
                <Form onSubmit={this.handleChangePassword}>
                  <FormRow buttons>
                    <ButtonText type='submit' size='l' onClick={() => RouterUtil.replaceParams(router, { modal: 'reset-password' })}>Изменить пароль</ButtonText>
                  </FormRow>
                </Form>
              </Col>
            </Row>
          </>
        )}

      </SettingsLayout>
    )
  }
}
