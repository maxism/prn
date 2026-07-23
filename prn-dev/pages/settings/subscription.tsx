import React, {Component} from 'react'
import { inject, observer } from 'mobx-react'

import Title from '../../elements/Title/Title'
import {IStoreContext, Stores} from '../../stores/RootStore'
import ProfileStore, {PlanStatus} from '../../stores/ProfileStore'
import Meta from '../../components/Meta'
import Row from '../../elements/Row/Row'
import Col from '../../elements/Col/Col'
import Text from '../../elements/Text/Text'
import SettingsLayout from './_SettingsLayout'
import ServiceBlockGroup from '../../elements/ServiceBlock/ServiceBlockGroup'
import ServiceBlock from '../../elements/ServiceBlock/ServiceBlock'
import InfoLabelGroup from '../../elements/InfoLabel/InfoLabelGroup'
import InfoLabel from '../../elements/InfoLabel/InfoLabel'
import ButtonTextGroup from '../../elements/ButtonText/ButtonTextGroup'
import ButtonText from '../../elements/ButtonText/ButtonText'
import PlanHistory from '../../elements/PlanHistory/PlanHistory'
import PlanHistoryItem from '../../elements/PlanHistory/PlanHistoryItem'
import {SingletonRouter, withRouter} from 'next/router'
import RouterUtil from '../../utils/RouterUtil'
import CancelSubscriptionModal from '../../modals/CancelSubscriptionModal'
import DateUtil from '../../utils/DateUtil'
import NumeralUtil from '../../utils/NumeralUtil'
import PlanUtil from '../../utils/PlanUtil'
import AccessDeniedPage from '../../components/AccessDeniedPage'
import PlanStore from '../../stores/PlanStore'
import Notification from '../../elements/Notification/Notification'
import AccountsStore from '../../stores/AccountsStore'
import CommunitiesStore, {CommunityType} from '../../stores/CommunitiesStore'

interface IProps {
  router: SingletonRouter
  profileStore?: ProfileStore
  planStore?: PlanStore
  communitiesStore?: CommunitiesStore
  accountsStore?: AccountsStore
}

interface IStates {
  maxInvoicesCount?: number
  showChangePassword?: boolean
}

@(withRouter as any)
@inject(Stores.PROFILE_STORE, Stores.PLAN_STORE, Stores.COMMUNITIES_STORE, Stores.ACCOUNTS_STORE)
@observer
export default class SettingsSubscriptionPage extends Component<IProps, IStates> {
  state: IStates = {
    maxInvoicesCount: 5,
    showChangePassword: false
  }

  static async getInitialProps (ctx: IStoreContext): Promise<Partial<any>> {
    await ctx.store.planStore.loadInvoices()
    return {}
  }

  componentDidMount() {
    const router = this.props.router
    if (router.query.invoiceID) {
      RouterUtil.replaceParams(router, { modal: 'awaiting-payment' })
    }
  }

  getInvoiceText = (items): string => {
    if (!items) return ''
    if (typeof items === 'number') {
      return `Оплата ${items} сообществ`
    }

    return `Оплата тарифа «${ items.name.toUpperCase() }»`
  }

  openModal = (modal: 'change-plan' | 'cancel-subscription' | 'select-payment-method', planName: string = '', planPeriod: number = 1) => {
    RouterUtil.replaceParams(this.props.router, { modal, planName, planPeriod: String(planPeriod) })
  }

  render (): JSX.Element {
    const { profileStore, planStore, communitiesStore, accountsStore } = this.props

    if (!profileStore.isAuth) return <AccessDeniedPage />

    const userPlan = profileStore.userPlan
    const currentPlan = userPlan.current
    const nextPlan = userPlan.next

    const isCurrentFree = currentPlan.name === 'free'
    const isNextFree = nextPlan.name === 'free'

    const planDiscount = PlanUtil.getPeriodDiscount(currentPlan.period) + profileStore.getPromoDiscount()
    const planCost = PlanUtil.getCostWithDiscount(currentPlan.price * currentPlan.period, planDiscount)

    const nextPlanDiscount = PlanUtil.getPeriodDiscount(nextPlan.period) + profileStore.getPromoDiscount()
    const nextPlanCost = PlanUtil.getCostWithDiscount(nextPlan.price * nextPlan.period, nextPlanDiscount)
    const nextPlanPeriodText = !isNextFree ? ` (${NumeralUtil.format(nextPlan.period, '0,0', ['месяц', 'месяца', 'месяцев'])})` : ''
    const nextPlanText = `${DateUtil.format(userPlan.activeToDate, 'D MMMM Y')} ваш тариф будет изменён на ${userPlan.next.name.toUpperCase()} ${nextPlanPeriodText} ${!isNextFree ? `. Цена нового тарифа ${nextPlanCost} р.` : ''}`

    const currentProjects = accountsStore.getProjects().length
    const maxProjects = userPlan.current.projects
    const currentCommunities = communitiesStore.getMaxCommunityPerProject(CommunityType.MY)
    const maxCommunities = userPlan.current.communities
    const currentCompetitors = communitiesStore.getMaxCommunityPerProject(CommunityType.COMPETITOR)
    const maxCompetitors = userPlan.current.competitors
    const currentInfluencers = communitiesStore.getMaxCommunityPerProject(CommunityType.INFLUENCER)
    const maxInfluencers = userPlan.current.influencers

    return (
      <SettingsLayout>
        <Meta title='Подписка и оплата' />

        <Row padding='xxl'>
          <Col size={12}>
            <Title>Ограничения тарифа</Title>
          </Col>
        </Row>

        <Row padding='m'>
          <Col size={12}>
            <Text semibold>
              В наших тарифах предусмотрены ограничения. Проекты и страницы, выходящие за рамки ограничений, будут заблокированы.
            </Text>
          </Col>
        </Row>

        {currentPlan.name !== nextPlan.name &&
          <Row padding='xl'>
            <Col size={12}>
              <Notification
                icon='admin'
                title='Переход на другой тариф'
                message={nextPlanText}
                buttonText='Отменить'
                isLoading={planStore.isPaying}
                onClick={async () => {
                  planStore.planPaymentForm.setData({
                    name: currentPlan.name,
                    period: currentPlan.period
                  })
                  await planStore.pay()
                }}
              />
            </Col>
          </Row>
        }

        <Row padding='xl' />

        <ServiceBlockGroup size='l'>
          <ServiceBlock size={12} white>
            <InfoLabelGroup size='l' fourCols small>
              <InfoLabel
                title='Проектов'
                value={`${currentProjects} из ${maxProjects}`}
                format='string'
                tooltipTitle='Превышено ограничение'
                tooltipText={`Вы добавили на ${NumeralUtil.format(currentProjects - maxProjects, '0,0', ['проект', 'проекта', 'проектов'])} больше, чем предполагает тариф. Блокировка сохранится до тех пор, пока вы не перейдёте на более высокий тариф.`}
                tooltipButton='Выбрать тариф'
                hideTooltip={currentProjects <= maxProjects}
                error={currentProjects > maxProjects}
                tooltipButtonOnClick={() => this.openModal('change-plan')}
              />
              <InfoLabel
                title='Страниц в проекте'
                value={`${currentCommunities} из ${maxCommunities}`}
                format='string'
                tooltipTitle='Превышено ограничение'
                tooltipText={`Вы добавили на ${NumeralUtil.format(currentCommunities - maxCommunities, '0,0', ['страницу', 'страницы', 'страниц'])} больше, чем предполагает тариф. Блокировка сохранится до тех пор, пока вы не перейдёте на более высокий тариф.`}
                tooltipButton='Выбрать тариф'
                hideTooltip={currentCommunities <= maxCommunities}
                error={currentCommunities > maxCommunities}
                tooltipButtonOnClick={() => this.openModal('change-plan')}
              />
              <InfoLabel
                title='Конкурентов в проекте'
                value={`${currentCompetitors} из ${maxCompetitors}`}
                format='string'
                tooltipTitle='Превышено ограничение'
                tooltipText={`Вы добавили на ${NumeralUtil.format(currentCompetitors - maxCompetitors, '0,0', ['конкурента', 'конкурента', 'конкурентов'])} больше, чем предполагает тариф. Блокировка сохранится до тех пор, пока вы не перейдёте на более высокий тариф.`}
                tooltipButton='Выбрать тариф'
                hideTooltip={currentCompetitors <= maxCompetitors}
                error={currentCompetitors > maxCompetitors}
                tooltipButtonOnClick={() => this.openModal('change-plan')}
              />
              <InfoLabel
                title='Блогеров в проекте'
                value={`${currentInfluencers} из ${maxInfluencers}`}
                format='string'
                tooltipTitle='Превышено ограничение'
                tooltipText={`Вы добавили на ${NumeralUtil.format(currentInfluencers - maxInfluencers, '0,0', ['блогера', 'блогера', 'блогеров'])} больше, чем предполагает тариф. Блокировка сохранится до тех пор, пока вы не перейдёте на более высокий тариф.`}
                tooltipButton='Выбрать тариф'
                hideTooltip={currentInfluencers <= maxInfluencers}
                error={currentInfluencers > maxInfluencers}
                tooltipButtonOnClick={() => this.openModal('change-plan')}
              />
            </InfoLabelGroup>
          </ServiceBlock>
        </ServiceBlockGroup>

        <Row padding='xxl'>
          <Col size={12}>
            <Title>Текущая подписка</Title>
          </Col>
        </Row>
        <Row padding='m'>
          <Col size={12}>
            <Text semibold>
              Сервис предоставляется в виде подписки на месяц или год. Вы в любой момент можете выбрать другой тариф, отменить подписку или изменить способ оплаты. Если вы привяжете карту, то подписка будет продлеваться автоматически.
            </Text>
          </Col>
        </Row>
        <Row padding='xl' />

        <ServiceBlockGroup size='l'>
          <ServiceBlock size={12} white>
            <InfoLabelGroup size='l'>
              <InfoLabel title='Тарифный план'>{currentPlan.name.toUpperCase()}</InfoLabel>
              {isCurrentFree
                ?
                  <>
                    <InfoLabel title='Действует до'>{DateUtil.format(userPlan.activeToDate, 'D MMMM Y')}</InfoLabel>
                    <InfoLabel title='Стоимость'>Бесплатно</InfoLabel>
                    <InfoLabel button={<ButtonText size='l' color='blue' onClick={() => this.openModal('change-plan')}>Выбрать другой тариф</ButtonText>}/>
                  </>
                :
                  <>
                    <InfoLabel title='Следующий платеж'>{DateUtil.format(userPlan.activeToDate, 'D MMMM Y')}</InfoLabel>
                    <InfoLabel title='Стоимость' rouble>{NumeralUtil.format(planCost, '0,0')}</InfoLabel>
                    {userPlan.isCardValid && userPlan.isCardAttached &&
                        <InfoLabel button={<ButtonText size='l' color='grey' onClick={() => this.openModal('cancel-subscription')}>Отменить подписку</ButtonText>}/>
                    }
                    {(![PlanStatus.NONE, PlanStatus.PAID].includes(userPlan.planStatus) && (!userPlan.isCardValid || !userPlan.isCardAttached) || !userPlan.isPlanValid) &&
                        <InfoLabel button={<ButtonText size='l' color='red' onClick={() => this.openModal('select-payment-method', userPlan.current.name, userPlan.current.period)}>Оплатить подписку</ButtonText>}/>
                    }
                  </>
              }
            </InfoLabelGroup>
          </ServiceBlock>
        </ServiceBlockGroup>

        <Row padding='l' />

        <ButtonTextGroup size='s'>
          <ButtonText size='l' onClick={() => this.openModal('change-plan')}>Выбрать другой тариф</ButtonText>
          {userPlan.isCardAttached && <InfoLabel button={<ButtonText size='l' color='grey' onClick={() => this.openModal('cancel-subscription')}>Отменить подписку</ButtonText>}/>}
        </ButtonTextGroup>

        {!!planStore.paidInvoices.length && (
          <>
            <Row padding='xxl'/>
            <Row padding='xxl'>
              <Col size={12}>
                <Title>История платежей</Title>
              </Col>
            </Row>

            <Row padding='m'>
              <Col size={12}>
                <Text semibold>
                  Здесь вы можете посмотреть всю историю своих покупок. Если возникнут проблемы, номера транзакций могут потребоваться при обращении в поддержку.
                </Text>
              </Col>
            </Row>

            <Row padding='l' />
            {planStore.paidInvoices.length &&
            <PlanHistory>
              {planStore.paidInvoices.slice(0, this.state.maxInvoicesCount).map(invoice =>(
                <PlanHistoryItem
                  key={invoice.invoiceID}
                  date={invoice.timeCreate}
                  text={this.getInvoiceText(invoice.items)}
                  number={invoice.invoiceID.toString()}
                  cost={invoice.cost}
                />
              ))}
            </PlanHistory>
            }

            <Row padding='l' />

            {planStore.paidInvoices.length > this.state.maxInvoicesCount &&
            <ButtonTextGroup size='s'>
              <ButtonText size='l' onClick={() => this.setState({ maxInvoicesCount: this.state.maxInvoicesCount + 5 })}>Показать ещё</ButtonText>
            </ButtonTextGroup>
            }
          </>
        )}

        <CancelSubscriptionModal />

      </SettingsLayout>
    )
  }
}
