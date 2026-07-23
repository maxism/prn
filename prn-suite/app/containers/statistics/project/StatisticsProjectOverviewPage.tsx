import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { IStatisticsParams } from '../../../interfaces/IParams'
import CommunitiesStore from '../../../stores/CommunitiesStore'
import PostsStore from '../../../stores/PostsStore'
import { Stores } from '../../../stores/RootStore'
import StatisticsStore from '../../../stores/StatisticsStore'
import StatisticsSummaryStore from '../../../stores/StatisticsSummaryStore'
import Description from '../../../ui/elements/Description/Description'
import Metric from '../../../ui/elements/Metric/Metric'
import MetricGroup from '../../../ui/elements/Metric/MetricGroup'
import Segment from '../../../ui/elements/Segment/Segment'
import Title from '../../../ui/elements/Title/Title'
import DateUtil from '../../../utils/DateUtil'
import ObjectUtil from '../../../utils/ObjectUtil'
import withParams, { ParamsProps } from '../../../utils/withParams'
import MetricsRow from '../../../ui/elements/MetricsRow/MetricsRow'
import ProjectOverview from '../../../ui/elements/ProjectOverview/ProjectOverview'
import MetricsRowGroup from '../../../ui/elements/MetricsRow/MetricsRowGroup'
import AccountsStore from '../../../stores/AccountsStore'
import Toolbar2 from '../../../ui/elements/Toolbar2/Toolbar2'
import TotalScoreRecommendationUtil from '../../../utils/TotalScoreRecommendationUtil'
import { Helmet } from 'react-helmet'
import CommunityType from '../../../types/CommunityType'
import ArrayUtil from '../../../utils/ArrayUtil'
import ProfileStore from '../../../stores/ProfileStore'
import NoData from '../../../ui/elements/NoData/NoData'

interface IProps {
  params?: ParamsProps<IStatisticsParams>
  profileStore?: ProfileStore
  accountsStore?: AccountsStore
  communitiesStore?: CommunitiesStore
  postsStore?: PostsStore
  statisticsStore?: StatisticsStore
  statisticsSummaryStore?: StatisticsSummaryStore
}

@withParams
@inject(Stores.PROFILE_STORE, Stores.ACCOUNTS_STORE, Stores.COMMUNITIES_STORE, Stores.STATISTICS_STORE, Stores.STATISTICS_SUMMARY_STORE, Stores.POSTS_STORE)
@observer
class StatisticsProjectOverviewPage extends Component<IProps> {
  render (): JSX.Element {
    const { params, profileStore, accountsStore, communitiesStore, statisticsStore, statisticsSummaryStore, postsStore } = this.props

    const myCommunities = communitiesStore.getMyCommunities()
    // const myStatisticsSummary = statisticsSummaryStore.getStatisticsByCommunityID(myCommunity?.communityID)

    const sortMap = {
      'usersCount': 'statistics.current.usersCount',
      '-usersCount': 'statistics.current.-usersCount',
      'interactions': 'statistics.current.deltaInteractions',
      '-interactions': 'statistics.current.-deltaInteractions',
      'er': 'statistics.current.er',
      '-er': 'statistics.current.-er',
      'views': 'statistics.current.deltaViews',
      '-views': 'statistics.current.-deltaViews',
      'posts': 'statistics.current.deltaPosts',
      '-posts': 'statistics.current.-deltaPosts',
      'score': 'statistics.score.total',
      '-score': 'statistics.score.-total'
    }

    const myCommunitiesWithStatistics = ArrayUtil.arrayObjectsSort(sortMap[params.tableSort], myCommunities.map(myCommunity => {
      return {
        ...myCommunity,
        statistics: statisticsSummaryStore.getStatisticsByCommunityID(myCommunity.communityID)
      }
    }))

    const mySummary = statisticsSummaryStore.statistics.summary.my

    // console.log(JSON.parse(JSON.stringify(myCommunitiesWithStatistics)))

    const totalScoreRecommendation = new TotalScoreRecommendationUtil(myCommunitiesWithStatistics.map(myCommunity => ({ socialType: myCommunity.socialType, totalScore: myCommunity.statistics?.score?.total })))
    const myTotalScoreRecommendation = totalScoreRecommendation.getMyTotalRecommendation()

    const period = DateUtil.period(params.from, params.to)

    if (!myCommunities.length) {
      return (
        <Segment size={3}>
          <NoData
            style='advanced'
            size={400}
            message='Нужно добавить свои страницы'
            description='Здесь пусто — потому что вы ещё не добавили ни одной своей страницы.'
            buttonLabel='Добавить страницы'
            buttonOnClick={() => params.changeParams({ addCommunity: true, addCommunityType: CommunityType.MY })}
          />
        </Segment>
      )
    }

    return (
      <Segment size={5}>
        {/*@ts-ignore*/}
        <Helmet>
          <title>Статистика проекта, Обзор своей статистики — КУБ Suite</title>
        </Helmet>

        <Title text='Общая эффективность проекта' />
        <Segment size={3} />
        <Description size='big'>
          Взгляните на общие данные по всем страницам проекта. Это поможет понять, какая страница нуждается в корректировке стратегии.
        </Description>

        <Segment size={5}>
          <ProjectOverview
            image={accountsStore.currentAccount.image}
            name={accountsStore.currentAccount.name}
            communities={myCommunities}
            score={myTotalScoreRecommendation.score}
            scoreName={myTotalScoreRecommendation.name}
            scoreDescription={myTotalScoreRecommendation.description}
            onSettings={() => params.changeUrl(`https://prn.c-cube.ru/settings/projects/${accountsStore.currentAccount?.accountID}/communities`, { token: profileStore.token })}
            onAdd={() => params.changeParams({ addCommunity: true, addCommunityType: CommunityType.COMPETITOR })}
          />
        </Segment>

        <Segment size={3}>
          <MetricsRowGroup>

            <Toolbar2 sticky stickyOffset={6} stickyPadding>
                <MetricsRow header sort={params.tableSort} onSort={e => params.changeParams({ tableSort: e.target.value })} />
            </Toolbar2>

            {myCommunitiesWithStatistics.map(myCommunity => (
              <MetricsRow
                key={myCommunity.communityID}
                competitors
                socialType={myCommunity.socialType}
                image={myCommunity.image}
                name={myCommunity.name}
                users={myCommunity.statistics?.current?.usersCount}
                usersDelta={myCommunity.statistics?.delta?.usersCount}
                interactions={myCommunity.statistics?.current?.deltaInteractions}
                interactionsDelta={myCommunity.statistics?.delta?.deltaInteractions}
                er={myCommunity.statistics?.current?.er}
                erDelta={myCommunity.statistics?.delta?.er}
                views={myCommunity.statistics?.current?.deltaViews}
                viewsDelta={myCommunity.statistics?.delta?.deltaViews}
                posts={myCommunity.statistics?.current?.deltaPosts}
                postsDelta={myCommunity.statistics?.delta?.deltaPosts}
                score={myCommunity.statistics?.score?.total}
                onClick={() => myCommunity.isPaid ? params.changeParams({ type: myCommunity.socialType, page: 'detail', hash: 'top' }) : params.changeParams({ premium: 'true' })}
                loading={myCommunity.communityStatus === 'COLLECTING'}
                isPaid={myCommunity.isPaid}
              />
            ))}
          </MetricsRowGroup>
        </Segment>

        <Segment size={10}>
          <Title text='Суммарные показатели проекта' />
          <Segment size={3} />
          <Description size='big'>
            Здесь показаны суммарные значения метрик по всем страницам проекта, чтобы с легкостью оценить общую работу бренда во всех социальны сетях.
          </Description>
        </Segment>

        <Segment size={3}>
          {!statisticsStore.isLoading && mySummary.current && (
            <MetricGroup>
              <Metric
                big
                title='Подписчики'
                value={mySummary.current.usersCount}
                deltaValue={mySummary.delta.usersCount}
                onClick={() => params.changeParams({ page: 'detail', hash: 'usersCount' })}
                tooltipTitle='Количество подписчиков'
                tooltipText='Общее количество подписчиков на странице и их изменение за выбранный период.'
              />
              {!ObjectUtil.isNullOrUndefined(mySummary.current.deltaInteractions) && (
                <Metric
                  big
                  title='Реакции'
                  value={mySummary.current.deltaInteractions}
                  deltaValue={mySummary.delta.deltaInteractions}
                  deltaPercent
                  onClick={() => params.changeParams({ page: 'detail', reactionMetric: 'interactions', hash: 'interactions' })}
                  tooltipTitle='Количество реакций'
                  tooltipText='Реакции — это сумма всех лайков, дизлайков, комментариев и репостов. Первая цифра показывает количество реакций за выбранный период. Вторая цифра показывает насколько больше или меньше было реакций в сравнении с предыдущим периодом.'
                  tooltipDescription={[`Выбранный период: ${period.currentDateFrom} – ${period.currentDateTo}`, `Предыдущий период: ${period.compareDateFrom} – ${period.compareDateTo}`]}
                />
              )}
              {!ObjectUtil.isNullOrUndefined(mySummary.current.er) && (
                <Metric
                  big
                  title='Вовлеченность'
                  value={mySummary.current.er}
                  deltaValue={mySummary.delta.er}
                  format='0.00%'
                  deltaPercent
                  onClick={() => params.changeParams({ page: 'detail', hash: 'er' })}
                  tooltipTitle='Вовлечённость на страницу (Page ER)'
                  tooltipText='Page ER — это процент подписчиков, которые совершают реакции на странице. Первая цифра показывает вовлечённость за выбранный период. Вторая — насколько изменилась вовлечённость в сравнении с предыдущим периодом.'
                  tooltipDescription={[`Выбранный период: ${period.currentDateFrom} – ${period.currentDateTo}`, `Предыдущий период: ${period.compareDateFrom} – ${period.compareDateTo}`]}
                />
              )}
              {!ObjectUtil.isNullOrUndefined(mySummary.current.deltaLikes) && (
                <Metric
                  big
                  title='Лайки'
                  value={mySummary.current.deltaLikes}
                  deltaValue={mySummary.delta.deltaLikes}
                  deltaPercent
                  onClick={() => params.changeParams({ page: 'detail', reactionMetric: 'likes', hash: 'interactions' })}
                  tooltipTitle='Количество лайков'
                  tooltipText='Первая цифра показывает количество лайков, которое было поставлено постам за выбранный период. Вторая — насколько больше или меньше было поставлено лайков в сравнении с предыдущим периодом.'
                  tooltipDescription={[`Выбранный период: ${period.currentDateFrom} – ${period.currentDateTo}`, `Предыдущий период: ${period.compareDateFrom} – ${period.compareDateTo}`]}
                />
              )}
              {!ObjectUtil.isNullOrUndefined(mySummary.current.deltaDislikes) && (
                <Metric
                  big
                  title='Дизлайки'
                  value={mySummary.current.deltaDislikes}
                  deltaValue={mySummary.delta.deltaDislikes}
                  deltaPercent
                  onClick={() => params.changeParams({ page: 'detail', reactionMetric: 'dislikes', hash: 'interactions' })}
                  tooltipTitle='Количество дизлайков'
                  tooltipText='Первая цифра показывает количество дизлайков, которое было поставлено постам за выбранный период. Вторая — насколько больше или меньше было поставлено дизлайков в сравнении с предыдущим периодом.'
                  tooltipDescription={[`Выбранный период: ${period.currentDateFrom} – ${period.currentDateTo}`, `Предыдущий период: ${period.compareDateFrom} – ${period.compareDateTo}`]}
                />
              )}
              {!ObjectUtil.isNullOrUndefined(mySummary.current.deltaComments) && (
                <Metric
                  big
                  title='Комментарии'
                  value={mySummary.current.deltaComments}
                  deltaValue={mySummary.delta.deltaComments}
                  deltaPercent
                  onClick={() => params.changeParams({ page: 'detail', reactionMetric: 'comments', hash: 'interactions' })}
                  tooltipTitle='Количество комментариев'
                  tooltipText='Первая цифра — количество комментариев, которое было оставлено на странице за выбранный период. Вторая цифра показывает насколько больше или меньше было оставлено комментариев в сравнении с предыдущим периодом.'
                  tooltipDescription={[`Выбранный период: ${period.currentDateFrom} – ${period.currentDateTo}`, `Предыдущий период: ${period.compareDateFrom} – ${period.compareDateTo}`]}
                />
              )}
              {!ObjectUtil.isNullOrUndefined(mySummary.current.deltaRePosts) && (
                <Metric
                  big
                  title='Репосты'
                  value={mySummary.current.deltaRePosts}
                  deltaValue={mySummary.delta.deltaRePosts}
                  deltaPercent
                  onClick={() => params.changeParams({ page: 'detail', reactionMetric: 'rePosts', hash: 'interactions' })}
                  tooltipTitle='Количество репостов'
                  tooltipText='Первая цифра показывает количество всех репостов со страницы за выбранный период. Вторая показывает насколько больше или меньше было репостов в сравнении с предыдущим периодом.'
                  tooltipDescription={[`Выбранный период: ${period.currentDateFrom} – ${period.currentDateTo}`, `Предыдущий период: ${period.compareDateFrom} – ${period.compareDateTo}`]}
                />
              )}
              {!ObjectUtil.isNullOrUndefined(mySummary.current.deltaPosts) && (
                <Metric
                  big
                  title='Посты'
                  value={mySummary.current.deltaPosts}
                  deltaValue={mySummary.delta.deltaPosts}
                  deltaPercent
                  onClick={() => params.changeParams({ page: 'content', hash: 'content' })}
                  tooltipTitle='Количество постов'
                  tooltipText='Первая цифра — это количество постов на странице за выбранный период. Вторая — показывает насколько больше или меньше было постов в сравнении с предыдущим периодом.'
                  tooltipDescription={[`Выбранный период: ${period.currentDateFrom} – ${period.currentDateTo}`, `Предыдущий период: ${period.compareDateFrom} – ${period.compareDateTo}`]}
                />
              )}
              {!ObjectUtil.isNullOrUndefined(mySummary.current.deltaViews) && (
                <Metric
                  big
                  title='Просмотры'
                  value={mySummary.current.deltaViews}
                  deltaValue={mySummary.delta.deltaViews}
                  deltaPercent
                  onClick={() => params.changeParams({ page: 'detail', hash: 'views' })}
                  tooltipTitle='Количество просмотров'
                  tooltipText='Просмотры — это просмотры постов на странице. Для YouTube это просмотры видео. Первая цифра показывает количество просмотров за выбранный период. Вторая — насколько больше или меньше было просмотров в сравнении с предыдущим периодом.'
                  tooltipDescription={[`Выбранный период: ${period.currentDateFrom} – ${period.currentDateTo}`, `Предыдущий период: ${period.compareDateFrom} – ${period.compareDateTo}`]}
                />
              )}
            </MetricGroup>
          )}
        </Segment>

        <Segment size={10} />

      </Segment>
    )
  }
}

export default StatisticsProjectOverviewPage
