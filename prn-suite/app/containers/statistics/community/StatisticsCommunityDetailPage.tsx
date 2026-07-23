import { inject, observer } from 'mobx-react'
import moment from 'moment'
import React, { Component } from 'react'
import { IStatisticsParams } from '../../../interfaces/IParams'
import CommunitiesStore from '../../../stores/CommunitiesStore'
import { Stores } from '../../../stores/RootStore'
import StatisticsStore from '../../../stores/StatisticsStore'
import Segment from '../../../ui/elements/Segment/Segment'
import LineWidgetChart, { ILineWidgetItem } from '../../../ui/views/statistics/widgets/LineWidgetChart/LineWidgetChart'
import ObjectUtil from '../../../utils/ObjectUtil'
import withParams, { ParamsProps } from '../../../utils/withParams'
import Title from '../../../ui/elements/Title/Title'
import Description from '../../../ui/elements/Description/Description'
import MetricGroup from '../../../ui/elements/Metric/MetricGroup'
import Metric from '../../../ui/elements/Metric/Metric'
import CommunityType from '../../../types/CommunityType'
import DateUtil from '../../../utils/DateUtil'
import { Helmet } from 'react-helmet'
import PostsStore from '../../../stores/PostsStore'
import ColumnWidgetChart from '../../../ui/views/statistics/widgets/ColumnWidgetChart/ColumnWidgetChart'
import ArrayUtil from '../../../utils/ArrayUtil'
import StatisticsActivityStore from '../../../stores/StatisticsActivityStore'
import DowhWidgetChart from '../../../ui/views/statistics/widgets/DowhWidgetChart/DowhWidgetChart'
import PieWidgetChart from '../../../ui/views/statistics/widgets/PieWidgetChart/PieWidgetChart'
import NumeralUtil from '../../../utils/NumeralUtil'
import Toolbar2Group from '../../../ui/elements/Toolbar2/Toolbar2Group'
import Toolbar2 from '../../../ui/elements/Toolbar2/Toolbar2'
import CommunityOverview from '../../../ui/elements/CommunityOverview/CommunityOverview'
import ScoreRecommendationUtil from '../../../utils/ScoreRecommendationUtil'
import StatisticsSummaryStore from '../../../stores/StatisticsSummaryStore'
import LabelMetricGroup from '../../../ui/elements/LabelMetric/LabelMetricGroup'
import LabelMetric from '../../../ui/elements/LabelMetric/LabelMetric'

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
      postsStore.loadOne(community.cid, params.from, params.to)

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
          <title>Статистика, Аудитория — КУБ Suite</title>
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
            name={myScoreRecommendation?.name}
            description={myScoreRecommendation?.description}
            onSettings={() => params.changeParams({ communityID: myCommunity.communityID })}
            onAdd={params.type !== 'ONE' && (() => params.changeParams({ addCommunity: true, addCommunityType: CommunityType.COMPETITOR }))}
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
                  tooltipText='Page ER — это процент подписчиков, которые совершают реакции на странице. Формула: Реакции за период / подписчики на конец периода / количество дней в периоде * 100%. Первая цифра показывает вовлечённость за выбранный период. Вторая — насколько изменилась вовлечённость в сравнении с предыдущим периодом.'
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

              {['VK', 'OK', 'INST', 'YT', 'TT'].includes(myCommunity.socialType) && (
                <Metric
                  big
                  title='Активные подписчики'
                  value={(chartDataAudienceTypes[0].value + chartDataAudienceTypes[1].value) || '—'}
                  format='0%'
                  onClick={() => params.changeParams({ page: 'detail', hash: 'audienceTypes' })}
                  // tooltipTitle='Активные подписчики'
                  // tooltipText='Просмотры — это просмотры постов на странице. Для YouTube это просмотры видео. Первая цифра показывает количество просмотров за выбранный период. Вторая — насколько больше или меньше было просмотров в сравнении с предыдущим периодом.'
                />
              )}
            </MetricGroup>
          )}
        </Segment>

        <Segment size={10}>
          <Title id='usersCount' text='Динамика подписчиков'>
            {/*<ButtonText icon='download'>Сохранить</ButtonText>*/}
          </Title>
          <Segment size={3} />
          <Description size='big'>
            Определяйте как ваш контент влияет на прирост и отток подписчиков. Сопоставляйте свои действия в соцсетях с графиком. Старайтесь понять причины изменений.
          </Description>
        </Segment>

        <Segment size={5}>
          <MetricGroup>
            <Metric
              active
              title='Подписчики'
              tooltipTitle='Количество подписчиков'
              tooltipText='Общее количество подписчиков на странице и их изменение за выбранный период.'
              value={statisticsStore.statistics.summary.current.usersCount}
              deltaValue={statisticsStore.statistics.summary.delta.usersCount}
            />
          </MetricGroup>
        </Segment>

        <Segment size={5}>
          <LineWidgetChart
            data={chartDataUsersCount}
            color='#80ADFF'
            metricName='Подписчиков'
            loading={statisticsStore.isLoading}
            noDataStyle='graph'
            noDataMessage='Нет подписчиков'
            noDataDescription='В выбранном периоде в сообществе нет подписчиков.'
            height={300}
          />
        </Segment>

        {['VK', 'OK', 'INST', 'YT', 'TT'].includes(myCommunity.socialType) && (
          <>
            <Segment size={10}>
              <Title id='interactions' text='Пол и возраст' />
              <Segment size={3} />
              <Description size='big'>
                Изучите целевую аудиторию страницы для подготовки подходящего контента.
              </Description>
              <Description size='small'>
                Это тестовый функционал. Увидели ошибку? Сообщите нам!
              </Description>
            </Segment>

            <Segment size={5}>
              <MetricGroup>
                <Metric
                  title='Показать'
                  value='Все'
                  onClick={() => params.changeParams({ agesMetric: '' })}
                  active={params.agesMetric === '' || !params.agesMetric}
                />
                <Metric
                  title='Показать'
                  value={`Мужчины — ${NumeralUtil.format(chartDataGenders[0]?.value, '0%')}`}
                  onClick={() => params.changeParams({ agesMetric: 'm' })}
                  active={params.agesMetric === 'm'}
                />
                <Metric
                  title='Показать'
                  value={`Женщины — ${NumeralUtil.format(chartDataGenders[1]?.value, '0%')}`}
                  onClick={() => params.changeParams({ agesMetric: 'f' })}
                  active={params.agesMetric === 'f'}
                />
              </MetricGroup>
            </Segment>

            <Segment size={5}>
              <Toolbar2>
                <Toolbar2Group fill>
                  <ColumnWidgetChart
                    data={chartDataAges}
                    format='0%'
                    color={{ 'm': '#7FC0FD', 'f': '#FFA5CC' }[params.agesMetric] || '#DC86FF'}
                    loading={postsStore.isLoading}
                    noDataStyle='graph'
                    noDataMessage='Сбор данных...'
                    noDataDescription='Пока мало информации для отображения'
                    height={300}
                  />
                  <PieWidgetChart
                    data={chartDataGenders}
                    format='0%'
                    loading={postsStore.isLoading}
                    noDataStyle='graph'
                    noDataMessage='Сбор данных...'
                    noDataDescription='Пока мало информации для отображения'
                    height={300}
                  />
                </Toolbar2Group>
              </Toolbar2>
            </Segment>

            <Segment size={10}>
              <Title id='interactions' text='Города и страны' />
              <Segment size={3} />
              <Description size='big'>
                Топ 5 городов и стран подписчиков данной страницы.
              </Description>
              <Description size='small'>
                Это тестовый функционал. Увидели ошибку? Сообщите нам!
              </Description>
            </Segment>

            <Segment size={5}>
              <Toolbar2>
                <Toolbar2Group fill>
                  <ColumnWidgetChart
                    data={chartDataCities}
                    format='0%'
                    color='#186AFF'
                    loading={postsStore.isLoading}
                    noDataStyle='graph'
                    noDataMessage='Сбор данных...'
                    noDataDescription='Пока мало информации для отображения'
                    height={300}
                  />
                  <ColumnWidgetChart
                    data={chartDataCountries}
                    format='0%'
                    color='#F8CF00'
                    loading={postsStore.isLoading}
                    noDataStyle='graph'
                    noDataMessage='Сбор данных...'
                    noDataDescription='Пока мало информации для отображения'
                    height={300}
                  />
                </Toolbar2Group>
              </Toolbar2>
            </Segment>

            <Segment size={10}>
              <Title id='audienceTypes' text='Состав аудитории' />
              <Segment size={3} />
              <Description size='big'>
                Определите качество подписчиков страницы
              </Description>
              <Description size='small'>
                Это тестовый функционал. Увидели ошибку? Сообщите нам!
              </Description>
            </Segment>

            <Segment size={5}>
              <MetricGroup>
                <Metric
                  title='Обычные подписчики'
                  value={NumeralUtil.format(chartDataAudienceTypes[0].value, '0%') || '—'}
                />
                <Metric
                  title='Инфлюенсеры'
                  value={NumeralUtil.format(chartDataAudienceTypes[1].value, '0%') || '—'}
                />
                <Metric
                  title='Массфолловеры'
                  value={NumeralUtil.format(chartDataAudienceTypes[2].value, '0%') || '—'}
                />
                <Metric
                  title='Подозрительные'
                  value={NumeralUtil.format(chartDataAudienceTypes[3].value, '0%') || '—'}
                />
              </MetricGroup>
            </Segment>

            <Segment size={5}>
              <PieWidgetChart
                data={chartDataAudienceTypes}
                format='0%'
                loading={postsStore.isLoading}
                noDataStyle='graph'
                noDataMessage='Сбор данных...'
                noDataDescription='Пока мало информации для отображения'
                height={300}
              />
            </Segment>
          </>
        )}

        {!ObjectUtil.isNullOrUndefined(statisticsStore.statistics.summary.current.deltaInteractions) && (
          <>
            <Segment size={10}>
              <Title id='interactions' text='Реакции пользователей' />
              <Segment size={3} />
              <Description size='big'>
                Отслеживайте изменение количества реакций на ваш контент — лайков, дизлайков, комментариев и репостов пользователей. Работайте со своей аудиторией для лучших показателей.
              </Description>
            </Segment>

            <Segment size={5}>
              <MetricGroup>
                <Metric
                  title='Все реакции'
                  tooltipTitle='Количество реакций'
                  tooltipText='Реакции — это сумма всех лайков, дизлайков, комментариев и репостов. Первая цифра показывает количество реакций за выбранный период. Вторая цифра показывает насколько больше или меньше было реакций в сравнении с предыдущим периодом.'
                  tooltipDescription={[`Выбранный период: ${period.currentDateFrom} – ${period.currentDateTo}`, `Предыдущий период: ${period.compareDateFrom} – ${period.compareDateTo}`]}
                  value={statisticsStore.statistics.summary.current.deltaInteractions}
                  deltaValue={statisticsStore.statistics.summary.delta.deltaInteractions}
                  deltaPercent
                  onClick={e => params.changeParams({ reactionMetric: 'interactions' })}
                  active={params.reactionMetric === 'interactions' || !params.reactionMetric}
                />
                {!ObjectUtil.isNullOrUndefined(statisticsStore.statistics.summary.current.deltaLikes) && (
                  <Metric
                    title='Лайки'
                    tooltipTitle='Количество лайков'
                    tooltipText='Первая цифра показывает количество лайков, которое было поставлено постам за выбранный период. Вторая — насколько больше или меньше было поставлено лайков в сравнении с предыдущим периодом.'
                    tooltipDescription={[`Выбранный период: ${period.currentDateFrom} – ${period.currentDateTo}`, `Предыдущий период: ${period.compareDateFrom} – ${period.compareDateTo}`]}
                    value={statisticsStore.statistics.summary.current.deltaLikes}
                    deltaValue={statisticsStore.statistics.summary.delta.deltaLikes}
                    deltaPercent
                    onClick={e => params.changeParams({ reactionMetric: 'likes' })}
                    active={params.reactionMetric === 'likes'}
                  />
                )}
                {!ObjectUtil.isNullOrUndefined(statisticsStore.statistics.summary.current.deltaDislikes) && (
                  <Metric
                    title='Дизлайки'
                    tooltipTitle='Количество дизлайков'
                    tooltipText='Первая цифра показывает количество дизлайков, которое было поставлено постам за выбранный период. Вторая — насколько больше или меньше было поставлено дизлайков в сравнении с предыдущим периодом.'
                    tooltipDescription={[`Выбранный период: ${period.currentDateFrom} – ${period.currentDateTo}`, `Предыдущий период: ${period.compareDateFrom} – ${period.compareDateTo}`]}
                    value={statisticsStore.statistics.summary.current.deltaDislikes}
                    deltaValue={statisticsStore.statistics.summary.delta.deltaDislikes}
                    deltaPercent
                    onClick={e => params.changeParams({ reactionMetric: 'dislikes' })}
                    active={params.reactionMetric === 'dislikes'}
                  />
                )}
                {!ObjectUtil.isNullOrUndefined(statisticsStore.statistics.summary.current.deltaComments) && (
                  <Metric
                    title='Комментарии'
                    tooltipTitle='Количество комментариев'
                    tooltipText='Первая цифра — количество комментариев, которое было оставлено на странице за выбранный период. Вторая цифра показывает насколько больше или меньше было оставлено комментариев в сравнении с предыдущим периодом.'
                    tooltipDescription={[`Выбранный период: ${period.currentDateFrom} – ${period.currentDateTo}`, `Предыдущий период: ${period.compareDateFrom} – ${period.compareDateTo}`]}
                    value={statisticsStore.statistics.summary.current.deltaComments}
                    deltaValue={statisticsStore.statistics.summary.delta.deltaComments}
                    deltaPercent
                    onClick={e => params.changeParams({ reactionMetric: 'comments' })}
                    active={params.reactionMetric === 'comments'}
                  />
                )}
                {!ObjectUtil.isNullOrUndefined(statisticsStore.statistics.summary.current.deltaRePosts) && (
                  <Metric
                    title='Репосты'
                    tooltipTitle='Количество репостов'
                    tooltipText='Первая цифра показывает количество всех репостов со страницы за выбранный период. Вторая показывает насколько больше или меньше было репостов в сравнении с предыдущим периодом.'
                    tooltipDescription={[`Выбранный период: ${period.currentDateFrom} – ${period.currentDateTo}`, `Предыдущий период: ${period.compareDateFrom} – ${period.compareDateTo}`]}
                    value={statisticsStore.statistics.summary.current.deltaRePosts}
                    deltaValue={statisticsStore.statistics.summary.delta.deltaRePosts}
                    deltaPercent
                    onClick={e => params.changeParams({ reactionMetric: 'rePosts' })}
                    active={params.reactionMetric === 'rePosts'}
                  />
                )}
              </MetricGroup>
            </Segment>
            <Segment size={5}>
              <LineWidgetChart
                data={['likes', 'comments', 'rePosts', 'dislikes'].includes(params.reactionMetric) ? chartDataInteractions[params.reactionMetric] : chartDataInteractions['total']}
                color='#FF6F00'
                loading={statisticsStore.isLoading}
                noDataStyle='graph'
                noDataMessage={({ 'likes': 'Нет лайков', 'comments': 'Нет комментариев', 'rePosts': 'Нет репостов', 'dislikes': 'Нет дизлайков' })[params.reactionMetric] || 'Нет реакций'}
                noDataDescription='За выбранный период не было никаких реакций. Попробуйте увеличить период, чтобы увидеть данные.'
                height={300}
              />
            </Segment>
          </>
        )}

        {!ObjectUtil.isNullOrUndefined(statisticsStore.statistics.summary.current.er) && (
          <>
            <Segment size={10}>
              <Title id='er' text='Вовлечённость страницы'>
                {/*<ButtonText icon='download'>Сохранить</ButtonText>*/}
              </Title>
              <Segment size={3} />
              <Description size='big'>
                Посмотрите как меняется вовлечённость аудитории на вашей странице. Отслеживайте зависимость этой метрики от запуска рекламы, различных конкурсов и других активностей.
              </Description>
            </Segment>
            <Segment size={5}>
              <MetricGroup>
                <Metric
                  active
                  title='Вовлечённость'
                  tooltipTitle='Вовлечённость на страницу (Page ER)'
                  tooltipText='Page ER — это процент подписчиков, которые совершают реакции на странице. Первая цифра показывает вовлечённость за выбранный период. Вторая — насколько изменилась вовлечённость в сравнении с предыдущим периодом.'
                  tooltipDescription={[`Выбранный период: ${period.currentDateFrom} – ${period.currentDateTo}`, `Предыдущий период: ${period.compareDateFrom} – ${period.compareDateTo}`]}
                  value={statisticsStore.statistics.summary.current.er}
                  deltaValue={statisticsStore.statistics.summary.delta.er}
                  deltaPercent
                  format='0.00%'
                  deltaFormat='+0.00%'
                />
              </MetricGroup>
            </Segment>
            <Segment size={5}>
              <LineWidgetChart
                data={chartDataERDay}
                color='#186AFF'
                loading={statisticsStore.isLoading} format='0.00%'
                noDataStyle='graph'
                noDataMessage='Нет данных'
                noDataDescription='За выбранный период нет данных. Попробуйте увеличить период.'
                height={300}
              />
            </Segment>
          </>
        )}

        {!ObjectUtil.isNullOrUndefined(statisticsStore.statistics.summary.current.deltaViews) && (
          <>
            <Segment size={10}>
              <Title id='views' text='Просмотры контента'>
                {/*<ButtonText icon='download'>Сохранить</ButtonText>*/}
              </Title>
              <Segment size={3} />
              <Description size='big'>
                Следите за количеством просмотров — этот график поможет сделать выводы относительно популярности вашего контента.
              </Description>
            </Segment>

            <Segment size={5}>
              <MetricGroup>
                <Metric
                  active
                  title='Просмотры'
                  tooltipTitle='Количество просмотров'
                  tooltipText='Просмотры — это просмотры постов на странице. Для YouTube это просмотры видео. Первая цифра показывает количество просмотров за выбранный период. Вторая — насколько больше или меньше было просмотров в сравнении с предыдущим периодом.'
                  tooltipDescription={[`Выбранный период: ${period.currentDateFrom} – ${period.currentDateTo}`, `Предыдущий период: ${period.compareDateFrom} – ${period.compareDateTo}`]}
                  value={statisticsStore.statistics.summary.current.deltaViews}
                  deltaValue={statisticsStore.statistics.summary.delta.deltaViews}
                  deltaPercent
                />
              </MetricGroup>
            </Segment>

            <Segment size={5}>
              <LineWidgetChart
                data={chartDataViews}
                color='#44C800'
                loading={statisticsStore.isLoading}
                noDataStyle='graph'
                noDataMessage='Нет просмотров'
                noDataDescription='За выбранный период нет просмотров. Попробуйте увеличить период, чтобы увидеть данные.'
                height={300}
              />
            </Segment>
          </>
        )}

        <Segment size={10}>
          <Title id='activity' text='Активность аудитории'>
            {/*<ButtonText icon='download'>Сохранить</ButtonText>*/}
          </Title>
          <Segment size={3} />
          <Description size='big'>
            Активность аудитории меняется в зависимости от дня недели и времени суток. Этот график показывает все пики активности. Если публиковать контент в нужный момент — можно добиться максимальной эффективности.
          </Description>
        </Segment>

        <Segment size={5}>
          <MetricGroup>
            {statisticsActivityStore.getActivitiesList().includes('interactions') && <Metric
              title='Показывать на графике'
              tooltipTitle='Активность по реакциям'
              tooltipText='Каждая точка на графике показывает среднее недельное количество всех реакций пользователей страницы в конкретный день недели и час.'
              tooltipDescription='Данные рассчитаны на основе последних 90 дней и не зависят от выбранного периода.'
              value='Все реакции'
              onClick={() => params.changeParams({ activityMetric: 'interactions' })}
              active={params.activityMetric === 'interactions'}
            />}
            {statisticsActivityStore.getActivitiesList().includes('views') && <Metric
              title='Показывать на графике'
              tooltipTitle='Активность по просмотрам'
              tooltipText='Каждая точка на графике показывает среднее недельное количество просмотров на странице в конкретный день недели и час.'
              tooltipDescription='Данные рассчитаны на основе последних 90 дней и не зависят от выбранного периода.'
              value='Просмотры'
              onClick={() => params.changeParams({ activityMetric: 'views' })}
              active={params.activityMetric === 'views'}
            />}
          </MetricGroup>
        </Segment>

        <Segment size={5}>
          <DowhWidgetChart
            data={statisticsActivityStore.getActivityData(params.activityMetric)}
            color='#80ADFF'
            metricName={params.activityMetric === 'views' ? 'Просмотров' : 'Реакций'}
            loading={statisticsActivityStore.isLoading}
            noDataStyle='graph'
            noDataMessage={params.activityMetric === 'views' ? 'Нет просмотров' : 'Нет реакций'}
            noDataDescription={`В сообществе нет ${params.activityMetric === 'views' ? 'просмотров' : 'реакций'}.`}
            height={300}
          />
        </Segment>

        <Segment size={10}>
          <Title id='views' text='Хэштеги'/>
          <Segment size={3} />
          <Description size='big'>
            Посмотрите какие из ваших хэштегов работают наиболее эффективно. \r В зависимости от того как вы пользуетесь хэштегами, можно сделать очень интересные выводы.
          </Description>
        </Segment>

        <Segment size={5}>
          <MetricGroup>
            <Metric
              title='Метод подсчёта'
              tooltipTitle='Сортировка по эффективности'
              tooltipText='В этом режиме хэштеги будут отсортированы по своей эффективности.'
              value='Эффективность'
              onClick={() => params.changeParams({ hashtagsMetric: 'grades' })}
              active={params.hashtagsMetric === 'grades' || !params.hashtagsMetric}
            />
            <Metric
              title='Метод подсчёта'
              tooltipTitle='Сортировка по количеству'
              tooltipText='В режиме сортировки по количеству вы увдите, какие хэштеги используются чаще других в ваших постах.'
              value='Количество'
              onClick={() => params.changeParams({ hashtagsMetric: 'count' })}
              active={params.hashtagsMetric === 'count'}
            />
          </MetricGroup>
        </Segment>

        <Segment size={5}>
          <ColumnWidgetChart
            data={chartDataHashTags}
            format={params.hashtagsMetric === 'count' ? '0,0' : '+0.00'}
            color='#F8CF00'
            loading={postsStore.isLoading}
            noDataStyle='graph'
            noDataMessage='Нет хештегов'
            noDataDescription='Мы не нашли хэштегов в постах за выбранный период.'
            height={300}
          />
        </Segment>

        <Segment size={10}>
          <Title id='views' text='Типы контента'/>
          <Segment size={3} />
          <Description size='big'>
            Для разных аудиторий работают разные типы контента. Попробуйте найти самые эффективные для вашей страницы и на основе этого стройте свой контент-план.
          </Description>
        </Segment>

        <Segment size={5}>
          <MetricGroup>
            <Metric
              title='Метод подсчёта'
              tooltipTitle='Сортировка по эффективности'
              tooltipText='В этом режиме посты разного типа будут отсортированы по своей эффективности.'
              value='Эффективность'
              onClick={() => params.changeParams({ contentTypeMetric: 'grades' })}
              active={params.contentTypeMetric === 'grades' || !params.contentTypeMetric}
            />
            <Metric
              title='Метод подсчёта'
              tooltipTitle='Сортировка по количеству'
              tooltipText='В режиме сортировки по количеству вы увидите, какой тип контента чаще использучется в ваши постах.'
              value='Количество'
              onClick={() => params.changeParams({ contentTypeMetric: 'count' })}
              active={params.contentTypeMetric === 'count'}
            />
          </MetricGroup>
        </Segment>

        <Segment size={5}>
          <ColumnWidgetChart
            data={chartDataContentType}
            format={params.contentTypeMetric === 'count' ? '0,0' : '+0.00'}
            color='#FF8E51'
            loading={postsStore.isLoading}
            noDataStyle='graph'
            noDataMessage='Нет данных'
            noDataDescription='Мы не смогли типизировать ваш контент, потому что за выбранный период не было постов.'
            height={300}
          />
        </Segment>

        <Segment size={10}>
          <Title id='views' text='Длина текста в постах'/>
          <Segment size={3} />
          <Description size='big'>
            Сопроводительный текст нужен к любому виду постов. Для успешной контент-стратегии важно понимать какое количество символов будет максимально эффективным в определённой ситуации.
          </Description>
        </Segment>

        <Segment size={5}>
          <MetricGroup>
            <Metric
              title='Метод подсчёта'
              tooltipTitle='Сортировка по эффективности'
              tooltipText='В этом режиме посты с разной длиной текста будут отсортированы по своей эффективности.'
              value='Эффективность'
              onClick={() => params.changeParams({ textLengthMetric: 'grades' })}
              active={params.textLengthMetric === 'grades' || !params.textLengthMetric}
            />
            <Metric
              title='Метод подсчёта'
              tooltipTitle='Сортировка по количеству'
              tooltipText='В режиме сортировки по количеству вы увидите, какая длина текста в ваши постах использучется чаще всего.'
              value='Количество'
              onClick={() => params.changeParams({ textLengthMetric: 'count' })}
              active={params.textLengthMetric === 'count'}
            />
          </MetricGroup>
        </Segment>

        <Segment size={5}>
          <ColumnWidgetChart
            data={chartDataTextLength}
            format={params.textLengthMetric === 'count' ? '0,0' : '+0.00'}
            color='#FFAE33'
            loading={postsStore.isLoading}
            noDataStyle='graph'
            noDataMessage='Нет данных'
            noDataDescription='Мы не смогли определить длину текста в ваших постах за выбраный период.'
            height={300}
          />
        </Segment>

        <Segment size={10} />
      </Segment>
    )
  }
}

export default StatisticsCommunityDetailPage
