import React, { Component } from 'react'
import { SingletonRouter, withRouter } from 'next/router'
import { IStoreContext, Stores } from '../../../../../../stores/RootStore'
import { inject, observer } from 'mobx-react'
import Meta from '../../../../../../components/Meta'
import Header from '../../../../../../elements/Header/Header'
import Segment from '../../../../../../elements/Segment/Segment'
import Container from '../../../../../../elements/Container/Container'
import Row from '../../../../../../elements/Row/Row'
import Col from '../../../../../../elements/Col/Col'
import Title from '../../../../../../elements/Title/Title'
import Text from '../../../../../../elements/Text/Text'
import Footer from '../../../../../../elements/Footer/Footer'
import SocialIndexStore from '../../../../../../stores/SocialIndexStore'
import ISocialType from '../../../../../../interfaces/ISocialType'
import LineChart from '../../../../../../elements/Chart/LineChart/LineChart'
import moment from 'moment'
import DateUtil from '../../../../../../utils/DateUtil'
import InfoLabel from '../../../../../../elements/InfoLabel/InfoLabel'
import InfoLabelGroup from '../../../../../../elements/InfoLabel/InfoLabelGroup'
import Block from '../../../../../../elements/Block/Block'
import BlockGroup from '../../../../../../elements/Block/BlockGroup'
import Select from '../../../../../../elements/Select/Select'
import SocialDataUtil from '../../../../../../utils/SocialDataUtil'
import ContactUs from '../../../../../../elements/ContactUs/ContactUs'
import TextColor from '../../../../../../elements/TextColor/TextColor'
import Link from '../../../../../../elements/Link/Link'
import ModalPopup from '../../../../../../elements/ModalPopup/ModalPopup'
import IndexTable from '../../../../../../elements/IndexTable/IndexTable'
import Image from '../../../../../../elements/Image/Image'
import ButtonTextGroup from '../../../../../../elements/ButtonText/ButtonTextGroup'
import RatingTagsStore from '../../../../../../stores/RatingTagsStore'
import Notification from '../../../../../../elements/Notification/Notification'
import RouterUtil from '../../../../../../utils/RouterUtil'
import ProfileStore from '../../../../../../stores/ProfileStore'

interface IRouter extends SingletonRouter {
  /**
   * query
   */
  query: {
    /**
     * Социальная сеть
     */
    socialType?: string
    /**
     * Страна
     */
    country?: string
    /**
     * Индустрия
     */
    industry?: string
    /**
     * Модалка
     */
    modal?: string
    planName?: string
  }
}

interface IProps {
  /**
   * router
   */
  router?: IRouter
  profileStore?: ProfileStore
  ratingTagsStore?: RatingTagsStore
  socialIndexStore?: SocialIndexStore
}

interface IStates {
  showHelp?: boolean
}

@(withRouter as any)
@inject(Stores.PROFILE_STORE, Stores.RATING_TAGS_STORE, Stores.SOCIALINDEX_STORE)
@observer
export default class SocialIndexPage extends Component<IProps, IStates> {
  state: IStates = {
    showHelp: false
  }

  static async getInitialProps (ctx: IStoreContext): Promise<Partial<any>> {
    let { socialType, country, industry, period } = ctx.query
    const { ratingTagsStore } = ctx.store

    socialType = SocialDataUtil.fromUri(String(socialType))

    await Promise.all([
      ratingTagsStore.load(),
      ctx.store.socialIndexStore.load(socialType as ISocialType, String(country), String(industry))
    ])

    return { socialType, industry, period }
  }

  render (): JSX.Element {
    const { router, profileStore, ratingTagsStore, socialIndexStore } = this.props

    const socialType = SocialDataUtil.fromUri(router.query.socialType)

    /*if (AppUtil.isClientSide && (!socialType || !router.query.country || !router.query.industry)) {
      router.replace(`/socialinVK&country=russia&industry=brands`)
      return (
        <Segment full>
          <Container>
            <Row padding='xxl'>
              <Col size={10} center>
                <Loader />
              </Col>
            </Row>
          </Container>
        </Segment>)
    }*/

    const finishLastWeek = moment().startOf('day').subtract(2, 'day').toDate()
    const startLastWeek = moment(finishLastWeek).subtract(30, 'days').add(1, 'day').toDate()
    const period = DateUtil.period(startLastWeek, finishLastWeek)

    /*const industries = [
      { id: 'brands', name: 'Бренды' },
      //{ id: 'airlines', name: '- Авиакомпании' },
      //{ id: 'auto-moto', name: '- Авто / Мото' },
      //{ id: 'health-beauty', name: '- Красота и Здоровье' },
      //{ id: 'fashion', name: '- Мода' },
      { id: 'media', name: 'Медиа' },
      //{ id: 'celebrities', name: 'Знаменитости' },
      { id: 'bloggers', name: 'Блогеры' },
      //{ id: 'entertainment', name: 'Развлечения' },
      //{ id: 'place', name: 'Места' }
    ]*/

    const industry = ratingTagsStore.getAllCategories.find(item => item.tagID === router.query.industry)
    const industryName = industry?.name
    const country = ratingTagsStore.getTag(router.query.country)

    const socialTypeName = SocialDataUtil.getSocialTypeName(socialType)

    return (
      <>
        <Meta
          title={`Индекс активности ${socialTypeName} ${industryName} ${country.name}`}
          description={`Индекс активности ${socialTypeName} ${industryName} ${country.name} — мониторинг активности и эффективности социальных сетей в реальном времени. Наши данные помогут маркетологам, аналитикам и SMM специалистам построить эффективные стратегии продвижения своих страниц.`}
          image='/images/sharing_socialindex.png'
          keywords={`Индекс активности, бенчмарки, средние метрики, средние значения, ориентиры, отрасль, ${socialTypeName}, ${industryName}, ${country.name}`}
          noindex={!socialIndexStore.summary?.lastAvgIndex}
        />
        <Header />
        <Segment background='top'>
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
                <Title size='heavy' center>Social Index</Title>
              </Col>
            </Row>
            <Row padding='m'>
              <Col size={8} center>
                <Text size='xl' semibold center>
                  <TextColor color='super-dark'>
                    {socialTypeName}, {industryName}, {country.name}
                  </TextColor>
                </Text>
              </Col>
            </Row>
            <Row padding='l'>
              <Col size={10} center>
                <Text center maxWidth><Link onClick={() => this.setState({ showHelp: true })}>Как считается индекс и что это такое?</Link></Text>
              </Col>
            </Row>

            <Row padding='xl' />

            {/*<ServiceBlockGroup>*/}
            {/*  <ServiceBlock white>*/}
                <Col size={12} center>
                  <ButtonTextGroup full>
                    <Select
                      label='Социальная сеть'
                      value={socialType}
                      list={SocialDataUtil.getSocialTypesShort().map(social => ({ id: social.socialType, name: social.name, icon: `${social.socialType.toLowerCase()}_colored` }))}
                      onSelect={e => router.replace(`/app/socialindex/${SocialDataUtil.toUri(e.target.value as ISocialType)}/${router.query.country}/${router.query.industry}`, null, { scroll: false })}
                      maxHeight={265}
                      empty
                    />
                    <Select
                      label='Страна'
                      value={String(router.query.country)}
                      list={ratingTagsStore.getCountriesCities.map(country => ({ id: country.tagID, name: country.name, level: country.level }))}
                      onSelect={e => router.replace(`/app/socialindex/${router.query.socialType}/${e.target.value}/${router.query.industry}`, null, { scroll: false })}
                      maxHeight={290}
                      // filtered
                      empty
                    />
                    <Select
                      label='Категория'
                      value={String(router.query.industry)}
                      list={ratingTagsStore.getAllCategories.map(industry => ({ id: industry.tagID, name: industry.name, level: industry.level }))}
                      onSelect={e => router.replace(`/app/socialindex/${router.query.socialType}/${router.query.country}/${e.target.value}`, null, { scroll: false })}
                      maxHeight={290}
                      filtered
                      empty
                    />
                  </ButtonTextGroup>
                </Col>
            {/*  </ServiceBlock>*/}
            {/*</ServiceBlockGroup>*/}

            <Row padding='xl'/>
            <Row padding='xxl'>
              <Col size={10} center>
                <Title size='l' center><TextColor color='#311E9D' gradientColor='#AA60F6'>Активность {socialTypeName}</TextColor></Title>
              </Col>
            </Row>
            <Row padding='m'>
              <Col size={10} center>
                <Text size='l' semibold center maxWidth><TextColor color='dark'>
                    Индекс и средние значения главных метрик {socialTypeName} для одного сообщества {period.currentShortFromTo}
                </TextColor></Text>
              </Col>
            </Row>

            <Row padding='xxl' />

            {!profileStore.isAuth && (
              <>
                <Notification
                  icon='admin'
                  title='Доступ к данным ограничен'
                  message='Зарегистрируйтесь, чтобы посмотреть больше данных по этой категории.'
                  to='?modal=registration&scroll=false'
                  buttonText='Зарегистрироваться'
                />
                <Row padding='xxl' />
              </>
            )}

            {profileStore.isAuth && industry?.level > profileStore.userPlan.current?.indexLevel && (
              <>
                <Notification
                  icon='admin'
                  title='Доступ к данным ограничен'
                  message={'Чтобы увидеть все данные по этой категории, перейдите на тариф '.concat(profileStore.getHigherPlansList({ indexLevel: industry?.level }))}
                  onClick={() => RouterUtil.replaceParams(router, { modal: 'change-plan', planName: profileStore.getHigherPlansByOptions({ indexLevel: industry?.level })[0] })}
                  buttonText='Выбрать тариф'
                />
                <Row padding='xxl' />
              </>
            )}

            <BlockGroup size='s' center>
              <Block size={4} to='#index' color='#FFF1E0'>
                <InfoLabelGroup size='s' center>
                  <InfoLabel
                    title='Индекс'
                    value={socialIndexStore.summary?.lastAvgIndex} format='0.0'
                    deltaValue={socialIndexStore.summary?.deltaPctAvgIndex} deltaValueFormat='0%'
                    loading={socialIndexStore.isLoading}
                    tooltipTitle='Индекс'
                    tooltipText={[`Доля активности пользователей в ${socialTypeName} по отношению к остальным социальным сетям.`,`Мы используем усредненные данные, собранные на основе ТОП-500 страниц в России в сегменте ${industryName}.`,`Нижнее значение показывает на сколько процентов изменился Индекс в сравнении с предыдущим месяцем.`]}
                  />
                </InfoLabelGroup>
              </Block>
              <Block size={4} to='#users'>
                <InfoLabelGroup size='s' center>
                  <InfoLabel
                    title='Подписчики'
                    value={socialIndexStore.summary?.lastAvgUsersCount} format='0.[0a]'
                    deltaValue={socialIndexStore.summary?.deltaPctAvgUsersCount} deltaValueFormat='0.00%'
                    loading={socialIndexStore.isLoading}
                    tooltipTitle='Подписчики'
                    tooltipText={[`Среднее количество подписчиков на одной странице за месяц.`,`Мы используем усредненные данные, собранные на основе ТОП-500 страниц в России в сегменте ${industryName}.`,`Нижнее значение показывает на сколько процентов изменилось количество подписчиков в сравнении с предыдущим месяцем.`]}
                  />
                </InfoLabelGroup>
              </Block>
              <Block size={4} to='#posts'>
                <InfoLabelGroup size='s' center>
                  <InfoLabel
                    title='Посты'
                    value={socialIndexStore.summary?.lastAvgPosts} format='0.[0a]'
                    deltaValue={socialIndexStore.summary?.deltaPctAvgPosts} deltaValueFormat='0.00%'
                    loading={socialIndexStore.isLoading}
                    tooltipTitle='Посты'
                    tooltipText={[`Среднее количество постов, которое публикуется на одной странице за месяц.`,`Мы используем усредненные данные, собранные на основе ТОП-500 страниц в России в сегменте ${industryName}.`,`Нижнее значение показывает на сколько процентов изменилось количество постов в сравнении с предыдущим месяцем.`]}
                  />
                </InfoLabelGroup>
              </Block>
              {SocialDataUtil.hasInteractions(socialType) && (<Block size={4} to='#interactions'>
                <InfoLabelGroup size='s' center>
                  <InfoLabel
                    title='Реакции'
                    value={socialIndexStore.summary?.lastAvgInteractions} format='0.[0a]'
                    deltaValue={socialIndexStore.summary?.deltaPctAvgInteractions} deltaValueFormat='0.00%'
                    loading={socialIndexStore.isLoading}
                    tooltipTitle='Реакции'
                    tooltipText={[`Среднее количество реакций, которое получают все посты на одной странице за месяц.`,`Мы используем усредненные данные, собранные на основе ТОП-500 страниц в России в сегменте ${industryName}.`,`Нижнее значение показывает на сколько процентов изменилось количество реакций в сравнении с предыдущим месяцем.`]}
                    blocked={!profileStore.isAuth || (profileStore.isAuth && industry?.level > profileStore.userPlan.current?.indexLevel)}
                    higherPlansList={profileStore.getHigherPlansList({ indexLevel: industry?.level })}
                    onChangePlan={() => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan', planName: profileStore.getHigherPlansByOptions({ indexLevel: industry?.level })[0] }) : RouterUtil.replaceParams(router, { modal: 'registration' })}
                  />
                </InfoLabelGroup>
              </Block>)}
              {SocialDataUtil.hasViews(socialType) && <Block size={4} to='#views'>
                <InfoLabelGroup size='s' center>
                  <InfoLabel
                    title='Просмотры'
                    value={socialIndexStore.summary?.lastAvgViews} format='0.[0a]'
                    deltaValue={socialIndexStore.summary?.deltaPctAvgViews} deltaValueFormat='0.00%'
                    loading={socialIndexStore.isLoading}
                    tooltipTitle='Просмотры'
                    tooltipText={[`Среднее количество просмотров, которое получают все посты на одной странице за месяц.`,`Мы используем усредненные данные, собранные на основе ТОП-500 страниц в России в сегменте ${industryName}.`,`Нижнее значение показывает на сколько процентов изменилось количество просмотров в сравнении с предыдущим месяцем.`]}
                    blocked={!profileStore.isAuth || (profileStore.isAuth && industry?.level > profileStore.userPlan.current?.indexLevel)}
                    higherPlansList={profileStore.getHigherPlansList({ indexLevel: industry?.level })}
                    onChangePlan={() => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan', planName: profileStore.getHigherPlansByOptions({ indexLevel: industry?.level })[0] }) : RouterUtil.replaceParams(router, { modal: 'registration' })}
                  />
                </InfoLabelGroup>
              </Block>}
              <Block size={4} to='#ar'>
                <InfoLabelGroup size='s' center>
                  <InfoLabel
                    title='Активность'
                    value={socialIndexStore.summary?.lastAvgAr} format='0%'
                    deltaValue={socialIndexStore.summary?.deltaPctAvgAr} deltaValueFormat='0.00%'
                    loading={socialIndexStore.isLoading}
                    tooltipTitle='Активность'
                    tooltipText={[`Средний процент пользователей, совершающих действия (лайки, комментарии, репосты, просмотры видео), которые получают все посты на одной странице за месяц.`,`Мы используем усредненные данные, собранные на основе ТОП-500 страниц в России в сегменте ${industryName}.`,`Нижнее значение показывает на сколько процентов изменилась активность в сравнении с предыдущим месяцем.`]}
                    blocked={!profileStore.isAuth || (profileStore.isAuth && industry?.level > profileStore.userPlan.current?.indexLevel)}
                    higherPlansList={profileStore.getHigherPlansList({ indexLevel: industry?.level })}
                    onChangePlan={() => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan', planName: profileStore.getHigherPlansByOptions({ indexLevel: industry?.level })[0] }) : RouterUtil.replaceParams(router, { modal: 'registration' })}
                  />
                </InfoLabelGroup>
              </Block>
            </BlockGroup>
          </Container>
        </Segment>

        <Segment>
          <Container>
            <Row padding='xxl'>
              <Col size={12}>
                <Title id='index'>Индекс {socialTypeName}</Title>
              </Col>
            </Row>

            <Row padding='m'>
              <Col size={12}>
                <Text>
                  Изменение Индекса в {socialTypeName} за месяц.
                  Показывает долю активности пользователей соцсети — чем больше Индекс, тем эффективнее соцсеть для работы.
                </Text>
              </Col>
            </Row>
            <Row padding='s'>
              <Col size={12}>
                <Text size='xs'><Link onClick={() => this.setState({ showHelp: true })}>Как считается Индекс и что это значит?</Link></Text>
              </Col>
            </Row>
            <Row padding='xl'>
              <Col size={12}>
                <LineChart data={socialIndexStore.retrospective?.map(item => ({ date: moment(item.date).toDate(), value: item.avgIndex }))} compare format='0.0' column color='#F7B801' height={350} />
              </Col>
            </Row>

            <Row padding='xxl' />

            <IndexTable data={socialIndexStore.indices.map(item => ({
              index: item?.lastAvgIndex,
              socialType: item?.socialType,
              deltaWeek: item?.deltaPctAvgWeekIndex,
              deltaMonth: item?.deltaPctAvgMonthIndex,
              onClick: () => router.replace(`/app/socialindex/${SocialDataUtil.toUri(item.socialType)}/${router.query.country}/${router.query.industry}`, undefined, { scroll: false })
            }))} />

            <Row padding='xxl'>
              <Col size={12}>
                <Title id='users'>Количество подписчиков {socialTypeName}</Title>
              </Col>
            </Row>

            <Row padding='m'>
              <Col size={12}>
                <Text>
                  Изменение количества подписчиков в {socialTypeName} за месяц.
                  Показывает среднее количество пользователей на странице — чем больше это значение, тем выше охваты.
                </Text>
              </Col>
            </Row>
            <Row padding='s'>
              <Col size={12}>
                <Text size='xs'><Link onClick={() => this.setState({ showHelp: true })}>Как разобраться в этих цифрах?</Link></Text>
              </Col>
            </Row>

            <Row padding='l' left>
              <Col size={4} top>
                <BlockGroup size='s'>
                  <Block>
                    <InfoLabelGroup size='m' oneCol>
                      <InfoLabel
                        title={`${period.currentShortPeriod}`}
                        value={socialIndexStore.summary?.lastAvgUsersCount}
                        format='0,0'
                        deltaValue={socialIndexStore.summary?.deltaPctAvgUsersCount}
                        deltaValueFormat='0.00%'
                      />
                    </InfoLabelGroup>
                  </Block>
                </BlockGroup>
              </Col>
              <Col size={8}>
                <LineChart
                  data={socialIndexStore.retrospective?.map(item => ({ date: moment(item.date).toDate(), value: item.avgUsersCount }))}
                  compare
                  format='0,0'
                  color='#80ADFF'
                  height={200}
                />
              </Col>
            </Row>

            <Row padding='xxl'>
              <Col size={12}>
                <Title id='posts'>Количество постов {socialTypeName}</Title>
              </Col>
            </Row>

            <Row padding='m'>
              <Col size={12}>
                <Text>
                  Изменение количества постов в {socialTypeName} за месяц.
                  Показывает сколько контента в среднем генерируется на одной странице — чем больше контента, тем интереснее площадка для пользователей.
                </Text>
              </Col>
            </Row>
            <Row padding='s'>
              <Col size={12}>
                <Text size='xs'><Link onClick={() => this.setState({ showHelp: true })}>Как разобраться в этих цифрах?</Link></Text>
              </Col>
            </Row>

            <Row padding='l' left>
              <Col size={4} top>
                <BlockGroup size='s'>
                  <Block>
                    <InfoLabelGroup size='m' oneCol>
                      <InfoLabel
                        title={`${period.currentShortPeriod}`}
                        value={socialIndexStore.summary?.lastAvgPosts}
                        format='0.00'
                        deltaValue={socialIndexStore.summary?.deltaPctAvgPosts}
                        deltaValueFormat='0.00%'
                      />
                    </InfoLabelGroup>
                  </Block>
                </BlockGroup>
              </Col>
              <Col size={8}>
                <LineChart
                  data={socialIndexStore.retrospective?.map(item => ({ date: moment(item.date).toDate(), value: item.avgPosts }))}
                  compare
                  format='0.00'
                  color='#FF8E51'
                  height={200}
                />
              </Col>
            </Row>

            {SocialDataUtil.hasViews(socialType) && (
              <>
                <Row padding='xxl'>
                  <Col size={12}>
                    <Title id='views'>Количество просмотров {socialTypeName}</Title>
                  </Col>
                </Row>
                <Row padding='m'>
                  <Col size={12}>
                    <Text>
                      Изменение количества просмотров пользователями в {socialTypeName} за месяц.
                      Показывает насколько интересен пользователям публикуемый на странице контент — можно прогнозировать охваты и прибыль.
                    </Text>
                  </Col>
                </Row>
                <Row padding='s'>
                  <Col size={12}>
                    <Text size='xs'><Link onClick={() => this.setState({ showHelp: true })}>
                      Как разобраться в этих цифрах?
                    </Link></Text>
                  </Col>
                </Row>

                <Row padding='l' left>
                  <Col size={4} top>
                    <BlockGroup size='s'>
                      <Block>
                        <InfoLabelGroup size='m' oneCol>
                          <InfoLabel
                            title={`${period.currentShortPeriod}`}
                            value={socialIndexStore.summary?.lastAvgViews}
                            format='0,0'
                            deltaValue={socialIndexStore.summary?.deltaPctAvgViews}
                            deltaValueFormat='0.00%'
                            blocked={!profileStore.isAuth || (profileStore.isAuth && industry?.level > profileStore.userPlan.current?.indexLevel)}
                            higherPlansList={profileStore.getHigherPlansList({ indexLevel: industry?.level })}
                            onChangePlan={() => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan', planName: profileStore.getHigherPlansByOptions({ indexLevel: industry?.level })[0] }) : RouterUtil.replaceParams(router, { modal: 'registration' })}
                          />
                        </InfoLabelGroup>
                      </Block>
                    </BlockGroup>
                  </Col>
                  <Col size={8}>
                    <LineChart
                      data={socialIndexStore.retrospective?.map(item => ({ date: moment(item.date).toDate(), value: item.avgViews }))}
                      compare
                      color='#44C800'
                      height={200}
                      blocked={!profileStore.isAuth || (profileStore.isAuth && industry?.level > profileStore.userPlan.current?.indexLevel)}
                      higherPlansList={profileStore.getHigherPlansList({ indexLevel: industry?.level })}
                      onChangePlan={() => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan', planName: profileStore.getHigherPlansByOptions({ indexLevel: industry?.level })[0] }) : RouterUtil.replaceParams(router, { modal: 'registration' })}
                    />
                  </Col>
                </Row>
              </>
            )}

            {SocialDataUtil.hasInteractions(socialType) && (
              <>
                <Row padding='xxl'>
                  <Col size={12}>
                    <Title id='interactions'>Количество реакций {socialTypeName}</Title>
                  </Col>
                </Row>
                <Row padding='m'>
                  <Col size={12}>
                    <Text>
                      Изменение количества реакций, оставленных пользователями в {socialTypeName} за месяц.
                      Показывает среднюю сумму лайков, комментариев и репостов на странице — это позволяет оценить активность аудитории.
                    </Text>
                  </Col>
                </Row>
                <Row padding='s'>
                  <Col size={12}>
                    <Text size='xs'><Link onClick={() => this.setState({ showHelp: true })}>
                      Как разобраться в этих цифрах?
                    </Link></Text>
                  </Col>
                </Row>

                <Row padding='l' left>
                  <Col size={4} top>
                    <BlockGroup size='s'>
                      <Block>
                        <InfoLabelGroup size='m' oneCol>
                          <InfoLabel
                            title={`${period.currentShortPeriod}`}
                            value={socialIndexStore.summary?.lastAvgInteractions}
                            format='0,0'
                            deltaValue={socialIndexStore.summary?.deltaPctAvgInteractions}
                            deltaValueFormat='0.00%'
                            blocked={!profileStore.isAuth || (profileStore.isAuth && industry?.level > profileStore.userPlan.current?.indexLevel)}
                            higherPlansList={profileStore.getHigherPlansList({ indexLevel: industry?.level })}
                            onChangePlan={() => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan', planName: profileStore.getHigherPlansByOptions({ indexLevel: industry?.level })[0] }) : RouterUtil.replaceParams(router, { modal: 'registration' })}
                          />
                        </InfoLabelGroup>
                      </Block>
                    </BlockGroup>
                  </Col>
                  <Col size={8}>
                    <LineChart
                      data={socialIndexStore.retrospective?.map(item => ({ date: moment(item.date).toDate(), value: item.avgInteractions }))}
                      compare
                      color='#FF6F00'
                      height={200}
                      blocked={!profileStore.isAuth || (profileStore.isAuth && industry?.level > profileStore.userPlan.current?.indexLevel)}
                      higherPlansList={profileStore.getHigherPlansList({ indexLevel: industry?.level })}
                      onChangePlan={() => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan', planName: profileStore.getHigherPlansByOptions({ indexLevel: industry?.level })[0] }) : RouterUtil.replaceParams(router, { modal: 'registration' })}
                    />
                  </Col>
                </Row>
              </>
            )}

            <Row padding='xxl'>
              <Col size={12}>
                <Title
                  id='ar'
                  //tooltipTitle='Активность'
                  //tooltipText={[`Средний процент пользователей, совершающих действия (лайки, комментарии, репосты, просмотры видео), которые получают все посты на одной странице за ${periodName}.`,`Мы используем усредненные данные, собранные на основе ТОП-500 страниц в России в сегменте ${industryName}.`,`Нижнее значение показывает на сколько процентов изменилась активность в сравнении с ${periodNameV}.`]}
                >
                  Активность {socialTypeName}
                </Title>
              </Col>
            </Row>
            <Row padding='m'>
              <Col size={12}>
                <Text>
                  Изменение активности в {socialTypeName} за месяц.
                  Показывает средний процент пользоватей, которые проявляют активность на странице — чем показатель выше, тем лояльнее аудитория.
                </Text>
              </Col>
            </Row>
            <Row padding='s'>
              <Col size={12}>
                <Text size='xs'><Link onClick={() => this.setState({ showHelp: true })}>
                  Как разобраться в этих цифрах?
                </Link></Text>
              </Col>
            </Row>

            <Row padding='l' left>
              <Col size={4} top>
                <BlockGroup size='s'>
                  <Block>
                    <InfoLabelGroup size='m' oneCol>
                      <InfoLabel
                        title={`${period.currentShortPeriod}`}
                        value={socialIndexStore.summary?.lastAvgAr}
                        format='0%'
                        deltaValue={socialIndexStore.summary?.deltaPctAvgAr}
                        deltaValueFormat='0.00%'
                        blocked={!profileStore.isAuth || (profileStore.isAuth && industry?.level > profileStore.userPlan.current?.indexLevel)}
                        higherPlansList={profileStore.getHigherPlansList({ indexLevel: industry?.level })}
                        onChangePlan={() => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan', planName: profileStore.getHigherPlansByOptions({ indexLevel: industry?.level })[0] }) : RouterUtil.replaceParams(router, { modal: 'registration' })}
                      />
                    </InfoLabelGroup>
                  </Block>
                </BlockGroup>
              </Col>
              <Col size={8}>
                <LineChart
                  data={socialIndexStore.retrospective?.map(item => ({ date: moment(item.date).toDate(), value: item.avgAr }))}
                  compare
                  format='0.000%'
                  color='#186AFF'
                  height={200}
                  blocked={!profileStore.isAuth || (profileStore.isAuth && industry?.level > profileStore.userPlan.current?.indexLevel)}
                  higherPlansList={profileStore.getHigherPlansList({ indexLevel: industry?.level })}
                  onChangePlan={() => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan', planName: profileStore.getHigherPlansByOptions({ indexLevel: industry?.level })[0] }) : RouterUtil.replaceParams(router, { modal: 'registration' })}
                />
              </Col>
            </Row>
          </Container>
        </Segment>

        <ContactUs />

        <Footer disableSupport />

        <ModalPopup open={this.state.showHelp} onCloseClick={() => this.setState({ showHelp: false })}>
          <Title>Что такое Индекс?</Title>
          <Row padding='m'/>
          <Text><TextColor color='dark'>
            Social Index — это уникальная и первая в России онлайн-платформа для мониторинга активности и эффективности социальных сетей в реальном времени.
          </TextColor></Text>
          <Row padding='m'/>
          <Text><TextColor color='dark'>
            Наши данные помогут маркетологам, аналитикам и SMM специалистам построить эффективные стратегии продвижения в сложившейся ситуации.
          </TextColor></Text>
          <Row padding='xl'/>

          <Title size='xs'>Как считается индекс и что он означает</Title>
          <Row padding='s'/>
          <Text size='s'><TextColor color='dark'>
            Индекс — показатель, созданный на основе анализа главных метрик в социальных сетях. Он измеряется от 0 до 100 и показывает долю активности пользователей в выбранной социальной сети по отношению к другим. Значение 100 — это вся активность всех пользователей во всех соцсетях.
          </TextColor></Text>
          <Row padding='s'/>
          <Image src={require('../../../../../../public/images/socialindex_index.png')} full />
          <Row padding='s'/>
          <Text size='s'><TextColor color='dark'>
            Индекс позволяет понять, какая соцсеть лучше подходит для определённого сегмента авторов. Всё просто — чем выше активность в социальной сети, тем выше её Индекс.
          </TextColor></Text>
          <Row padding='xl'/>

          <Title size='xs'>Как считаются подписчики, посты, реакции и просмотры</Title>
          <Row padding='s'/>
          <Text size='s'><TextColor color='dark'>
            Каждая отдельно взятая метрика показывает среднее значение на одной странице за выбранный период времени.
          </TextColor></Text>
          <Row padding='s'/>
          <Image src={require('../../../../../../public/images/socialindex_metric.png')} full />
          <Row padding='s'/>
          <Text size='s'><TextColor color='dark'>
            Все основные метрики для каждой социальной сети считаются путем усреднения. Мы берём все значения одной метрики со всех страниц за выбранный период (неделя или месяц) и усредняем их. Получается некоторое число, которое принято называть «Бенчмарк».
          </TextColor></Text>
          <Row padding='xl'/>

          <Title size='xs'>Как считается активность и что она значит</Title>
          <Row padding='s'/>
          <Text size='s'><TextColor color='dark'>
            Активность — это такая же усреднённая метрика как и другие. Средний процент пользователей, совершающих действия (лайки, комментарии, репосты, просмотры видео), которые получают все посты на одной странице за выбранный период времени.
          </TextColor></Text>
          <Row padding='xl'/>
          <Text size='s'>Упоминая «все страницы», мы говорим о том, что отобрали для каждого сегмента по 500 лучших страниц в каждой социальной сети. Для расчёта Индекса и основных показателей используются усреднённые публичные данные.</Text>
        </ModalPopup>
      </>)
  }
}
