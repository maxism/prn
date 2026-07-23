import React, {Component} from 'react'
import {SingletonRouter, withRouter} from 'next/router'
import {IStoreContext, Stores} from '../../../../stores/RootStore'
import {inject, observer} from 'mobx-react'
import Meta from '../../../../components/Meta'
import Header from '../../../../elements/Header/Header'
import Segment from '../../../../elements/Segment/Segment'
import Container from '../../../../elements/Container/Container'
import Row from '../../../../elements/Row/Row'
import Col from '../../../../elements/Col/Col'
import Title from '../../../../elements/Title/Title'
import Text from '../../../../elements/Text/Text'
import TextColor from '../../../../elements/TextColor/TextColor'
import RatingStore from '../../../../stores/RatingStore'
import InfoLabel from '../../../../elements/InfoLabel/InfoLabel'
import InfoLabelGroup from '../../../../elements/InfoLabel/InfoLabelGroup'
import CommunityInfo from '../../../../elements/CommunityInfo/CommunityInfo'
import ButtonTag from '../../../../elements/ButtonTag/ButtonTag'
import ButtonTagGroup from '../../../../elements/ButtonTag/ButtonTagGroup'
import ButtonTextGroup from '../../../../elements/ButtonText/ButtonTextGroup'
import ButtonText from '../../../../elements/ButtonText/ButtonText'
import ProfileStore from '../../../../stores/ProfileStore'
import SocialDataUtil from '../../../../utils/SocialDataUtil'
import RatingTagsStore from '../../../../stores/RatingTagsStore'
import AppUtil from '../../../../utils/AppUtil'
import Page from '../../../../elements/Page/Page'
import ServiceBlock from '../../../../elements/ServiceBlock/ServiceBlock'
import ServiceBlockGroup from '../../../../elements/ServiceBlock/ServiceBlockGroup'
import moment from 'moment'
import CommunitiesStore, { CommunityType } from '../../../../stores/CommunitiesStore'
import NumeralUtil from '../../../../utils/NumeralUtil'
import Footer from '../../../../elements/Footer/Footer'
import Image from '../../../../elements/Image/Image'
import LineChart from '../../../../elements/Chart/LineChart/LineChart'
import StatisticsStore from '../../../../stores/StatisticsStore'
import DateUtil from '../../../../utils/DateUtil'
import Link from '../../../../elements/Link/Link'
import Loader from '../../../../elements/Loader/Loader'
import RouterUtil from '../../../../utils/RouterUtil'
import Popup from '../../../../elements/Popup/Popup'
import PopupButton from '../../../../elements/Popup/PopupButton'
import AccountsStore from '../../../../stores/AccountsStore'
import ContentChart from '../../../../elements/Chart/ContentChart/ContentChart'
import ArrayUtil from '../../../../utils/ArrayUtil'
import DowhChart from '../../../../elements/Chart/DowhChart/DowhChart'
import Tooltip from '../../../../elements/Tooltip/Tooltip'
import BlockGroup from '../../../../elements/Block/BlockGroup'
import Block from '../../../../elements/Block/Block'

interface IRouter extends SingletonRouter {
  /**
   * query
   */
  query: {
    /**
     * Соцсеть
     */
    socialType: string
    /**
     * ScreenName
     */
    screenName: string
    /**
     * ID сообщества
     */
    cid: string
    /**
     * Обратная ссылка
     */
    back?: string
    /**
     * Начало периода
     */
    from?: string
    /**
     * Конец периода
     */
    to?: string
    /**
     * Модалка
     */
    modal?: string
    queryCommunity?: string
    addCommunityUrl?: string
  }
}

interface IProps {
  /**
   * router
   */
  router: IRouter
  ratingStore?: RatingStore
  ratingTagsStore?: RatingTagsStore
  profileStore?: ProfileStore
  communitiesStore?: CommunitiesStore
  statisticsStore?: StatisticsStore
  accountsStore?: AccountsStore
}

interface IStates {
  filter?: string
  showSuggestTags?: boolean
}

@(withRouter as any)
@inject(Stores.PROFILE_STORE, Stores.RATING_STORE, Stores.RATING_TAGS_STORE, Stores.COMMUNITIES_STORE, Stores.STATISTICS_STORE, Stores.ACCOUNTS_STORE)
@observer
export default class AppRatingDetailPage extends Component<IProps, IStates> {
  private _timeout: NodeJS.Timeout

  state: IStates = {
    filter: '',
    showSuggestTags: false
  }

  static async getInitialProps (ctx: IStoreContext): Promise<Partial<any>> {
    const { statisticsStore, ratingTagsStore, profileStore } = ctx.store
    const cid = String(ctx.query.cid)
    const screenName = String(ctx.query.screenName)

    await statisticsStore.loadCommunity(cid, screenName)

    const from = moment(statisticsStore.community?.timeStatistics).subtract(27 * 3, 'days').format('DD.MM.YYYY')
    const to = moment(statisticsStore.community?.timeStatistics).format('DD.MM.YYYY')

    await ratingTagsStore.load()
    if (profileStore.isAvailableStatistics()) {
      await Promise.all([
        statisticsStore.loadCommunityRetrospective(cid, screenName, from, to),
        statisticsStore.loadCommunityPosts(cid, screenName, from, to, '-date'),
        statisticsStore.loadCommunityActivity(cid, screenName),
        statisticsStore.loadCommunityActivityPrediction(cid, screenName),
        statisticsStore.loadCommunityRetrospectiveGrades(cid, screenName)
      ])
    }

    return {}
  }

  componentDidMount() {
    this.init()
  }

  componentDidUpdate() {
    this.init()
  }

  componentWillUnmount() {
    clearInterval(this._timeout)
  }

  init () {
    if (!this._timeout && AppUtil.isClientSide && !['PARTIAL', 'DONE'].includes(this.props.statisticsStore.community?.communityStatus)) {
      this._timeout = setInterval(() => this.loadCommunityData(), 20000)
    }
  }

  loadCommunityData = async () => {
    const { router, statisticsStore, ratingTagsStore, profileStore } = this.props
    const cid = String(router.query.cid)
    const screenName = String(router.query.screenName)

    const from = moment(statisticsStore.community?.timeStatistics).subtract(27 * 3, 'days').format('DD.MM.YYYY')
    const to = moment(statisticsStore.community?.timeStatistics).format('DD.MM.YYYY')

    await statisticsStore.loadCommunity(cid, screenName, true)

    if (['PARTIAL', 'DONE'].includes(statisticsStore.community?.communityStatus)) {
      clearInterval(this._timeout)

      await ratingTagsStore.load()

      if (profileStore.isAvailableStatistics()) {
        await Promise.all([
          statisticsStore.loadCommunityRetrospective(cid, screenName, from, to),
          statisticsStore.loadCommunityPosts(cid, screenName, from, to, '-date'),
          statisticsStore.loadCommunityActivity(cid, screenName),
          statisticsStore.loadCommunityActivityPrediction(cid, screenName),
          statisticsStore.loadCommunityRetrospectiveGrades(cid, screenName)
        ])
      }
    }
  }

  handleAddSuggestTag = async (tagID) => {
    await this.props.ratingStore.suggestTag(tagID)
  }

  handleRemoveSuggestTag = async (tagID) => {
    await this.props.ratingStore.removeSuggestTag(tagID)
  }

  handleRemoveTag = async (tagID) => {
    await this.props.ratingStore.removeSuggestTag(tagID)
  }

  handleApproveTags = async () => {
    await this.props.ratingStore.approveTags()
  }

  handleNextApproveCommunity = async () => {
    const { router } = this.props

    const cid = await this.props.ratingStore.getNextApproveCommunity()
    const { socialType } = SocialDataUtil.fromCid(cid)

    router.push(`/search/${SocialDataUtil.toUri(socialType)}/none/${cid}`)
  }

  render (): JSX.Element {
    const { router, profileStore, statisticsStore, ratingTagsStore, communitiesStore, accountsStore } = this.props
    // const { filter } = this.state

    const community = statisticsStore.community

    const tags = (community?.tags || []).map(tagID => ratingTagsStore.getTag(tagID)).slice().reverse() || []
    // const suggestedTags = community?.suggestedTags || []
    const ratingTags = (community?.ratingTags || []).slice().reverse()
    // const mainTag = router.query.back && router.query.back.includes('/rating/') && ratingTags.shift() || null
    const countryTag = tags.find(tag => tag.parent === 'countries')

    if (AppUtil.isClientSide && statisticsStore.isLoading) {
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
    }

    if (profileStore.isAuth) {
      if (AppUtil.isClientSide && !statisticsStore.isLoading && !community) {
        // todo: Если сообщество не существует - выдаем сообщение об ошибке
        return <p>Нет такого сообщества</p>
      }
    }

    const isLoading = !['PARTIAL', 'DONE'].includes(statisticsStore.community?.communityStatus)

    const projectsCommunities = communitiesStore.getAllProjectsCommunitiesByCid(community?.cid)

    if (community && community.isPublicBlocked) {
      return (
        <Segment full>
          <Meta
            title='Страница изъята из общего доступа по требованию Правообладателя.'
            noindex
          />
          <Container>
            <Row padding='xxl'>
              <Col size={10} center>
                Страница изъята из общего доступа по требованию Правообладателя.
              </Col>
            </Row>
          </Container>
        </Segment>)
    }

    return (
      <Page grey>
        <Meta
          title={`Статистика ${community?.name} (${community?.screenName}) ${SocialDataUtil.getSocialTypeName(community?.socialType)}`}
          description={`Статистика ${community?.name} (${community?.screenName}) ${SocialDataUtil.getSocialTypeName(community?.socialType)}: ${community?.description}`}
          image={community?.image || '/images/sharing_rating.png'}
          keywords={`статистика, рейтинг, анализ, анализировать, аналитика, количество подписчиков, просмотры постов, вовлеченность, ER, engagement rate, quality score, реакций на пост, ${community?.name}, ${community?.screenName}, ${SocialDataUtil.getSocialTypeName(community?.socialType)}, ${tags.map(tag => tag.name).join(', ')}`}
          canonicalUrl={`/search/${router.query.socialType}/${encodeURIComponent(community?.screenName)}/${router.query.cid}`}
        />

        <Header />
        <Segment>
          <Container>
            <Row padding='m' />
            <Row padding='xs' />

            {router.query.back && router.query.back.includes('/search?') && <ButtonText to={router.query.back} secondary icon='arrow_left'>Назад к поиску</ButtonText>}
            {router.query.back && router.query.back.includes('/rating/') && <ButtonText to={router.query.back} secondary icon='arrow_left'>Назад к рейтингу</ButtonText>}
            {router.query.back && router.query.back.includes('/settings/projects/') && <ButtonText to={router.query.back} secondary icon='arrow_left'>Назад к проекту</ButtonText>}

            <Row padding='m' />

            {community && (
              <ServiceBlockGroup size='l'>
                <ServiceBlock white>
                  <CommunityInfo
                    image={community?.image}
                    name={community?.name}
                    url={community?.url}
                    size='heavy'
                    description={community?.description}
                  >
                    <ButtonTagGroup>
                      {ratingTags.map(tag => <ButtonTag to={`/app/rating/${router.query.socialType}/${countryTag?.tagID || 'all'}/${countryTag?.tagID !== tag.tagID ? tag.tagID : 'all'}`} key={tag.tagID} color='grey'>{tag.name}</ButtonTag>)}
                    </ButtonTagGroup>
                  </CommunityInfo>

                  <Row padding='xl' />

                  <InfoLabelGroup size='l' fourCols center bigDescription>
                    <InfoLabel
                      description='Количество подписчиков'
                      format='0.[0a]'
                      loading={isLoading}
                    >{community?.usersCount}</InfoLabel>
                    <InfoLabel
                      description='КУБ Score'
                      qualityScore={community?.qualityScore}
                      format='0%'
                      loading={isLoading}
                      blocked={!profileStore.isAvailableStatistics()}
                      onChangePlan={() => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan' }) : RouterUtil.replaceParams(router, { modal: 'registration' })}
                    >{community?.qualityScore}</InfoLabel>
                    {SocialDataUtil.hasViews(community?.socialType) && (
                      <InfoLabel
                        description='Просмотров на пост'
                        format='0.[0a]'
                        loading={isLoading}
                        blocked={!profileStore.isAvailableStatistics()}
                        onChangePlan={() => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan' }) : RouterUtil.replaceParams(router, { modal: 'registration' })}
                      >{community?.avgViews}</InfoLabel>
                    )}
                    {SocialDataUtil.hasInteractions(community?.socialType) && !SocialDataUtil.hasViews(community?.socialType) && (
                      <InfoLabel
                        description='Реакций на пост'
                        format='0.[0a]'
                        loading={isLoading}
                        blocked={!profileStore.isAvailableStatistics()}
                        onChangePlan={() => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan' }) : RouterUtil.replaceParams(router, { modal: 'registration' })}
                      >{community?.avgInteractions}</InfoLabel>)}
                    {SocialDataUtil.hasInteractions(community?.socialType) && !SocialDataUtil.hasViews(community?.socialType) && (
                      <InfoLabel
                        description='Вовлечённость (ER)'
                        format='0.00%'
                        loading={isLoading}
                        blocked={!profileStore.isAvailableStatistics()}
                        onChangePlan={() => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan' }) : RouterUtil.replaceParams(router, { modal: 'registration' })}
                      >{community?.avgER}</InfoLabel>)}
                    {SocialDataUtil.hasInteractions(community?.socialType) && SocialDataUtil.hasViews(community?.socialType) && (
                      <InfoLabel
                        description='Вовлечённость (ERV)'
                        format='0.00%'
                        loading={isLoading}
                        blocked={!profileStore.isAvailableStatistics()}
                        onChangePlan={() => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan' }) : RouterUtil.replaceParams(router, { modal: 'registration' })}
                      >{community?.avgER}</InfoLabel>)}
                  </InfoLabelGroup>
                </ServiceBlock>
              </ServiceBlockGroup>
            )}

            {!community && (
              <>
                <Row padding='xl'>
                  <Col size={10} center>
                    <Text size='m' semibold center>
                      <TextColor color='dark'>
                        {!profileStore.isAuth && 'Статистика аккаунта будет доступна после регистрации.'}
                      </TextColor>
                    </Text>
                  </Col>
                </Row>
                <Row padding='l'>
                  <Col size={10} center>
                    <ButtonTextGroup full size='s'>
                      {!profileStore.isAuth && (
                        <>
                          <ButtonText
                            size='l'
                            to='?modal=registration'
                          >Посмотреть статистику</ButtonText>
                        </>
                      )}
                    </ButtonTextGroup>
                  </Col>
                </Row>
              </>
            )}

            {community && !projectsCommunities.length && (
              <>
                <Row padding='xl'>
                  <Col size={10} center>
                    <ButtonTextGroup full size='s'>
                      {!profileStore.isAuth && (
                        <>
                          <ButtonText
                            size='l'
                            to='?modal=registration'
                          >Посмотреть всю статистику</ButtonText>

                          <ButtonText
                            secondary
                            size='l'
                            to='?modal=registration'
                          >Обновить статистику</ButtonText>
                        </>
                      )}
                      {profileStore.isAuth && (
                        <>
                          <ButtonText
                            size='l'
                            to={`https://prns.c-cube.ru/statistics?addCommunityType=my&addCommunity=true&addUrl=${community.url}&token=${profileStore.token}`}
                            _blank
                          >Добавить в проект</ButtonText>

                          <ButtonText
                            secondary
                            size='l'
                            to={`https://prns.c-cube.ru/statistics?addCommunityType=my&addCommunity=true&addUrl=${community.url}&token=${profileStore.token}`}
                            _blank
                          >Обновить статистику</ButtonText>
                        </>
                      )}
                    </ButtonTextGroup>
                  </Col>
                </Row>
                <Row padding='m'>
                  <Col size={10} center>
                    <Text size='m' semibold center>
                      <TextColor color='dark'>
                        {!profileStore.isAuth && 'После регистрации вы сможете увидеть гораздо больше данных по странице — лучшие посты, динамику лайков, комментариев и просмотров, а также сравнить показатели с конкурентами.'}
                        {profileStore.isAuth && 'Вы можете увидеть гораздо больше данных по странице — лучшие посты, динамику лайков, комментариев и просмотров, а также сравнить показатели с конкурентами.'}
                      </TextColor>
                    </Text>
                  </Col>
                  <Col size={10} center>
                    <Text size='xs' semibold center>
                      Статистика собрана {moment(community?.timeStatistics).format('DD.MM.YYYY HH:mm')}
                    </Text>
                  </Col>
                </Row>
              </>
            )}

            {!!projectsCommunities.length && (
              <>
                <Row padding='xl'>
                  <Col size={10} center>
                    <Text size='m' semibold center>
                      <TextColor color='dark'>
                        Страница добавлена в один или несколько ваших проектов.
                      </TextColor>
                    </Text>
                  </Col>
                </Row>
                <Row padding='l'>
                  <Col size={10} center>
                    <ButtonTextGroup full size='s'>
                      <Popup trigger={<ButtonText size='l'>Посмотреть всю статистику</ButtonText>}>
                        {projectsCommunities.map(projectCommunity => (
                          <>
                            {projectCommunity.communityType === CommunityType.MY && <PopupButton project to={`https://prns.c-cube.ru/?accountID=${projectCommunity.accountID}&type=${projectCommunity.socialType}&page=overview&token=${profileStore.token}`} image={accountsStore.getProject(projectCommunity.accountID)?.image}>{accountsStore.getProject(projectCommunity.accountID)?.name}</PopupButton>}
                            {projectCommunity.communityType === CommunityType.COMPETITOR && <PopupButton to={`https://prns.c-cube.ru/statistics?type=ONE&page=detail&accountID=${projectCommunity.accountID}&reportCommunityID=${projectCommunity.communityID}&token=${profileStore.token}`} image={accountsStore.getProject(projectCommunity.accountID)?.image}>{accountsStore.getProject(projectCommunity.accountID)?.name}</PopupButton>}
                            {projectCommunity.communityType === CommunityType.INFLUENCER && <PopupButton to={`https://prns.c-cube.ru/statistics?type=ONE&page=detail&accountID=${projectCommunity.accountID}&reportCommunityID=${projectCommunity.communityID}&token=${profileStore.token}`} image={accountsStore.getProject(projectCommunity.accountID)?.image}>{accountsStore.getProject(projectCommunity.accountID)?.name}</PopupButton>}
                          </>
                        ))}
                      </Popup>
                      <ButtonText size='l' onClick={() => RouterUtil.replaceParams(router, { modal: 'add-community', queryCommunity: community.url })} secondary>Добавить в другой проект</ButtonText>
                    </ButtonTextGroup>
                  </Col>
                </Row>
              </>
            )}

            <Row padding='xl' />

            {profileStore.isAvailableStatistics() && (
              <>
                <ServiceBlockGroup size='l'>
                  <ServiceBlock size={4} white grid>
                    <InfoLabelGroup center bigDescription oneCol>
                      <InfoLabel
                        description='Количество подписчиков'
                        value={statisticsStore.communityRetrospective?.summary?.current?.usersCount}
                        format='0.[0a]'
                        deltaValue={statisticsStore.communityRetrospective?.summary?.delta?.usersCount}
                        deltaValueFormat='0.[0a]'
                      />
                    </InfoLabelGroup>
                  </ServiceBlock>
                  {!!statisticsStore.communityRetrospective?.summary?.current?.deltaViews && (
                    <ServiceBlock size={4} white grid>
                      <InfoLabelGroup center bigDescription oneCol>
                        <InfoLabel
                          description='Просмотров'
                          value={statisticsStore.communityRetrospective?.summary?.current?.deltaViews}
                          format='0.[0a]'
                          deltaValue={statisticsStore.communityRetrospective?.summary?.delta?.deltaViews}
                          deltaValueFormat='0.[0a]'
                          blocked={!profileStore.isAvailableStatistics()}
                          onChangePlan={() => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan' }) : RouterUtil.replaceParams(router, { modal: 'registration' })}
                        />
                      </InfoLabelGroup>
                    </ServiceBlock>
                  )}
                  {!!statisticsStore.communityRetrospective?.summary?.current?.deltaInteractions && (
                    <ServiceBlock size={4} white grid>
                      <InfoLabelGroup center bigDescription oneCol>
                        <InfoLabel
                          description='Реакций'
                          value={statisticsStore.communityRetrospective?.summary?.current?.deltaInteractions}
                          format='0.[0a]'
                          deltaValue={statisticsStore.communityRetrospective?.summary?.delta?.deltaInteractions}
                          deltaValueFormat='0.[0a]'
                          blocked={!profileStore.isAvailableStatistics()}
                          onChangePlan={() => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan' }) : RouterUtil.replaceParams(router, { modal: 'registration' })}
                        />
                      </InfoLabelGroup>
                    </ServiceBlock>
                  )}
                </ServiceBlockGroup>

                <ServiceBlockGroup size='l'>
                  <ServiceBlock size={12} white grid>
                    <Title size='xs'>Количество подписчиков</Title>
                    <Row padding='s' />
                    <Text size='s'>На графике показано изменение количества подписчиков за последние 3 месяца и до 30 самых значимых постов.</Text>
                    <Row padding='l' />

                    <ContentChart
                      data={statisticsStore.communityRetrospective?.series?.current?.map(day => ({ date: moment(day.date).toDate(), value: day.usersCount }))}
                      posts={ArrayUtil.arrayObjectsSort('-indexGrade', statisticsStore.communityPosts).slice(0, 30).map(post => ({
                        id: post.postID,
                        date: moment(post.date).toDate(),
                        socialType: post.socialType,
                        grade: post.mainGrade,
                        indexGrade: post.indexGrade,
                        usersCount: post.usersCount,
                        postImage: post.postImage,
                        text: post.text,
                        interactions: post.interactions,
                        likes: post.likes,
                        comments: post.comments,
                        rePosts: post.rePosts,
                        views: post.views,
                        er: post.er
                      }))}
                      color='#F7B801'
                      metric='usersCount'
                      loading={isLoading}
                      height={350}
                      blocked={!profileStore.isAvailableStatistics()}
                      onChangePlan={() => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan' }) : RouterUtil.replaceParams(router, { modal: 'registration' })}
                    />
                  </ServiceBlock>
                </ServiceBlockGroup>

                <ServiceBlockGroup size='l'>
                  <ServiceBlock size={12} white grid>
                    <Title size='xs'>
                      Время активности аудитории
                    </Title>
                    <Row padding='s' />
                    <Text size='s'>Показаны данные за последние 3 месяца. Чем больше точка, тем активнее аудитория взаимодействует с контентом.</Text>
                    <Row padding='l' />

                    {/* todo: добавить график активности аудитории за месяц */}

                    <DowhChart
                      data={statisticsStore.communityActivity?.map(item => ({ time: item.time, value: item.views || item.interactions }))}
                      color='#2787F5'
                      metricName={SocialDataUtil.hasViews(community?.socialType) ? 'Просмотров' : 'Реакций'}
                      noDataStyle='graph'
                      noDataMessage={SocialDataUtil.hasViews(community?.socialType) ? 'Нет просмотров' : 'Нет реакций'}
                      noDataDescription={SocialDataUtil.hasViews(community?.socialType) ? 'В сообществе нет просмотров.' : 'В сообществе нет реакций.'}
                      height={300}
                      loading={isLoading}
                      blocked={!profileStore.isAvailableStatistics()}
                      onChangePlan={() => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan' }) : RouterUtil.replaceParams(router, { modal: 'registration' })}
                    />

                    {/*<ColumnChart
                  data={statisticsStore.getCommunityRetrospectiveGradesViews()
                    ?.map(item => ({ name: item.hour.toString(), value: item.value, tooltipTitles: ['просмотр', 'просмотра', 'просмотров'] }))
                  }
                  spline
                  format='0,0'
                  color='#FF0000'
                  height={350}
                  loading={isLoading}
                />

                <DowhChart
                    data={statisticsStore.communityActivityPrediction?.map(item => ({ time: item.time, value: item.views || item.interactions }))}
                    color='#FF0000'
                    metricName={SocialDataUtil.hasViews(community?.socialType) ? 'Просмотров' : 'Реакций'}
                    noDataStyle='graph'
                    noDataMessage={SocialDataUtil.hasViews(community?.socialType) ? 'Нет просмотров' : 'Нет реакций'}
                    noDataDescription={SocialDataUtil.hasViews(community?.socialType) ? 'В сообществе нет просмотров.' : 'В сообществе нет реакций.'}
                    height={300}
                    loading={isLoading}
                />*/}

                  </ServiceBlock>
                </ServiceBlockGroup>

                {/*<ServiceBlockGroup size='l'>*/}
                {/*  <ServiceBlock size={6} white grid>*/}
                {/*    <InfoLabelGroup center bigDescription oneCol>*/}
                {/*      <InfoLabel description='Самое активное время' value='с 17 до 21' />*/}
                {/*    </InfoLabelGroup>*/}
                {/*  </ServiceBlock>*/}
                {/*  <ServiceBlock size={6} white grid>*/}
                {/*    <InfoLabelGroup center bigDescription oneCol>*/}
                {/*      <InfoLabel description='Самый активный день' value='Вторник' />*/}
                {/*    </InfoLabelGroup>*/}
                {/*  </ServiceBlock>*/}
                {/*</ServiceBlockGroup>*/}

                {SocialDataUtil.hasInteractions(community?.socialType) && (
                  <ServiceBlockGroup size='l'>
                    <ServiceBlock size={12} white grid>
                      <Title size='xs'>
                        Количество реакций
                      </Title>
                      <Row padding='s' />
                      <Text size='s'>На графике показана сумма всех реакций пользователей.</Text>
                      <Row padding='l' />

                      <LineChart
                        data={statisticsStore.communityRetrospective?.series?.current?.map(day => ({ date: day.date, value: day.deltaInteractions }))}
                        format='0,0'
                        color='#FF8E51'
                        height={350}
                        loading={isLoading}
                        blocked={!profileStore.isAvailableStatistics()}
                        onChangePlan={() => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan' }) : RouterUtil.replaceParams(router, { modal: 'registration' })}
                      />
                    </ServiceBlock>
                  </ServiceBlockGroup>
                )}

                <ServiceBlockGroup size='l'>
                  {!!statisticsStore.communityRetrospective?.summary?.current?.deltaLikes && (
                    <ServiceBlock size={4} white grid>
                      <InfoLabelGroup center bigDescription oneCol>
                        <InfoLabel
                          description='Лайки'
                          value={statisticsStore.communityRetrospective?.summary?.current?.deltaLikes}
                          format='0.[0a]'
                          deltaValue={statisticsStore.communityRetrospective?.summary?.delta?.deltaLikes}
                          deltaValueFormat='0.[0a]'
                          blocked={!profileStore.isAvailableStatistics()}
                          onChangePlan={() => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan' }) : RouterUtil.replaceParams(router, { modal: 'registration' })}
                        />
                      </InfoLabelGroup>
                    </ServiceBlock>
                  )}
                  {!!statisticsStore.communityRetrospective?.summary?.current?.deltaComments && (
                    <ServiceBlock size={4} white grid>
                      <InfoLabelGroup center bigDescription oneCol>
                        <InfoLabel
                          description='Комментарии'
                          value={statisticsStore.communityRetrospective?.summary?.current?.deltaComments}
                          format='0.[0a]'
                          deltaValue={statisticsStore.communityRetrospective?.summary?.delta?.deltaComments}
                          deltaValueFormat='0.[0a]'
                          blocked={!profileStore.isAvailableStatistics()}
                          onChangePlan={() => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan' }) : RouterUtil.replaceParams(router, { modal: 'registration' })}
                        />
                      </InfoLabelGroup>
                    </ServiceBlock>
                  )}
                  {!!statisticsStore.communityRetrospective?.summary?.current?.deltaRePosts && (
                    <ServiceBlock size={4} white grid>
                      <InfoLabelGroup center bigDescription oneCol>
                        <InfoLabel
                          description='Репосты'
                          value={statisticsStore.communityRetrospective?.summary?.current?.deltaRePosts}
                          format='0.[0a]'
                          deltaValue={statisticsStore.communityRetrospective?.summary?.delta?.deltaRePosts}
                          deltaValueFormat='0.[0a]'
                          blocked={!profileStore.isAvailableStatistics()}
                          onChangePlan={() => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan' }) : RouterUtil.replaceParams(router, { modal: 'registration' })}
                        />
                      </InfoLabelGroup>
                    </ServiceBlock>
                  )}
                </ServiceBlockGroup>

                {SocialDataUtil.hasViews(community?.socialType) && (
                  <>
                    <ServiceBlockGroup size='l'>
                      <ServiceBlock size={12} white grid>
                        <Title size='xs'>
                          Количество просмотров
                        </Title>
                        <Row padding='s' />
                        <Text size='s'>На графике показана общие просмотры контента пользователями по дням.</Text>
                        <Row padding='l' />

                        <LineChart
                          data={statisticsStore.communityRetrospective?.series?.current?.map(day => ({ date: day.date, value: day.deltaViews }))}
                          format='0,0'
                          column
                          color='#F8CE00'
                          height={350}
                          loading={isLoading}
                          blocked={!profileStore.isAvailableStatistics()}
                          onChangePlan={() => profileStore.isAuth ? RouterUtil.replaceParams(router, { modal: 'change-plan' }) : RouterUtil.replaceParams(router, { modal: 'registration' })}
                        />
                      </ServiceBlock>
                    </ServiceBlockGroup>
                  </>
                )}

                {!!statisticsStore.communityPostsHashTags?.length && (
                  <>
                    <ServiceBlockGroup size='l'>
                      <ServiceBlock size={12} white grid>
                        <Title size='xs'>
                          Эффективность хэштегов
                        </Title>
                        <Row padding='s' />
                        <Text size='s'>Хэштеги, которые оказались самыми эффективными на этой странице.</Text>
                        <Row padding='l' />

                        <ButtonTagGroup>
                          {statisticsStore.communityPostsHashTags.map(tag => (
                            <Tooltip
                              trigger={<ButtonTag indexGrade={tag.grade} color='grey' count={tag.count}>#{tag.name}</ButtonTag>}
                              key={tag.name}
                              title={`#${tag.name}`}
                              text={
                                <>
                                  {tag.grade > 0 && `Посты с этим хэштегом в ${NumeralUtil.format(Math.abs(tag.grade), '0.[0]', ['раз', 'раза', 'раз'])} лучше других постов на странице.`}
                                  {tag.grade < 0 && `Посты с этим хэштегом в ${NumeralUtil.format(Math.abs(tag.grade), '0.[0]', ['раз', 'раза', 'раз'])} хуже других постов на странице.`}
                                </>
                              }
                              description={`Всего за 3 месяца ${NumeralUtil.declination(Math.abs(tag.count),['был', 'было', 'было'])} ${NumeralUtil.format(Math.abs(tag.count), '0,0', ['пост', 'поста', 'постов'])}`}
                            >
                            </Tooltip>
                          ))}
                        </ButtonTagGroup>
                      </ServiceBlock>
                    </ServiceBlockGroup>
                  </>
                )}

                {!isLoading && !!statisticsStore.communityPosts.length && (
                  <>
                    <Row padding='xxl'>
                      <Col size={10} center>
                        <Title size='m'>
                          Обзор постов
                        </Title>
                      </Col>
                    </Row>
                    <Row padding='m'>
                      <Col size={10} center>
                        <Text size='m' semibold><TextColor color='grey'>
                          Посмотрите на последние посты этой страницы. Так вы сможете понять, какой контент публикуется и работает лучше всего.
                        </TextColor></Text>
                      </Col>
                    </Row>

                    <Row padding='xl' />

                    <ServiceBlockGroup size='l' stackGrid>
                      {/* todo: Добавить пагинацию */}
                      {statisticsStore.communityPosts.slice(0, 30).map(post => (
                        <ServiceBlock white key={post.postID} grid>
                          <InfoLabelGroup size='s' center twoCol small>
                            {SocialDataUtil.hasViews(community?.socialType) && <InfoLabel description='Просмотры' format='0.[0a]'>{post?.views}</InfoLabel>}
                            {SocialDataUtil.hasInteractions(community?.socialType) && !SocialDataUtil.hasViews(community?.socialType) && <InfoLabel description='Сумма реакций' format='0.[0a]'>{post?.interactions}</InfoLabel>}
                            <InfoLabel description='Вовлечённость (ER)' format='0.00%'>{post?.er}</InfoLabel>
                          </InfoLabelGroup>
                          <Row padding='m' />
                          {post.postImage && <Image src={post.postImage} border full />}
                          <Row padding='s' />
                          <Text size='s'><TextColor color='dark' maxLines={5}>
                            {post.text}
                          </TextColor></Text>
                          <Row padding='m' />
                          <ButtonTagGroup size='s'>
                            {/*<ButtonTag color='orange' size='s' icon='advertising'>Реклама</ButtonTag>*/}
                            {post.hashTags.map(hashTag => <ButtonTag color='grey' size='s' key={hashTag}>#{hashTag}</ButtonTag>)}
                          </ButtonTagGroup>
                          <Row padding='m' />
                          <Link to={post.postUrl} newTab><Text size='xs'><TextColor color='grey'>
                            Опубликовано {DateUtil.format(post.date, 'LLL')}
                          </TextColor></Text>
                          </Link>
                        </ServiceBlock>
                      ))}
                    </ServiceBlockGroup>
                  </>
                )}

                {/*<Row padding='xxl'>*/}
                {/*  <Col size={10} center>*/}
                {/*    <Title size='m'>Похожие страницы</Title>*/}
                {/*  </Col>*/}
                {/*</Row>*/}
                {/*<Row padding='m'>*/}
                {/*  <Col size={10} center>*/}
                {/*    <Text size='m' semibold >*/}
                {/*      Мы подобрали несколько похожих страниц.*/}
                {/*      Возможно они будут интересны для вас, рекомендуем изучить их или добавить в любой из наших сервисов для конкурентного анализа.*/}
                {/*    </Text>*/}
                {/*  </Col>*/}
                {/*</Row>*/}

                {/*<Row padding='xl' />*/}

                {/*<ServiceBlockGroup size='l' slider4>*/}
                {/*  {community?.similar.map(item =>*/}
                {/*    <ServiceBlock size={4} slide white to={`/search/${router.query.socialType}/none/${item.cid}`} _blank key={item.cid}>*/}
                {/*      <SimilarPage*/}
                {/*        image={item.image}*/}
                {/*        title={item.name}*/}
                {/*        number={NumeralUtil.format(item.usersCount, '0.[0a]')}*/}
                {/*      />*/}
                {/*    </ServiceBlock>*/}
                {/*  )}*/}
                {/*</ServiceBlockGroup>*/}
              </>
            )}

            {!profileStore.isAvailableStatistics() && (
              <>
                <BlockGroup size='s'>
                  <Block
                    size={12}
                    image='/images/statistics_feature_social_networks.png'
                    // rightImage
                    white
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
                    </ButtonTextGroup>
                  </Block>
                </BlockGroup>

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
                    white
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
                    white
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
                    white
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
                    white
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
                    white
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
                    white
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
                    white
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
                    white
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
                    white
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
                    white
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
                    white
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
                    white
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
                    white
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
                    white
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
                    white
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
                    white
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
                    white
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
                    white
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
                    white
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
                    </ButtonTextGroup>
                  </Block>
                </BlockGroup>
              </>
            )}
          </Container>
        </Segment>

        <Row padding='xxl' />
        <Row padding='xxl' />

        <Footer disableSupport />
      </Page>)
  }
}
