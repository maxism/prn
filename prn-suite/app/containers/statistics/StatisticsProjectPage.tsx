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
import ButtonText from '../../ui/elements/ButtonText/ButtonText'
import CommunityNotification from '../../ui/elements/CommunityNotification/CommunityNotification'
import List from '../../ui/elements/List/List'
import ReportsStore from '../../stores/ReportsStore'
import DateRangePicker from '../../ui/modules/DateRangePicker/DateRangePicker'
import ProfileStore from '../../stores/ProfileStore'
import ButtonTextGroup from '../../ui/elements/ButtonText/ButtonTextGroup'
import StatisticsProjectOverviewPage from './project/StatisticsProjectOverviewPage'
import StatisticsProjectCompetitorsPage from './project/StatisticsProjectCompetitorsPage'
import { Helmet } from 'react-helmet'
import StatisticsProjectInfluencersPage from './project/StatisticsProjectInfluencersPage'
import Icon from '../../ui/elements/Icon/Icon'
import Tooltip from '../../ui/modules/Tooltip/Tooltip'
import Popup from '../../ui/elements/Popup/Popup'
import PopupButton from '../../ui/elements/Popup/PopupButton'

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
 * Страница StatisticsProjectPage
 */
@withParams
@inject(Stores.PROFILE_STORE, Stores.COMMUNITIES_STORE, Stores.STATISTICS_STORE, Stores.STATISTICS_SUMMARY_STORE, Stores.POSTS_STORE, Stores.REPORTS_STORE)
@observer
class StatisticsProjectPage extends Component<IProps> {

  constructor (props: IProps) {
    super(props)

    props.params.setDefaultParams({
      type: 'VK',
      page: 'overview',
      from: moment().subtract(13, 'days').format('DD.MM.YYYY'),
      to: moment().format('DD.MM.YYYY'),
      sort: 'interactions',
      tableSort: '-score'
    })

    this.load()
  }

  componentDidUpdate (prevProps: Readonly<IProps>, prevState: Readonly<{}>, snapshot?: any): void {
    this.load()
  }

  load = () => {
    const { params, communitiesStore, statisticsSummaryStore } = this.props

    statisticsSummaryStore.load('ALL', params.from, params.to, communitiesStore.communitiesHash)

    // Если нет выбранной вкладки - редиректим на overview
    if (!['overview', 'competitors', 'influencers'].includes(params.page)) params.changeParams({ page: 'overview' })
  }

  download = async (short: boolean) => {
    const { params, communitiesStore, reportsStore } = this.props

    if (!communitiesStore.isLoading) {
      await reportsStore.loadReport('ALL', params.from, params.to, short)
      window.open(reportsStore.url)
    }
  }

  render (): JSX.Element {
    const { params, profileStore, communitiesStore, reportsStore } = this.props

    const communities = communitiesStore.getCommunities()
    const myCommunities = communitiesStore.getMyCommunities()
    const myCommunityStatus = communitiesStore.getMyCommunityStatus()
    const competitorsCommunityStatus = communitiesStore.getCompetitorsCommunityStatus()

    // todo: Вынести LiteLayout на уровень выше в App
    return (
      <LiteLayout
        secondHeader={!!communitiesStore.communities.length && (
          <Toolbar2 size='middle'>
            <Toolbar2Group>
              <ButtonTextGroup>
                <ButtonText
                  size='big'
                  active={params.page === 'overview'}
                  onClick={() => params.changeParams({ page: 'overview', hash: 'top' })}>
                  Обзор своей статистики
                </ButtonText>
                <ButtonText
                  size='big'
                  active={params.page === 'competitors'}
                  onClick={() => params.changeParams({ page: 'competitors', hash: 'top' })}>
                  Обзор конкурентов
                </ButtonText>
                <ButtonText
                  size='big'
                  active={params.page === 'influencers'}
                  onClick={() => params.changeParams({ page: 'influencers', hash: 'top' })}>
                  Обзор блогеров
                </ButtonText>
              </ButtonTextGroup>
            </Toolbar2Group>
            <Toolbar2Group right>
              {params.page !== 'influencers' && (
                <DateRangePicker
                  from={params.from}
                  to={params.to}
                  onChangePeriod={(from, to) => params.changeParams({ from, to })}
                  retrospectives={profileStore.profile.isDemo ? 1 : profileStore.profile?.plan?.retrospectives}
                  onBlockButtonClick={() => params.changeParams({ premium: 'true' })}
                  onPremium={() => params.changeParams({ premium: 'true' })}
                />
              )}

              <Popup
                trigger={<ButtonText size='big' icon='download' loading={reportsStore.isLoading} />}
                size='small'
              >
                <PopupButton onClick={() => !profileStore.profile.isDemo && profileStore.profile.isReports ? this.download(false) : params.changeParams({ premium: 'true' })} autoClosePopup>Полный отчет</PopupButton>
                <PopupButton onClick={() => !profileStore.profile.isDemo && profileStore.profile.isReports ? this.download(true) : params.changeParams({ premium: 'true' })} autoClosePopup>Сокращенный отчет</PopupButton>
              </Popup>

              <ButtonText size='big' icon='gear' onClick={() => params.changeUrl('/settings/communities')} />
            </Toolbar2Group>
          </Toolbar2>
        )}
      >
        {/*@ts-ignore*/}
        <Helmet>
          <title>Статистика проекта — КУБ Suite</title>
        </Helmet>

        {/* Хак для обновления mobX: */ Boolean(communitiesStore.communitiesHash)}
        {!communities.length && (
          <Segment size={3}>
            <NoData
              style='advanced'
              size={400}
              message='Добавьте страницы'
              description='Чтобы начать пользоваться сервисом, нужно добавить хотя бы одну страницу в проект. В один проект можно добавить свои страницы, конкурентов и блогеров. Приступим?'
              buttonLabel='Добавить страницы'
              buttonOnClick={() => params.changeParams({ addCommunity: true, addCommunityType: 'my' })}
            />
          </Segment>
        )}

        {!!myCommunities.length && myCommunities.every(myCommunity => !myCommunity.isPaid) && (
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

        {myCommunityStatus === 'COLLECTING' && myCommunities.length === 1 && myCommunities[0].isPaid && (
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

        {myCommunities.length > 1 && myCommunities.some(myCommunity => myCommunity.isPaid) && (
          <List size='middle' noEmptyTopOffset={1}>
            {myCommunityStatus === 'COLLECTING' && (
              <CommunityNotification
                loading
                title='Некоторые страницы пока недоступны'
                description='Сейчас мы собираем первичные данные по страницам — обычно это занимает не больше 10-15 минут. Во время анализа страницы не будут учитываться в статистике.'
              />
            )}

            {myCommunityStatus === 'PARTIAL' && (
              <CommunityNotification
                loading
                title='Идёт ретроспективный сбор данных'
                description='Сейчас мы собираем ретроспективные данные страниц — это может занять несколько часов. В это время могут возникнуть неточности при выборе больших периодов в прошлом.'
              />
            )}

            {competitorsCommunityStatus === 'COLLECTING' && params.page === 'competitors' && (
              <CommunityNotification
                loading
                title='Некоторые страницы конкурентов пока недоступны'
                description='Сейчас мы собираем первичные данные по страницам конкурентов — обычно это занимает не больше 10-15 минут. Во время анализа страницы не будут учитываться в статистике.'
              />
            )}

            {competitorsCommunityStatus === 'PARTIAL' && params.page === 'competitors' && (
              <CommunityNotification
                loading
                title='Данные могут быть не полными'
                description='Идёт сбор ретроспективных данных по страницам конкурентов — обычно это занимает несколько часов. В это время статистика может быть не полной.'
              />
            )}
          </List>
        )}

        {!!communities.length && communities.some(myCommunity => myCommunity.communityStatus !== 'COLLECTING' && myCommunity.isPaid) && (
          <>
            {params.page === 'overview' && <StatisticsProjectOverviewPage />}
            {params.page === 'competitors' && <StatisticsProjectCompetitorsPage />}
            {params.page === 'influencers' && <StatisticsProjectInfluencersPage />}
          </>
        )}

      </LiteLayout>
    )
  }
}

export default StatisticsProjectPage
