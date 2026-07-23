import { inject, observer } from 'mobx-react'
import React, { Component, ReactNode } from 'react'
import { IGlobalParams } from '../../interfaces/IParams'
import { Stores } from '../../stores/RootStore'
import ButtonText from '../../ui/elements/ButtonText/ButtonText'
import FloatingAlert from '../../ui/elements/FloatingAlert/FloatingAlert'
import ScrollUp from '../../ui/elements/ScrollUp/ScrollUp'
import withParams, { ParamsProps } from '../../utils/withParams'

import HeaderBlock from './HeaderBlock'
import PageLayout, { PageLayoutIcon } from '../../ui/views/PageLayout/PageLayout'
import Footer from '../../ui/elements/Footer/Footer'
import ProfileStore from '../../stores/ProfileStore'
import moment from 'moment'

interface IProps {
  params?: ParamsProps<IGlobalParams>
  profileStore?: ProfileStore
  /**
   * Компоненты, которые лежат внутри
   */
  children: ReactNode
  center?: boolean
  full?: boolean
  icon?: PageLayoutIcon
  secondHeader?: ReactNode
}

@withParams
@inject(Stores.PROFILE_STORE)
@observer
class LiteLayout extends Component<IProps> {

  constructor (props: IProps) {
    super(props)
    props.profileStore.profileForm.setData(props.profileStore.profile)
  }

  async componentDidUpdate (prevProps: Readonly<IProps>, prevState: Readonly<IProps>, snapshot?: any): Promise<void> {
    const { params, profileStore } = this.props
    const { confirmCode } = params

    // Если есть код подтверждения
    if (confirmCode) {
      params.changeParams({ confirmCode: null })
      await profileStore.confirmEmail(confirmCode)
    }
  }

  handleClose = () => {
    this.props.params.changeParams({ isConfirmEmailClosed: true })
  }

  render (): JSX.Element {
    const { params, profileStore, children, center, full, icon, secondHeader } = this.props

    const profile = profileStore.profile
    const isProfilePage = params.currentPath() === '/settings/profile'
    const confirmCountdown = profileStore.emailConfirmCountdown
    const showEmailConfirmationAlert = profileStore.isAuth && !profile?.confirmedEmail && !profile?.showSurvey && (!params.isConfirmEmailClosed || isProfilePage)
    const showPlanHasExpiredAlert = profileStore.isAuth && !profileStore.profile.plan.isPlanValid
    return (
      <PageLayout
        header={<HeaderBlock />}
        footer={
          <>
            <ScrollUp />

            {showPlanHasExpiredAlert && (
              <FloatingAlert
                icon='attention_nt'
                title='Подписка завершена'
                text='Ваша подписка закончилась, и некоторые функции теперь ограничены. Продлите подписку, чтобы снова получить полный доступ к возможностям сервиса.'
                // onClose={this.handleClose}
              >
                <ButtonText
                  size='middle'
                  color='blue'
                  onClick={() => params.changeParams({ premium: 'true' })}
                >
                  Продлить подписку
                </ButtonText>
              </FloatingAlert>
            )}

            {/*{showEmailConfirmationAlert && (*/}
            {/*  <FloatingAlert*/}
            {/*    icon='attention_nt'*/}
            {/*    title={'Для работы в сервисе необходимо подтвердить адрес электронной почты.'}*/}
            {/*    text='Мы уже отправили вам письмо с подтверждением, но если вы его не нашли, то можете отправить ещё одно.'*/}
            {/*    onClose={this.handleClose}*/}
            {/*  >*/}
            {/*    <ButtonText*/}
            {/*      size='middle'*/}
            {/*      color='blue'*/}
            {/*      onClick={() => profileStore.sendConfirmEmail()}*/}
            {/*      disabled={!!confirmCountdown}*/}
            {/*    >*/}
            {/*      {'Подтвердить почту ' + (confirmCountdown ? `(${confirmCountdown})` : '')}*/}
            {/*    </ButtonText>*/}
            {/*  </FloatingAlert>*/}
            {/*)}*/}
            <Footer />
          </>}
        secondHeader={secondHeader}
        center={center}
        full={full}
        icon={icon}
      >
        {children}
      </PageLayout>
    )
  }
}

export default LiteLayout
