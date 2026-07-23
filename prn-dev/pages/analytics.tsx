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

interface IProps {
  profileStore?: ProfileStore
}

@inject(Stores.PROFILE_STORE)
@observer
export default class AnalyticsPage extends Component<IProps, any> {
  render (): JSX.Element {
    const { profileStore } = this.props

    return (
      <>
        <Meta
          title='Аналитика социальных сетей'
          description='Профессиональный инструмент для решения любых задач по аналитике социальных сетей. Индивидуальный подход к каждому клиенту. Гибкая настройка сервиса. Более 10 лет работы с крупнейшими брендами и агентствами.'
          image='/images/sharing_analytics.png'
        />
        <Header />
        <Segment background='analytics'>
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
                <Title size='heavy' center>Аналитика</Title>
              </Col>
            </Row>
            <Row padding='m'>
              <Col size={10} center>
                <Text size='xl' semibold center><TextColor color='super-dark'>
                  Профессиональный инструмент для решения
                  любых задач по аналитике социальных сетей
                </TextColor></Text>
              </Col>
            </Row>
            <Row padding='xl'>
              <Col size={10} center>
                <IconGroup size='m' label='Работаем с' full>
                  <Icon icon='vk' size='m' color='#999999' />
                  <Icon icon='fb' size='m' color='#999999' />
                  <Icon icon='ig' size='m' color='#999999' />
                  <Icon icon='ok' size='m' color='#999999' />
                  <Icon icon='tg' size='m' color='#999999' />
                  <Icon icon='tw' size='m' color='#999999' />
                  <Icon icon='yt' size='m' color='#999999' />
                </IconGroup>
              </Col>
            </Row>
            <Row padding='xl'>
              <Col size={10} center>
                <ButtonTextGroup full size='s'>
                  {profileStore.isAuth && <ButtonText to='https://prna.c-cube.ru/ru?modal=login' size='l'>Войти</ButtonText>}
                  <ButtonText to='/analytics?modal=analytics-demo' size='l'>Запросить демо-доступ</ButtonText>
                  <ButtonText to='/docs/Cube_Presentation_Analytics.pdf' size='l' secondary _blank>Скачать презентацию</ButtonText>
                </ButtonTextGroup>
              </Col>
            </Row>
            <Row padding='m'>
              <Col size={10} center>
                <Text size='xs' center>Бесплатный демо-доступ и консультация специалиста</Text>
              </Col>
            </Row>
            {/*<Row padding='xxl'>*/}
            {/*  <Col size={12}>*/}
            {/*    <Device image={require('../public/images/analytics.png')} label='Показатели вовлечённости и фильтры в отчёте Аналитики' />*/}
            {/*  </Col>*/}
            {/*</Row>*/}
            <Row padding='xxl'>
              <Col size={12} center>
                <Device
                  image={require('../public/images/analytics.png')}
                  // vkontakte='https://vk.com/video_ext.php?oid=-34093701&id=456239033&hd=1'
                />
              </Col>
            </Row>
            <Row padding='xxl' />
          </Container>
        </Segment>

        <Segment>
          <Container>
            <Row>
              <Col size={10} center>
                <Title size='l' center><TextColor color='#311E9D' gradientColor='#AA60F6'>Для профессионалов</TextColor></Title>
              </Col>
            </Row>
            <Row padding='m'>
              <Col size={10} center>
                <Text size='l' semibold center maxWidth><TextColor color='dark'>
                  Мы поможем решить задачу любой сложности благодаря индивидуальному подходу и экспертизе. Более 10 лет мы работаем с данными и успешно сотрудничаем с крупными брендами и агентствами
                </TextColor></Text>
              </Col>
            </Row>
            <Row padding='xxl' />
          </Container>
        </Segment>

        <Segment>
          <Container>

            <BlockGroup size='l'>
              <Block size={12} image='/images/analytics_feature_individual.png' rightImage>
                <Title>Индивидуальный подход</Title>
                <Row padding='m' />
                <Text semibold>
                  В профессиональной среде часто приходится решать не самые стандартные задачи и мы подходим индивидуально к каждому клиенту.<br/><br/>Аналитика настраивается под ваши запросы, а в поддержке всегда на связи опытный персональный менеджер.
                </Text>
                <Row padding='l' />
                <ButtonText onClick={() => window['carrotWrap']().open()} size='l'>Связаться с менеджером</ButtonText>
              </Block>
            </BlockGroup>

            <Row padding='l' />

            <BlockGroup size='m' slider>
              <Block size={4}  image='/images/analytics_feature_brands.png' slide>
                <Title size='s'>Экспертная работа с крупнейшими компаниями</Title>
                <Row padding='m' />
                <Text semibold>
                  Наше многолетнее сотрудничество с крупным бизнесом и агентствами — это огромный опыт для решения ваших аналитических задач.
                </Text>
              </Block>
              <Block size={4}  image='/images/analytics_feature_legal.png' slide>
                <Title size='s'>Только легальные методы</Title>
                <Row padding='m' />
                <Text semibold>
                  Официально работаем в партнерстве с социальными сетями и соблюдаем все законы. КУБ — это легально и надёжно.
                </Text>
              </Block>
              <Block size={4}  image='/images/analytics_feature_10years.png' slide>
                <Title size='s'>Более 10 лет работаем с данными</Title>
                <Row padding='m' />
                <Text semibold>
                  Мы отлично умеем собирать большие данные и анализировать их. Мы первыми начали решать сложные бизнес-задачи и успешно делаем это более 10 лет.
                </Text>
              </Block>
            </BlockGroup>
            <Row padding='xxl' />
          </Container>
        </Segment>

        <Segment>
          <Container>
            <Row padding='xxl'>
              <Col size={10} center>
                <Title size='l' center><TextColor color='#311E9D' gradientColor='#AA60F6'>Богатый функционал</TextColor></Title>
              </Col>
            </Row>
            <Row padding='m'>
              <Col size={10} center>
                <Text size='l' semibold center maxWidth><TextColor color='dark'>
                  Аналитика КУБ — это мощный инструмент с большими возможностями. Сложно описать весь функционал, поэтому мы расскажем только о самом основном
                </TextColor></Text>
              </Col>
            </Row>
            <Row padding='xxl' />
            <BlockGroup size='l'>
              <Block size={12} color='#a0adff' gradientColor='#5e69cf' image='/images/analytics_feature_reports.png' rightImage>
                <Title><TextColor color='#fff'>Огромные возможности формирования отчётности</TextColor></Title>
                <Row padding='m' />
                <Text semibold><TextColor color='#fff'>
                  Отчёты лежат в основе Аналитики. Работайте с ними в онлайн-режиме или сохраняйте в виде красивых презентаций. Вы даже можете запланировать автоматическую отправку актуальных отчётов прямо на почту.
                </TextColor></Text>
                <Row padding='l' />
                <ButtonText onClick={() => window['carrotWrap']().open()} size='l' colorBackground>Узнать подробнее</ButtonText>
              </Block>
            </BlockGroup>
          </Container>
        </Segment>

        <Segment>
          <Container>
            <Row padding='l' />
            <BlockGroup size='m' slider>
              <Block size={4}  image='/images/analytics_feature_tags.png' slide>
                <Title size='s'>Тегирование контента</Title>
                <Row padding='m' />
                <Text semibold>
                  Возможность тегировать контент на основе ключевых слов. Незаменимый инструмент при работе с контент-стратегией бренда.
                </Text>
              </Block>
              <Block size={4}  image='/images/analytics_feature_tone.png' slide>
                <Title size='s'>Тональность комментариев и постов</Title>
                <Row padding='m' />
                <Text semibold>
                  Отслеживайте эмоции своей аудитории. Работа с постами, комментариями и скоростью ответа на них представителей бренда в социальных сетях.
                </Text>
              </Block>
              <Block size={4}  image='/images/analytics_feature_ad_stats.png' slide>
                <Title size='s'>Обзор внутренней статистики</Title>
                <Row padding='m' />
                <Text semibold>
                  После подключения рекламного кабинета Аналитика станет намного эффективнее для работы с маркетинговыми и стратегическими решениями.
                </Text>
              </Block>
            </BlockGroup>
          </Container>
        </Segment>

        <Segment>
          <Container>
            {/*<Row padding='l' />*/}
            <BlockGroup size='m'>
              <Block size={6}  image='/images/analytics_feature_competitors.png'>
                <Title size='s'>Анализ конкурентов</Title>
                <Row padding='m' />
                <Text semibold>
                  Одной из главных задач для успешной работы всегда был анализ конкурентов. Сравнивайте любые страницы и любые показатели, а мы предоставим вам понятные отчёты с самыми полными данными.
                </Text>
              </Block>
              <Block size={6}  image='/images/analytics_feature_tender.png'>
                <Title size='s'>Подготовка к тендерам</Title>
                <Row padding='m' />
                <Text semibold>
                  Тендеры — это сжатые сроки и быстрое получение исторических данных. Аналитика идеально подходит для этого: от анализа текущего состояния страниц потенциального клиента до оценки отрасли в целом и ее тенденций.
                </Text>
              </Block>
            </BlockGroup>
          </Container>
        </Segment>

        <Segment>
          <Container>
            <Row padding='l' />
            <BlockGroup size='l'>
              <Block size={12} color='#a0adff' gradientColor='#5e69cf' image='/images/analytics_feature_metrics.png' rightImage>
                <Title><TextColor color='#fff'>Более 60 метрик</TextColor></Title>
                <Row padding='m' />
                <Text semibold><TextColor color='#fff'>
                  Любая аналитика начинается с данных. Помимо базовых метрик, таких как, количества реакций, подписчиков, охватов и вовлечённости — мы показываем множество специфических. Например, скорость реагирования бренда на вопросы пользователей, вовлечённость на охват или тональность комментариев пользователей.<br/><br/>
                  Аналитика позволяет создавать вам свои собственные метрики и сегменты контента для более детальной и эффективной оценки кампаний.
                  {/*Каждая задача требует индивидуальной количественной и качественной оценки. В КУБ есть все стандартные метрики, такие как Количество подписчиков, Лайки, Комментарии, Репосты, Охват, Вовлеченность (ER),*/}
                  {/*Так и множество специфических под конкретные задачи - например Скорость реагирования бренда на вопросы пользователей, Вовлеченность на охват (ERR), Тональность комментариев пользователей.*/}
                  {/*Также есть возможность создавать свои собственные метрики и сегменты контента для более детальной оценки эффективности кампаний.*/}
                </TextColor></Text>
                <Row padding='l' />
                <ButtonText onClick={() => window['carrotWrap']().open()} size='l' colorBackground>Узнать подробнее</ButtonText>
              </Block>
            </BlockGroup>
          </Container>
        </Segment>

        <Segment>
          <Container>
            <Row padding='l' />
            <BlockGroup size='m' slider>
              <Block size={4}  image='/images/analytics_feature_team.png' slide>
                <Title size='s'>Максимально командная работа</Title>
                <Row padding='m' />
                <Text semibold>
                  От 2 человек до бесконечности. Мы даём возможности для гибкой настройки работы в команде — роли прав доступа, виды отчетов.
                </Text>
              </Block>
              <Block size={4}  image='/images/analytics_feature_compare.png' slide>
                <Title size='s'>Сравнивайте что угодно. Как угодно</Title>
                <Row padding='m' />
                <Text semibold>
                  Аналитика позволяет сравнивать практически всё, что вам может понадобиться сравнить. И даже больше.
                </Text>
              </Block>
              <Block size={4}  image='/images/analytics_feature_dashboard.png' slide>
                <Title size='s'>Подключение дашборда</Title>
                <Row padding='m' />
                <Text semibold>
                  Уникальная функция для вывода нужных вам данных в любом виде. Обновление в реальном времени, полная кастомизация.
                </Text>
              </Block>
            </BlockGroup>
            <Row padding='xxl' />
            <Row padding='xxl' />
          </Container>
        </Segment>

        <Segment color='#f9f9f9'>
          <Container>
            <Row padding='xxl'>
              <Col size={10} center>
                <Title size='l' center><TextColor color='#311E9D' gradientColor='#AA60F6'>Стоимость</TextColor></Title>
              </Col>
            </Row>
            <Row padding='m'>
              <Col size={10} center>
                <Text size='l' semibold center maxWidth><TextColor color='dark'>
                  Обычно стоимость считается индивидуально в зависимости от ваших задач и доступных в сервисе функций. Вы всегда можете обратиться за консультацией к нашим специалистам.
                </TextColor></Text>
              </Col>
            </Row>
            <Row padding='xxl'>
              <Col size={10} center>
                <Title size='l' center>от 9 890 р./месяц</Title>
              </Col>
            </Row>
            <Row padding='xl' />
            <BlockGroup size='z'>
              <Block size={4} icon='user'>
                <Text><TextColor color='super-dark'>
                  Индивидуальная настройка тарифа под задачи
                </TextColor></Text>
              </Block>
              <Block size={4} icon='item_duplicate'>
                <Text><TextColor color='super-dark'>
                  Безграничные возможности создания отчётов
                </TextColor></Text>
              </Block>
              <Block size={4} icon='admin'>
                <Text><TextColor color='super-dark'>
                  На рынке нет аналогов с похожим функционалом
                </TextColor></Text>
              </Block>
            </BlockGroup>
            <Row padding='xxl'>
              <Col size={10} center>
                <ButtonTextGroup full>
                  <ButtonText onClick={() => window['carrotWrap']().open()} size='l'>Запросить консультацию</ButtonText>
                  <Text size='xs' middle>
                    Во время консультации вам расскажут об основных возможностях Аналитики и покажут
                    сервис в действии. Вместе с нашим менеджером вы сможете найти лучшее решение
                    и рассчитать стоимость, исходя из ваших задач.
                  </Text>
                </ButtonTextGroup>
              </Col>
            </Row>
            <Row padding='xxl' />
          </Container>
        </Segment>

        <ContactUs />

        <Footer/>
      </>
    )
  }
}
