import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { IStatisticsParams } from '../../../interfaces/IParams'
import CommunitiesStore from '../../../stores/CommunitiesStore'
import PostsStore from '../../../stores/PostsStore'
import { Stores } from '../../../stores/RootStore'
import StatisticsStore from '../../../stores/StatisticsStore'
import StatisticsSummaryStore from '../../../stores/StatisticsSummaryStore'
import Description from '../../../ui/elements/Description/Description'
import Segment from '../../../ui/elements/Segment/Segment'
import Title from '../../../ui/elements/Title/Title'
import withParams, { ParamsProps } from '../../../utils/withParams'
import NoData from '../../../ui/elements/NoData/NoData'
import CommunityType from '../../../types/CommunityType'
import Toolbar2 from '../../../ui/elements/Toolbar2/Toolbar2'
import { Helmet } from 'react-helmet'
import ArrayUtil from '../../../utils/ArrayUtil'
import ProfileStore from '../../../stores/ProfileStore'
import InfluencersMetricsRow from '../../../ui/elements/InfluencersMetricsRow/InfluencersMetricsRow'
import InfluencersMetricsRowGroup from '../../../ui/elements/InfluencersMetricsRow/InfluencersMetricsRowGroup'
import MetricGroup from '../../../ui/elements/Metric/MetricGroup'
import Metric from '../../../ui/elements/Metric/Metric'
import ObjectUtil from '../../../utils/ObjectUtil'

interface IProps {
  params?: ParamsProps<IStatisticsParams>
  profileStore?: ProfileStore
  communitiesStore?: CommunitiesStore
  postsStore?: PostsStore
  statisticsStore?: StatisticsStore
  statisticsSummaryStore?: StatisticsSummaryStore
}

@withParams
@inject(Stores.PROFILE_STORE, Stores.COMMUNITIES_STORE, Stores.STATISTICS_STORE, Stores.STATISTICS_SUMMARY_STORE, Stores.POSTS_STORE)
@observer
class StatisticsProjectInfluencersPage extends Component<IProps> {
  render (): JSX.Element {
    const { params, profileStore, communitiesStore, statisticsStore, statisticsSummaryStore, postsStore } = this.props

    const communities = communitiesStore.getInfluencersCommunities()

    const sortMap = {
      'usersCount': 'usersCount',
      '-usersCount': '-usersCount',
      'avgInteractions': 'avgInteractions',
      '-avgInteractions': '-avgInteractions',
      'avgER': 'avgER',
      '-avgER': '-avgER',
      'avgViews': 'avgViews',
      '-avgViews': '-avgViews',
      'pctFakeFollowers': 'pctFakeFollowers',
      '-pctFakeFollowers': '-pctFakeFollowers',
      'qualityScore': 'qualityScore',
      '-qualityScore': '-qualityScore'
    }
    const communitiesWithStatistics = ArrayUtil.arrayObjectsSort(sortMap[params.tableSort], communities.map(community => {
      return {
        ...community,
        statistics: statisticsSummaryStore.getStatisticsByCommunityID(community.communityID)
      }
    }))

    if (!communities.length) {
      return (
        <Segment size={3}>
          <NoData
            style='advanced'
            size={400}
            message='Нужно добавить блогеров'
            description='Здесь пусто — потому что вы ещё не добавили ни одной страницы блогера. Это позволит сравнить страницы блогеров между собой.'
            buttonLabel='Добавить блогера'
            buttonOnClick={() => params.changeParams({ addCommunity: true, addCommunityType: CommunityType.INFLUENCER })}
          />
        </Segment>
      )
    }

    const count = communitiesWithStatistics.length
    const countFakeFollowers = communitiesWithStatistics.filter(item => item.pctFakeFollowers).length
    const summary = communitiesWithStatistics.reduce((s, i) => ({
      sumUsersCount: s.sumUsersCount + i.usersCount || 0,
      sumER: s.sumER + i.avgER || 0,
      sumFakeFollowers: s.sumFakeFollowers + i.pctFakeFollowers || 0,
      sumQualityScore: s.sumQualityScore + i.qualityScore || 0
    }), {
      sumUsersCount: 0,
      sumER: 0,
      sumFakeFollowers: 0,
      sumQualityScore: 0
    })

    return (
      <Segment size={5}>
        {/* @ts-ignore */}
        <Helmet>
          <title>Статистика проекта, Обзор блогеров — КУБ Suite</title>
        </Helmet>

        <Title text='Общие показатели блогеров' />
        <Segment size={3} />
        <Description size='big'>
          Посмотрите на общую таблицу по всем добавленным блогерам — делайте выводы о качестве этих страниц и отбирайте лучших для сотрудничества.
        </Description>

        {communitiesWithStatistics.length && (
          <Segment size={3}>
            <MetricGroup>
              <Metric
                title='Всего подписчиков'
                value={summary.sumUsersCount}
                tooltipTitle='Всего подписчиков'
                tooltipText='Общее количество подписчиков на всех страницах блогеров на текущий момент.'
              />
              <Metric
                title='Вовлеченность'
                value={summary.sumER / count}
                format='0.00%'
                tooltipTitle='Средняя вовлеченность'
                tooltipText='Средняя вовлеченность на пост среди всех страниц блогеров за 2 месяца.'
              />
              <Metric
                title='% ботов'
                value={summary.sumFakeFollowers / countFakeFollowers}
                format='0%'
                tooltipTitle='Средний % ботов'
                tooltipText='Средний % ботов между всеми страницами блогеров.'
              />
              <Metric
                title='Качество'
                value={summary.sumQualityScore / count}
                format='0%'
                tooltipTitle='Среднее качество'
                tooltipText='Среднее качество страниц среди всех страниц блогеров.'
              />
            </MetricGroup>
          </Segment>
        )}

        <Segment size={3}>
          <InfluencersMetricsRowGroup>

            <Toolbar2 sticky stickyOffset={6} stickyPadding>
              <InfluencersMetricsRow header sort={params.tableSort} onSort={e => params.changeParams({ tableSort: e.target.value })} />
            </Toolbar2>

            {communitiesWithStatistics.map((community, i) => (
              <InfluencersMetricsRow
                key={community.communityID}
                index={i + 1}
                competitors
                name={community.name}
                image={community.image}
                socialType={community.socialType}
                users={community.usersCount}
                interactions={community.avgInteractions}
                er={community.avgER}
                views={community.avgViews}
                posts={community.statistics?.current?.deltaPosts}
                postsDelta={community.statistics?.delta?.deltaPosts}
                score={community.qualityScore}
                country={community?.topAudienceCountryCode}
                city={community?.membersCities[0]?.name}
                age={community?.membersGendersAges?.summary?.avgAges}
                gender={(community?.membersGendersAges?.summary?.m + community?.membersGendersAges?.summary?.f) ? ((community?.membersGendersAges?.summary?.m >= 0.6 ? 'm' : '') || (community?.membersGendersAges?.summary?.f >= 0.6 ? 'f' : '') || 'mf') : ''}
                pctFakeFollowers={community?.pctFakeFollowers}
                onClick={() => community.isPaid ? params.changeParams({ type: 'ONE', reportCommunityID: community.communityID, page: 'detail', hash: 'top' }) : params.changeParams({ premium: 'true' })}
                loading={community.communityStatus === 'COLLECTING'}
                isPaid={community.isPaid}
                my={community.communityType === CommunityType.MY}
              />
            ))}
          </InfluencersMetricsRowGroup>
        </Segment>

        <Segment size={10} />

      </Segment>
    )
  }
}

export default StatisticsProjectInfluencersPage
