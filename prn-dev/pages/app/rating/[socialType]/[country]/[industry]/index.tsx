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
import Text from '../../../../../../elements/Text/Text'
import Footer from '../../../../../../elements/Footer/Footer'
import Block from '../../../../../../elements/Block/Block'
import InfoLabelGroup from '../../../../../../elements/InfoLabel/InfoLabelGroup'
import InfoLabel from '../../../../../../elements/InfoLabel/InfoLabel'
import BlockGroup from '../../../../../../elements/Block/BlockGroup'
import TextColor from '../../../../../../elements/TextColor/TextColor'
import ButtonTagGroup from '../../../../../../elements/ButtonTag/ButtonTagGroup'
import ButtonTag from '../../../../../../elements/ButtonTag/ButtonTag'
import CommunityInfo from '../../../../../../elements/CommunityInfo/CommunityInfo'
import RatingStore from '../../../../../../stores/RatingStore'
import ButtonText from "../../../../../../elements/ButtonText/ButtonText"
import Loader from '../../../../../../elements/Loader/Loader'
import SocialDataUtil from '../../../../../../utils/SocialDataUtil'
import Page from '../../../../../../elements/Page/Page'
import RatingTagsStore from '../../../../../../stores/RatingTagsStore'
import InfluenceStore from '../../../../../../stores/InfluenceStore'
import Select from '../../../../../../elements/Select/Select'
import ISocialType from '../../../../../../interfaces/ISocialType'
import ServiceBlockGroup from '../../../../../../elements/ServiceBlock/ServiceBlockGroup'
import ServiceBlock from '../../../../../../elements/ServiceBlock/ServiceBlock'
import ButtonTextGroup from '../../../../../../elements/ButtonText/ButtonTextGroup'
import RouterUtil from '../../../../../../utils/RouterUtil'
import Notification from '../../../../../../elements/Notification/Notification'
import ProfileStore from '../../../../../../stores/ProfileStore'
import AppUtil from '../../../../../../utils/AppUtil'
import Title from '../../../../../../elements/Title/Title'

interface IRouter extends SingletonRouter {
  /**
   * query
   */
  query: {
    /**
     * Для получения параметров со старого сайта
     */
    redirect: string
    /**
     * Соцсеть
     */
    socialType: string
    /**
     * Страна
     */
    country: string
    /**
     * Отрасль
     */
    industry: string
    /**
     * Модалка
     */
    modal: string
    /**
     * Устаревший параметр, для редиректа
     */
    query?: string
    planName?: string
  }
}

interface IProps {
  /**
   * router
   */
  router: IRouter
  profileStore?: ProfileStore
  ratingStore?: RatingStore
  influenceStore?: InfluenceStore
  ratingTagsStore?: RatingTagsStore
}

interface IStates {
  isSearchFocus: boolean
}

@(withRouter as any)
@inject(Stores.PROFILE_STORE, Stores.RATING_STORE, Stores.RATING_TAGS_STORE, Stores.INFLUENCE_STORE)
@observer
export default class AppRatingPage extends Component<IProps, IStates> {
  state: IStates = {
    isSearchFocus: false
  }

  static async getInitialProps (ctx: IStoreContext): Promise<Partial<any>> {
    const { influenceStore, ratingTagsStore } = ctx.store
    let { socialType, country, industry, query, redirect } = ctx.query

    socialType = SocialDataUtil.fromUri(String(socialType))

    await Promise.all([
      ratingTagsStore.load(),
      influenceStore.search({ socialType, tags: [String(country), String(industry)], query: String(query || ''), inRating: true, isActive: true })
    ])

    if (redirect) {
      // redirectQuery = RatingTagsUtil.generateSearchQuery(String(redirect).split('/'))
    }

    return { socialType, country, industry, query }
  }

  render (): JSX.Element {
    const { router, profileStore, ratingTagsStore, influenceStore } = this.props

    const metaQuery = `${SocialDataUtil.getSocialTypeName(SocialDataUtil.fromUri(router.query.socialType))} ${ratingTagsStore.getTag(router.query.industry)?.name} ${ratingTagsStore.getTag(router.query.country)?.name}`
    const metaTopCommunities = influenceStore.communities?.slice(0, 10).map(community => community.name).join(', ')
    const metaImageTopCommunity = influenceStore.communities.length && influenceStore.communities[0].image || ''

    if (AppUtil.isClientSide && router.query.query) router.push(`/search?query=${encodeURIComponent(router.query.query)}`)
    if (AppUtil.isClientSide && router.query.redirect) router.push(`/app/rating/${router.query.redirect.split('/').slice(0, 3).join('/')}`)

    return (
      <Page grey>
        <Meta
          title={`Рейтинг топ 10 ${metaQuery}`}
          description={`Рейтинг топ 10 ${metaQuery}: (${metaTopCommunities})`}
          image={metaImageTopCommunity || '/images/sharing_rating.png'}
          keywords={`Топ 3, Топ 5, Топ 10, Топ 20, Топ 100, рейтинг, количество подписчиков, просмотры постов, вовлеченность, ${metaQuery}, ${metaTopCommunities}`}
          noindex={!influenceStore.communities?.length}
        />

        <Header />

        <Segment>
          <Container>
            <Row padding='l'>
              <Col size={10} center>
                <Title size='l' center>Рейтинг страниц</Title>
              </Col>
            </Row>
            <Row padding='l' />
            <ServiceBlockGroup>
              <ServiceBlock white>
                <Col size={12} center>
                  <ButtonTextGroup full>
                    <Select
                      label='Социальная сеть'
                      value={SocialDataUtil.fromUri(router.query.socialType)}
                      list={SocialDataUtil.getSocialTypesShort().map(social => ({ id: social.socialType, name: social.name, icon: `${social.socialType.toLowerCase()}_colored` }))}
                      onSelect={e => router.replace(`/app/rating/${SocialDataUtil.toUri(e.target.value as ISocialType)}/${router.query.country}/${router.query.industry}`, null, { scroll: false })}
                      maxHeight={265}
                      empty
                    />
                    <Select
                      label='Страна'
                      value={String(router.query.country)}
                      list={[{ tagID: 'all', name: 'Все страны', icon: '', level: 0 }, ...ratingTagsStore.getCountriesCities].map(country => ({ id: country.tagID, name: country.name, level: country.level }))}
                      onSelect={e => router.replace(`/app/rating/${router.query.socialType}/${e.target.value}/${router.query.industry}`, null, { scroll: false })}
                      maxHeight={290}
                      empty
                    />
                    <Select
                      label='Категория'
                      value={String(router.query.industry)}
                      list={[{ tagID: 'all', name: 'Все категории', level: null }, ...ratingTagsStore.getAllCategories].map(industry => ({ id: industry.tagID, name: industry.name, level: industry.level }))}
                      onSelect={e => router.replace(`/app/rating/${router.query.socialType}/${router.query.country}/${e.target.value}`, null, { scroll: false })}
                      maxHeight={290}
                      filtered
                      empty
                    />
                  </ButtonTextGroup>
                </Col>
              </ServiceBlock>
            </ServiceBlockGroup>

            {!influenceStore.communities?.length && (
              <>
                <Row padding='l'>
                  <Col size={10} center>
                    <Text center><TextColor color='grey'>Просто выберите нужную соцсеть, категорию или страну. Или выберите один из примеров запросов:</TextColor></Text>
                  </Col>
                </Row>
                <Row padding='xl'>
                  <Col size={10} center>
                    <ButtonTagGroup center>
                      <ButtonTag color='dark' to='/app/rating/vkontakte/russia/brands'>Лучшие бренды ВКонтакте</ButtonTag>
                      <ButtonTag color='dark' to='/app/rating/vkontakte/russia/celebrities'>Топ-100 знаменитостей в России</ButtonTag>
                      <ButtonTag color='dark' to='/app/rating/telegram/russia/media'>Лучшие Медиа в Telegram</ButtonTag>
                      <ButtonTag color='dark' to='/app/rating/youtube/russia/celebrities'>Блогеры в YouTube</ButtonTag>
                      <ButtonTag color='dark' to='/app/rating/vkontakte/russia/airlines'>Авиакомпании Россиии</ButtonTag>
                    </ButtonTagGroup>
                  </Col>
                </Row>
                <Row padding='xxl' />
              </>
            )}

            <Row padding='xl' />

            <BlockGroup size='s'>
              {influenceStore.communities?.map((community, index) => (
                <Block size={6} to={`/search/${router.query.socialType}/${encodeURIComponent(community.screenName)}/${community.cid}`} _blank key={community.cid} white>
                  <CommunityInfo
                    image={community.image}
                    name={community.name}
                    url={community.url}
                  />
                  <Row padding='l' />
                  <ButtonTagGroup size='s'>
                    <ButtonTag size='s' icon='admin' color='orange'>{index + 1} место</ButtonTag>
                    {community?.ratingTags?.map(tag => <ButtonTag key={tag.tagID} size='s' color='grey'>{tag.name}</ButtonTag>)}
                  </ButtonTagGroup>
                  <Row padding='l' />
                  <InfoLabelGroup size='m'>
                    <InfoLabel description='Подписчиков' format='0.[0a]'>{community.usersCount}</InfoLabel>
                    {SocialDataUtil.hasViews(community.socialType) && (
                      <InfoLabel
                        description='Просмотров на пост'
                        format='0.[0a]'
                        blocked={!profileStore.isAvailableStatistics()}
                        onChangePlan={() => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan' }) : RouterUtil.replaceParams(router, { modal: 'registration' })}
                      >{Math.round(community.avgViews)}</InfoLabel>
                    )}
                    {SocialDataUtil.hasInteractions(community.socialType) && !SocialDataUtil.hasViews(community.socialType) && (
                      <InfoLabel
                        description='Реакций на пост'
                        format='0.[0a]'
                        blocked={!profileStore.isAvailableStatistics()}
                        onChangePlan={() => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan' }) : RouterUtil.replaceParams(router, { modal: 'registration' })}
                      >{Math.round(community.avgInteractions)}</InfoLabel>
                    )}
                  </InfoLabelGroup>
                </Block>
              ))}
            </BlockGroup>

            {influenceStore.isLoading && <Loader />}

            {!profileStore.isAuth && influenceStore.communities.length >= profileStore.userPlan.current.topRating && (
              <>
                <Row padding='xl' />
                <Notification
                  icon='admin'
                  title='Хотите увидеть больше страниц?'
                  message='Без регистрации доступно лишь 10 первых страниц. Зарегистрируйтесь, чтобы увидеть больше.'
                  to='?modal=registration&scroll=false'
                  buttonText='Зарегистрироваться'
                />
                <Row padding='l' />
              </>
            )}
            {profileStore.isAuth && influenceStore.communities.length >= profileStore.userPlan.current.topRating && (
              <>
                <Row padding='xl' />
                <Notification
                  icon='admin'
                  title='Хотите увидеть больше страниц?'
                  message={'Вы достигли лимита страниц. Чтобы увидеть больше — перейдите на тариф '.concat(profileStore.getHigherPlansList({ topRating: influenceStore.communities.length + 1 }))}
                  onClick={() => RouterUtil.replaceParams(router, { modal: 'change-plan', planName: profileStore.getHigherPlansByOptions({ topRating: influenceStore.communities.length + 1 })[0] })}
                  buttonText='Выбрать тариф'
                />
                <Row padding='l' />
              </>
            )}

          </Container>
        </Segment>

        {influenceStore.communities.length < profileStore.userPlan.current.topRating && !influenceStore.isLoading && influenceStore.hasNextPage && (
          <Segment onEnterViewport={() => influenceStore.loadListNextPage()}>
            <Container>
              <Row padding='xl'>
                <Col center>
                  <ButtonText onClick={() => influenceStore.loadListNextPage()} size='l'>Следущая страница</ButtonText>
                </Col>
              </Row>
              <Row padding='xxl' />
            </Container>
          </Segment>
        )}

        <Row padding='xxl'/>

        <Footer lite disableSupport />
      </Page>)
  }
}
