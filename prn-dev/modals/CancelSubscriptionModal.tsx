import React, { Component } from 'react'

import ModalPopup from '../elements/ModalPopup/ModalPopup'
import { SingletonRouter, withRouter } from 'next/router'
import { inject, observer } from 'mobx-react'
import Title from '../elements/Title/Title'
import Row from '../elements/Row/Row'
import Text from '../elements/Text/Text'
import FormRow from '../elements/Form/FormRow'
import Form from '../elements/Form/Form'
import {Stores} from '../stores/RootStore'
import RouterUtil from '../utils/RouterUtil'
import ButtonText from '../elements/ButtonText/ButtonText'
import RadioButton from '../elements/RadioButton/RadioButton'
import Checkbox from '../elements/Checkbox/Checkbox'
import Image from '../elements/Image/Image'
import Textarea from '../elements/Textarea/Textarea'
import ButtonTagGroup from '../elements/ButtonTag/ButtonTagGroup'
import PlanStore from "../stores/PlanStore";
import DateUtil from "../utils/DateUtil";
import ProfileStore from "../stores/ProfileStore";

interface IRouter extends SingletonRouter {
  /**
   * query
   */
  query: {
    /**
     * Название модалки
     */
    modal: string
  }
}

interface IProps {
  /**
   * router
   */
  router?: IRouter
  profileStore?: ProfileStore
  planStore?: PlanStore
}

interface IStates {
  tab: string
}

@(withRouter as any)
@inject(Stores.PROFILE_STORE, Stores.PLAN_STORE)
@observer
export default class CancelSubscriptionModal extends Component<IProps, IStates> {
  state: IStates = {
    tab: 'step1'
  }

  constructor (props: IProps) {
    super(props)
  }

  handleOpen = async () => {
    this.props.planStore.planSurveyForm.clearData()
    this.setState({
      tab: 'step1'
    })
  }

  handleChangeStep2Tasks = (e, name) => {
    const value = e.target.value
    const surveyForm = this.props.planStore.planSurveyForm
    const tasks = [...surveyForm.step2features.value]
    if (tasks.includes(name)) {
      if (!value) tasks.splice(tasks.indexOf(name), 1)
    } else if (value) {
      tasks.push(name)
    }
    surveyForm.step2features.change(tasks)
  }

  cancelSubscription = async () => {
    await this.props.planStore.removeCard()
    this.nextStep()
  }

  nextStep = () => {
    if (this.state.tab === 'step1') {
      const surveyForm = this.props.planStore.planSurveyForm
      const step1answer = surveyForm.step1answer.value
      if (step1answer === 'too_expensive') {
        surveyForm.step2notifyAboutPriceChanges.change(true)
        this.setState({ tab: 'step2.1' })
      }
      if (step1answer === 'no_features') this.setState({ tab: 'step2.2' })
      if (step1answer === 'use_other_service') this.setState({ tab: 'step2.3' })
      if (step1answer === 'use_service_issues') this.setState({ tab: 'step2.4' })
      if (step1answer === 'service_not_needed') this.setState({ tab: 'step2.5' })
      if (step1answer === 'payment_period_issue') this.setState({ tab: 'step2.6' })
      if (step1answer === 'other') this.setState({ tab: 'step2.7' })
      if (step1answer === 'contact_me') this.setState({ tab: 'step2.8' })
    }
    if (this.state.tab.startsWith('step2')) {
      this.setState({ tab: 'step3' })
    }
  }

  render (): JSX.Element {
    const { router, planStore } = this.props
    const { step1answer, step2features, step2comment, step2notifyAboutPriceChanges } = this.props.planStore.planSurveyForm
    const isLoading = planStore.isLoading

    return (
      <ModalPopup
        open={router?.query?.modal === 'cancel-subscription'}
        onCloseClick={() => RouterUtil.replaceParams(router, { modal: undefined })}
        onOpen={this.handleOpen}
      >
        {this.state.tab === 'step1' && (
          <>
            <Title>Почему вы отменяете подписку?</Title>
            <Row padding='m'/>
            <Text size='m' semibold>
              Нам жаль, что вы уходите 😢 Расскажите, почему вы решили отменить подписку, может быть мы сможем помочь?
            </Text>

            <Row padding='xl'/>

            <Form>
              <FormRow full>
                <RadioButton
                  white
                  value='service_not_needed'
                  group='step1answer'
                  label='Работа сделана'
                  checked={step1answer.value === 'service_not_needed'}
                  onSelect={e => step1answer.change(e.target.value)}
                />
              </FormRow>
              <FormRow full>
                <RadioButton
                  white
                  value='payment_period_issue'
                  group='step1answer'
                  label='Хочу оплачивать помесячно'
                  checked={step1answer.value === 'payment_period_issue'}
                  onSelect={e => step1answer.change(e.target.value)}
                />
              </FormRow>
              <FormRow full>
                <RadioButton
                  white
                  value='no_features'
                  group='step1answer'
                  label='Нет нужных функций'
                  checked={step1answer.value === 'no_features'}
                  onSelect={e => step1answer.change(e.target.value)}
                />
              </FormRow>
              <FormRow full>
                <RadioButton
                  white
                  value='too_expensive'
                  group='step1answer'
                  label='Слишком дорого'
                  checked={step1answer.value === 'too_expensive'}
                  onSelect={e => step1answer.change(e.target.value)}
                />
              </FormRow>
              <FormRow full>
                <RadioButton
                  white
                  size='m'
                  value='use_other_service'
                  group='step1answer'
                  label='Перешел на другой сервис'
                  checked={step1answer.value === 'use_other_service'}
                  onSelect={e => step1answer.change(e.target.value)}
                />
              </FormRow>
              <FormRow full>
                <RadioButton
                  white
                  value='use_service_issues'
                  group='step1answer'
                  label='Возникли проблемы при использовании'
                  checked={step1answer.value === 'use_service_issues'}
                  onSelect={e => step1answer.change(e.target.value)}
                />
              </FormRow>
              <FormRow full>
                <RadioButton
                  white
                  value='other'
                  group='step1answer'
                  label='Другая причина'
                  checked={step1answer.value === 'other'}
                  onSelect={e => step1answer.change(e.target.value)}
                />
              </FormRow>
              <FormRow full>
                <RadioButton
                  white
                  value='contact_me'
                  group='step1answer'
                  label='Свяжитесь со мной, все расскажу'
                  checked={step1answer.value === 'contact_me'}
                  onSelect={e => step1answer.change(e.target.value)}
                />
              </FormRow>

              <Row padding='m' />
              <Row padding='xxs' />

              <FormRow buttons>
                <ButtonText size='l' disabled={!step1answer.value} onClick={this.nextStep}>Продолжить</ButtonText>
              </FormRow>
            </Form>
          </>)}

        {this.state.tab === 'step2.1' && (
          <>
            <Title>Отмена подписки</Title>
            <Row padding='m'/>
            <Text size='m' semibold>
              К сожалению, на данный момент мы не можем снизить цену. Как только что-то поменяется в наших тарифных планах — мы можем прислать вам элетронное письмо с подробной информацией.
            </Text>

            <Row padding='xl'/>

            <Form>
              <FormRow full>
                <Checkbox
                  white
                  group='subscription'
                  label='Сообщите мне об изменении цен'
                  checked={step2notifyAboutPriceChanges.value}
                  onChange={e => step2notifyAboutPriceChanges.change(!!e.target.value)}
                />
              </FormRow>

              <Row padding='m' />
              <Row padding='xxs' />

              <FormRow buttons>
                <ButtonText size='l' onClick={this.cancelSubscription} loading={isLoading}>Отменить подписку</ButtonText>
              </FormRow>
            </Form>
          </>)}

        {this.state.tab === 'step2.2' && (
          <>
            <Title>Отмена подписки</Title>
            <Row padding='m'/>
            <Text size='m' semibold>
              Спасибо! Уделите ещё минуту и расскажите, каких функций вам не хватает для работы, чтобы мы могли добавить их в будущем.
            </Text>

            <Row padding='xl'/>

            <Form>
              <FormRow full>
                <Checkbox
                  white
                  group='noFeatures'
                  label='Автопостинг'
                  checked={step2features.value.includes('posting_in_social_networks')}
                  onChange={e => this.handleChangeStep2Tasks(e, 'posting_in_social_networks')}
                />
              </FormRow>
              <FormRow full>
                <Checkbox
                  white
                  group='noFeatures'
                  label='Возможность ответа на комментарии и личные сообщения'
                  checked={step2features.value.includes('comments_and_dm')}
                  onChange={e => this.handleChangeStep2Tasks(e, 'comments_and_dm')}
                />
              </FormRow>
              <FormRow full>
                <Checkbox
                  white
                  group='noFeatures'
                  label='Больше данных и более подробная статистика'
                  checked={step2features.value.includes('need_more_data')}
                  onChange={e => this.handleChangeStep2Tasks(e, 'need_more_data')}
                />
              </FormRow>
              <FormRow full>
                <Checkbox
                  white
                  group='noFeatures'
                  label='Больше возможностей у отчётов'
                  checked={step2features.value.includes('need_more_reports_features')}
                  onChange={e => this.handleChangeStep2Tasks(e, 'need_more_reports_features')}
                />
              </FormRow>
              <FormRow full>
                <Checkbox
                  white
                  group='noFeatures'
                  label='Командная работа'
                  checked={step2features.value.includes('teamwork')}
                  onChange={e => this.handleChangeStep2Tasks(e, 'teamwork')}
                />
              </FormRow>

              <Row padding='m' />
              <Row padding='xxs' />

              <FormRow buttons>
                <ButtonText size='l' onClick={this.cancelSubscription} loading={isLoading}>Отменить подписку</ButtonText>
              </FormRow>
            </Form>
          </>)}

        {this.state.tab === 'step2.3' && (
          <>
            <Title>Отмена подписки</Title>
            <Row padding='m'/>
            <Text size='m' semibold>
              Вы можете рассказать, какой сервис вы выбрали и почему?
            </Text>

            <Row padding='xl'/>

            <Form>
              <FormRow full>
                <Textarea
                  white
                  placeholder='Напишите пару строк, если хотите'
                  minRows={3}
                  maxRows={8}
                  value={step2comment.value}
                  onChange={e => step2comment.change(e.target.value)}
                />
              </FormRow>

              <Row padding='m' />
              <Row padding='xxs' />

              <FormRow buttons>
                <ButtonText size='l' onClick={this.cancelSubscription} loading={isLoading}>Отменить подписку</ButtonText>
              </FormRow>
            </Form>
          </>)}

        {this.state.tab === 'step2.4' && (
          <>
            <Title>Отмена подписки</Title>
            <Row padding='m'/>
            <Text size='m' semibold>
              Нам очень жаль. Расскажите о возникших проблемах — мы с радостью поможем оперативно разобраться с недоразумением!
            </Text>
            <Row padding='xs' />
            <Row padding='l'/>
            <ButtonTagGroup>
              <ButtonText size='l' onClick={() => window['carrotWrap']().open()} loading={isLoading}>Обратиться в поддержку</ButtonText>
              <ButtonText size='l' secondary onClick={this.cancelSubscription} loading={isLoading}>Отменить подписку</ButtonText>
            </ButtonTagGroup>
          </>)}

        {this.state.tab === 'step2.5' && (
          <>
            <Title>Отмена подписки</Title>
            <Row padding='m'/>
            <Text size='m' semibold>
              Спасибо за использование сервисов КУБ! Надеемся, что вы скоро вернётесь с новыми проектами.
            </Text>
            <Row padding='xs' />
            <Row padding='l'/>
            <ButtonTagGroup>
              <ButtonText size='l' onClick={this.cancelSubscription} loading={isLoading}>Отменить подписку</ButtonText>
            </ButtonTagGroup>
          </>)}

        {this.state.tab === 'step2.6' && (
          <>
            <Title>Отмена подписки</Title>
            <Row padding='m'/>
            <Text size='m' semibold>
              Вы можете в любой момент перейти на помесячную оплату. В профиле нажмите «Выбрать другой тариф» и укажите свой текущий тариф с пометкой «Помесячная оплата».
              <br/><br/>
              Мы пересчитаем ваш предыдущий платёж и зачислим на счет нужную сумму. Для возврата оставшихся средств — свяжитесь с нами.
            </Text>
            <Row padding='xs' />
            <Row padding='l'/>
            <ButtonTagGroup>
              <ButtonText size='l' onClick={() => RouterUtil.replaceParams(router, { modal: 'change-plan' })} loading={isLoading}>Перейти на помесячную оплату</ButtonText>
              <ButtonText size='l' secondary onClick={this.cancelSubscription} loading={isLoading}>Отменить подписку</ButtonText>
            </ButtonTagGroup>
          </>)}

        {this.state.tab === 'step2.7' && (
          <>
            <Title>Отмена подписки</Title>
            <Row padding='m'/>
            <Text size='m' semibold>
              Расскажите о причинах отмены подписки, мы будем очень признательны.
            </Text>

            <Row padding='xl'/>

            <Form>
              <FormRow full>
                <Textarea
                  white
                  placeholder='Напишите пару строк, если хотите'
                  minRows={5}
                  maxRows={10}
                  value={step2comment.value}
                  onChange={e => step2comment.change(e.target.value)}
                />
              </FormRow>

              <Row padding='m' />
              <Row padding='xxs' />

              <FormRow buttons>
                <ButtonText size='l' onClick={this.cancelSubscription} loading={isLoading}>Отменить подписку</ButtonText>
              </FormRow>
            </Form>
          </>)}

        {this.state.tab === 'step2.8' && (
          <>
            <Title>Отмена подписки</Title>
            <Row padding='m'/>
            <Text size='m' semibold>
              Спасибо за использование сервисов КУБ! Мы скоро с вами свяжемся для уточнения деталей.
            </Text>
            <Row padding='xs' />
            <Row padding='l'/>
            <ButtonTagGroup>
              <ButtonText size='l' onClick={this.cancelSubscription} loading={isLoading}>Отменить подписку</ButtonText>
            </ButtonTagGroup>
          </>)}

        {this.state.tab === 'step3' && (
          <>
            <Image src={require('../public/images/emoji_okay.png')} emoji />
            <Row padding='l'/>
            <Title>Подписка отменена</Title>
            <Row padding='m'/>
            <Text size='m' semibold>
              {`Отмена подписки прошла успешно. Вы по прежнему сможете пользоваться всеми оплаченными функциями до ${DateUtil.format(this.props.profileStore.userPlan.activeToDate, 'D MMMM Y')} года. После этого мы переведём ваш аккаунт на бесплатный тариф. Вы в любой момент сможете возобновить подписку — оплатить её или выбрать другой тариф.`}
            </Text>
            <Row padding='xs' />
            <Row padding='l'/>
            <ButtonTagGroup>
              <ButtonText size='l' onClick={() => RouterUtil.replaceParams(router, { modal: undefined })} >Закрыть окно</ButtonText>
            </ButtonTagGroup>
          </>)}

      </ModalPopup>
    )
  }
}
