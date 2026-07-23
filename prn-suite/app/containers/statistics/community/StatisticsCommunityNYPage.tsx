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
import Textarea from '../../../ui/elements/Textarea/Textarea'
import Checkbox from '../../../ui/elements/Checkbox/Checkbox'
import Image from '../../../ui/elements/Image/Image'
import Loading from '../../../ui/elements/Loading/Loading'

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
class StatisticsCommunityRecommendationsPage extends Component<IProps> {
  render (): JSX.Element {
    const { params, communitiesStore } = this.props

    const myCommunity = params.type === 'ONE' ? communitiesStore.getCommunityByCommunityID(params.reportCommunityID) : communitiesStore.getMyCommunityBySocialType(params.type)
    const myCommunityStatus = myCommunity?.communityStatus

    return (
      <Segment size={5}>

        <Title text={`Итоги 2025 года: ${myCommunity.name}`} />
        <Segment size={3} />

        <Description size='big'>
          {`Посмотри на статистику страницы «${myCommunity.name}» за 2025 год и не забудь поделиться лучшими достижениями с подписчиками 😎.`}
        </Description>

        <Segment size={5}>
          {myCommunity && myCommunity.isPaid && myCommunityStatus === 'PARTIAL' && (
            <Loading size={200} message='Собираем данные' />
          )}
          {myCommunity && myCommunity.isPaid && myCommunityStatus === 'DONE' && (
            <div style={{display: 'flex', gap: 10, rowGap: 10, flexWrap: 'wrap'}}>
              {Array(10).fill(null).map((_, i) => (
                <div key={String(myCommunity.communityID).concat(String(i))} style={{
                  width: 200,
                  height: 200,
                  position: 'relative',
                  border: '1px solid #ccc',
                  borderRadius: 10,
                  overflow: 'hidden'
                }}>
                  <Loading size={200} style={{position: 'absolute', width: 200, overflow: 'hidden'}}/>
                  <img
                    style={{position: 'absolute', overflow: 'hidden'}}
                    src={`https://prnapi.c-cube.ru/v5/apps/urlscreencat/getNYScreenshotURL?cid=${myCommunity.cid}&index=${i + 1}`}
                    width={200}
                    height={200}
                  />
                </div>
              ))}
            </div>
          )}
        </Segment>

        <Segment size={10}/>

      </Segment>
    )
  }
}

export default StatisticsCommunityRecommendationsPage
