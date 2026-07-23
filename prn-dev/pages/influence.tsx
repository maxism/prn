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
import ButtonTextGroup from '../elements/ButtonText/ButtonTextGroup'
import ButtonText from '../elements/ButtonText/ButtonText'
import TextColor from '../elements/TextColor/TextColor'
import Device from '../elements/Device/Device'
import IconGroup from '../elements/Icon/IconGroup'
import Icon from '../elements/Icon/Icon'
import Block from '../elements/Block/Block'
import BlockGroup from '../elements/Block/BlockGroup'
import ContactUs from '../elements/ContactUs/ContactUs'
import ProfileStore from '../stores/ProfileStore'
import { inject, observer } from 'mobx-react'
import { Stores } from '../stores/RootStore'
import ButtonNavGroup from '../elements/ButtonNav/ButtonNavGroup'
import ButtonNav from '../elements/ButtonNav/ButtonNav'
import PlansBlock from '../elements/PlansBlock/PlansBlock'
import Link from '../elements/Link/Link'
import RouterUtil from '../utils/RouterUtil'
import {SingletonRouter, withRouter} from 'next/router'
import PlanStore from '../stores/PlanStore'

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
export default class InfluencePage extends Component<IProps, any> {
  render (): JSX.Element {

    const { router, profileStore, planStore } = this.props

    return (
      <>
        <Meta
          title='Поиск блогеров в социальных сетях'
          description='Удобный инструмент для поиска и анализа страниц блогеров в социальных сетях. Показываем эффективность страниц — качество контента, качество работы с аудиторией и самой аудитории, лучшее время для интеграций.'
          image='/images/sharing_influence.png'
        />

        <Header/>

        <Segment background='influence'>
          <Container>
            {/*<Row padding='l'>
              <Col size={12} center>
                <Notification
                  small
                  inline
                  icon='item_duplicate'
                  title='Большое обновление КУБ'
                  message='Что нового? Читайте подробности в блоге.'
                  buttonText='Читать блог'
                  to='/blog/tag/updates'
                />
              </Col>
            </Row>*/}
            <Row padding='xl'>

            {/*<Row padding='xxl'>*/}
              <Col size={10} center>
                <Title size='heavy' center>Поиск блогеров</Title>
              </Col>
            </Row>
            <Row padding='m'>
              <Col size={10} center>
                <Text size='xl' semibold center><TextColor color='super-dark'>
                  Удобный инструмент для поиска и анализа блогеров в социальных сетях
                </TextColor></Text>
              </Col>
            </Row>

            <Row padding='xl'>
              <Col size={10} center>
                <IconGroup size='m' label='Ищем в' full>
                  {
                    ['vk', 'fb', 'ig', 'ok', 'tg', 'tw', 'tt', 'yz', 'ch', 'rt', 'vb', 'vc', 'tc', 'yt', 'mx']
                      .map(social => <Icon key={social} icon={social} size='m' color='#999999'/>)
                  }
                </IconGroup>
              </Col>
            </Row>

            <Row padding='xl'>
              <Col size={10} center>
                <ButtonTextGroup full>
                  {!profileStore.isAuth && <ButtonText to='?modal=registration' size='l'>Попробовать бесплатно</ButtonText>}
                  {profileStore.isAuth && <ButtonText to={`https://prns.c-cube.ru/search?token=${profileStore.token}`} size='l'>Найти блогеров</ButtonText>}
                </ButtonTextGroup>
              </Col>
            </Row>
            {/*{!profileStore.isAuth && <Row padding='m'>*/}
            {/*  <Col size={10} center>*/}
            {/*    <Text size='xs' center>Бесплатный доступ навсегда. Без привязки карты.</Text>*/}
            {/*  </Col>*/}
            {/*</Row>}*/}

            <Row padding='xxl'>
              <Col size={12}>
                <Device image={require('../public/images/influence.png')} label='Информация по странице блогера Wylsacom на Youtube'/>
              </Col>
            </Row>
            <Row padding='xxl'/>
          </Container>
        </Segment>

        <Segment>
          <Container>

            <Row padding='xxl'>
              <Col size={10} center>
                <Title size='l' center><TextColor color='#311E9D' gradientColor='#AA60F6'>Анализ страниц</TextColor></Title>
              </Col>
            </Row>
            <Row padding='m'>
              <Col size={10} center>
                <Text size='l' semibold center maxWidth><TextColor color='dark'>
                  Одной из основных задач при поиске блогеров для сотрудничества является оценка качества его аккаунта и отклика его аудитории. Мы сделали очень сложный алгоритм,
                  который сделает вашу жизнь проще
                </TextColor></Text>
              </Col>
            </Row>

            <Row padding='xxl'/>

            <BlockGroup size='l'>
              <Block size={12} color='#a0adff' gradientColor='#5e69cf' image='/images/influence_feature_quality.png' rightImage>
                <Title><TextColor color='#fff'>КУБ Score — оценка эффективности блогера</TextColor></Title>
                <Row padding='m'/>
                <Text semibold><TextColor color='#fff'>
                  Всего одна метрика подскажет насколько эффективным может быть сотрудничество. Чем выше оценка, тем эффективнее будет ваша интеграция в сравнении с похожими блогерами.<br /><br />
                  Наши уникальные алгоритмы учитывают более 10 параметров, например, общий объем и динамику аудитории, а также охваты и регулярность постинга на странице.
                </TextColor></Text>
                <Row padding='l'/>
                <ButtonText onClick={() => window['carrotWrap']().open()} size='l' colorBackground>Узнать подробнее</ButtonText>
              </Block>
            </BlockGroup>

            <Row padding='l'/>

            <BlockGroup size='m' slider>
              <Block size={4} image='/images/influence_feature_blogger_quality.png' slide>
                <Title size='s'>Качество ведения аккаунта</Title>
                <Row padding='m'/>
                <Text semibold>
                  Вы получаете представление о том, насколько хорошо блогер ведёт свою страницу — как часто и регулярно выходят посты, как автор работает с аудиторией.
                </Text>
              </Block>
              <Block size={4} image='/images/influence_feature_user_activity.png' slide>
                <Title size='s'>Активность аудитории</Title>
                <Row padding='m'/>
                <Text semibold>
                  Influence умеет определять, когда аудитория активнее всего взаимодействует с контентом. Так вы сможете выбрать лучшее время для интеграций.
                </Text>
              </Block>
              <Block size={4} image='/images/influence_feature_user_metrics.png' slide>
                <Title size='s'>Вовлечённость аудитории</Title>
                <Row padding='m'/>
                <Text semibold>
                  Показываем количество реакций и просмотров на пост, вовлечённость аудитории. Средние значения по метрикам говорят о качестве аудитории блогера.
                </Text>
              </Block>
            </BlockGroup>

            <Row padding='xxl'/>
            <Row padding='xxl'>
              <Col size={10} center>
                <Title size='l' center><TextColor color='#311E9D' gradientColor='#AA60F6'>Просто и эффективно</TextColor></Title>
              </Col>
            </Row>
            <Row padding='m'>
              <Col size={10} center>
                <Text size='l' semibold center maxWidth><TextColor color='dark'>
                  Идея лежит в простоте подачи большого количества данных, удобстве работы с ними и сервисом вцелом
                </TextColor></Text>
              </Col>
            </Row>

            <Row padding='xxl'/>

            <BlockGroup size='m' slider>
              <Block size={4} image='/images/influence_feature_bookmarks.png' slide>
                <Title size='s'>Добавление страниц в закладки</Title>
                <Row padding='m'/>
                <Text semibold>
                  Добавляйте в закладки интересные страницы, чтобы потом легко посмотреть актуальную статистику, сравнить и отобрать лучших для сотрудничества.
                </Text>
              </Block>
              <Block size={4} image='/images/influence_feature_posts.png' slide>
                <Title size='s'>Обзор лучших постов</Title>
                <Row padding='m'/>
                <Text semibold>
                  Посмотрите на самые эффективные посты блогера, чтобы понять с каким контентом заходить для максимальной отдачи.
                </Text>
              </Block>
              <Block size={4} image='/images/influence_feature_notes.png' slide>
                <Title size='s'>Заметки и статусы блогеров</Title>
                <Row padding='m'/>
                <Text semibold>
                  При работе с блогерами нужно пройти через несколько этапов. Чтобы ничего не забыть, добавляйте заметки к страницам. Статус поможет быстро сортировать список.
                </Text>
              </Block>
            </BlockGroup>

            <BlockGroup size='l'>
              <Block size={12} image='/images/analytics_feature_10years.png' rightImage>
                <Title>Детальный обзор аккаунта блогера</Title>
                <Row padding='m'/>
                <Text semibold>
                  Для каждой страницы мы показываем подробную статистику с наглядными графиками и цифрами. Мы стремимся постоянно добавлять новые метрики и совершенствовать алгоритмы.<br /><br />
                  Если вы хотите несколько дней понаблюдать за страницей блогера — обязательно добавляйте её в закладки. Так информация будет максимально актуальной.
                </Text>
                <Row padding='l'/>
                <ButtonText onClick={() => window['carrotWrap']().open()} size='l'>Узнать подробнее</ButtonText>
              </Block>
            </BlockGroup>

            <Row padding='xxl'/>
            <Row padding='xxl'/>

          </Container>
        </Segment>

        <Segment color='#f6f6f6'>
          <Container>
            <Row padding='xxl'>
              <Col size={10} center>
                <Title size='l' center><TextColor color='#311E9D' gradientColor='#AA60F6'>Стоимость</TextColor></Title>
              </Col>
            </Row>
            <Row padding='m'>
              <Col size={10} center>
                {!profileStore.isAuth && <Text size='l' semibold center maxWidth><TextColor color='dark'>Все сервисы объединены в одну выгодную подписку. Начните пользоваться бесплатно или выберите подходящий тариф:</TextColor></Text>}
                {profileStore.isAuth && <Text size='l' semibold center maxWidth><TextColor color='dark'>Все сервисы объединены в одну выгодную подписку. Выберите подходящий тариф для расширения функционала:</TextColor></Text>}
              </Col>
            </Row>

            <Row padding='xl' />

            <ButtonNavGroup white>
              <ButtonNav to='/influence?period=1&scroll=false' active={Number(router.query.period) === 1}>Подписка на месяц</ButtonNav>
              <ButtonNav to='/influence?period=12&scroll=false' active={Number(router.query.period) === 12 || router.query.period === undefined}>Подписка на год</ButtonNav>
            </ButtonNavGroup>
            <Row padding='s'>
              <Col size={12} center>
                <Text size='xs' center>При оплате подписки на год — скидка 15%</Text>
              </Col>
            </Row>

            <Row padding='m' />

            <PlansBlock
              short
              period={Number(router.query.period) || 12}
              plans={planStore.plans}
              onChangePlan={e => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan', planName: e.target.value, planPeriod: router.query.period }) : RouterUtil.replaceParams(router, { modal: 'registration' }) }
              free={!profileStore.isAuth}
            />

            <Row padding='m'>
              <Col size={10} center>
                <Text size='m' semibold center><TextColor color='dark'>
                  Ознакомиться со всеми предложениями и узнать подробную информацию вы можете на <Link to='/plans'>детальной странице тарифов</Link>.
                </TextColor></Text>
              </Col>
            </Row>
            <Row padding='xxl' />
          </Container>
        </Segment>

        <ContactUs/>

        <Footer/>
      </>
    )
  }
}
