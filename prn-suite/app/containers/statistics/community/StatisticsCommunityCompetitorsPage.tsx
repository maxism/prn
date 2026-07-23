import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { IStatisticsParams } from '../../../interfaces/IParams'
import CommunitiesStore from '../../../stores/CommunitiesStore'
import { Stores } from '../../../stores/RootStore'
import StatisticsSummaryStore from '../../../stores/StatisticsSummaryStore'
import Segment from '../../../ui/elements/Segment/Segment'
import RadarChart from '../../../ui/views/statistics/widgets/RadarChart/RadarChart'
import ObjectUtil from '../../../utils/ObjectUtil'
import ScoreRecommendationUtil from '../../../utils/ScoreRecommendationUtil'
import withParams, { ParamsProps } from '../../../utils/withParams'
import Title from '../../../ui/elements/Title/Title'
import Description from '../../../ui/elements/Description/Description'
import MetricGroup from '../../../ui/elements/Metric/MetricGroup'
import CommunityScore from '../../../ui/elements/CommunityScore/CommunityScore'
import CommunityMetric from '../../../ui/elements/CommunityMetric/CommunityMetric'
import CommunitiesPicker, { ICommunityPicker } from '../../../ui/modules/CommunitiesPicker/CommunitiesPicker'
import Community from '../../../ui/elements/Community/Community'
import Toolbar2 from '../../../ui/elements/Toolbar2/Toolbar2'
import Toolbar2Group from '../../../ui/elements/Toolbar2/Toolbar2Group'
import NoData from '../../../ui/elements/NoData/NoData'
import CommunityType from '../../../types/CommunityType'
import { Helmet } from 'react-helmet'
import ProfileStore from '../../../stores/ProfileStore'

interface IProps {
  params?: ParamsProps<IStatisticsParams>
  profileStore?: ProfileStore
  communitiesStore?: CommunitiesStore
  statisticsSummaryStore?: StatisticsSummaryStore
}

@withParams
@inject(Stores.PROFILE_STORE, Stores.COMMUNITIES_STORE, Stores.STATISTICS_SUMMARY_STORE)
@observer
class StatisticsCommunityCompetitorsPage extends Component<IProps> {
  handleChangeCommunitiesIDs = (communitiesIDs: Array<string>) => {
    // console.log('communitiesIDs:: ', communitiesIDs)

    this.props.params.changeParams({ competitorsIDs: communitiesIDs })
  }

  render (): JSX.Element {
    const { params, profileStore, communitiesStore, statisticsSummaryStore } = this.props

    const myCommunity = communitiesStore.getMyCommunityBySocialType(params.type)
    const competitorCommunity = communitiesStore.getCommunityByCommunityID(params.competitorsIDs && params.competitorsIDs[0])

    const myStatistics = statisticsSummaryStore.getStatisticsByCommunityID(myCommunity?.communityID)
    const competitorStatistics = statisticsSummaryStore.getStatisticsByCommunityID(params.competitorsIDs && params.competitorsIDs[0])
    const avgCompetitorStatistics = statisticsSummaryStore.getCompetitorsStatistics()

    const myMetrics: any = [
      { name: 'Подписчики', score: myStatistics?.score?.usersCount, value: myStatistics?.current?.usersCount },
      { name: 'Прирост подписчиков', score: myStatistics?.score?.deltaUsersCount, value: myStatistics?.current?.deltaUsersCount },
      { name: 'Постов', score: myStatistics?.score?.deltaPosts, value: myStatistics?.current?.deltaPosts }
    ]
    const competitorMetrics: any = [
      { name: 'Подписчики', score: competitorStatistics?.score?.usersCount, value: competitorStatistics?.current?.usersCount },
      { name: 'Прирост подписчиков', score: competitorStatistics?.score?.deltaUsersCount, value: competitorStatistics?.current?.deltaUsersCount },
      { name: 'Постов', score: competitorStatistics?.score?.deltaPosts, value: competitorStatistics?.current?.deltaPosts }
    ]
    const avgCompetitorMetrics: any = [
      { name: 'Подписчики', score: avgCompetitorStatistics?.avgScore?.usersCount, value: avgCompetitorStatistics?.avgCurrent?.usersCount },
      { name: 'Прирост подписчиков', score: avgCompetitorStatistics?.avgScore?.deltaUsersCount, value: avgCompetitorStatistics?.avgCurrent?.deltaUsersCount },
      { name: 'Постов', score: avgCompetitorStatistics?.avgScore?.deltaPosts, value: avgCompetitorStatistics?.avgCurrent?.deltaPosts }
    ]

    if (myStatistics?.current?.deltaInteractions !== null) {
      myMetrics.push({ name: 'Реакции', score: myStatistics?.score?.deltaInteractions, value: myStatistics?.current?.deltaInteractions })
      competitorMetrics.push({ name: 'Реакции', score: competitorStatistics?.score?.deltaInteractions, value: competitorStatistics?.current?.deltaInteractions })
      avgCompetitorMetrics.push({ name: 'Реакции', score: avgCompetitorStatistics?.avgScore?.deltaInteractions, value: avgCompetitorStatistics?.avgCurrent?.deltaInteractions })
    }

    if (myStatistics?.current?.deltaLikes !== null) {
      myMetrics.push({ name: 'Лайки', score: myStatistics?.score?.deltaLikes, value: myStatistics?.current?.deltaLikes })
      competitorMetrics.push({ name: 'Лайки', score: competitorStatistics?.score?.deltaLikes, value: competitorStatistics?.current?.deltaLikes })
      avgCompetitorMetrics.push({ name: 'Лайки', score: avgCompetitorStatistics?.avgScore?.deltaLikes, value: avgCompetitorStatistics?.avgCurrent?.deltaLikes })
    }

    if (myStatistics?.current?.deltaRePosts !== null) {
      myMetrics.push({ name: 'Репосты', score: myStatistics?.score?.deltaRePosts, value: myStatistics?.current?.deltaRePosts })
      competitorMetrics.push({ name: 'Репосты', score: competitorStatistics?.score?.deltaRePosts, value: competitorStatistics?.current?.deltaRePosts })
      avgCompetitorMetrics.push({ name: 'Репосты', score: avgCompetitorStatistics?.avgScore?.deltaRePosts, value: avgCompetitorStatistics?.avgCurrent?.deltaRePosts })
    }

    if (myStatistics?.current?.deltaComments !== null) {
      myMetrics.push({ name: 'Комментарии', score: myStatistics?.score?.deltaComments, value: myStatistics?.current?.deltaComments })
      competitorMetrics.push({ name: 'Комментарии', score: competitorStatistics?.score?.deltaComments, value: competitorStatistics?.current?.deltaComments })
      avgCompetitorMetrics.push({ name: 'Комментарии', score: avgCompetitorStatistics?.avgScore?.deltaComments, value: avgCompetitorStatistics?.avgCurrent?.deltaComments })
    }

    if (myStatistics?.current?.er !== null) {
      myMetrics.push({ name: 'Вовлеченность', score: myStatistics?.score?.er, value: myStatistics?.current?.er, formatValue: '0.00%' })
      competitorMetrics.push({ name: 'Вовлеченность', score: competitorStatistics?.score?.er, value: competitorStatistics?.current?.er, formatValue: '0.00%' })
      avgCompetitorMetrics.push({ name: 'Вовлеченность', score: avgCompetitorStatistics?.avgScore?.er, value: avgCompetitorStatistics?.avgCurrent?.er, formatValue: '0.00%' })
    }

    if (myStatistics?.current?.deltaViews !== null) {
      myMetrics.push({ name: 'Просмотры', score: myStatistics?.score?.deltaViews, value: myStatistics?.current?.deltaViews })
      competitorMetrics.push({ name: 'Просмотры', score: competitorStatistics?.score?.deltaViews, value: competitorStatistics?.current?.deltaViews })
      avgCompetitorMetrics.push({ name: 'Просмотры', score: avgCompetitorStatistics?.avgScore?.deltaViews, value: avgCompetitorStatistics?.avgCurrent?.deltaViews })
    }

    const scoreRecommendation = new ScoreRecommendationUtil(statisticsSummaryStore.statistics.series.map(serie => serie.score))
    const myScoreRecommendation = scoreRecommendation.getMyRecommendation(myStatistics?.score)
    const competitorScoreRecommendation = scoreRecommendation.getCompetitorRecommendation(myStatistics?.score, competitorStatistics?.score)

    const comparison: Array<any> = [{
      name: myCommunity?.name,
      color: '#2787F5',
      metrics: myMetrics
    }, {
      name: competitorCommunity?.name,
      color: '#FF9F00',
      metrics: competitorMetrics
    }, {
      name: 'Среднее по конкурентам',
      color: '#e6e6e6',
      metrics: avgCompetitorMetrics,
      avg: true
    }]

    const competitorCommunities: Array<ICommunityPicker> = communitiesStore.getCompetitorsCommunitiesBySocialType(params.type).filter(item => item.isPaid).map(item => ({
      communityID: item.communityID,
      image: item.image,
      name: item.name,
      url: item.url,
      checked: (params.competitorsIDs || []).includes(item.communityID)
    }))

    if (!competitorCommunities.length) {
      return (
        <Segment size={3}>
          <NoData
            style='advanced'
            size={400}
            message='Нужно добавить конкурентов'
            description='Здесь пусто — потому что вы ещё не добавили ни одной страницы конкурентов. Тут можно будет сравнивать страницы между собой, чтобы понять у кого показатели лучше и посмотреть свой КУБ Score.'
            buttonLabel='Добавить конкурентов'
            buttonOnClick={() => params.changeParams({ addCommunity: true, addCommunityType: CommunityType.COMPETITOR })}
          />
        </Segment>
      )
    }

    return (
      <Segment size={5}>
        {/*@ts-ignore*/}
        <Helmet>
          <title>Статистика, Конкуренты — КУБ Suite</title>
        </Helmet>

        <Title text='Сравнение со страницами конкурентов'>
          {/*<ButtonText icon='download'>Сохранить</ButtonText>*/}
        </Title>
        <Segment size={3} />
        <Description size='big'>
          Здесь вы можете сравнить свои показатели с показателями страниц конкурентов. Так вы найдёте свои слабые и сильные стороны. Это поможет скорректировать маркетинговую стратегию и контент-план.
        </Description>

        <Segment size={5}>
          <Toolbar2 size='big' sticky stickyOffset={6}>
            <Toolbar2Group fill>
              <Community
                small
                disabled
                name={myCommunity.name}
                image={myCommunity.image}
                url={myCommunity.url}
              />
            </Toolbar2Group>
            <Toolbar2Group>
              <CommunitiesPicker
                communities={competitorCommunities}
                onChangeCommunitiesIDs={(communitiesIDs) => this.handleChangeCommunitiesIDs(communitiesIDs)}
                onAdd={() => params.changeParams({ addCommunity: true, addCommunityType: 'competitor' })}
                onCommunityOptions={(communityID) => params.changeParams({ communityID })}
              />
            </Toolbar2Group>
          </Toolbar2>

          {!!communitiesStore.getCompetitorsCommunitiesBySocialType(params.type).filter(item => !item.isPaid)?.length && (
            <Segment size={3}>
              <NoData
                style='advanced'
                size={400}
                message='Вы достигли лимита конкурентов в проекте'
                description='По некоторым конкурентам статистика скрыта. Для снятия ограничения — нужно перейти на другой тариф.'
                buttonLabel='На страницу оплаты'
                buttonOnClick={() => params.changeParams({ premium: 'true' })}
              />
            </Segment>
          )}

          {competitorCommunity?.communityStatus === 'COLLECTING' && (
            <Segment size={3}>
              <NoData
                loading
                style='graph'
                size={400}
                message='Собираем данные по странице'
                description='Подождите несколько минут — мы собираем начальные данные по странице конкурента. Обычно всё происходит достаточно быстро.'
              />
            </Segment>
          )}

          {competitorCommunity?.communityStatus !== 'COLLECTING' && (
            <>
              <Segment size={3}>
                <MetricGroup>
                  <CommunityScore score={myStatistics?.score?.total} name={myScoreRecommendation.name} description={myScoreRecommendation.description} />
                  <CommunityScore score={competitorStatistics?.score?.total} name={competitorScoreRecommendation.name} description={competitorScoreRecommendation.description} />
                </MetricGroup>
              </Segment>

              <Segment size={3}>
                <RadarChart data={comparison}/>
              </Segment>

              <Segment size={0}>
                {!ObjectUtil.isNullOrUndefined([ myStatistics?.score?.usersCount, competitorStatistics?.score?.usersCount ]) && (
                  <>
                    <Segment size={10} />
                    <Title size='middle'>Подписчики</Title>
                    <Segment size={2} />
                    <Description>
                      Количество подписчиков косвенно показывает насколько ваша доля рынка больше или меньше по сравнению со страницами конкурентов.
                    </Description>
                    <Segment size={3} />
                    <MetricGroup>
                      <CommunityMetric
                        score={myStatistics.score.usersCount}
                        value={myStatistics.current.usersCount}
                        deltaValue={myStatistics.delta.usersCount}
                        best={myStatistics.score.usersCount >= competitorStatistics.score.usersCount}
                      />
                      <CommunityMetric
                        score={competitorStatistics.score.usersCount}
                        value={competitorStatistics.current.usersCount}
                        deltaValue={competitorStatistics.delta.usersCount}
                        right
                        best={myStatistics.score.usersCount <= competitorStatistics.score.usersCount}
                      />
                    </MetricGroup>
                  </>
                )}
                {!ObjectUtil.isNullOrUndefined([ myStatistics?.score?.deltaUsersCount, competitorStatistics?.score?.deltaUsersCount ]) && (
                  <>
                    <Segment size={10} />
                    <Title size='middle'>Прирост подписчиков</Title>
                    <Segment size={2} />
                    <Description>
                      Эта метрика показывает рост аудитории на странице. Чем активнее прибывают подписчики, тем лучше работает реклама и маркетинг.
                    </Description>
                    <Segment size={3} />
                    <MetricGroup>
                      <CommunityMetric
                        score={myStatistics.score.deltaUsersCount}
                        value={myStatistics.current.deltaUsersCount}
                        deltaValue={myStatistics.delta.deltaUsersCount}
                        best={myStatistics.score.deltaUsersCount >= competitorStatistics.score.deltaUsersCount}
                      />
                      <CommunityMetric
                        score={competitorStatistics.score.deltaUsersCount}
                        value={competitorStatistics.current.deltaUsersCount}
                        deltaValue={competitorStatistics.delta.deltaUsersCount}
                        right
                        best={myStatistics.score.deltaUsersCount <= competitorStatistics.score.deltaUsersCount}
                      />
                    </MetricGroup>
                  </>
                )}
                {!ObjectUtil.isNullOrUndefined([ myStatistics?.score?.deltaInteractions, competitorStatistics?.score?.deltaInteractions ]) && (
                  <>
                    <Segment size={10} />
                    <Title size='middle'>Реакции</Title>
                    <Segment size={2} />
                    <Description>
                      Суммарное количество всех реакций — важный показатель активности аудитории. Чем лояльнее аудитория, тем эффективнее работа с подписчиками и сама страница в целом.
                    </Description>
                    <Segment size={3} />
                    <MetricGroup>
                      <CommunityMetric
                        score={myStatistics.score.deltaInteractions}
                        value={myStatistics.current.deltaInteractions}
                        deltaValue={myStatistics.delta.deltaInteractions}
                        best={myStatistics.score.deltaInteractions >= competitorStatistics.score.deltaInteractions}
                      />
                      <CommunityMetric
                        score={competitorStatistics.score.deltaInteractions}
                        value={competitorStatistics.current.deltaInteractions}
                        deltaValue={competitorStatistics.delta.deltaInteractions}
                        right
                        best={myStatistics.score.deltaInteractions <= competitorStatistics.score.deltaInteractions}
                      />
                    </MetricGroup>
                  </>
                )}
                {!ObjectUtil.isNullOrUndefined([ myStatistics?.score?.deltaLikes, competitorStatistics?.score?.deltaLikes ]) && (
                  <>
                    <Segment size={10} />
                    <Title size='middle'>Лайки</Title>
                    <Segment size={2} />
                    <Description>
                      Количество лайков показывает степень одобрения контента у аудитории. Высокие значения говорят о том, что пользователи ценят контент и он им интересен.
                    </Description>
                    <Segment size={3} />
                    <MetricGroup>
                      <CommunityMetric
                        score={myStatistics.score.deltaLikes}
                        value={myStatistics.current.deltaLikes}
                        deltaValue={myStatistics.delta.deltaLikes}
                        best={myStatistics.score.deltaLikes >= competitorStatistics.score.deltaLikes}
                      />
                      <CommunityMetric
                        score={competitorStatistics.score.deltaLikes}
                        value={competitorStatistics.current.deltaLikes}
                        deltaValue={competitorStatistics.delta.deltaLikes}
                        right
                        best={myStatistics.score.deltaLikes <= competitorStatistics.score.deltaLikes}
                      />
                    </MetricGroup>
                  </>
                )}
                {!ObjectUtil.isNullOrUndefined([ myStatistics?.score?.deltaComments, competitorStatistics?.score?.deltaComments ]) && (
                  <>
                    <Segment size={10} />
                    <Title size='middle'>Комментарии</Title>
                    <Segment size={2} />
                    <Description>
                      Этот показатель даёт представление о том, насколько пользователи хотят участвовать в жизни бренда. По количеству комментариев можно оценить эффективность работы с аудиторией и маркетинговой составляющей стратегии.
                    </Description>
                    <Segment size={3} />
                    <MetricGroup>
                      <CommunityMetric
                        score={myStatistics.score.deltaComments}
                        value={myStatistics.current.deltaComments}
                        deltaValue={myStatistics.delta.deltaComments}
                        best={myStatistics.score.deltaComments >= competitorStatistics.score.deltaComments}
                      />
                      <CommunityMetric
                        score={competitorStatistics.score.deltaComments}
                        value={competitorStatistics.current.deltaComments}
                        deltaValue={competitorStatistics.delta.deltaComments}
                        right
                        best={myStatistics.score.deltaComments <= competitorStatistics.score.deltaComments}
                      />
                    </MetricGroup>
                  </>
                )}
                {!ObjectUtil.isNullOrUndefined([ myStatistics?.score?.deltaRePosts, competitorStatistics?.score?.deltaRePosts ]) && (
                  <>
                    <Segment size={10} />
                    <Title size='middle'>Репосты</Title>
                    <Segment size={2} />
                    <Description>
                      Эта метрика отвечает за степень распространения. Чем она выше, тем больше пользователей хочет ассоциировать себя с брендом и делиться контентом.
                    </Description>
                    <Segment size={3} />
                    <MetricGroup>
                      <CommunityMetric
                        score={myStatistics.score.deltaRePosts}
                        value={myStatistics.current.deltaRePosts}
                        deltaValue={myStatistics.delta.deltaRePosts}
                        best={myStatistics.score.deltaRePosts >= competitorStatistics.score.deltaRePosts}
                      />
                      <CommunityMetric
                        score={competitorStatistics.score.deltaRePosts}
                        value={competitorStatistics.current.deltaRePosts}
                        deltaValue={competitorStatistics.delta.deltaRePosts}
                        right
                        best={myStatistics.score.deltaRePosts <= competitorStatistics.score.deltaRePosts}
                      />
                    </MetricGroup>
                  </>
                )}
                {!ObjectUtil.isNullOrUndefined([ myStatistics?.score?.deltaPosts, competitorStatistics?.score?.deltaPosts ]) && (
                  <>
                    <Segment size={10} />
                    <Title size='middle'>Количество постов</Title>
                    <Segment size={2} />
                    <Description>
                      Объем контента в сочетании с другими метриками поможет узнать, насколько хорошо работает контент-стратегия бренда.
                    </Description>
                    <Segment size={3} />
                    <MetricGroup>
                      <CommunityMetric
                        score={myStatistics.score.deltaPosts}
                        value={myStatistics.current.deltaPosts}
                        deltaValue={myStatistics.delta.deltaPosts}
                        best={myStatistics.score.deltaPosts >= competitorStatistics.score.deltaPosts}
                      />
                      <CommunityMetric
                        score={competitorStatistics.score.deltaPosts}
                        value={competitorStatistics.current.deltaPosts}
                        deltaValue={competitorStatistics.delta.deltaPosts}
                        right
                        best={myStatistics.score.deltaPosts <= competitorStatistics.score.deltaPosts}
                      />
                    </MetricGroup>
                  </>
                )}
                {!ObjectUtil.isNullOrUndefined([ myStatistics?.score?.deltaViews, competitorStatistics?.score?.deltaViews ]) && (
                  <>
                    <Segment size={10} />
                    <Title size='middle'>Просмотры</Title>
                    <Segment size={2} />
                    <Description>
                      Анализируя количество просмотров, можно понять насколько популярен создаваемый контент и как хорошо он продвигается.
                    </Description>
                    <Segment size={3} />
                    <MetricGroup>
                      <CommunityMetric
                        score={myStatistics.score.deltaViews}
                        value={myStatistics.current.deltaViews}
                        deltaValue={myStatistics.delta.deltaViews}
                        best={myStatistics.score.deltaViews >= competitorStatistics.score.deltaViews}
                      />
                      <CommunityMetric
                        score={competitorStatistics.score.deltaViews}
                        value={competitorStatistics.current.deltaViews}
                        deltaValue={competitorStatistics.delta.deltaViews}
                        right
                        best={myStatistics.score.deltaViews <= competitorStatistics.score.deltaViews}
                      />
                    </MetricGroup>
                  </>
                )}
                {!ObjectUtil.isNullOrUndefined([ myStatistics?.score?.er, competitorStatistics?.score?.er ]) && (
                  <>
                    <Segment size={10} />
                    <Title size='middle'>Вовлеченность</Title>
                    <Segment size={2} />
                    <Description>
                      Важный показатель — мы видим процент активной аудитории и то, насколько контент страницы совпадает с ожиданиями подписчиков.
                    </Description>
                    <Segment size={3} />
                    <MetricGroup>
                      <CommunityMetric
                        score={myStatistics.score.er}
                        value={myStatistics.current.er}
                        deltaValue={myStatistics.delta.er}
                        format='0.00%'
                        best={myStatistics.score.er >= competitorStatistics.score.er}
                      />
                      <CommunityMetric
                        score={competitorStatistics.score.er}
                        value={competitorStatistics.current.er}
                        deltaValue={competitorStatistics.delta.er}
                        format='0.00%'
                        right
                        best={myStatistics.score.er <= competitorStatistics.score.er}
                      />
                    </MetricGroup>
                  </>
                )}
              </Segment>
            </>
          )}
        </Segment>

        <Segment size={10} />

      </Segment>
    )
  }
}

export default StatisticsCommunityCompetitorsPage
