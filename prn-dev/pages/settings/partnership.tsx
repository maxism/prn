import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

import Title from '../../elements/Title/Title'
import { IStoreContext, Stores } from '../../stores/RootStore'
import ProfileStore from '../../stores/ProfileStore'
import Form from '../../elements/Form/Form'
import FormRow from '../../elements/Form/FormRow'
import InputText from '../../elements/InputText/InputText'
import Meta from '../../components/Meta'
import Row from '../../elements/Row/Row'
import Col from '../../elements/Col/Col'
import SettingsLayout from './_SettingsLayout'
import { SingletonRouter, withRouter } from 'next/router'
import AccessDeniedPage from '../../components/AccessDeniedPage'
import ServiceBlockGroup from '../../elements/ServiceBlock/ServiceBlockGroup'
import ServiceBlock from '../../elements/ServiceBlock/ServiceBlock'
import InfoLabelGroup from '../../elements/InfoLabel/InfoLabelGroup'
import InfoLabel from '../../elements/InfoLabel/InfoLabel'
import ButtonText from '../../elements/ButtonText/ButtonText'
import Checkbox from '../../elements/Checkbox/Checkbox'
import Link from '../../elements/Link/Link'
import Text from '../../elements/Text/Text'

interface IProps {
  router: SingletonRouter
  profileStore?: ProfileStore
}

interface IStates {
  isChecked?: boolean
}

@(withRouter as any)
@inject(Stores.PROFILE_STORE)
@observer
export default class SettingsPartnershipPage extends Component<IProps, IStates, any> {
  state = {
    isChecked: false
  }

  constructor (props: IProps) {
    super(props)
  }

  static async getInitialProps (ctx: IStoreContext): Promise<Partial<any>> {
    const { profileStore } = ctx.store

    await profileStore.loadPartnerReport()

    return {}
  }

  acceptPartnerTerms = async () => {
    const { profileStore } = this.props

    profileStore.profileForm.setData({ isPartner: true })
    await profileStore.update()
  }

  render (): JSX.Element {
    const { profileStore } = this.props

    if (!profileStore.isAuth) return <AccessDeniedPage />

    return (
      <SettingsLayout>

        <Meta
          title='Профиль'
        />

        <Row padding='xxl'>
          <Col size={12}>
            <Title>Партнерская программа</Title>
          </Col>
        </Row>

        {profileStore.profile.isPartner && (
          <>
            {/*<Row padding='m'>*/}
            {/*  <Col size={12}>*/}
            {/*    <Text semibold>Благодарим, за то, что стали партнером КУБ!</Text>*/}
            {/*  </Col>*/}
            {/*</Row>*/}

            <Row padding='xl'>
              <Col size={8}>
                <Form onSubmit={() => profileStore.update()}>
                  <FormRow full>
                    <InputText
                      white
                      label='Партнерская ссылка'
                      value={`https://prn.c-cube.ru?partnerCode=${profileStore.profile.userID}&promoCode=${String(profileStore.profile.partnerPromoCode || '').toUpperCase()}`}
                      readOnly
                    />
                  </FormRow>
                  <FormRow full>
                    {profileStore.profile.partnerPromoCode && (
                      <InputText
                        white
                        label='Партнерский промо-код'
                        value={profileStore.profile.partnerPromoCode.toUpperCase()}
                        readOnly
                      />
                    )}
                    {!profileStore.profile.partnerPromoCode && (
                      <Text>
                        Вы можете запросить персональный промо-код для своей аудитории. Для этого необходимо <Link onClick={() => window['carrotWrap']().track('Запрос на персональный промо-код')}>связаться с нами</Link>
                      </Text>
                    )}
                  </FormRow>
                </Form>
              </Col>
            </Row>

            <Row padding='xl' />

            <ServiceBlockGroup size='l'>
              <ServiceBlock size={12} white>
                <InfoLabelGroup size='l' fourCols small>
                  <InfoLabel
                    title='Регистраций'
                    value={profileStore.partnerReport?.summary?.count || '0'}
                  />
                  <InfoLabel
                    title='Доступно для выплаты'
                    value={profileStore.partnerReport?.summary?.available || '0'}
                    rouble
                  />
                  <InfoLabel
                    title='Заморожено'
                    value={profileStore.partnerReport?.summary?.frozen || '0'}
                    rouble
                  />
                  <InfoLabel
                    title='Выплачено'
                    value={profileStore.partnerReport?.summary?.payout || '0'}
                    rouble
                  />
                </InfoLabelGroup>
              </ServiceBlock>
            </ServiceBlockGroup>

            <Row padding='l' />

            <Form>
              <FormRow buttons>
                <ButtonText size='l' onClick={() => window['carrotWrap']().track('Хочу распорядиться вознаграждением')}>Распорядиться вознаграждением</ButtonText>
                <Link to='/docs/Affiliate_program_Cube.pdf' newTab>Правила партнерской программы</Link>
              </FormRow>
            </Form>
          </>
        )}

        {!profileStore.profile.isPartner && (
          <>
            {/*<Row padding='m'>*/}
            {/*  <Col size={12}>*/}
            {/*    <Text semibold>Для подключения партнерской программы...</Text>*/}
            {/*  </Col>*/}
            {/*</Row>*/}

            <Row padding='l' />

            <Form>
              <FormRow full>
                <Checkbox
                  white
                  size='s'
                  checked={this.state.isChecked}
                  onChange={() => this.setState({ isChecked: !this.state.isChecked })}
                >
                  Я принимаю условия <Link to='/docs/Affiliate_program_Cube.pdf' newTab>Партнерской программы</Link>
                </Checkbox>
              </FormRow>
              <FormRow buttons>
                <ButtonText size='l' onClick={this.acceptPartnerTerms} disabled={!this.state.isChecked} loading={profileStore.isLoading}>Стать партнером</ButtonText>
              </FormRow>
            </Form>
          </>
        )}

        {/*<Text>Рекомендуем использовать такой контекст:</Text>*/}
        {/*<Text>«Узнай бесплатно свою статистику по ссылке https://prn.c-cube.ru/ SDFSFDSFDS»</Text>*/}
        {/*<Text>«Узнай бесплатно свою статистику. Дарю тебе эксклюзивный доступ на 2 недели https://prn.c-cube.ru/ SDFSFDSFDS»</Text>*/}

        {/*<Text>Актуальный список регистраций и оплат:</Text>*/}
        {/*<Text>Пока никто не воспользовался вашим промокодом, но все еще впереди! 😊</Text>*/}
        {/*<Text>Условия:</Text>*/}
        {/*<Text>Вы получите 30% от каждой оплаты. Выплата доступна через 14 дней после оплаты покупателем.</Text>*/}

        {/*<Text>Ответы на вопросы:</Text>*/}
        {/*<Text>Вы получаете 30% от каждой оплаты.</Text>*/}
        {/*<Text>Выплата доступна через 14 дней после оплаты покупателем.</Text>*/}
        {/*<Text>Выплата осуществляется на банковскую карту в течение 3х дней после обращения.</Text>*/}

      </SettingsLayout>
    )
  }
}
