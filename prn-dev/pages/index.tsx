import React, { Component } from 'react'
import Segment from '../elements/Segment/Segment'
import Container from '../elements/Container/Container'
import Row from '../elements/Row/Row'
import Col from '../elements/Col/Col'
import Title from '../elements/Title/Title'
import Text from '../elements/Text/Text'
import Header from '../elements/Header/Header'
import Block from '../elements/Block/Block'
import BlockGroup from '../elements/Block/BlockGroup'
import Icon from '../elements/Icon/Icon'
import ButtonText from '../elements/ButtonText/ButtonText'
import Device from '../elements/Device/Device'
import IconGroup from '../elements/Icon/IconGroup'
import TextColor from '../elements/TextColor/TextColor'
import ButtonTextGroup from '../elements/ButtonText/ButtonTextGroup'
import Footer from '../elements/Footer/Footer'
import Meta from '../components/Meta'
import ContactUs from '../elements/ContactUs/ContactUs'
import ProfileStore from '../stores/ProfileStore'
import {inject, observer} from 'mobx-react'
import {Stores} from '../stores/RootStore'
import Link from '../elements/Link/Link'
import PlanStore from '../stores/PlanStore'
import {SingletonRouter, withRouter} from 'next/router'
import RouterUtil from '../utils/RouterUtil'
import FaqBlock from '../elements/FaqBlock/FaqBlock'
import FaqBlockItem from '../elements/FaqBlock/FaqBlockItem'
import InputText from '../elements/InputText/InputText'

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

interface IStates {
  query: string
}

@(withRouter as any)
@inject(Stores.PROFILE_STORE, Stores.PLAN_STORE)
@observer
export default class IndexPage extends Component<IProps, IStates> {
  state: IStates = {
    query: ''
  }

  render (): JSX.Element {
    const { router, profileStore } = this.props

    // todo: Добавить в title и description на новые лендинги КУБ - статистика и аналитика сообществ в социальных сетях ВКонтакте, Facebook, Instagram, YouTube, Twitter, ...
    return (
      <>
        <Meta
          title='Статистика аккаунтов в социальных сетях'
          description='Статистика по вашим аккаунтам, анализ конкурентов, оценка постов, автоматические отчёты — всё это сделает вашу работу в социальных сетях простой, быстрой и эффективной.'
          image='/images/sharing_statistics.png'
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
              <Col size={10} center>
                <Title id='top' size='xl' center>Статистика аккаунтов в&nbsp;социальных сетях</Title>
              </Col>
            </Row>
            <Row padding='m'>
              <Col size={10} center>
                <Text size='l' semibold center><TextColor color='super-dark'>
                  Лучшие посты, динамика подписчиков, просмотров, вовлеченности, лайков, комментариев и&nbsp;репостов за любой период
                </TextColor></Text>
              </Col>
            </Row>
            <Row padding='xl'>
              <Col size={8} center>
                <InputText
                  big
                  icon='search'
                  label='Поиск аккаунта'
                  value={this.state.query}
                  onChange={e => this.setState({ query: e.target.value })}
                  onSubmit={() => !profileStore.isAuth ? router.push(`/search?query=${this.state.query}&next=registration`) : router.push(`/search?query=${this.state.query}`)}
                  white
                  focus
                />
              </Col>
            </Row>
            <Row padding='m' />
            <Col size={10} center>
              <Text size='xs' center>Введите название аккаунта или ссылку на него. Далее выберите нужный пункт из результатов поиска — откроется детальная статистика.</Text>
            </Col>
            <Row padding='xl'>
              <Col size={10} center>
                <IconGroup size='m' label='Анализируем' full>
                  <Link to='/statistics/vkontakte'><Icon icon='vk' size='m' color='#999999' /></Link>
                  <Link to='/statistics/facebook'><Icon icon='fb' size='m' color='#999999' /></Link>
                  <Link to='/statistics/instagram'><Icon icon='ig' size='m' color='#999999' /></Link>
                  <Link to='/statistics/odnoklassniki'><Icon icon='ok' size='m' color='#999999' /></Link>
                  <Link to='/statistics/telegram'><Icon icon='tg' size='m' color='#999999' /></Link>
                  <Link to='/statistics/twitter'><Icon icon='tw' size='m' color='#999999' /></Link>
                  <Link to='/statistics/tiktok'><Icon icon='tt' size='m' color='#999999' /></Link>
                  <Link to='/statistics/yandexzen'><Icon icon='yz' size='m' color='#999999' /></Link>
                  <Icon icon='ch' size='m' color='#999999' />
                  <Link to='/statistics/rutube'><Icon icon='rt' size='m' color='#999999' /></Link>
                  <Icon icon='vb' size='m' color='#999999' />
                  <Icon icon='vc' size='m' color='#999999' />
                  <Icon icon='tc' size='m' color='#999999' />
                  <Link to='/statistics/youtube'><Icon icon='yt' size='m' color='#999999' /></Link>
                  <Icon icon='mx' size='m' color='#999999' />
                </IconGroup>
              </Col>
            </Row>
            <Row padding='xl'>
              <Col size={10} center>
                <ButtonTextGroup full>
                  {!profileStore.isAuth && <ButtonText to='?modal=registration' size='l'>Попробовать бесплатно</ButtonText>}
                  {profileStore.isAuth && <ButtonText to={`https://prns.c-cube.ru/?token=${profileStore.token}`} size='l'>Перейти в Статистику</ButtonText>}
                </ButtonTextGroup>
              </Col>
            </Row>
            {/*{!profileStore.isAuth && <Row padding='m'>*/}
            {/*  <Col size={10} center>*/}
            {/*    <Text size='xs' center>Бесплатный доступ навсегда. Без привязки карты.</Text>*/}
            {/*  </Col>*/}
            {/*</Row>}*/}
            <Row padding='xxl'>
              <Col size={12} center>
                <Device
                  image={require('../public/images/statistics.png')}
                  // vkontakte='https://vk.com/video_ext.php?oid=-34093701&id=456239034&hd=1'
                />
              </Col>
            </Row>
            <Row padding='xxl' />
          </Container>
        </Segment>

        <Segment>
          <Container>
            <Row padding='xl'>
              <Col size={10} center>
                <Title size='l' center><TextColor color='#311E9D' gradientColor='#AA60F6'>Что получите?</TextColor></Title>
              </Col>
            </Row>
            <Row padding='m'>
              <Col size={10} center>
                <Text size='l' semibold center><TextColor color='dark'>
                  Больше свободы, эксклюзивные функции и возможности статистики соцсетей
                </TextColor></Text>
              </Col>
            </Row>

            <Row padding='xl' />

            <BlockGroup size='s'>
              <Block
                size={4}
                image='/images/statistics_feature_search.png'
                onClick={() => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan' }) : RouterUtil.replaceParams(router, { modal: 'registration' })}
              >
                <Title size='xs'>Умный поиск страниц</Title>
                <Row padding='s' />
                <Text semibold size='s'>
                  Ищите страницы по всем соцсетям, ключевым словам, странам, городам, тематикам
                </Text>
                {/*<InlineTextList noDots>*/}
                {/*  <InlineTextListItem text='Всем соцсетям' icon='group' />*/}
                {/*  <InlineTextListItem text='Ключевым словам' icon='report' />*/}
                {/*  <InlineTextListItem text='Странам' icon='compare' />*/}
                {/*  <InlineTextListItem text='Города' icon='user' />*/}
                {/*  <InlineTextListItem text='Тематикам' icon='gmt' />*/}
                {/*</InlineTextList>*/}
              </Block>
              <Block
                size={4}
                image='/images/statistics_feature_retrospective.png'
                onClick={() => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan' }) : RouterUtil.replaceParams(router, { modal: 'registration' })}
              >
                <Title size='xs'>Ретроспектива</Title>
                <Row padding='s' />
                <Text semibold size='s'>
                  Выбирайте любой период в прошлом и изучайте расширенную статистику
                </Text>
              </Block>
              <Block
                size={4}
                image='/images/statistics_feature_dynamicmetrics.png'
                onClick={() => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan' }) : RouterUtil.replaceParams(router, { modal: 'registration' })}
              >
                <Title size='xs'>Динамика всех показателей</Title>
                <Row padding='s' />
                <Text semibold size='s'>
                  Сервис автоматически подберет предыдущий период и покажет прирост или снижение каждого показателя
                </Text>
              </Block>
              <Block
                size={4}
                image='/images/statistics_feature_graphics2.png'
                onClick={() => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan' }) : RouterUtil.replaceParams(router, { modal: 'registration' })}
              >
                <Title size='xs'>Наглядные графики</Title>
                <Row padding='s' />
                <Text semibold size='s'>
                  Изучайте и сопоставляйте пики и падения показателей в динамике.
                  Работа над ошибками поможет вашему динамичному росту
                </Text>
              </Block>
              <Block
                size={4}
                image='/images/statistics_feature_overview.png'
                onClick={() => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan' }) : RouterUtil.replaceParams(router, { modal: 'registration' })}
              >
                <Title size='xs'>Основные показатели под контролем</Title>
                <Row padding='s' />
                <Text semibold size='s'>
                  Оценивайте эффективность страницы как по классическим показателям, так и инновационным, охватывающем все показатели и динамику их роста, в сравнении с конкурентами - Score
                </Text>
              </Block>
              <Block
                size={4}
                image='/images/statistics_feature_brandstats.png'
                onClick={() => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan' }) : RouterUtil.replaceParams(router, { modal: 'registration' })}
              >
                <Title size='xs'>Сводная статистика бренда</Title>
                <Row padding='s' />
                <Text semibold size='s'>
                  Смотрите, как развиваются ваши страницы в сводных таблицах, сразу по всем соцсетям
                </Text>
              </Block>
              <Block
                size={4}
                image='/images/statistics_feature_compcomp.png'
                onClick={() => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan' }) : RouterUtil.replaceParams(router, { modal: 'registration' })}
              >
                <Title size='xs'>Сравнение с конкурентами</Title>
                <Row padding='s' />
                <Text semibold size='s'>
                  Определяйте вашу позицию в рейтинге всех страниц.
                  Сортируйте по нужной вам метрике прямо в интерфейсе
                </Text>
              </Block>
              <Block
                size={4}
                image='/images/statistics_feature_postgrades.png'
                onClick={() => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan' }) : RouterUtil.replaceParams(router, { modal: 'registration' })}
              >
                <Title size='xs'>Влияние постов на показатели</Title>
                <Row padding='s' />
                <Text semibold size='s'>
                  Анализируйте наглядно, какие посты произвели резкое изменение показателей.
                  Это позволяет, например, определить, после каких постов начался рост подписчиков
                </Text>
              </Block>
              <Block
                size={4}
                image='/images/statistics_feature_audactivity.png'
                onClick={() => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan' }) : RouterUtil.replaceParams(router, { modal: 'registration' })}
              >
                <Title size='xs'>Активность аудитории</Title>
                <Row padding='s' />
                <Text semibold size='s'>
                  Увеличьте охваты до 30%. Посмотрите, когда ваша аудитория на самом деле видит ваши посты.
                  Скорректируйте вашу контентную стратегию и увеличьте эффективность постов
                </Text>
              </Block>
              <Block
                size={4}
                image='/images/statistics_feature_posttypes.png'
                onClick={() => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan' }) : RouterUtil.replaceParams(router, { modal: 'registration' })}
              >
                <Title size='xs'>Типы контента, длина, хэштеги</Title>
                <Row padding='s' />
                <Text semibold size='s'>
                  Определяйте, как влияет тип поста, его длина, хештеги на эффективность контента.
                  Старайтесь использовать только эффективные типы и хештеги
                </Text>
              </Block>
              <Block
                size={4}
                image='/images/statistics_feature_compscorerec.png'
                onClick={() => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan' }) : RouterUtil.replaceParams(router, { modal: 'registration' })}
              >
                <Title size='xs'>Сравнение: Score + подсказки</Title>
                <Row padding='s' />
                <Text semibold size='s'>
                  Выбирайте лучших конкурентов и смотрите наглядно ваши показатели
                </Text>
              </Block>
              <Block
                size={4}
                image='/images/statistics_feature_bestpostgrades.png'
                onClick={() => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan' }) : RouterUtil.replaceParams(router, { modal: 'registration' })}
              >
                <Title size='xs'>Грейды и Лучший креатив</Title>
                <Row padding='s' />
                <Text semibold size='s'>
                  Ваши лучшие посты - это А+, А, старайтесь продвигать такие посты, анализируйте рубрику и наполнение таких постов и повторяйте ваш опыт
                </Text>
              </Block>
              <Block
                size={4}
                image='/images/statistics_feature_postslist.png'
                onClick={() => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan' }) : RouterUtil.replaceParams(router, { modal: 'registration' })}
              >
                <Title size='xs'>Списки постов</Title>
                <Row padding='s' />
                <Text semibold size='s'>
                  Найдите лучшие и худшие посты по нужному критерию
                </Text>
              </Block>
              <Block
                size={4}
                image='/images/statistics_feature_audsexage.png'
                onClick={() => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan' }) : RouterUtil.replaceParams(router, { modal: 'registration' })}
              >
                <Title size='xs'>Пол и возраст аудитории</Title>
                <Row padding='s' />
                <Text semibold size='s'>
                  Анализируйте пол и возраст подписчиков ваших страниц, конкурента, блогера или любой другой страницы
                </Text>
              </Block>
              <Block
                size={4}
                image='/images/statistics_feature_audlocation.png'
                onClick={() => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan' }) : RouterUtil.replaceParams(router, { modal: 'registration' })}
              >
                <Title size='xs'>Города и страны аудитории</Title>
                <Row padding='s' />
                <Text semibold size='s'>
                  Посмотрите, из каких стран и городов подписчики ваших страниц, конкурента, блогера или любой другой страницы
                </Text>
              </Block>
              <Block
                size={4}
                image='/images/statistics_feature_audtypes.png'
                onClick={() => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan' }) : RouterUtil.replaceParams(router, { modal: 'registration' })}
              >
                <Title size='xs'>Состав аудитории</Title>
                <Row padding='s' />
                <Text semibold size='s'>
                  Посмотрите состав подписчиков любой страницы: Обычные подписчики, Инфлюенсеры, Массфолловеры, Подозрительные пользователи
                </Text>
              </Block>
              <Block
                size={4}
                image='/images/statistics_feature_autoreports.png'
                onClick={() => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan' }) : RouterUtil.replaceParams(router, { modal: 'registration' })}
              >
                <Title size='xs'>Автоматические отчеты</Title>
                <Row padding='s' />
                <Text semibold size='s'>
                  Получайте еженедельную сводку по вашим страницам на ваш email
                </Text>
              </Block>
              <Block
                size={4}
                image='/images/statistics_feature_xlsxreport.png'
                onClick={() => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan' }) : RouterUtil.replaceParams(router, { modal: 'registration' })}
              >
                <Title size='xs'>XLSX отчет</Title>
                <Row padding='s' />
                <Text semibold size='s'>
                  Используйте XLSX отчет со сводными данными, списками постов и другими показателями для индивидуальных отчетов
                </Text>
              </Block>

              <Block
                size={12}
                image='/images/statistics_feature_social_networks.png'
                // rightImage
              >
                <Title><TextColor color='blue'>Рейтинг страниц, поиск блогеров и расширенная статистика теперь в одной подписке</TextColor></Title>
                <Row padding='m' />
                <Text semibold>
                  Вы получите доступ к рейтингу из 2 млн. страниц, поиску блогеров по ключевым словам, странам и городам, актуальной расширенной статистики любых страниц, анализу аудитории, определению ботов и инфлюенсеров
                </Text>
                {/*<Row padding='l' />*/}
                {/*<Row padding='xs' />*/}

                {/*<InlineTextList noDots>*/}
                {/*  <InlineTextListItem text='Подробная статистика по любым аккаунтам' icon='bookmarks_selected' />*/}
                {/*  /!*<InlineTextListItem text='Обновление 24/7' icon='gmt' />*!/*/}
                {/*</InlineTextList>*/}

                <Row padding='xl' />
                <ButtonTextGroup size='s'>
                  <ButtonText
                    size='l'
                    onClick={() => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan' }) : RouterUtil.replaceParams(router, { modal: 'registration' })}
                  >Купить доступ</ButtonText>
                  <ButtonText secondary onClick={() => window['carrotWrap']().open()} size='l'>Узнать больше</ButtonText>
                </ButtonTextGroup>
              </Block>
            </BlockGroup>
          </Container>
        </Segment>

        <FaqBlock>
          <FaqBlockItem question='Что такое Статистика и причем тут КУБ?'>
            КУБ — это компания, которая создаёт сервисы для работы с данными из социальных сетей. Статистика — это один из таких сервисов, где можно в деталях увидеть множество метрик по страницам, понаблюдать за конкурентами и найти самые лучшие посты.
          </FaqBlockItem>
          <FaqBlockItem question='Какие данные я увижу?'>
            Все основные метрики по каждой странице и то, насколько они изменились: количество подписчиков, лайков, репостов, комментариев и просмотров, вовлечённость, лучшие хэштеги, лучшие типы постов и оптимальную длину текста, время активности аудитории.<br /><br />
            Также можно увидеть все посты с подробной статистикой и оценкой эффективности. Ещё есть очень удобная таблица, где можно найти вообще все данные о проекте. И да — всё это доступно как для своих страниц, так и для страниц конкурентов.
          </FaqBlockItem>
          <FaqBlockItem question='Хорошо, а что с подпиской и оплатой?'>
            Все наши сервисы объединены одной подпиской — покупаете её и пользуетесь любым сервисом. Каждый месяц подписку нужно продлевать вручную или автоматически. Стартовый набор функций ограничен, но доступен бесплатно и навсегда останется с вами — нужно просто зарегистрироваться.<br /><br />
            Базовый тариф обойдется в 890 рублей, и это самое выгодное предложение на рынке за предоставляемый функционал. Можно оплатить сразу на год вперёд и получить скидку 15%. Подробнее обо всех тарифах <Link to='/plans'>читайте здесь</Link>.
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
