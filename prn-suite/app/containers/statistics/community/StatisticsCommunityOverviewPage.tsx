import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { IStatisticsParams } from '../../../interfaces/IParams'
import CommunitiesStore from '../../../stores/CommunitiesStore'
import PostsStore from '../../../stores/PostsStore'
import { Stores } from '../../../stores/RootStore'
import StatisticsStore from '../../../stores/StatisticsStore'
import StatisticsSummaryStore from '../../../stores/StatisticsSummaryStore'
import ButtonText from '../../../ui/elements/ButtonText/ButtonText'
import Description from '../../../ui/elements/Description/Description'
import Metric from '../../../ui/elements/Metric/Metric'
import MetricGroup from '../../../ui/elements/Metric/MetricGroup'
import Segment from '../../../ui/elements/Segment/Segment'
import Title from '../../../ui/elements/Title/Title'
import Toolbar2 from '../../../ui/elements/Toolbar2/Toolbar2'
import Toolbar2Group from '../../../ui/elements/Toolbar2/Toolbar2Group'
import DateUtil from '../../../utils/DateUtil'
import ObjectUtil from '../../../utils/ObjectUtil'
import ScoreRecommendationUtil from '../../../utils/ScoreRecommendationUtil'
import withParams, { ParamsProps } from '../../../utils/withParams'
import CommunityOverview from '../../../ui/elements/CommunityOverview/CommunityOverview'
import PostBest from '../../../ui/elements/PostBest/PostBest'
import CommunityType from '../../../types/CommunityType'
import { Helmet } from 'react-helmet'

interface IProps {
  params?: ParamsProps<IStatisticsParams>
  communitiesStore?: CommunitiesStore
  postsStore?: PostsStore
  statisticsStore?: StatisticsStore
  statisticsSummaryStore?: StatisticsSummaryStore
}

@withParams
@inject(Stores.COMMUNITIES_STORE, Stores.STATISTICS_STORE, Stores.STATISTICS_SUMMARY_STORE, Stores.POSTS_STORE)
@observer
class StatisticsCommunityOverviewPage extends Component<IProps> {
  render (): JSX.Element {
    const { params, communitiesStore, statisticsStore, statisticsSummaryStore, postsStore } = this.props

    const myCommunity = communitiesStore.getMyCommunityBySocialType(params.type)
    const competitorCommunities = communitiesStore.getCompetitorsCommunitiesBySocialType(params.type)
    const myStatisticsSummary = statisticsSummaryStore.getStatisticsByCommunityID(myCommunity?.communityID)

    const scoreRecommendation = new ScoreRecommendationUtil(statisticsSummaryStore.statistics.series.map(serie => serie.score))
    const myScoreRecommendation = scoreRecommendation.getMyRecommendation(myStatisticsSummary?.score)

    const bestPost = postsStore.getBestPost()

    const period = DateUtil.period(params.from, params.to)

    return (
      <Segment size={5}>
        {/*@ts-ignore*/}
        <Helmet>
          <title>Статистика, Обзор — КУБ Suite</title>
        </Helmet>

        <Title text='Общие показатели страницы' />
        <Segment size={3} />
        <Description size='big'>
          В этом разделе собраны основные данные по странице и их изменения относительно предыдущего периода.
        </Description>

        <Segment size={5}>
          <CommunityOverview
            community={myCommunity}
            score={competitorCommunities.length && myStatisticsSummary?.score?.total}
            name={myScoreRecommendation.name}
            description={myScoreRecommendation.description}
            onSettings={() => params.changeParams({ communityID: myCommunity.communityID })}
            onAdd={() => params.changeParams({ addCommunity: true, addCommunityType: CommunityType.COMPETITOR })}
          />
        </Segment>

        <Segment size={3}>
          {!statisticsStore.isLoading && (
            <MetricGroup>
              <Metric
                big
                title='Подписчики'
                value={statisticsStore.statistics.summary.current.usersCount}
                deltaValue={statisticsStore.statistics.summary.delta.usersCount}
                onClick={() => params.changeParams({ page: 'detail', hash: 'usersCount' })}
                tooltipTitle='Количество подписчиков'
                tooltipText='Общее количество подписчиков на странице и их изменение за выбранный период.'
              />
              {!ObjectUtil.isNullOrUndefined(statisticsStore.statistics.summary.current.deltaInteractions) && (
                <Metric
                  big
                  title='Реакции'
                  value={statisticsStore.statistics.summary.current.deltaInteractions}
                  deltaValue={statisticsStore.statistics.summary.delta.deltaInteractions}
                  deltaPercent
                  onClick={() => params.changeParams({ page: 'detail', reactionMetric: 'interactions', hash: 'interactions' })}
                  tooltipTitle='Количество реакций'
                  tooltipText='Реакции — это сумма всех лайков, дизлайков, комментариев и репостов. Первая цифра показывает количество реакций за выбранный период. Вторая цифра показывает насколько больше или меньше было реакций в сравнении с предыдущим периодом.'
                  tooltipDescription={[`Выбранный период: ${period.currentDateFrom} – ${period.currentDateTo}`, `Предыдущий период: ${period.compareDateFrom} – ${period.compareDateTo}`]}
                />
              )}
              {!ObjectUtil.isNullOrUndefined(statisticsStore.statistics.summary.current.er) && (
                <Metric
                  big
                  title='Вовлеченность'
                  value={statisticsStore.statistics.summary.current.er}
                  deltaValue={statisticsStore.statistics.summary.delta.er}
                  format='0.00%'
                  deltaPercent
                  onClick={() => params.changeParams({ page: 'detail', hash: 'er' })}
                  tooltipTitle='Вовлечённость на страницу (Page ER)'
                  tooltipText='Page ER — это процент подписчиков, которые совершают реакции на странице. Первая цифра показывает вовлечённость за выбранный период. Вторая — насколько изменилась вовлечённость в сравнении с предыдущим периодом.'
                  tooltipDescription={[`Выбранный период: ${period.currentDateFrom} – ${period.currentDateTo}`, `Предыдущий период: ${period.compareDateFrom} – ${period.compareDateTo}`]}
                />
              )}
              {!ObjectUtil.isNullOrUndefined(statisticsStore.statistics.summary.current.deltaLikes) && (
                <Metric
                  big
                  title='Лайки'
                  value={statisticsStore.statistics.summary.current.deltaLikes}
                  deltaValue={statisticsStore.statistics.summary.delta.deltaLikes}
                  deltaPercent
                  onClick={() => params.changeParams({ page: 'detail', reactionMetric: 'likes', hash: 'interactions' })}
                  tooltipTitle='Количество лайков'
                  tooltipText='Первая цифра показывает количество лайков, которое было поставлено постам за выбранный период. Вторая — насколько больше или меньше было поставлено лайков в сравнении с предыдущим периодом.'
                  tooltipDescription={[`Выбранный период: ${period.currentDateFrom} – ${period.currentDateTo}`, `Предыдущий период: ${period.compareDateFrom} – ${period.compareDateTo}`]}
                />
              )}
              {!ObjectUtil.isNullOrUndefined(statisticsStore.statistics.summary.current.deltaDislikes) && (
                <Metric
                  big
                  title='Дизлайки'
                  value={statisticsStore.statistics.summary.current.deltaDislikes}
                  deltaValue={statisticsStore.statistics.summary.delta.deltaDislikes}
                  deltaPercent
                  onClick={() => params.changeParams({ page: 'detail', reactionMetric: 'dislikes', hash: 'interactions' })}
                  tooltipTitle='Количество дизлайков'
                  tooltipText='Первая цифра показывает количество дизлайков, которое было поставлено постам за выбранный период. Вторая — насколько больше или меньше было поставлено дизлайков в сравнении с предыдущим периодом.'
                  tooltipDescription={[`Выбранный период: ${period.currentDateFrom} – ${period.currentDateTo}`, `Предыдущий период: ${period.compareDateFrom} – ${period.compareDateTo}`]}
                />
              )}
              {!ObjectUtil.isNullOrUndefined(statisticsStore.statistics.summary.current.deltaComments) && (
                <Metric
                  big
                  title='Комментарии'
                  value={statisticsStore.statistics.summary.current.deltaComments}
                  deltaValue={statisticsStore.statistics.summary.delta.deltaComments}
                  deltaPercent
                  onClick={() => params.changeParams({ page: 'detail', reactionMetric: 'comments', hash: 'interactions' })}
                  tooltipTitle='Количество комментариев'
                  tooltipText='Первая цифра — количество комментариев, которое было оставлено на странице за выбранный период. Вторая цифра показывает насколько больше или меньше было оставлено комментариев в сравнении с предыдущим периодом.'
                  tooltipDescription={[`Выбранный период: ${period.currentDateFrom} – ${period.currentDateTo}`, `Предыдущий период: ${period.compareDateFrom} – ${period.compareDateTo}`]}
                />
              )}
              {!ObjectUtil.isNullOrUndefined(statisticsStore.statistics.summary.current.deltaRePosts) && (
                <Metric
                  big
                  title='Репосты'
                  value={statisticsStore.statistics.summary.current.deltaRePosts}
                  deltaValue={statisticsStore.statistics.summary.delta.deltaRePosts}
                  deltaPercent
                  onClick={() => params.changeParams({ page: 'detail', reactionMetric: 'rePosts', hash: 'interactions' })}
                  tooltipTitle='Количество репостов'
                  tooltipText='Первая цифра показывает количество всех репостов со страницы за выбранный период. Вторая показывает насколько больше или меньше было репостов в сравнении с предыдущим периодом.'
                  tooltipDescription={[`Выбранный период: ${period.currentDateFrom} – ${period.currentDateTo}`, `Предыдущий период: ${period.compareDateFrom} – ${period.compareDateTo}`]}
                />
              )}
              {!ObjectUtil.isNullOrUndefined(statisticsStore.statistics.summary.current.deltaPosts) && (
                <Metric
                  big
                  title='Посты'
                  value={statisticsStore.statistics.summary.current.deltaPosts}
                  deltaValue={statisticsStore.statistics.summary.delta.deltaPosts}
                  deltaPercent
                  onClick={() => params.changeParams({ page: 'content', hash: 'content' })}
                  tooltipTitle='Количество постов'
                  tooltipText='Первая цифра — это количество постов на странице за выбранный период. Вторая — показывает насколько больше или меньше было постов в сравнении с предыдущим периодом.'
                  tooltipDescription={[`Выбранный период: ${period.currentDateFrom} – ${period.currentDateTo}`, `Предыдущий период: ${period.compareDateFrom} – ${period.compareDateTo}`]}
                />
              )}
              {!ObjectUtil.isNullOrUndefined(statisticsStore.statistics.summary.current.deltaViews) && (
                <Metric
                  big
                  title='Просмотры'
                  value={statisticsStore.statistics.summary.current.deltaViews}
                  deltaValue={statisticsStore.statistics.summary.delta.deltaViews}
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

        {bestPost && (
          <>
            <Segment size={10}>
              <Title text='Лучший креатив' />
              <Segment size={3} />
              <Description size='big'>
                Этот пост был самым лучшим за выбранный период. Анализируя свои лучшие посты вы сможете создавать наиболее эффективный контент.
              </Description>
            </Segment>

            <Segment size={5}>
              <PostBest
                image={bestPost.postImage}
                text={bestPost.text}
                date={bestPost.date}
                grade={bestPost.mainGrade}
                indexGrade={bestPost.indexGrade}
                url={bestPost.postUrl}
                metrics={[
                  { name: 'Реакции', value: bestPost.interactions },
                  { name: 'Вовлеченность', value: bestPost.er, format: '0.00%' },
                  { name: 'Просмотры', value: bestPost.views }
                ]}
                onClick={() => params.changeParams({ postID: bestPost.postID })}
              />
            </Segment>

            <Segment size={2} />
          </>
        )}

        <Segment size={3}>
          <Toolbar2 size='button'>
            <Toolbar2Group fill>
              <ButtonText size='awesome' onClick={() => params.changeParams({ page: 'detail', hash: 'top' })}>Подробная статистика</ButtonText>
              <ButtonText size='awesome' onClick={() => params.changeParams({ page: 'content', hash: 'top' })}>Посмотреть все посты</ButtonText>
              <ButtonText size='awesome' onClick={() => params.changeParams({ page: 'competitors', hash: 'top' })}>Данные по конкурентам</ButtonText>
            </Toolbar2Group>
          </Toolbar2>
        </Segment>

        <Segment size={10} />

      </Segment>
    )
  }
}

export default StatisticsCommunityOverviewPage
