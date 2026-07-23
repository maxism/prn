import { inject, observer } from 'mobx-react'
import moment from 'moment'
import React, { Component } from 'react'
import { IStatisticsParams } from '../../../interfaces/IParams'
import CommunitiesStore from '../../../stores/CommunitiesStore'
import { Stores } from '../../../stores/RootStore'
import StatisticsStore from '../../../stores/StatisticsStore'
import Segment from '../../../ui/elements/Segment/Segment'
import { ILineWidgetItem } from '../../../ui/views/statistics/widgets/LineWidgetChart/LineWidgetChart'
import withParams, { ParamsProps } from '../../../utils/withParams'
import Title from '../../../ui/elements/Title/Title'
import Description from '../../../ui/elements/Description/Description'
import DateUtil from '../../../utils/DateUtil'
import { Helmet } from 'react-helmet'
import PostsStore from '../../../stores/PostsStore'
import ArrayUtil from '../../../utils/ArrayUtil'
import StatisticsActivityStore from '../../../stores/StatisticsActivityStore'
import NumeralUtil from '../../../utils/NumeralUtil'
import CommunityOverview from '../../../ui/elements/CommunityOverview/CommunityOverview'
import ScoreRecommendationUtil from '../../../utils/ScoreRecommendationUtil'
import StatisticsSummaryStore from '../../../stores/StatisticsSummaryStore'
import LabelMetricGroup from '../../../ui/elements/LabelMetric/LabelMetricGroup'
import LabelMetric from '../../../ui/elements/LabelMetric/LabelMetric'
import MetricGroup from '../../../ui/elements/Metric/MetricGroup'
import Metric from '../../../ui/elements/Metric/Metric'
import ColumnWidgetChart from '../../../ui/views/statistics/widgets/ColumnWidgetChart/ColumnWidgetChart'
import NoData from '../../../ui/elements/NoData/NoData'
import CommunityStats from '../../../ui/elements/CommunityStats/CommunityStats'
import List from '../../../ui/elements/List/List'
import ObjectUtil from '../../../utils/ObjectUtil'

interface IProps {
  params?: ParamsProps<IStatisticsParams>
  communitiesStore?: CommunitiesStore
  postsStore?: PostsStore
  statisticsStore?: StatisticsStore
  statisticsActivityStore?: StatisticsActivityStore
  statisticsSummaryStore?: StatisticsSummaryStore
}

@withParams
@inject(Stores.COMMUNITIES_STORE, Stores.POSTS_STORE, Stores.STATISTICS_STORE, Stores.STATISTICS_SUMMARY_STORE, Stores.STATISTICS_ACTIVITY_STORE)
@observer
class StatisticsCommunityDetailPage extends Component<IProps> {
  constructor (props: IProps) {
    super(props)

    this.load()
  }

  componentDidUpdate (prevProps: Readonly<IProps>, prevState: Readonly<{}>, snapshot?: any): void {
    this.load()
  }

  typeCategoryToText = (category: string): string => {
    if (category === 'images') return 'Несколько картинок'
    if (category === 'photo') return 'Фото'
    if (category === 'SHORTS') return 'SHORTS'
    if (category === 'REELS') return 'REELS'
    if (category === 'video') return 'Видео'
    if (category === 'text') return 'Текст'
    if (category === 'article') return 'Статья'
    if (category === 'vote') return 'Голосование'
    if (category === 'repost') return 'Репост'
    if (category === 'links') return 'Ссылки'
    if (category === 'gif') return 'Gif'
    return 'Другое'
  }

  textLengthCategoryToText = (category: string): string => {
    if (category === 'short') return 'Короткие (до 80)'
    if (category === 'small') return 'Маленькие (80 – 150)'
    if (category === 'middle') return 'Средние (150 – 1000)'
    if (category === 'long') return 'Длинные (1000 – 2000)'
    if (category === 'huge') return 'Очень длинные (больше 2000)'
  }

  ageToText = (age: string): string => {
    if (age === '0_18') return 'до 18'
    if (age === '18_21') return 'от 18 до 21'
    if (age === '21_24') return 'от 21 до 24'
    if (age === '24_27') return 'от 24 до 27'
    if (age === '27_30') return 'от 27 до 30'
    if (age === '30_35') return 'от 30 до 35'
    if (age === '35_45') return 'от 35 до 45'
    if (age === '45_100') return '45+'
    return age
  }

  load = () => {
    const { params, communitiesStore, statisticsStore, statisticsActivityStore, postsStore } = this.props

    const community = params.type === 'ONE' ? communitiesStore.getCommunityByCommunityID(params.reportCommunityID) : communitiesStore.getMyCommunityBySocialType(params.type)

    if (community) {
      statisticsStore.load(community.communityID, params.from, params.to)
      statisticsActivityStore.load(community.communityID)
      postsStore.loadOne(community.cid, moment().subtract(6, 'months').format('DD.MM.YYYY'), moment().format('DD.MM.YYYY'), { type: 'ads' })

      if (!statisticsActivityStore.isLoading) {
        const activitiesList = statisticsActivityStore.getActivitiesList()
        if (!activitiesList.includes(params.activityMetric)) {
          if (activitiesList[0]) params.changeParams({ activityMetric: activitiesList[0] })
        }
      }
    }
  }

  render (): JSX.Element {
    const { params, communitiesStore, postsStore, statisticsStore, statisticsActivityStore, statisticsSummaryStore } = this.props

    const myCommunity = params.type === 'ONE' ? communitiesStore.getCommunityByCommunityID(params.reportCommunityID) : communitiesStore.getMyCommunityBySocialType(params.type)

    const competitorCommunities = communitiesStore.getCompetitorsCommunitiesBySocialType(params.type)

    const myStatisticsSummary = statisticsSummaryStore.getStatisticsByCommunityID(myCommunity?.communityID)

    const scoreRecommendation = new ScoreRecommendationUtil(statisticsSummaryStore.statistics.series.map(serie => serie.score))
    const myScoreRecommendation = scoreRecommendation.getMyRecommendation(myStatisticsSummary?.score)

    const chartDataUsersCount: Array<ILineWidgetItem> = statisticsStore.statistics.series.map(serie => ({
      date: moment(serie.date).valueOf(),
      value: serie.usersCount
    }))

    const chartDataGenders = [
      {
        name: 'Мужчины',
        value: myCommunity?.membersGendersAges?.summary?.m,
        color: '#7FC0FD'
      }, {
        name: 'Женщины',
        value: myCommunity?.membersGendersAges?.summary?.f,
        color: '#FFA5CC'
      }
    ]

    const chartDataAudienceTypes = [
      {
        name: 'Обычные подписчики',
        value: myCommunity?.membersTypes?.find(item => item.name === 'real')?.percent,
        color: '#00AD00'
      }, {
        name: 'Инфлюенсеры',
        value: myCommunity?.membersTypes?.find(item => item.name === 'influencer')?.percent,
        color: '#00DA00'
      }, {
        name: 'Массфолловеры',
        value: myCommunity?.membersTypes?.find(item => item.name === 'massfollowers')?.percent,
        color: '#F2F2F2'
      }, {
        name: 'Подозрительные',
        value: myCommunity?.membersTypes?.find(item => item.name === 'suspicious')?.percent,
        color: '#999999'
      }
    ]

    const chartDataAges = (myCommunity?.membersGendersAges?.data || []).map(item => ({
      name: this.ageToText(item.category),
      value: { 'm': item.m / myCommunity?.membersGendersAges?.summary?.m, 'f': item.f / myCommunity?.membersGendersAges?.summary?.f, '': item.f + item.m }[params.agesMetric || '']
    }))

    const chartDataCountries = ArrayUtil.arrayObjectsSort('-value',
      (myCommunity?.membersCountries || []).map(item => ({
        name: item.name,
        value: item.value
      }))
    ).filter(item => item.value >= 0.01).slice(0, 5)

    const chartDataCities = ArrayUtil.arrayObjectsSort('-value',
      (myCommunity?.membersCities || []).map(item => ({
        name: item.name,
        value: item.value
      }))
    ).filter(item => item.value >= 0.01).slice(0, 5)

    const chartDataInteractions: Record<string, Array<ILineWidgetItem>> = {
      total: statisticsStore.statistics.series.map(serie => ({
        date: moment(serie.date).valueOf(),
        value: serie.deltaInteractions
      })),
      likes: statisticsStore.statistics.series.map(serie => ({
        date: moment(serie.date).valueOf(),
        value: serie.deltaLikes
      })),
      comments: statisticsStore.statistics.series.map(serie => ({
        date: moment(serie.date).valueOf(),
        value: serie.deltaComments
      })),
      rePosts: statisticsStore.statistics.series.map(serie => ({
        date: moment(serie.date).valueOf(),
        value: serie.deltaRePosts
      }))
    }

    const chartDataERDay: Array<ILineWidgetItem> = statisticsStore.statistics.series.map(serie => ({
      date: moment(serie.date).valueOf(),
      value: serie.er
    }))

    const chartDataViews: Array<ILineWidgetItem> = statisticsStore.statistics.series.map(serie => ({
      date: moment(serie.date).valueOf(),
      value: serie.deltaViews
    }))

    const chartDataContentType = ArrayUtil.arrayObjectsSort('-value',
      (postsStore.postsSummary?.types || []).map(item => ({
        name: this.typeCategoryToText(item.name),
        value: params.contentTypeMetric === 'count' ? item.count : item.grade,
        tooltipTitles: params.contentTypeMetric === 'count' ? ['пост', 'поста', 'постов'] : 'x'
      }))
    )

    const chartDataHashTags = ArrayUtil.arrayObjectsSort('-value',
      (postsStore.postsSummary?.hashTags || []).map(item => ({
        name: `#${item.name}`,
        value: params.hashtagsMetric === 'count' ? item.count : item.grade,
        tooltipTitles: params.hashtagsMetric === 'count' ? ['пост', 'поста', 'постов'] : 'x'
      }))
    ).slice(0, 10)

    const chartDataTextLength = (postsStore.postsSummary?.textLength || []).map(item => ({
      name: this.textLengthCategoryToText(item.name),
      value: params.textLengthMetric === 'count' ? item.count : item.grade,
      tooltipTitles: params.textLengthMetric === 'count' ? ['пост', 'поста', 'постов'] : 'x'
    }))

    const period = DateUtil.period(params.from, params.to)
    return (
      <Segment size={5}>
        {/*@ts-ignore*/}
        <Helmet>
          <title>Статистика, Brand Safety — КУБ Suite</title>
        </Helmet>

        <Title text='Brand Safety' />
        <Segment size={3} />
        <Description size='big'>
          В этом разделе собрана аналитика по репутации контента страницы.
        </Description>
        <Description size='small'>
          Это тестовый функционал. Увидели ошибку? Сообщите нам!
        </Description>

        <Segment size={5}>
          <CommunityOverview
            community={myCommunity}
          />
        </Segment>

        <Segment size={2}>
          <LabelMetricGroup>
            {(myCommunity.brandSafety.ad || 0) > 0 ? (
              <LabelMetric icon='complete' iconColor='green' title='Есть реклама и упоминания' badge={NumeralUtil.format(myCommunity.brandSafety.ad || 0, '0%')} />
            ) : (
              <LabelMetric icon='tariff_promise' iconColor='red' title='Нет рекламы и упоминаний' badge={NumeralUtil.format(myCommunity.brandSafety.ad || 0, '0%')} />
            )}

            {(myCommunity.brandSafety.not_marked_ad || 0) < 0.2 ? (
              <LabelMetric icon='complete' iconColor='green' title='Реклама маркируется' badge={NumeralUtil.format(1 - myCommunity.brandSafety.not_marked_ad || 0, '0%')} />
            ) : (
              <LabelMetric icon='tariff_promise' iconColor='red' title='Отсутствует маркировка рекламы' badge={NumeralUtil.format(myCommunity.brandSafety.not_marked_ad || 0, '0%')} />
            )}

            {(myCommunity.brandSafety.alcohol || 0) < 0.1 ? (
              <LabelMetric icon='complete' iconColor='green' title='Отсутствует контент связанный с алкоголем' badge={NumeralUtil.format(myCommunity.brandSafety.alcohol || 0, '0%')} />
            ) : (
              <LabelMetric icon='tariff_promise' iconColor='red' title='Публикуется контент связанный с алкоголем' badge={NumeralUtil.format(myCommunity.brandSafety.alcohol || 0, '0%')} />
            )}

            {(myCommunity.brandSafety.toxic || 0) < 0.1 ? (
              <LabelMetric icon='complete' iconColor='green' title='Отсутствует токсичный контент' badge={NumeralUtil.format(myCommunity.brandSafety.toxic || 0, '0%')} />
            ) : (
              <LabelMetric icon='tariff_promise' iconColor='red' title='Публикуется токсичный контент' badge={NumeralUtil.format(myCommunity.brandSafety.toxic || 0, '0%')} />
            )}

            {(myCommunity.brandSafety.religious || 0) < 0.1 ? (
              <LabelMetric icon='complete' iconColor='green' title='Отсутствует религиозный контент' badge={NumeralUtil.format(myCommunity.brandSafety.religious || 0, '0%')} />
            ) : (
              <LabelMetric icon='tariff_promise' iconColor='red' title='Публикуется религиозный контент' badge={NumeralUtil.format(myCommunity.brandSafety.religious || 0, '0%')} />
            )}

            {myCommunity.brandSafety.negative || 0 < 0.1 ? (
              <LabelMetric icon='complete' iconColor='green' title='Отсутствует негативный контент' badge={NumeralUtil.format(myCommunity.brandSafety.negative || 0, '0%')} />
            ) : (
              <LabelMetric icon='tariff_promise' iconColor='red' title='Публикуется негативный контент' badge={NumeralUtil.format(myCommunity.brandSafety.negative || 0, '0%')} />
            )}

            {(myCommunity.brandSafety.offensive || 0) < 0.1 ? (
              <LabelMetric icon='complete' iconColor='green' title='Отсутствует оскорбительный контент' badge={NumeralUtil.format(myCommunity.brandSafety.offensive || 0, '0%')} />
            ) : (
              <LabelMetric icon='tariff_promise' iconColor='red' title='Публикуется оскорбительный контент' badge={NumeralUtil.format(myCommunity.brandSafety.offensive || 0, '0%')} />
            )}

            {(myCommunity.brandSafety.political || 0) < 0.1 ? (
              <LabelMetric icon='complete' iconColor='green' title='Отсутствует политический контент' badge={NumeralUtil.format(myCommunity.brandSafety.political || 0, '0%')} />
            ) : (
              <LabelMetric icon='tariff_promise' iconColor='red' title='Публикуется политический контент' badge={NumeralUtil.format(myCommunity.brandSafety.political || 0, '0%')} />
            )}

            {(myCommunity.brandSafety.crime || 0) < 0.1 ? (
              <LabelMetric icon='complete' iconColor='green' title='Отсутствует криминальный контент' badge={NumeralUtil.format(myCommunity.brandSafety.crime || 0, '0%')} />
            ) : (
              <LabelMetric icon='tariff_promise' iconColor='red' title='Публикуется криминальный контент' badge={NumeralUtil.format(myCommunity.brandSafety.crime || 0, '0%')} />
            )}

            {(myCommunity.brandSafety.adult || 0) < 0.1 ? (
              <LabelMetric icon='complete' iconColor='green' title='Отсутствует контент для взрослых' badge={NumeralUtil.format(myCommunity.brandSafety.adult || 0, '0%')} />
            ) : (
              <LabelMetric icon='tariff_promise' iconColor='red' title='Публикуется контент для взрослых' badge={NumeralUtil.format(myCommunity.brandSafety.adult || 0, '0%')} />
            )}

            {(myCommunity.brandSafety.pranks || 0) < 0.1 ? (
              <LabelMetric icon='complete' iconColor='green' title='Отсутствует контент c пранками' badge={NumeralUtil.format(myCommunity.brandSafety.pranks || 0, '0%')} />
            ) : (
              <LabelMetric icon='tariff_promise' iconColor='red' title='Публикуется контент с пранками' badge={NumeralUtil.format(myCommunity.brandSafety.pranks || 0, '0%')} />
            )}
          </LabelMetricGroup>
        </Segment>

        <Segment size={10}>
          <Title id='mentions' text='Рекламирует'/>
          <Segment size={3} />
          <Description size='big'>
            Список упоминаний других страниц за последние 6 месяцев.\r
            На вкладке Контент можно посмотреть конкретные рекламные посты.
          </Description>
        </Segment>

        <Segment size={5}>
          <List
            isLoading={postsStore.isLoading}
            emptyText='Нет упоминаний'
          >
            {postsStore.postsSummary?.mentions?.map(mention => (
              <CommunityStats
                key={mention.cid}
                image={mention.image}
                name={mention.name}
                url={mention.url}
                metrics={[
                  { name: 'Подписчиков', value: mention.usersCount },
                  { name: 'Охват упоминаний', value: mention.views, isHide: ObjectUtil.isNullOrUndefined(mention.views) },
                  { name: 'Всего реакций', value: mention.interactions, isHide: ObjectUtil.isNullOrUndefined(mention.interactions) },
                  { name: 'Постов', value: mention.count },
                ]}
                onClick={() => params.changeParams({ addCommunity: true, addUrl: mention.url })}
              />
            ))}
          </List>
        </Segment>

        <Segment size={10} />
      </Segment>
    )
  }
}

export default StatisticsCommunityDetailPage
