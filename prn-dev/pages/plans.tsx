import React, { Component } from 'react'

import Segment from '../elements/Segment/Segment'
import Container from '../elements/Container/Container'
import Row from '../elements/Row/Row'
import Col from '../elements/Col/Col'
import Title from '../elements/Title/Title'
import Text from '../elements/Text/Text'
import Header from '../elements/Header/Header'
import Footer from '../elements/Footer/Footer'
import Meta from '../components/Meta'
import Block from '../elements/Block/Block'
import ButtonText from '../elements/ButtonText/ButtonText'
import BlockGroup from '../elements/Block/BlockGroup'
import ButtonTextGroup from '../elements/ButtonText/ButtonTextGroup'
import TextColor from '../elements/TextColor/TextColor'
import ContactUs from '../elements/ContactUs/ContactUs'
import Icon from '../elements/Icon/Icon'
import PlansBlock from '../elements/PlansBlock/PlansBlock'
import ButtonNavGroup from '../elements/ButtonNav/ButtonNavGroup'
import ButtonNav from '../elements/ButtonNav/ButtonNav'
import {SingletonRouter, withRouter} from 'next/router'
import ProfileStore from '../stores/ProfileStore'
import {inject, observer} from 'mobx-react'
import { Stores } from '../stores/RootStore'
import PlanStore from '../stores/PlanStore'
import RouterUtil from '../utils/RouterUtil'
import FaqBlockItem from '../elements/FaqBlock/FaqBlockItem'
import FaqBlock from '../elements/FaqBlock/FaqBlock'
import Link from '../elements/Link/Link'

interface IRouter extends SingletonRouter {
  /**
   * query
   */
  query: {
    /**
     * Период
     */
    period?: string
    /**
     * Модалка
     */
    modal?: string
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
  planStore?: PlanStore
}

@(withRouter as any)
@inject(Stores.PROFILE_STORE, Stores.PLAN_STORE)
@observer
export default class PlansPage extends Component<IProps, any> {
  render (): JSX.Element {
    const { router, profileStore, planStore } = this.props

    const period = Number(router.query.period) || 1

    return (
      <>
        <Meta
          title='Тарифы'
          description='Тарифы сервисами КУБ'
          image='/images/sharing.png'
          keywords='Тарифы, цены, цена, стоимость, услуга'
        />
        <Header />
        <Segment>
          <Container>
            <Row padding='xxl'>
              <Col size={10} center>
                <Title size='xl' center>Тарифы</Title>
              </Col>
            </Row>
            {/*<Row padding='m'>*/}
            {/*  <Col size={10} center>*/}
            {/*    <Text size='xl' semibold center><TextColor color='dark'>*/}
            {/*      Начните пользоваться сервисами КУБ бесплатно или сразу выберите подходящий тариф*/}
            {/*    </TextColor></Text>*/}
            {/*  </Col>*/}
            {/*</Row>*/}

            {/*<Row padding='xxl' />*/}

            {/*<BlockGroup size='l'>*/}
            {/*  <Block size={12} image='/images/statistics_feature_social_networks.png' rightImage>*/}
            {/*    <Title><TextColor color='blue'>Пробный доступ</TextColor></Title>*/}
            {/*    <Row padding='m' />*/}
            {/*    <Text semibold>*/}
            {/*      После регистрации в КУБ вы получаете пробный доступ к нашим сервисам на 3 дня.*/}
            {/*    </Text>*/}
            {/*    <Row padding='l' />*/}
            {/*    <Row padding='xs' />*/}

            {/*    <InlineTextList noDots>*/}
            {/*      <InlineTextListItem text={NumeralUtil.format(planStore.getPlanByName('start')?.projects, '0,0', ['проект', 'проекта', 'проектов'])} icon='group' />*/}
            {/*      <InlineTextListItem text={NumeralUtil.format(planStore.getPlanByName('start')?.communities, '0,0', ['страница', 'страницы', 'страниц'])} icon='report' />*/}
            {/*      <InlineTextListItem text={NumeralUtil.format(planStore.getPlanByName('start')?.competitors, '0,0', ['конкурент', 'конкурента', 'конкурентов'])} icon='compare' />*/}
            {/*      <InlineTextListItem text={NumeralUtil.format(planStore.getPlanByName('start')?.influencers, '0,0', ['блогер', 'блогера', 'блогеров'])} icon='user' />*/}
            {/*      <InlineTextListItem text={NumeralUtil.format(planStore.getPlanByName('start')?.retrospectives, '0,0', ['месяц истории', 'месяца истории', 'месяцев истории'])} icon='gmt' />*/}
            {/*    </InlineTextList>*/}

            {/*    <Row padding='xl' />*/}
            {/*      <ButtonTextGroup size='s'>*/}
            {/*        {profileStore.isAuth && <ButtonText to={`https://prns.c-cube.ru/?token=${profileStore.token}`} size='l'>Перейти в Статистику</ButtonText>}*/}
            {/*        {!profileStore.isAuth && <ButtonText to='?modal=registration' size='l'>Зарегистрироваться</ButtonText>}*/}
            {/*        <ButtonText secondary onClick={() => window['carrotWrap']().open()} size='l'>Узнать больше</ButtonText>*/}
            {/*      </ButtonTextGroup>*/}
            {/*  </Block>*/}
            {/*</BlockGroup>*/}

            {/*<Row padding='xxl' />*/}
            {/*<Row padding='xxl'>*/}
            {/*  <Col size={10} center>*/}
            {/*    <Title id='general' size='l' center><TextColor color='#311E9D' gradientColor='#AA60F6'>Базовые тарифы</TextColor></Title>*/}
            {/*  </Col>*/}
            {/*</Row>*/}
            {/*<Row padding='m'>*/}
            {/*  <Col size={10} center>*/}
            {/*    <Text size='l' semibold center><TextColor color='dark'>*/}
            {/*      Мы сделали сбалансированную систему тарифов, они подойдут и для фрилансеров, и для бизнеса*/}
            {/*    </TextColor></Text>*/}
            {/*  </Col>*/}
            {/*</Row>*/}
            <Row padding='xl' />
            <ButtonNavGroup>
              <ButtonNav to='/plans?period=1&scroll=false' active={period === 1}>Подписка на месяц</ButtonNav>
              <ButtonNav to='/plans?period=12&scroll=false' active={period === 12}>Подписка на год</ButtonNav>
            </ButtonNavGroup>
            <Row padding='s'>
              <Col size={12} center>
                <Text size='xs' center>При оплате подписки на год — скидка 15%</Text>
              </Col>
            </Row>

            <Row padding='xl' />

            <PlansBlock
              short
              period={period}
              plans={planStore.plans}
              onChangePlan={e => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan', planName: e.target.value, planPeriod: period.toString() }) : RouterUtil.replaceParams(router, { modal: 'registration' }) }
            />

            <Row padding='xl'>
              <Col size={10} center>
                <Title size='l' center><TextColor color='#311E9D' gradientColor='#AA60F6'>Для агентств и брендов</TextColor></Title>
              </Col>
            </Row>
            <Row padding='m'>
              <Col size={10} center>
                <Text size='l' semibold center><TextColor color='dark'>
                  Специально для крупных компаний и агентств мы сделали возможным расширение функционала
                </TextColor></Text>
              </Col>
            </Row>

            <Row padding='xl' />

            <BlockGroup size='m'>
              <Block size={6}>
                <Title><TextColor color='blue'>Индивидуальный</TextColor></Title>
                <Row padding='s' />
                <Text semibold><TextColor color='dark'>
                  Тариф, который настраивается под ваши задачи
                </TextColor></Text>
                <Row padding='m' />
                <Text size='s'><TextColor color='grey'>
                  Если вам не хватает возможностей в тарифе Профессиональный — оставьте заявку нашим менеджерам и мы создадим вам персональный тариф с любыми настройками.
                </TextColor></Text>
                <Row padding='l' />
                <Row padding='xs' />
                <Title size='m'><TextColor color='black'>
                  от 7 890
                  <Icon icon='rouble' color='black' />
                </TextColor></Title>
                <Row padding='l' />
                <Row padding='xs' />
                <ButtonTextGroup full>
                  <ButtonText size='l' onClick={() => window['carrotWrap']().track('Запрос тарифа SPECIAL')}>Оставить заявку</ButtonText>
                </ButtonTextGroup>
              </Block>

              <Block size={6} color='#a0adff' gradientColor='#5e69cf'>
                <Title><TextColor color='white'>Аналитика</TextColor></Title>
                <Row padding='s' />
                <Text semibold><TextColor color='high'>
                  Сервис с безграничными возможностями
                </TextColor></Text>
                <Row padding='m' />
                <Text size='s'><TextColor color='white'>
                  Для тех, у кого есть очень серьезные задачи по аналитике социальных сетей и большие команды. Профессионально. Индивидуально.
                </TextColor></Text>
                <Row padding='l' />
                <Row padding='xs' />
                <Title size='m'><TextColor color='white'>
                  от 9 890
                  <Icon icon='rouble' color='white' />
                </TextColor></Title>
                <Row padding='l' />
                <Row padding='xs' />
                <ButtonTextGroup full>
                  <ButtonText size='l' colorBackground onClick={() => window['carrotWrap']().open()}>Запросить демонстрацию</ButtonText>
                </ButtonTextGroup>
              </Block>
            </BlockGroup>

          </Container>
        </Segment>

        <FaqBlock>
          <FaqBlockItem question='Как оплатить сервис?'>
            Выберите подходящий тариф, а также частоту оплаты — раз в месяц или раз в год. Нажмите кнопку «Перейти к оплате» и следуйте инструкциям.<br /><br />
          </FaqBlockItem>
          <FaqBlockItem question='Как продлить или отменить подписку?'>
            Если вы привяжете свою карту, то подписка будет продлеваться автоматически. Чтобы отменить подписку — нажмите кнопку «Отменить подписку» в <Link to='/settings/subscription'>личном кабинете</Link>.<br /><br />
            Если вы не привязывали свою карту, то подписка отменяется автоматически. Чтобы продлить её — нажмите кнопку «Оплатить», чтобы выбрать другой тариф — нажмите «Выбрать другой тариф».
          </FaqBlockItem>
          <FaqBlockItem question='Что будет, если отменить подписку?'>
            После отмены подписки или после её автоматического завершения доступ к сервису будет ограничен в соответствии с условиями действующего тарифа.<br /><br />
            Все привязанные платежные средства будут автоматически отвязаны. Проекты, страницы и функции, недоступные без активной подписки, будут заблокированы. Мы не удаляем ваши данные — информация по таким проектам и страницам сохраняется, однако просмотр и использование будут недоступны до возобновления подписки.
            В период блокировки сбор новых данных по заблокированным страницам и проектам не осуществляется.
          </FaqBlockItem>
          <FaqBlockItem question='Что будет с моим старым тарифом?'>
            Продолжайте пользоваться сервисом на старых условиях. Мы не будем блокировать доступ или ограничивать функционал при своевременной оплате. К сожалению, добавление новых страниц, конкурентов или блогеров не возможно на архивных тарифах, так что в этом случае вам нужно будет выбрать подходящий из новой линейки.
          </FaqBlockItem>
        </FaqBlock>

        <ContactUs />

        <Footer/>
      </>
    )
  }
}
