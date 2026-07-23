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
import MetricsRow from '../../../ui/elements/MetricsRow/MetricsRow'
import MetricsRowGroup from '../../../ui/elements/MetricsRow/MetricsRowGroup'
import NoData from '../../../ui/elements/NoData/NoData'
import CommunityType from '../../../types/CommunityType'
import Toolbar2 from '../../../ui/elements/Toolbar2/Toolbar2'
import { Helmet } from 'react-helmet'
import ArrayUtil from '../../../utils/ArrayUtil'
import ProfileStore from '../../../stores/ProfileStore'

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
class StatisticsProjectCompetitorsPage extends Component<IProps> {
  render (): JSX.Element {
    const { params, profileStore, communitiesStore, statisticsStore, statisticsSummaryStore, postsStore } = this.props

    const communities = communitiesStore.getMyAndCompetitorsCommunities()
    const competitors = communitiesStore.getCompetitorsCommunities()

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
    const communitiesWithStatistics = ArrayUtil.arrayObjectsSort(sortMap[params.tableSort], communities.map(community => {
      return {
        ...community,
        statistics: statisticsSummaryStore.getStatisticsByCommunityID(community.communityID)
      }
    }))

    if (!competitors.length) {
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
        {/* @ts-ignore */}
        <Helmet>
          <title>Статистика проекта, Обзор конкурентов — КУБ Suite</title>
        </Helmet>

        <Title text='Общие показатели конкурентов' />
        <Segment size={3} />
        <Description size='big'>
          Посмотрите на общую таблицу по всем добавленным конкурентам — делайте выводы о качестве этих страниц и их работе в социальных сетях. Это также поможет в построении вашей стратегии.
        </Description>

        <Segment size={3}>
          <MetricsRowGroup>

            <Toolbar2 sticky stickyOffset={6} stickyPadding>
              <MetricsRow header sort={params.tableSort} onSort={e => params.changeParams({ tableSort: e.target.value })} />
            </Toolbar2>

            {communitiesWithStatistics.map((community, i) => (
              <MetricsRow
                key={community.communityID}
                index={i + 1}
                competitors
                name={community.name}
                image={community.image}
                socialType={community.socialType}
                users={community.statistics?.current?.usersCount}
                usersDelta={community.statistics?.delta?.usersCount}
                interactions={community.statistics?.current?.deltaInteractions}
                interactionsDelta={community.statistics?.delta?.deltaInteractions}
                er={community.statistics?.current?.er}
                erDelta={community.statistics?.delta?.er}
                views={community.statistics?.current?.deltaViews}
                viewsDelta={community.statistics?.delta?.deltaViews}
                posts={community.statistics?.current?.deltaPosts}
                postsDelta={community.statistics?.delta?.deltaPosts}
                score={community.statistics?.score?.total}
                onClick={() => community.isPaid ? params.changeParams({ type: 'ONE', reportCommunityID: community.communityID, page: 'detail', hash: 'top' }) : params.changeParams({ premium: 'true' })}
                loading={community.communityStatus === 'COLLECTING'}
                isPaid={community.isPaid}
                my={community.communityType === CommunityType.MY}
              />
            ))}
          </MetricsRowGroup>
        </Segment>

        <Segment size={10} />

      </Segment>
    )
  }
}

export default StatisticsProjectCompetitorsPage
