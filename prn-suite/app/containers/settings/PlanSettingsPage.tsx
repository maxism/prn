import React, { Component } from 'react'
import config from '../../config'
import { IGlobalParams } from '../../interfaces/IParams'
import Segment from '../../ui/elements/Segment/Segment'
import NumeralUtil from '../../utils/NumeralUtil'
import LiteLayout from '../layouts/LiteLayout'
import ButtonText from '../../ui/elements/ButtonText/ButtonText'
import Title from '../../ui/elements/Title/Title'
import Info from '../../ui/elements/Info/Info'
import InfoGroup from '../../ui/elements/Info/InfoGroup'
import Description from '../../ui/elements/Description/Description'
import { inject, observer } from 'mobx-react'
import { Stores } from '../../stores/RootStore'
import DateUtil from '../../utils/DateUtil'
import withParams, { ParamsProps } from '../../utils/withParams'
import PlanStore from '../../stores/PlanStore'
import ProfileStore from '../../stores/ProfileStore'
import Timeout = NodeJS.Timeout
import Toolbar2 from '../../ui/elements/Toolbar2/Toolbar2'
import Toolbar2Group from '../../ui/elements/Toolbar2/Toolbar2Group'
import CommunityNotification from '../../ui/elements/CommunityNotification/CommunityNotification'
import { Helmet } from 'react-helmet'
import ViewPaymentInfo from '../../ui/elements/ViewPaymentInfo/ViewPaymentInfo'
import YMUtil from '../../utils/YMUtil'

interface IProps {
  params?: ParamsProps<IGlobalParams>
  profileStore?: ProfileStore
  planStore?: PlanStore
}

@withParams
@inject(Stores.PROFILE_STORE, Stores.PLAN_STORE)
@observer
class PlanSettingsPage extends Component<IProps> {
  private _timer: Timeout = null
  constructor (props: IProps) {
    super(props)
    this.load()
  }

  componentDidMount (): void {
    this._timer = setInterval(() => this.load(), 5000)
  }

  async componentDidUpdate (prevProps: Readonly<IProps>, prevState: Readonly<{}>, snapshot?: any): Promise<void> {
    const { params, planStore, profileStore } = this.props
    if (planStore.confirmationURL) location.href = planStore.confirmationURL

    // Если счет оплачен
    if (params.invoiceID) {
      const invoice = planStore.getInvoiceByInvoiceID(params.invoiceID)

      // Отключаем проверку
      if (invoice?.status !== 'pending') {
        await profileStore.load(true)
        params.changeParams({ invoiceID: undefined })
        if (invoice?.status === 'paid') YMUtil.reachGoal('payment')
      }
    }
  }

  componentWillUnmount (): void {
    clearInterval(this._timer)
  }

  load = () => {
    this.props.planStore.load()
  }

  handlePurchase = (method = '') => {
    YMUtil.reachGoal('checkout')
    const redirectURL = `${config.websiteUrl}settings/plan?accountID=${this.props.params.accountID}&invoiceID={invoiceID}`
    this.props.planStore.pay(redirectURL, method)
  }

  removeCard = () => {
    this.props.planStore.removeCard()
  }

  cardFormat = (card: string): string => {
    if (!card) return ''

    return card.match(/.{1,4}/g).join(' ')
  }

  renderCard (): JSX.Element {
    const plan = this.props.profileStore.profile.plan
    const isCardAttached = plan.isCardAttached
    const isCardValid = plan.isCardValid
    if (isCardAttached) {
      return (
        <Segment size={3}>
          <InfoGroup>
            <Info
              wide
              title='Привязанная карта'
              warning={!isCardValid}
              text={this.cardFormat(plan.cardNumber)}
              description='помощь'
            />
            {isCardValid && <ButtonText unsubscribe size='awesome' color='grey' icon='undetected' onClick={() => this.removeCard()}>Отменить подписку</ButtonText>}
            {!isCardValid && <ButtonText unsubscribe size='awesome' color='grey' icon='undetected' onClick={() => this.removeCard()}>Отвязать карту</ButtonText>}
          </InfoGroup>
        </Segment>
      )
    }
  }

  renderPaymentButton (): JSX.Element {
    const {
      isDemo, currentCommunities, maxCommunities, hasCommunities,
      isPlanValid, isCardAttached, isCardValid,
      isPaying
    } = this.getVars()

    if (isCardAttached && !isCardValid) {
      return (
        <Segment>
          <Segment size={3}>
            <Description size='small' red>
              Мы не смогли продлить вашу подписку на следующий месяц. Возможно привязанная карта больше не действительна
              или на ней недостаточно денег. Попробуйте повторить оплату или привязать другую карту.
            </Description>
            <Segment size={3}/>
            <ButtonText size='awesome' color='blue' icon='finance' onClick={() => this.handlePurchase()} loading={isPaying}>Повторить оплату</ButtonText>
          </Segment>
          <Segment size={3}>
            <ViewPaymentInfo/>
          </Segment>
        </Segment>
      )
    }

    if (hasCommunities) {
      if (isDemo) {
        if (isPlanValid && currentCommunities > maxCommunities) {
          return (
            <Segment>
              <Segment size={3}>
                <Toolbar2 size='big'>
                  <Toolbar2Group fill>
                    <ButtonText size='awesome' color='blue' icon='finance' onClick={() => this.handlePurchase()} loading={isPaying}>Оформить подписку банковской картой РФ (с электронным чеком)</ButtonText>
                  </Toolbar2Group>
                </Toolbar2>
                <Toolbar2 size='big'>
                  <Toolbar2Group fill>
                    <ButtonText size='awesome' color='grey' icon='finance' onClick={() => this.handlePurchase('enot')} loading={isPaying}>Иностранные банковские карты и другие способы оплаты (без чека)</ButtonText>
                  </Toolbar2Group>
                </Toolbar2>
              </Segment>

              <Segment size={3}>
                <ViewPaymentInfo/>
              </Segment>
            </Segment>
          )
        }

        if (isPlanValid && currentCommunities <= maxCommunities) {
          return (
            <Segment>
              <Segment size={3}>
                <Toolbar2 size='big'>
                  <Toolbar2Group fill>
                    <ButtonText size='awesome' color='blue' icon='finance' onClick={() => this.handlePurchase()} loading={isPaying}>Оплатить подписку банковской картой РФ (с электронным чеком)</ButtonText>
                  </Toolbar2Group>
                </Toolbar2>
                <Toolbar2 size='big'>
                  <Toolbar2Group fill>
                    <ButtonText size='awesome' color='grey' icon='finance' onClick={() => this.handlePurchase('enot')} loading={isPaying}>Иностранные банковские карты и другие способы оплаты (без чека)</ButtonText>
                  </Toolbar2Group>
                </Toolbar2>
              </Segment>
              <Segment size={3}>
                <ViewPaymentInfo/>
              </Segment>
            </Segment>
          )
        }

        if (!isPlanValid) {
          return (
            <Segment>
              <Segment size={3}>
                <Toolbar2 size='big'>
                  <Toolbar2Group fill>
                    <ButtonText size='awesome' color='blue' icon='finance' onClick={() => this.handlePurchase()} loading={isPaying}>Оформить подписку банковской картой РФ (с электронным чеком)</ButtonText>
                  </Toolbar2Group>
                </Toolbar2>
                <Toolbar2 size='big'>
                  <Toolbar2Group fill>
                    <ButtonText size='awesome' color='grey' icon='finance' onClick={() => this.handlePurchase('enot')} loading={isPaying}>Иностранные банковские карты и другие способы оплаты (без чека)</ButtonText>
                  </Toolbar2Group>
                </Toolbar2>
              </Segment>

              <Segment size={3}>
                <ViewPaymentInfo/>
              </Segment>
            </Segment>
          )
        }
      }

      if (!isDemo) {
        if (isPlanValid && currentCommunities > maxCommunities) {
          return (
            <Segment>
              <Segment size={3}>
                <Toolbar2 size='big'>
                  <Toolbar2Group fill>
                    <ButtonText size='awesome' color='blue' icon='finance' onClick={() => this.handlePurchase()} loading={isPaying}>Оплатить подписку банковской картой РФ (с электронным чеком)</ButtonText>
                  </Toolbar2Group>
                </Toolbar2>
                <Toolbar2 size='big'>
                  <Toolbar2Group fill>
                    <ButtonText size='awesome' color='grey' icon='finance' onClick={() => this.handlePurchase('enot')} loading={isPaying}>Иностранные банковские карты и другие способы оплаты (без чека)</ButtonText>
                  </Toolbar2Group>
                </Toolbar2>
              </Segment>
              <Segment size={3}>
                <ViewPaymentInfo/>
              </Segment>
            </Segment>
          )
        }

        if (!isPlanValid) {
          return (
            <Segment>
              <Segment size={3}>
                <Toolbar2 size='big'>
                  <Toolbar2Group fill>
                    <ButtonText size='awesome' color='blue' icon='finance' onClick={() => this.handlePurchase()} loading={isPaying}>Оформить подписку банковской картой РФ (с электронным чеком)</ButtonText>
                  </Toolbar2Group>
                </Toolbar2>
                <Toolbar2 size='big'>
                  <Toolbar2Group fill>
                    <ButtonText size='awesome' color='grey' icon='finance' onClick={() => this.handlePurchase('enot')} loading={isPaying}>Иностранные банковские карты и другие способы оплаты (без чека)</ButtonText>
                  </Toolbar2Group>
                </Toolbar2>
              </Segment>
              <Segment size={3}>
                <ViewPaymentInfo/>
              </Segment>
            </Segment>
          )
        }
      }
    }
  }

  renderDemoInfo (): JSX.Element {
    const {
      isDemo, activeToDate, currentCommunities, maxCommunities, creditsCommunities,
      isPlanValid
    } = this.getVars()

    if (isDemo && isPlanValid) {
      return (
        <InfoGroup>
          <Info
            title='Количество страниц'
            text={`${currentCommunities} из ${maxCommunities}`}
            warning={creditsCommunities > 0}
            tooltipTitle='Ваши добавленные страницы'
            tooltipText='Вы можете добавлять и удалять свои страницы в любой момент — цена на подписку также будет меняться. При увеличении количества страниц вам сначала нужно будет оплатить их. При уменьшении количества страниц вы заплатите в следующем месяце меньше — только за оставшиеся.'
            tooltipDescription='Каждая добавленная страница стоит 200 рублей. Страницы конкурентов — бесплатные. Можете добавлять сколько угодно страниц конкурентов, это никак не повлияет на стоимость подписки.'
          />
          <Info
            title='Дата окончания'
            text={DateUtil.format(activeToDate, 'D MMM YYYY')}
            tooltipTitle='Дата окончания пробного периода'
            tooltipText='Здесь указан последний день вашего пробного периода, после чего для дальнейшей работы в сервисе будет необходимо оплатить подписку.'
          />
        </InfoGroup>
      )
    }
  }

  renderCurrentInfo (): JSX.Element {
    const {
      activeToDate, maxCommunities,
      isPlanValid, isCardAttached, costCurrent, costItem
    } = this.getVars()

    if (isPlanValid) {
      return (
        <InfoGroup>
          <Info
            title='Количество страниц'
            text={NumeralUtil.format(maxCommunities, '0,0', ['страница', 'страницы', 'страниц'])}
            tooltipTitle='Ваши добавленные страницы'
            tooltipText='Вы можете добавлять и удалять свои страницы в любой момент — цена на подписку также будет меняться. При увеличении количества страниц вам сначала нужно будет оплатить их. При уменьшении количества страниц вы заплатите в следующем месяце меньше — только за оставшиеся.'
            tooltipDescription='Каждая добавленная страница стоит 200 рублей. Страницы конкурентов — бесплатные. Можете добавлять сколько угодно страниц конкурентов, это никак не повлияет на стоимость подписки.'
          />
          <Info
            title={isCardAttached ? 'Дата следующей оплаты' : 'Конец действия подписки'}
            text={DateUtil.format(activeToDate, 'D MMM YYYY')}
            tooltipText={isCardAttached ? 'В этот день подписка будет автоматически продлена на следующий месяц.' : 'До этой даты вы можете полноценно пользоваться сервисом согласно текущей подписке. После — доступ завершится и появится возможность оформить подписку заново.'}
          />
          {isCardAttached && <Info
            title='Стоимость подписки'
            text={NumeralUtil.format(costCurrent)}
            rouble
            tooltipTitle='Текущая стоимость вашей подписки'
            tooltipText={`Это сумма ежемесячного платежа. Сумма всех добавленных страниц умноженная на ${costItem} рублей (стоимость одной страницы).`}
          />}
        </InfoGroup>
      )
    }
  }

  renderCommonInfo (): JSX.Element {
    const {
      isDemo, activeToDate, currentCommunities, maxCommunities, creditsCommunities, hasCommunities,
      isPlanValid, isCardAttached, activeToDateNext, costNext, costCredits
    } = this.getVars()

    if (isDemo && hasCommunities) {
      return (
        <InfoGroup>
          <Info
            title='Количество страниц'
            text={NumeralUtil.format(currentCommunities, '0,0', ['страница', 'страницы', 'страниц'])}
            tooltipTitle='Ваши добавленные страницы'
            tooltipText='Вы можете добавлять и удалять свои страницы в любой момент — цена на подписку также будет меняться. При увеличении количества страниц вам сначала нужно будет оплатить их. При уменьшении количества страниц вы заплатите в следующем месяце меньше — только за оставшиеся.'
            tooltipDescription='Каждая добавленная страница стоит 200 рублей. Страницы конкурентов — бесплатные. Можете добавлять сколько угодно страниц конкурентов, это никак не повлияет на стоимость подписки.'
          />
          <Info
            title='Срок действия подписки'
            text={`до ${DateUtil.format(activeToDateNext, 'D MMM YYYY')}`}
            tooltipText='До этой даты вам будет предоставлен полный доступ к сервису после оформления подписки. Если ваша карта будет привязана — то в этот день подписка будет автоматически продлена на следующий месяц.'
          />
          <Info
            title='Стоимость подписки'
            text={NumeralUtil.format(costNext)}
            rouble
            tooltipTitle='Текущая стоимость вашей подписки'
            tooltipText='Это сумма ежемесячного платежа при оформлении подписки сейчас. Если количество страниц не изменится в течение всего периода подписки — стоимость останется такой же и на следующий месяц.'
          />
        </InfoGroup>
      )
    }

    if (!isDemo) {
      if (!isPlanValid && hasCommunities) {
        return (
          <InfoGroup>
            <Info
              title='Количество страниц'
              text={NumeralUtil.format(creditsCommunities, '0,0', ['страница', 'страницы', 'страниц'])}
              tooltipTitle='Ваши добавленные страницы'
              tooltipText='Вы можете добавлять и удалять свои страницы в любой момент — цена на подписку также будет меняться. При увеличении количества страниц вам сначала нужно будет оплатить их. При уменьшении количества страниц вы заплатите в следующем месяце меньше — только за оставшиеся.'
              tooltipDescription='Каждая добавленная страница стоит 200 рублей. Страницы конкурентов — бесплатные. Можете добавлять сколько угодно страниц конкурентов, это никак не повлияет на стоимость подписки.'
            />
            <Info
              title='Срок действия подписки'
              text={DateUtil.format(activeToDateNext, 'D MMM YYYY')}
              tooltipText='До этой даты вам будет предоставлен полный доступ к сервису после оформления подписки. Если ваша карта будет привязана — то в этот день подписка будет автоматически продлена на следующий месяц.'
            />
            <Info
              title='Стоимость подписки'
              text={NumeralUtil.format(costNext)}
              rouble
              tooltipTitle='Текущая стоимость вашей подписки'
              tooltipText='Это сумма ежемесячного платежа при оформлении подписки сейчас. Если количество страниц не изменится в течение всего периода подписки — стоимость останется такой же и на следующий месяц.'
            />
          </InfoGroup>
        )
      }

      if (isPlanValid && isCardAttached && currentCommunities < maxCommunities) {
        return (
          <InfoGroup>
            <Info
              title='Количество страниц'
              text={NumeralUtil.format(currentCommunities, '0,0', ['страница', 'страницы', 'страниц'])}
              tooltipTitle='Ваши добавленные страницы'
              tooltipText='Вы можете добавлять и удалять свои страницы в любой момент — цена на подписку также будет меняться. При увеличении количества страниц вам сначала нужно будет оплатить их. При уменьшении количества страниц вы заплатите в следующем месяце меньше — только за оставшиеся.'
              tooltipDescription='Каждая добавленная страница стоит 200 рублей. Страницы конкурентов — бесплатные. Можете добавлять сколько угодно страниц конкурентов, это никак не повлияет на стоимость подписки.'
            />
            <Info
              title='Изменение стоимости подписки'
              text={`с ${DateUtil.format(activeToDate, 'D MMM YYYY')}`}
              tooltipText='С этой даты стоимость вашей подписки станет меньше.'
            />
            <Info
              title='Стоимость новой подписки'
              text={NumeralUtil.format(costNext)}
              rouble
              tooltipTitle='Новая стоимость вашей подписки'
              tooltipText='Столько будет стоить продление подписки на следующий месяц, если количество страниц не изменится на момент оплаты.'
            />
          </InfoGroup>
        )
      }

      if (isPlanValid && currentCommunities > maxCommunities) {
        return (
          <InfoGroup>
            <Info
              title='Количество страниц'
              text={NumeralUtil.format(creditsCommunities, '0,0', ['страница', 'страницы', 'страниц'])}
              tooltipTitle='Ваши добавленные страницы'
              tooltipText='Вы можете добавлять и удалять свои страницы в любой момент — цена на подписку также будет меняться. При увеличении количества страниц вам сначала нужно будет оплатить их. При уменьшении количества страниц вы заплатите в следующем месяце меньше — только за оставшиеся.'
              tooltipDescription='Каждая добавленная страница стоит 200 рублей. Страницы конкурентов — бесплатные. Можете добавлять сколько угодно страниц конкурентов, это никак не повлияет на стоимость подписки.'
            />
            <Info
              title='Страницы будут оплачены'
              text={`до ${DateUtil.format(activeToDate, 'D MMM YYYY')}`}
              tooltipText='Новые страницы будут оплачены до этой даты. Далее оплата будет происходить вместе с остальными страницами — раз в месяц.'
            />
            <Info
              title='Итого к оплате'
              text={NumeralUtil.format(costCredits)}
              rouble
              tooltipTitle='Стоимость добавления страниц'
              tooltipText='Столько нужно заплатить, чтобы открыть доступ к работе с новыми страницами прямо сейчас. Стоимость вашей подписки увеличится на эту же сумму.'
            />
          </InfoGroup>
        )
      }
    }
  }

  getVars (): any {
    const { params, profileStore, planStore } = this.props
    const profile = profileStore.profile
    const plan = profile.plan

    return {
      isDemo: profile.isDemo,
      activeToDate: profile.activeToDate,
      currentCommunities: profile.currentCommunities,
      maxCommunities: profile.maxCommunities,
      creditsCommunities: profile.creditsCommunities,
      hasCommunities: profile.currentCommunities > 0,

      isPlanValid: plan.isPlanValid,
      isCardAttached: plan.isCardAttached,
      isCardValid: plan.isCardValid,
      cardNumber: plan.cardNumber,
      activeToDateNext: plan.activeToDateNext,
      costCurrent: plan.costCurrent,
      costNext: plan.costNext,
      costCredits: plan.costCredits,
      costItem: plan.costItem,

      isPaying: params.invoiceID || planStore.isPaying || planStore.confirmationURL
    }
  }

  render (): JSX.Element {
    const { params, planStore } = this.props
    const confirmationURL = planStore.getInvoiceByInvoiceID(params.invoiceID)?.confirmationURL
    const {
      isDemo, activeToDate, currentCommunities, maxCommunities, hasCommunities,
      isPlanValid, isCardAttached, costItem,
      isPaying
    } = this.getVars()

    return (
      <LiteLayout>
        {/* ШАПКА */}
        {/*@ts-ignore*/}
        <Helmet>
          <title>Подписка и оплата — КУБ Suite</title>
        </Helmet>
        {/* Хак для обновления mobX: */ planStore.isLoading}
        <Segment size={3}>
          <Title text='Подписка и оплата'>
            {Boolean(planStore.invoices.length) && <ButtonText to='/settings/plan/invoice' icon='duplicate'>История оплаты</ButtonText>}
          </Title>
          <Segment size={3} />
          <Description size='big'>
            {`Сервис предоставляется в виде подписки на месяц с автоматическим продлением. Вы платите только за количество добавленных страниц — по **${costItem} рублей** за каждую. Управлять своими страницами вы можете в [настройках](/settings/communities) проектов.`}
          </Description>
        </Segment>
        {isPaying &&
          <Segment size={5}>
            <CommunityNotification
              loading
              title='Ожидание оплаты'
              description='Сейчас мы ожидаем подтверждение оплаты. Обычно это занимает пару минут, но может затянуться на целый час. Как только мы увидим подтверждение — вы сразу получите полный доступ к сервису.'
              button={{
                buttonEnabled: Boolean(confirmationURL),
                buttonLabel: 'Вернуться к оплате',
                buttonClick: () => location.href = confirmationURL
              }}
            />
          </Segment>
        }
        {/* ШАПКА */}

        {/* ОСНОВНАЯ ЛОГИКА*/}
        {!isPlanValid && !hasCommunities &&
          <Segment size={10}>
            <Title size='superBig' green>Подписка не активна</Title>
            <Segment size={2} />
            <Description size='big'>
              Кажется, у вас не добавлено ни одной страницы — это значит, что мы не можем начать собирать данные. Добавьте несколько своих страниц, несколько страниц конкурентов и оформите подписку для работы в сервисе.
            </Description>
            <Segment size={3} />
            <ButtonText size='awesome' color='blue' icon='add' onClick={() => this.props.params.changeUrl('/settings/communities')}>Добавить мою страницу</ButtonText>
          </Segment>
        }

        {isDemo && isPlanValid && !hasCommunities &&
          <Segment size={10}>
            <Title size='superBig' green>Пробный период</Title>
            <Segment size={2} />
            {this.renderDemoInfo()}
            <Segment size={10} />
            <Title size='big'>Вам нужно добавить страницы</Title>
            <Segment size={3} />
            <Description size='big'>
              {`Для начала добавьте одну или несколько своих страниц. Во время поробного периода вам доступно ${NumeralUtil.format(maxCommunities, '0,0', ['страница', 'страницы', 'страниц'])} на ограниченное время. После окончиния пробного периода или при превышении лимита страниц — вам нужно будет купить подписку, чтобы продолжить использование сервиса.`}
            </Description>
            <Segment size={3} />
            <ButtonText size='awesome' color='blue' icon='add' onClick={() => this.props.params.changeUrl('/settings/communities')}>Добавить мою страницу</ButtonText>
          </Segment>
        }

        {isDemo && isPlanValid && hasCommunities &&
          <Segment>
            {currentCommunities > maxCommunities &&
              <Segment size={10}>
                <Title id='add' size='big'>Превышен лимит страниц</Title>
                <Segment size={3} />
                <Description size='big'>
                  {`Вы добавили больше страниц, чем предусмотрено в бесплатным доступом. Вы по прежнему можете анализировать первые ${NumeralUtil.format(maxCommunities, '0,0', ['страницу', 'страницы', 'страниц'])} бесплатно до конца пробного периода. Чтобы увидеть все данные — необходимо оформить подписку. Стоимость зависит от количества добавленных на момент оплаты страниц. Сейчас ваша подписка будет выглядеть так:`}
                </Description>
                <Segment size={3} />
                {this.renderCommonInfo()}
                {this.renderPaymentButton()}
              </Segment>
            }

            <Segment size={10} />
            <Title size='superBig' green>Пробный период</Title>
            <Segment size={2} />
            {this.renderDemoInfo()}

            {currentCommunities <= maxCommunities &&
              <Segment size={10}>
                <Title size='big'>Уже готовы оформить подписку?</Title>
                <Segment size={2} />
                <Description size='big'>
                  После оформления подписки вы получите доступ к сервису на месяц. Стоимость зависит от количества добавленных на момент оплаты страниц. Сейчас ваша подписка будет выглядеть так:
                </Description>
                <Segment size={3} />
                {this.renderCommonInfo()}
                {this.renderPaymentButton()}
              </Segment>
            }
          </Segment>
        }

        {isDemo && !isPlanValid && hasCommunities &&
          <Segment>
            <Segment size={10}>
              <Title size='superBig' green>Оформите подписку</Title>
              <Segment size={3} />
              {this.renderCommonInfo()}
              {this.renderPaymentButton()}
            </Segment>
            <Segment size={10}>
              <Title size='big'>Пробный период завершен</Title>
              <Segment size={3} />
              <Description size='big'>
                После завершения пробного периода — все ваши страницы и проекты остаются на месте, но вы не можете посмотреть данные. Чтобы продолжить пользоваться сервисом — необходимо оформить подписку.
              </Description>
            </Segment>
          </Segment>
        }

        {!isDemo && isPlanValid && currentCommunities > maxCommunities &&
          <Segment size={10}>
            <Title id='add' size='big'>Есть неоплаченные страницы</Title>
            <Segment size={3} />
            <Description size='big'>
              Вы добавили больше страниц, чем предусматривает ваша текущая подписка. Чтобы работать с новыми страницами — сначала нужно их оплатить.
            </Description>
            <Segment size={2}/>
            <Description size='small' red>
              **Обратите внимание**: стоимость вашей подписки изменится в соответствии с активными страницами и при следующей оплате вы заплатите больше. Если до конца подписки осталось несколько дней — рекомендуем подождать, чтобы не платить за новые страницы дважды. Также вы можете освободить место в подписке, удалив другие страницы.
            </Description>
            <Segment size={3} />
            {this.renderCommonInfo()}
            {this.renderCard()}
            {this.renderPaymentButton()}
          </Segment>
        }

        {!isDemo && isPlanValid && isCardAttached && hasCommunities && currentCommunities < maxCommunities &&
          <Segment size={10}>
            <Title size='big'>Изменение стоимости подписки</Title>
            <Segment size={3} />
            <Description size='big'>
              Мы заметили, что вы удалили свои страницы — теперь стоимость подписки уменьшится, если на дату следующей оплаты добавленных страниц будет меньше, чем было. На данный момент новая подписка выглядит так:
            </Description>
            <Segment size={2}/>
            <Description size='small' red>
              **Обратите внимание**: стоимость вашей подписки изменится в соответствии с активными страницами и при следующей оплате вы заплатите меньше. Если вы добавите новые страницы вместо удалённых — стоимость не поменяется.
            </Description>
            <Segment size={3} />
            {this.renderCommonInfo()}
            {this.renderCard()}
          </Segment>
        }

        {!isDemo && isPlanValid &&
          <Segment size={10}>
            <Title size='superBig' green>Активная подписка</Title>
            <Segment size={3} />
            {this.renderCurrentInfo()}
            {isCardAttached && currentCommunities === maxCommunities && this.renderCard()}
          </Segment>
        }

        {!isDemo && !isPlanValid && hasCommunities &&
          <Segment size={10}>
            <Title size='superBig' green>Оформите подписку</Title>
            <Segment size={3} />
            {this.renderCommonInfo()}
            {this.renderCard()}
            {this.renderPaymentButton()}
          </Segment>
        }

        {!isDemo && isPlanValid && !isCardAttached &&
          <Segment size={10}>
            <Title size='big'>Вы отменили подписку</Title>
            <Segment size={3} />
            <Description size='big'>
              {`Доступ к КУБ Suite останется у вас до ${DateUtil.format(activeToDate, 'D MMM YYYY')} Теперь вам надо дождаться окончания действия текущей подписки, после чего здесь появится кнопка «Оформить подписку». Все добавленные страницы и проекты останутся на месте и вы снова сможете пользоваться сервисом после оплаты.`}
            </Description>
          </Segment>
        }

        {!isDemo && isPlanValid && !hasCommunities &&
          <Segment size={10}>
            <Title size='big'>Автоматическая отмена подписки</Title>
            <Segment size={3} />
            <Description size='big'>
              {`Кажется, вы удалили все свои страницы. Если на момент следующей оплаты у вас по прежнему не будет ни одного добавленного сообщества — мы автоматически отменим подписку.\\n
              Обратите внимание: пока подписка активна вы всё ещё можете добавить сообщества обратно и пользоваться сервисом.`}
            </Description>
          </Segment>
        }

        {/* ФУТЕР */}
        <Segment size={10}>
          <Title size='big'>Возникли вопросы по поводу оплаты?</Title>
          <Segment size={3} />
          <Description size='big'>
            Рекомендуем прочитать этот раздел, чтобы понять, от чего зависит стоимость подписки и как происходит оплата. Это поможет избежать неловких моментов при работе с сервисом КУБ Suite.
          </Description>

          <Segment size={5}>
            <Title size='small'>1. Как считается стоимость подписки?</Title>
            <Segment size={1} />
            <Description size='big'>
              {`Место для одной страницы в сервисе стоит ${costItem} рублей. Умножаем на сумму всех своих добавленных и оплаченных страниц из всех проектов — получаем стоимость нашей подписки. Страницы конкурентов — бесплатные, добавляйте столько, сколько потребуется.`}
            </Description>
          </Segment>

          <Segment size={3}>
            <Title size='small'>2. Как уменьшить количество страниц в подписке?</Title>
            <Segment size={1} />
            <Description size='big'>
              {`Просто [удалите](/settings/communities) нужное количество страниц не позднее чем за сутки до следующей оплаты. При следующем продлении подписки после удаления, вы заплатите меньше — только за добавленные страницы. Новые условия подписки будут показаны на этой странице.`}
            </Description>
          </Segment>

          <Segment size={3}>
            <Title size='small'>3. Как увеличить количество страниц в подписке?</Title>
            <Segment size={1} />
            <Description size='big'>
              {`[Добавляйте свои страницы](/settings/communities) в настройках проектов и вы увидите сообщение о необходимости их оплаты. Вам нужно оплатить только новые страницы, при этом ваша подписка изменится — увеличится количество добавленных страниц и сумма для следующей запланированной оплаты.\\n
              Лучше всего добавлять новые страницы в начале периода, чтобы не платить за них дважды.`}
            </Description>
          </Segment>

          <Segment size={3}>
            <Title size='small'>4. Что произойдёт, если отменить подписку?</Title>
            <Segment size={1} />
            <Description size='big'>
              {`После отмены подписки мы отключим автоматическую оплату и удалим привязанную карту, но полноценный доступ к сервису сохранится до даты окончания подписки.\\n
              Все ваши проекты и добавленные страницы останутся на месте — при желании вы сможете отредактировать списки страниц в проектах и оформить подписку снова после окончания текущего оплаченного периода.\\n
              Если вы отменили подписку потому, что не хотите оставлять карту привязанной к сервису, то вы всё ещё можете [добавить больше страниц](/settings/communities) — для этого нужно будет просто оплатить их на этой странице. Карта снова привяжется, автоматическая оплата включится, а условия подписки изменятся.`}
            </Description>
          </Segment>

          <Segment size={3}>
            <Title size='small'>5. Что будет, если удалить одну страницу и добавить другую?</Title>
            <Segment size={1} />
            <Description size='big'>
              {`Если удалить одну страницу и добавить другую — условия подписки не изменятся, потому что не изменится количество добавленных страниц. Грубо говоря, вы платите 200 рублей в месяц за место для одной страницы — не важно в какой она социальной сети или проекте.\\n
              Если в середине оплаченного периода удалить страницу — то место, которое она занимала, останется свободным. Вы можете занять это место другой страницей. Если оставить это место пустым — ваша подписка на следующий месяц станет дешевле, а пустое место пропадёт.`}
            </Description>
          </Segment>

          <Segment size={3}>
            <Title size='small'>6. Каким способом можно оплатить сервис?</Title>
            <Segment size={1} />
            <Description size='big'>
              {`Основной и рекомендуемый способ оплаты — с помощью банковской карты любой платежной системы: Visa, MasterCard, Maestro, JCB, Мир, Apple Pay и Google Pay.\\n
              Для юридических лиц у нас предусмотрены специальные тарифы и возможность оплаты по счёту — пишите нам на почту [info@c-cube.ru](mailto:info@c-cube.ru), чтобы узнать подробности.\\n
              Также пишите, если вы хотите воспользоваться другим способом оплаты, например: ЮMoney, WebMoney, Qiwi, через интернет банки или со счета мобильного телефона.`}
            </Description>
          </Segment>
        </Segment>

        <Segment size={10} />

      </LiteLayout>
    )
  }
}

export default PlanSettingsPage
