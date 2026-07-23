import React, { Component } from 'react'

import { SingletonRouter, withRouter } from 'next/router'
import { inject, observer } from 'mobx-react'
import { Stores } from '../stores/RootStore'
import RatingStore from '../stores/RatingStore'
import Segment from '../elements/Segment/Segment'
import Container from '../elements/Container/Container'
import Row from '../elements/Row/Row'
import Col from '../elements/Col/Col'
import Title from '../elements/Title/Title'
import Text from '../elements/Text/Text'
import Header from '../elements/Header/Header'
import Block from '../elements/Block/Block'
import BlockGroup from '../elements/Block/BlockGroup'
import ButtonText from '../elements/ButtonText/ButtonText'
import Device from '../elements/Device/Device'
import TextColor from '../elements/TextColor/TextColor'
import ButtonTextGroup from '../elements/ButtonText/ButtonTextGroup'
import Footer from '../elements/Footer/Footer'
import Meta from '../components/Meta'
import ButtonTagGroup from '../elements/ButtonTag/ButtonTagGroup'
import ButtonTag from '../elements/ButtonTag/ButtonTag'
import Image from '../elements/Image/Image'
import ContactUs from '../elements/ContactUs/ContactUs'

interface IProps {
  /**
   * router
   */
  router: SingletonRouter
  ratingStore?: RatingStore
}

interface IStates {
  isSearchFocus: boolean
}

@(withRouter as any)
@inject(Stores.PROFILE_STORE, Stores.RATING_STORE)
@observer
export default class RatingPage extends Component<IProps, IStates> {
  state: IStates = {
    isSearchFocus: true
  }

  render (): JSX.Element {
    const { ratingStore } = this.props

    return (
      <>
        <Meta
          title='Рейтинг аккаунтов в социальных сетях'
          description='Рейтинг показывает статистику сообществ конкурентов. Рейтинг поможет посмотреть основные метрики сообществ брендов и блоггеров'
          image='/images/rating_search_results.png'
          keywords='рейтинг, статистика, анализ, анализировать, аналитика, аккаунтов, страниц, сообществ, количество подписчиков, просмотры постов, вовлеченность'
        />
        <Header />
        <Segment background>
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
                <Title size='heavy' center>Рейтинг страниц</Title>
              </Col>
            </Row>
            <Row padding='m'>
              <Col size={10} center>
                <Text size='xl' semibold center><TextColor color='super-dark'>
                  Просматривайте рейтинги лучших страниц,
                  наблюдайте за лидерами и изучайте статистику
                </TextColor></Text>
              </Col>
            </Row>
            <Row padding='xl'>
              <Col size={10} center>
                <ButtonTextGroup full size='s'>
                  <ButtonText to='/app/rating/vkontakte/russia/brands' size='l'>Посмотреть Рейтинг</ButtonText>
                  <ButtonText to='/search' size='l' secondary>Найти страницы</ButtonText>
                </ButtonTextGroup>
              </Col>
            </Row>
            <Row padding='xl'>
              <Col size={8} center>
                {!ratingStore.autocompleteTags.length && (
                  <ButtonTagGroup full center>
                    <ButtonTag color='dark' to='/app/rating/vkontakte/russia/brands'>Лучшие бренды ВКонтакте</ButtonTag>
                    <ButtonTag color='dark' to='/app/rating/vkontakte/russia/celebrities'>Топ-100 знаменитостей в России</ButtonTag>
                    <ButtonTag color='dark' to='/app/rating/telegram/russia/media'>Лучшие Медиа в Telegram</ButtonTag>
                    <ButtonTag color='dark' to='/app/rating/youtube/russia/celebrities'>Блогеры в YouTube</ButtonTag>
                    <ButtonTag color='dark' to='/app/rating/vkontakte/russia/airlines'>Авиакомпании Россиии</ButtonTag>
                  </ButtonTagGroup>
                )}
                {!!ratingStore.autocompleteTags.length && (
                  <ButtonTagGroup full center>
                    {ratingStore.autocompleteTags.slice(0, 5).map(x => (
                      <ButtonTag key={x.request} onClick={() => ratingStore.autocomplete(x.request)}>{x.data}</ButtonTag>
                    ))}
                  </ButtonTagGroup>
                )}
              </Col>
            </Row>

            <Row padding='xxl'>
              <Col size={12}>
                <Device image={require('../public/images/rating.png')} label='Информация по странице банка Тинькофф' />
              </Col>
            </Row>
            <Row padding='xxl' />
            <Row padding='xxl' />
          </Container>
        </Segment>

        <Segment>
          <Container>
            <Row>
              <Col size={10} center>
                <Title size='l' center><TextColor color='#311E9D' gradientColor='#AA60F6'>Зачем нужен Рейтинг?</TextColor></Title>
              </Col>
            </Row>
            <Row padding='m'>
              <Col size={10} center>
                <Text size='l' semibold center maxWidth><TextColor color='dark'>
                  Всё просто — чтобы найти страницы лучших представителей отрасли, категории или индустрии. Это поможет выявить лидеров и изучить их статистику
                </TextColor></Text>
              </Col>
            </Row>

            <Row padding='xxl'>
              <Col size={12}>
                <Image src={require('../public/images/rating_search_results.png')} full />
              </Col>
            </Row>
            <Row padding='xxl' />
          </Container>
        </Segment>

        <Segment>
          <Container>
            <Row padding='xxl'>
              <Col size={10} center>
                <Title size='l' center><TextColor color='#311E9D' gradientColor='#AA60F6'>Как попасть в Рейтинг?</TextColor></Title>
              </Col>
            </Row>
            <Row padding='m'>
              <Col size={10} center>
                <Text size='l' semibold center maxWidth><TextColor color='dark'>
                  Мы показываем только лучшие страницы в каждой из более чем 100 категорий. Чтобы попасть в топ, нужно быть лучше!
                </TextColor></Text>
              </Col>
            </Row>
          </Container>
        </Segment>

        <Segment>
          <Container>
            <Row padding='xxl' />
            <BlockGroup size='m' slider>
              <Block size={4} image='/images/rating_feature_competitors.png' slide>
                <Title size='s'>Анализируйте конкурентов</Title>
                <Row padding='m' />
                <Text semibold>
                  Ничто не помогает понять интересы целевой аудитории лучше, чем анализ конкурентов и их контента. Наблюдайте, пробуйте лучшие тактики, будьте в потоке.
                </Text>
              </Block>
              <Block size={4}  image='/images/rating_feature_content_plan.png' slide>
                <Title size='s'>Работайте с контент-планом</Title>
                <Row padding='m' />
                <Text semibold>
                  Постоянно улучшайте работу с контентом. Убирайте лишнее и оставляйте самое эффективное. Пробуйте новые методы взаимодействия с аудиторией.
                </Text>
              </Block>
              <Block size={4}  image='/images/rating_feature_make_decigions.png' slide>
                <Title size='s'>Делайте выводы</Title>
                <Row padding='m' />
                <Text semibold>
                  Собирайте статистику и анализируйте данные — повторяйте это снова и снова. С каждым разом вы должны становиться лучше!
                </Text>
              </Block>
            </BlockGroup>
          </Container>
        </Segment>

        <Segment>
          <Container>
            <Row padding='xl'>
              <Col size={10} center>
                <Text size='l' semibold center><TextColor color='dark'>
                  Всё это можно сделать в нашем сервисе КУБ Statistics.
                </TextColor></Text>
              </Col>
            </Row>

            <Row padding='xl'>
              <Col size={10} center>
                <ButtonTextGroup full size='s'>
                  <ButtonText size='l' to='?modal=registration'>Попробовать Статистику</ButtonText>
                  <ButtonText size='l' to='/' secondary>Узнать подробнее</ButtonText>
                </ButtonTextGroup>
              </Col>
            </Row>
            {/*<Row padding='m'>*/}
            {/*  <Col size={10} center>*/}
            {/*    <Text size='xs' center>*/}
            {/*      Бесплатный доступ навсегда. Без привязки карты.*/}
            {/*    </Text>*/}
            {/*  </Col>*/}
            {/*</Row>*/}
            {/*<Row padding='m' />*/}
          </Container>
        </Segment>

        {/*<FaqBlock>
          <FaqBlockItem question='Что такое дашборд?'>
            Комплексная аналитика КУБ охватывает все необходимые данные для эффективной работы в социальных медиа — от конкурентного анализа по количественным и качественным показателям до оценки эффективности платных кампаний.
          </FaqBlockItem>
          <FaqBlockItem question='Какие возможности даст мне этот сервис?'>
            Комплексная аналитика КУБ охватывает все необходимые данные для эффективной работы в социальных медиа — от конкурентного анализа по количественным и качественным показателям до оценки эффективности платных кампаний.
          </FaqBlockItem>
          <FaqBlockItem question='Чем дашборд отличается от аналитики?'>
            Комплексная аналитика КУБ охватывает все необходимые данные для эффективной работы в социальных медиа — от конкурентного анализа по количественным и качественным показателям до оценки эффективности платных кампаний.
          </FaqBlockItem>
          <FaqBlockItem question='Как получить демо доступ и посмотреть сервис?'>
            Комплексная аналитика КУБ охватывает все необходимые данные для эффективной работы в социальных медиа — от конкурентного анализа по количественным и качественным показателям до оценки эффективности платных кампаний.
          </FaqBlockItem>
          <FaqBlockItem question='Как считается стоимость сервиса? От чего она зависит?'>
            Комплексная аналитика КУБ охватывает все необходимые данные для эффективной работы в социальных медиа — от конкурентного анализа по количественным и качественным показателям до оценки эффективности платных кампаний.
          </FaqBlockItem>
        </FaqBlock>*/}

        <ContactUs />

        <Footer/>
      </>
    )
  }
}
