import { inject, observer } from 'mobx-react'
import moment from 'moment'
import React, { Component } from 'react'
import { IStatisticsParams } from '../interfaces/IParams'
import CommunitiesStore from '../stores/CommunitiesStore'
import PostsStore from '../stores/PostsStore'
import { Stores } from '../stores/RootStore'
import StatisticsStore from '../stores/StatisticsStore'
import NoData from '../ui/elements/NoData/NoData'
import Segment from '../ui/elements/Segment/Segment'
import Toolbar2 from '../ui/elements/Toolbar2/Toolbar2'
import Toolbar2Group from '../ui/elements/Toolbar2/Toolbar2Group'
import withParams, { ParamsProps } from '../utils/withParams'

import LiteLayout from './layouts/LiteLayout'
import ButtonText from '../ui/elements/ButtonText/ButtonText'
import CommunityNotification from '../ui/elements/CommunityNotification/CommunityNotification'
import List from '../ui/elements/List/List'
import ReportsStore from '../stores/ReportsStore'
import DateRangePicker from '../ui/modules/DateRangePicker/DateRangePicker'
import ProfileStore from '../stores/ProfileStore'
import ButtonTextGroup from '../ui/elements/ButtonText/ButtonTextGroup'
import Tooltip from '../ui/modules/Tooltip/Tooltip'
import GlobalSearchPage from './search/GlobalSearchPage'

interface IProps {
  params?: ParamsProps<IStatisticsParams>
  profileStore?: ProfileStore
  communitiesStore?: CommunitiesStore
  statisticsStore?: StatisticsStore
  postsStore?: PostsStore
  reportsStore?: ReportsStore
}

/**
 * Страница ContentPage
 */
@withParams
@inject(Stores.PROFILE_STORE, Stores.SOURCES_STORE, Stores.COMMUNITIES_STORE, Stores.POSTS_STORE, Stores.REPORTS_STORE)
@observer
class ContentPage extends Component<IProps> {
  constructor (props: IProps) {
    super(props)

    props.params.setDefaultParams({
      type: 'VK',
      page: 'overview',
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
    const { params, communitiesStore, postsStore } = this.props

    if (!communitiesStore.isLoading) {
      postsStore.loadCompetitors(params.accountID, params.type, params.from, params.to, params.grades, params.text, params.sort, params.direction)
    }

    // Если нет выбранной вкладки - редиректим на overview
    if (!['content', 'catalog'].includes(params.page)) params.changeParams({ page: 'content' })
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

    const myCommunity = communitiesStore.getMyCommunityBySocialType(params.type)
    const myCommunityStatus = communitiesStore.getMyCommunityStatusBySocialType(params.type)
    const competitorsCommunityStatus = communitiesStore.getCompetitorsCommunityStatusBySocialType(params.type)

    const myCommunitySocialTypes = communitiesStore.getMyCommunitySocialTypes()

    return (
      <LiteLayout
        secondHeader={!!myCommunitySocialTypes.length && (
          <Toolbar2 size='middle'>
            <Toolbar2Group>
              <ButtonTextGroup>
                <ButtonText
                  size='big'
                  active={params.page === 'content'}
                  onClick={() => params.changeParams({ page: 'content', hash: 'top' })}>
                  Контент конкурентов
                </ButtonText>
                <ButtonText
                  size='big'
                  active={params.page === 'catalog'}
                  onClick={() => params.changeParams({ page: 'catalog', hash: 'top' })}>
                  Общий каталог
                </ButtonText>
              </ButtonTextGroup>
            </Toolbar2Group>
            <Toolbar2Group right>
              <DateRangePicker
                from={params.from}
                to={params.to}
                onChangePeriod={(from, to) => params.changeParams({ from, to })}
                // isBlocked={profileStore.profile.isDemo}
                retrospectives={profileStore.profile?.plan?.retrospectives}
                onBlockButtonClick={() => params.changeParams({ premium: 'true' })}
                onPremium={() => params.changeParams({ premium: 'true' })}
              />
              <Tooltip
                delay={750}
                trigger={
                  <ButtonText
                      size='big'
                      icon='download'
                      onClick={ this.download }
                      loading={reportsStore.isLoading}
                      disabled={myCommunity?.communityStatus === 'COLLECTING' || !myCommunity?.isPaid}
                  />
                }
                title='Отчёт по странице'
                text='Скачать отчёт по текущей странице за выбранный период в формате таблицы Microsoft Excel (.XLSX)'
              >
              </Tooltip>

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
        {/* Хак для обновления mobX: */ Boolean(communitiesStore.communitiesHash)}

        {myCommunity && !myCommunity.isPaid && (
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

        {myCommunity && myCommunity.isPaid && (
          <List size='middle'>
            {myCommunityStatus === 'PARTIAL' && ['overview', 'detail', 'content', 'ny'].includes(params.page) && (
              <CommunityNotification
                title='Идёт ретроспективный сбор данных'
                description='Сейчас мы собираем ретроспективные данные страницы — это может занять несколько часов. В это время могут возникнуть неточности при выборе больших периодов в прошлом.'
              />
            )}

            {myCommunityStatus !== 'COLLECTING' && competitorsCommunityStatus === 'COLLECTING' && ['overview', 'competitors'].includes(params.page) && (
              <CommunityNotification
                loading
                title='Некоторые страницы конкурентов пока недоступны'
                description='Сейчас мы собираем первичные данные по страницам конкурентов — обычно это занимает не больше 10-15 минут. Во время анализа страницы не будут учитываться в статистике.'
              />
            )}

            {myCommunityStatus !== 'COLLECTING' && competitorsCommunityStatus === 'PARTIAL' && ['overview', 'competitors'].includes(params.page) && (
              <CommunityNotification
                title='Данные могут быть не полными'
                description='Идёт сбор ретроспективных данных по страницам конкурентов — обычно это занимает несколько часов. В это время статистика может быть не полной.'
              />
            )}
          </List>
        )}

        {params.page === 'content' && <GlobalSearchPage />}
        {params.page === 'catalog' && <NoData
          message='Общий каталог в разработке'
          description='Сейчас мы работаем над расширением функционала КУБ Suite.'
        />}

      </LiteLayout>
    )
  }
}

export default ContentPage
