import { inject, observer } from 'mobx-react'
import moment from 'moment'
import React, { Component } from 'react'
import { IStatisticsParams } from '../../interfaces/IParams'
import CommunitiesStore from '../../stores/CommunitiesStore'
import PostsStore from '../../stores/PostsStore'
import { Stores } from '../../stores/RootStore'
import StatisticsStore from '../../stores/StatisticsStore'
import StatisticsSummaryStore from '../../stores/StatisticsSummaryStore'
import NoData from '../../ui/elements/NoData/NoData'
import Segment from '../../ui/elements/Segment/Segment'
import Toolbar2 from '../../ui/elements/Toolbar2/Toolbar2'
import Toolbar2Group from '../../ui/elements/Toolbar2/Toolbar2Group'
import withParams, { ParamsProps } from '../../utils/withParams'

import LiteLayout from '../layouts/LiteLayout'
import StatisticsCommunityCompetitorsPage from './community/StatisticsCommunityCompetitorsPage'
import StatisticsCommunityContentPage from './community/StatisticsCommunityContentPage'
import StatisticsCommunityDetailPage from './community/StatisticsCommunityDetailPage'
import StatisticsCommunityOverviewPage from './community/StatisticsCommunityOverviewPage'
import ButtonText from '../../ui/elements/ButtonText/ButtonText'
import CommunityNotification from '../../ui/elements/CommunityNotification/CommunityNotification'
import List from '../../ui/elements/List/List'
import ReportsStore from '../../stores/ReportsStore'
import StatisticsCommunityRecommendationsPage from './community/StatisticsCommunityRecommendationsPage'
import StatisticsCommunityNYPage from './community/StatisticsCommunityNYPage'
import DateRangePicker from '../../ui/modules/DateRangePicker/DateRangePicker'
import ProfileStore from '../../stores/ProfileStore'
import ButtonTextGroup from '../../ui/elements/ButtonText/ButtonTextGroup'
import Tooltip from '../../ui/modules/Tooltip/Tooltip'
import { Helmet } from 'react-helmet'
import uuid from '../../ui/behaviors/Uuid/Uuid'
import StatisticsCommunityCompetitorsContentPage from './community/StatisticsCommunityCompetitorsContentPage'
import StatisticsCommunityBrandSafetyPage from './community/StatisticsCommunityBrandSafetyPage'

interface IProps {
  params?: ParamsProps<IStatisticsParams>
  profileStore?: ProfileStore
  communitiesStore?: CommunitiesStore
  statisticsStore?: StatisticsStore
  statisticsSummaryStore?: StatisticsSummaryStore
  postsStore?: PostsStore
  reportsStore?: ReportsStore
}

/**
 * Страница StatisticsCommunityPage
 */
@withParams
@inject(Stores.PROFILE_STORE, Stores.COMMUNITIES_STORE, Stores.STATISTICS_STORE, Stores.STATISTICS_SUMMARY_STORE, Stores.POSTS_STORE, Stores.REPORTS_STORE)
@observer
class StatisticsCommunityPage extends Component<IProps> {

  constructor (props: IProps) {
    super(props)

    props.params.setDefaultParams({
      type: 'VK',
      page: 'detail',
      from: moment().subtract(13, 'days').format('DD.MM.YYYY'),
      to: moment().format('DD.MM.YYYY'),
      sort: 'interactions'
    })

    this.load()
  }

  componentDidUpdate (prevProps: Readonly<IProps>, prevState: Readonly<{}>, snapshot?: any): void {
    this.load()
  }

  load = () => {
    const { params, communitiesStore, statisticsStore, statisticsSummaryStore, postsStore } = this.props

    if (!communitiesStore.isLoading) {
      const myCommunity = params.type === 'ONE' ? communitiesStore.getCommunityByCommunityID(params.reportCommunityID) : communitiesStore.getMyCommunityBySocialType(params.type)
      // const myCommunitySocialTypes = communitiesStore.getMyCommunitySocialTypes()

      if (myCommunity) {
        statisticsStore.load(myCommunity.communityID, params.from, params.to, communitiesStore.communitiesHash)
        statisticsSummaryStore.load(myCommunity.socialType, params.from, params.to, communitiesStore.communitiesHash)
      }

      // // Если выбранная соцсеть не существует - редиректим на существующую или на настройки проекта
      // if (![...myCommunitySocialTypes, 'ONE'].includes(params.type) && params.type !== myCommunitySocialTypes[0]) {
      //   params.changeParams({ type: myCommunitySocialTypes[0] })
      // }
    }
    // Если нет выбранной вкладки - редиректим на overview
    if (!['detail', 'content', 'competitors', 'competitors_content', 'brand_safety', 'ny'].includes(params.page)) params.changeParams({ page: 'detail' })
  }

  download = async () => {
    const { params, communitiesStore, reportsStore } = this.props

    if (!communitiesStore.isLoading) {
      const myCommunity = communitiesStore.getMyCommunityBySocialType(params.type)

      if (myCommunity) {
        await reportsStore.loadCommunityReport(myCommunity.communityID, params.from, params.to)
        window.open(reportsStore.url)
      }
    }
  }

  render (): JSX.Element {
    const { params, reportsStore, profileStore, communitiesStore } = this.props

    const myCommunity = params.type === 'ONE' ? communitiesStore.getCommunityByCommunityID(params.reportCommunityID) : communitiesStore.getMyCommunityBySocialType(params.type)
    const myCommunityStatus = myCommunity?.communityStatus
    const competitorsCommunityStatus = communitiesStore.getCompetitorsCommunityStatusBySocialType(params.type)

    // todo: Вынести LiteLayout на уровень выше в App
    return (
      <LiteLayout
        secondHeader={!!communitiesStore.communities.length && (
          <Toolbar2 size='middle'>
            <Toolbar2Group>
              <ButtonTextGroup>
                {/*<ButtonText*/}
                {/*  size='big'*/}
                {/*  active={params.page === 'overview'}*/}
                {/*  onClick={() => params.changeParams({ page: 'overview', hash: 'top' })}>*/}
                {/*  Обзор*/}
                {/*</ButtonText>*/}
                <ButtonText
                  size='big'
                  active={params.page === 'detail'}
                  onClick={() => params.changeParams({ page: 'detail', hash: 'top' })}>
                  Статистика
                </ButtonText>
                <ButtonText
                  size='big'
                  active={params.page === 'content'}
                  onClick={() => params.changeParams({ page: 'content', hash: 'top' })}>
                  Контент
                </ButtonText>
                {params.type !== 'ONE' && (
                  <>
                    <ButtonText
                      size='big'
                      active={params.page === 'competitors'}
                      onClick={() => params.changeParams({ page: 'competitors', hash: 'top' })}>
                      Конкуренты
                    </ButtonText>
                    <ButtonText
                      size='big'
                      active={params.page === 'competitors_content'}
                      onClick={() => params.changeParams({ page: 'competitors_content', hash: 'top' })}>
                      Посты конкурентов
                    </ButtonText>
                  </>
                )}
                <ButtonText
                  size='big'
                  active={params.page === 'brand_safety'}
                  onClick={() => params.changeParams({ page: 'brand_safety', hash: 'top' })}>
                  Brand Safety
                </ButtonText>
                {/*<ButtonText*/}
                {/*  size='big'*/}
                {/*  active={params.page === 'ny'}*/}
                {/*  onClick={() => params.changeParams({ page: 'ny', hash: 'top' })}*/}
                {/*  icon='new_year'*/}
                {/*  iconColor='red'*/}
                {/*/>*/}
                {/*<ButtonText*/}
                {/*  size='big'*/}
                {/*  active={params.page === 'favorites'}*/}
                {/*  onClick={() => params.changeParams({ page: 'favorites', hash: 'top' })}*/}
                {/*  icon='star'/>*/}
              </ButtonTextGroup>
            </Toolbar2Group>
            <Toolbar2Group right>
              <DateRangePicker
                from={params.from}
                to={params.to}
                onChangePeriod={(from, to) => params.changeParams({ from, to })}
                retrospectives={profileStore.profile.isDemo ? 1 : profileStore.profile?.plan?.retrospectives}
                onBlockButtonClick={() => params.changeParams({ premium: 'true' })}
                onPremium={() => params.changeParams({ premium: 'true' })}
              />
              {params.type !== 'ONE' && (
                <Tooltip
                  delay={250}
                  trigger={
                    <ButtonText
                      size='big'
                      icon='download'
                      onClick={!profileStore.profile.isDemo && profileStore.profile.isReports && myCommunity?.isPaid ? this.download : (() => params.changeParams({ premium: 'true' })) }
                      loading={reportsStore.isLoading}
                      disabled={myCommunity?.communityStatus === 'COLLECTING'}
                    />
                }
                  title='Отчёт по странице'
                  text='Скачать отчёт по текущей странице за выбранный период в формате таблицы Microsoft Excel (.XLSX)'
                >
                </Tooltip>
              )}

              <ButtonText size='big' icon='gear' onClick={() => params.changeParams({ communityID: myCommunity?.communityID })} />
              {/*<Tooltip*/}
              {/*  delay={750}*/}
              {/*  trigger={<ButtonText size='big' icon='gear' onClick={() => params.changeParams({ communityID: myCommunity?.communityID })} />}*/}
              {/*  title='Настройки страницы'*/}
              {/*  text='Здесь находятся настройки текущей страницы, например — возможность отправки еженедельных отчётов на почту.'*/}
              {/*>*/}
              {/*</Tooltip>*/}
            </Toolbar2Group>
          </Toolbar2>
        )}
      >
        {/*@ts-ignore*/}
        <Helmet>
          <title>Статистика — КУБ Suite</title>
        </Helmet>

        {/* Хак для обновления mobX: */ Boolean(communitiesStore.communitiesHash)}
        {!myCommunity && myCommunityStatus !== 'COLLECTING' && (
          <Segment size={3}>
            <NoData
              style='advanced'
              size={400}
              message='Добавьте свои страницы'
              description='Чтобы начать пользоваться сервисом, нужно добавить хотя бы одну страницу. В один проект можно добавить по одной своей странице из каждой социальной сети и сколько угодно страниц конкурентов. Приступим?'
              buttonLabel='Добавить страницы'
              buttonOnClick={() => params.changeParams({ addCommunity: true, addCommunityType: 'my' })}
            />
          </Segment>
        )}

        {myCommunity && !myCommunity?.isPaid && (
          <Segment size={3}>
            <NoData
              style='advanced'
              size={400}
              message='Страница не оплачена'
              description='Вы не сможете посмотреть статистику страницы, пока она не оплачена. Если страница по каким-то причинам вам больше не нужна — можно удалить её в настройках проекта.'
              buttonLabel='На страницу оплаты'
              buttonOnClick={() => params.changeParams({ premium: 'true' })}
            />
          </Segment>
        )}

        {myCommunityStatus === 'COLLECTING' && myCommunity?.isPaid && (
          <Segment size={3}>
            <NoData
              loading
              style='advanced'
              size={400}
              message='Собираем данные по странице'
              description='Подождите несколько минут пока мы собираем начальные данные по вашей странице. Обычно всё происходит быстро.'
            />
          </Segment>
        )}

        {myCommunity && myCommunity.isPaid && (
          <List size='middle' noEmptyTopOffset={1}>
            {myCommunityStatus === 'PARTIAL' && ['overview', 'detail', 'content', 'ny'].includes(params.page) && (
                <CommunityNotification
                  title='Идёт ретроспективный сбор данных'
                  description='Сейчас мы собираем ретроспективные данные страницы — это может занять несколько часов. В это время могут возникнуть неточности при выборе больших периодов в прошлом.'
                />
            )}

            {myCommunity?.isPaid && myCommunityStatus !== 'COLLECTING' && competitorsCommunityStatus === 'COLLECTING' && ['overview', 'competitors', 'competitors_content'].includes(params.page) && (
                <CommunityNotification
                  loading
                  title='Некоторые страницы конкурентов пока недоступны'
                  description='Сейчас мы собираем первичные данные по страницам конкурентов — обычно это занимает не больше 10-15 минут. Во время анализа страницы не будут учитываться в статистике.'
                />
            )}

            {myCommunityStatus !== 'COLLECTING' && competitorsCommunityStatus === 'PARTIAL' && ['overview', 'competitors', 'competitors_content'].includes(params.page) && (
                <CommunityNotification
                  title='Данные могут быть не полными'
                  description='Идёт сбор ретроспективных данных по страницам конкурентов — обычно это занимает несколько часов. В это время статистика может быть не полной.'
                />
            )}
          </List>
        )}

        {myCommunity && myCommunity.communityStatus !== 'COLLECTING' && myCommunity.isPaid && (
          <>
            {params.page === 'overview' && <StatisticsCommunityOverviewPage />}
            {params.page === 'detail' && <StatisticsCommunityDetailPage />}
            {params.page === 'content' && <StatisticsCommunityContentPage />}
            {params.page === 'competitors' && <StatisticsCommunityCompetitorsPage />}
            {params.page === 'competitors_content' && <StatisticsCommunityCompetitorsContentPage />}
            {params.page === 'brand_safety' && <StatisticsCommunityBrandSafetyPage />}
            {params.page === 'recommendations' && <StatisticsCommunityRecommendationsPage />}
            {params.page === 'ny' && <StatisticsCommunityNYPage />}
          </>
        )}

      </LiteLayout >
    )
  }
}

export default StatisticsCommunityPage
