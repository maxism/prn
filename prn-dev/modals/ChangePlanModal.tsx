import React, { Component } from 'react'
import ModalPopup from '../elements/ModalPopup/ModalPopup'
import { SingletonRouter, withRouter } from 'next/router'
import { inject, observer } from 'mobx-react'
import Title from '../elements/Title/Title'
import Row from '../elements/Row/Row'
import Text from '../elements/Text/Text'
import FormRow from '../elements/Form/FormRow'
import Form from '../elements/Form/Form'
import { Stores } from '../stores/RootStore'
import ProfileStore, { PlanStatus } from '../stores/ProfileStore'
import AccountsStore from '../stores/AccountsStore'
import RouterUtil from '../utils/RouterUtil'
import ButtonText from '../elements/ButtonText/ButtonText'
import ModalChangePlanSelector from '../elements/ModalChangePlanSelector/ModalChangePlanSelector'
import Select from '../elements/Select/Select'
import PlanStore from '../stores/PlanStore'
import Notification from '../elements/Notification/Notification'
import TextColor from '../elements/TextColor/TextColor'
import Link from '../elements/Link/Link'

interface IRouter extends SingletonRouter {
  /**
   * query
   */
  query: {
    /**
     * Название модалки
     */
    modal: string
    /**
     * Название тариф
     */
    planName?: string
    /**
     * Период тарифа
     */
    planPeriod?: string
  }
}

interface IProps {
  /**
   * router
   */
  router?: IRouter
  profileStore?: ProfileStore
  accountsStore?: AccountsStore
  planStore?: PlanStore
}

@(withRouter as any)
@inject(Stores.PROFILE_STORE, Stores.ACCOUNTS_STORE, Stores.PLAN_STORE)
@observer
export default class ChangePlanModal extends Component<IProps, any> {
  constructor (props: IProps) {
    super(props)
  }

  handleOpen = async () => {
    const { router, profileStore, planStore } = this.props

    const plan = profileStore.userPlan.next
    planStore.planPaymentForm.setData({
      name: router.query.planName || profileStore.getHigherPlansByOptions()[0],
      period: Number(router.query.planPeriod) || plan.period,
      method: 'bank_card'
    })
  }

  changePlan = async () => {
    const { router, profileStore, planStore } = this.props

    let modal = undefined
    if (this.isPaymentRequired()) {
      modal = 'select-payment-method'
    } else {
      await planStore.pay()
      if (planStore.confirmationURL) {
        document.location.href = planStore.confirmationURL
      } else {
        await profileStore.load()
      }
    }

    const { name, period } = planStore.planPaymentForm
    RouterUtil.replaceParams(router, {
      modal,
      planName: name || undefined,
      planPeriod: period?.toString() || undefined
    })
  }

  selectPlan = (e) => {
    const planForm = this.props.planStore.planPaymentForm
    const planPeriod = planForm.period.value

    const name = e.target.value
    const period = this.isOneMonthPlan(name) ? 1 : planPeriod
    planForm.setData({
      name,
      period
    })
  }

  isOneMonthPlan = (planName) => {
    return (['suite', 'free', 'special'].includes(planName))
  }

  isPaymentRequired = () => {
    const { planStore, profileStore } = this.props
    const planName = planStore.planPaymentForm.name.value
    const period = planStore.planPaymentForm.period.value

    const userPlan = profileStore.userPlan.current
    const plan = planStore.getPlanByName(planName)
    const newPlan = { ...plan, period }

    if (newPlan.name === 'free') return false // если тариф бесплатный
    if (profileStore.userPlan.planStatus !== PlanStatus.PAID) return true // необходимо оплатить тариф
    if (newPlan.period > userPlan.period) return true // если выбранный период отличается от текущего периода
    if (newPlan.name === userPlan.name) return false // если текущий тариф
    if (newPlan.price > userPlan.price) return true // если базовая стоимость выбраного тарифа больше текущей
  }

  render (): JSX.Element {
    const { router, planStore, profileStore } = this.props
    const planName = planStore.planPaymentForm.name.value
    const planPeriod = planStore.planPaymentForm.period.value

    if (!profileStore.isAuth) return null

    const periodsList = [{ id: 'month', name: 'На месяц', value: 1 }, { id: 'year', name: 'На год (Cкидка 15%)', value: 12 }]
    let plansList = planStore.plans.map(x => ({ id: x.name, name: x.name.toUpperCase().concat(profileStore.userPlan.current?.name === x.name ? ' (Текущий тариф)' : '') })).filter(item => !['guest', 'suite'].includes(item.id))
    plansList.push({ id: 'special', name: 'SPECIAL' })

    if (profileStore.userPlan.current.name !== 'free') plansList = plansList.filter(p => p.id !== 'free')

    const planNext = profileStore.userPlan.next
    const isSelectedPlan = planNext.name === planName && planNext.period === planPeriod

    const selectedPlan = planStore.getPlanByName(planName)

    return (
      <ModalPopup
        open={router?.query?.modal === 'change-plan'}
        onCloseClick={() => RouterUtil.replaceParams(router, { modal: undefined, planName: undefined, planPeriod: undefined })}
        onOpen={this.handleOpen}
      >
        <Title>Ваш новый тариф</Title>
        <Row padding='m'/>
        <Text size='m' semibold>
          Вы можете поменять тариф и его длительность в любой момент. Переход на более высокий тариф происходит сразу после оплаты, переход на более низкий тариф происходит после окончания оплаченного срока текущего тарифа.
        </Text>
        <Row padding='s' />
        <Text size='m' semibold>
          Подписка продлится автоматически в соответствии с <Link to='/about/payment-regular' newTab>офертой регулярных платежей</Link>. Мы уведомим о продлении за 3 дня. Отменить подписку можно в любой момент.
        </Text>
        <Row padding='s' />
        <Text size='s'><Link to='/plans#general' newTab>Перейти на страницу с подробным описанием тарифов</Link></Text>
        <Row padding='xl' />

        <Form>
          <FormRow>
            <Select white label='Тариф' list={plansList} value={planName} onSelect={e => this.selectPlan(e)} />
            {!this.isOneMonthPlan(planName) &&
                <Select
                    white
                    label='Длительность'
                    list={periodsList}
                    value={periodsList.find(x => x.value === planPeriod)?.id}
                    onSelect={e => planStore.planPaymentForm.period.change(periodsList.find(x => x.id === e.target.value)?.value)}
                />
            }
          </FormRow>
        </Form>

        <Row padding='l' />

        {!isSelectedPlan && selectedPlan?.name && (profileStore.userPlan?.current?.price >= selectedPlan?.price) && (
          <>
            <Notification
              icon='none'
              title='Ограничение функционала'
              message={`При переходе на тариф «${planName.toUpperCase()}» некоторые возможности сервисов могут быть заблокированы.`}
            />
            <Row padding='l' />
          </>
        )}

        {selectedPlan && <ModalChangePlanSelector
          name={selectedPlan?.name}
          price={selectedPlan?.price}
          projects={selectedPlan?.projects}
          communities={selectedPlan?.communities}
          competitors={selectedPlan?.competitors}
          influencers={selectedPlan?.influencers}
          retrospectives={selectedPlan?.retrospectives}
          reports={selectedPlan?.reports}
          period={planPeriod}
          promoDiscount={profileStore.getPromoDiscount()}
          indexLevel={selectedPlan?.indexLevel}
          topRating={selectedPlan?.topRating}
        />}

        {!isSelectedPlan && selectedPlan &&
          <>
            <Row padding='l'/>
            <Form>
              <FormRow full>
                <ButtonText size='l' loading={planStore.isPaying || profileStore.isLoading} onClick={this.changePlan}>
                  {this.isPaymentRequired() ? 'Перейти к оплате' : 'Сменить тариф (бесплатно)'}
                </ButtonText>
              </FormRow>
            </Form>
          </>
        }

        {!selectedPlan && (
          <>
            <Form>
              <FormRow full>
                <Text size='m' semibold><TextColor color='dark'>Тариф, который настраивается под ваши задачи</TextColor></Text>
                <Text>Если вам не хватает возможностей в тарифе Pro — оставьте заявку нашим менеджерам и мы создадим вам персональный тариф с любыми настройками.</Text>
              </FormRow>
              <Row padding='l' />
              <FormRow full>
                <ButtonText size='l' onClick={() => window['carrotWrap']().track('Запрос тарифа SPECIAL')}>
                  Оставить заявку
                </ButtonText>
              </FormRow>
            </Form>
          </>
        )}
      </ModalPopup>
    )
  }
}
