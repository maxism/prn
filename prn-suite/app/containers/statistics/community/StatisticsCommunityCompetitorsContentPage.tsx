import { inject, observer } from 'mobx-react'
import moment from 'moment'
import React, { Component } from 'react'
import ISocialType from '../../../interfaces/ISocialType'
import { IStatisticsParams } from '../../../interfaces/IParams'
import CommunitiesStore from '../../../stores/CommunitiesStore'
import PostsStore from '../../../stores/PostsStore'
import { Stores } from '../../../stores/RootStore'
import ButtonText from '../../../ui/elements/ButtonText/ButtonText'
import ButtonTextGroup from '../../../ui/elements/ButtonText/ButtonTextGroup'
import Description from '../../../ui/elements/Description/Description'
import List from '../../../ui/elements/List/List'
import Segment from '../../../ui/elements/Segment/Segment'
import Select from '../../../ui/elements/Select/Select'
import Title from '../../../ui/elements/Title/Title'
import Toolbar2 from '../../../ui/elements/Toolbar2/Toolbar2'
import Toolbar2Group from '../../../ui/elements/Toolbar2/Toolbar2Group'
import Post from '../../../ui/elements/Post/Post'
import ContentWidgetChart, { IContentWidgetPost } from '../../../ui/views/statistics/widgets/ContentWidgetChart/ContentWidgetChart'
import withParams, { ParamsProps } from '../../../utils/withParams'
import { ICommunityPicker } from '../../../ui/modules/CommunitiesPicker/CommunitiesPicker'
import NoData from '../../../ui/elements/NoData/NoData'
import CommunityType from '../../../types/CommunityType'
import InputText from '../../../ui/elements/InputText/InputText'
import { Helmet } from 'react-helmet'
import StatisticsStore from '../../../stores/StatisticsStore'
import StatisticsSummaryStore from '../../../stores/StatisticsSummaryStore'

interface IProps {
  params?: ParamsProps<IStatisticsParams>
  communitiesStore?: CommunitiesStore
  statisticsStore?: StatisticsStore
  statisticsSummaryStore?: StatisticsSummaryStore
  postsStore?: PostsStore
}

@withParams
@inject(Stores.COMMUNITIES_STORE, Stores.STATISTICS_STORE, Stores.STATISTICS_SUMMARY_STORE, Stores.POSTS_STORE)
@observer
class StatisticsCommunityContentPage extends Component<IProps> {
  state = {
    postsLimit: 20
  }

  componentDidMount () {
    this.load()
  }

  componentDidUpdate (prevProps: Readonly<IProps>, prevState: Readonly<{}>, snapshot?: any): void {
    this.load()
  }

  load = () => {
    const { params, communitiesStore, statisticsStore, statisticsSummaryStore, postsStore } = this.props

    const myCommunity = params.type === 'ONE' ? communitiesStore.getCommunityByCommunityID(params.reportCommunityID) : communitiesStore.getMyCommunityBySocialType(params.type)
    const myCommunitySocialTypes = communitiesStore.getMyCommunitySocialTypes()

    if (myCommunity) {
      statisticsStore.load(myCommunity.communityID, params.from, params.to, communitiesStore.communitiesHash)
      statisticsSummaryStore.load(myCommunity.socialType, params.from, params.to, communitiesStore.communitiesHash)
      postsStore.loadCompetitors(params.accountID, myCommunity.socialType, params.from, params.to, params.grades, params.text, params.sort, params.direction)
    }

    // Если выбранная соцсеть не существует - редиректим на существующую или на настройки проекта
    if (![...myCommunitySocialTypes, 'ONE'].includes(params.type) && params.type !== myCommunitySocialTypes[0]) {
      params.changeParams({ type: myCommunitySocialTypes[0] })
    }

    // Если нет выбранной вкладки - редиректим на overview
    if (!['detail', 'content', 'competitors', 'competitors_content'].includes(params.page)) params.changeParams({ page: 'detail' })
  }

  handleToggleGrade = (grade: string) => {
    let { params } = this.props

    let newGrades = params.grades || []

    if (!newGrades.includes(grade)) newGrades.push(grade)
    else newGrades = newGrades.filter(g => g !== grade)

    params.changeParams({ grades: newGrades })
  }

  render (): JSX.Element {
    const { params, communitiesStore, postsStore } = this.props

    let posts: Array<IContentWidgetPost> = postsStore.competitorsPosts.map(post => ({
      id: post.postID,
      date: moment(post.date).valueOf(),
      socialType: post.socialType as ISocialType,
      grade: post.mainGrade,
      indexGrade: post.indexGrade,
      usersCount: post.usersCount,
      postImage: post.postImage,
      text: post.text,
      interactions: post.interactions,
      likes: post.likes,
      comments: post.comments,
      rePosts: post.rePosts,
      views: post.views,
      er: post.er
    }))

    if (posts.length > 100) posts = posts.slice(0, 100)

    const list = [
      { id: 'interactions', name: 'Реакции', value: posts.length && posts.reduce((a, c) => a + c.interactions, 0) || null },
      { id: 'likes', name: 'Лайки', value: posts.length && posts.reduce((a, c) => a + c.likes, 0) || null },
      { id: 'comments', name: 'Комментарии', value: posts.length && posts.reduce((a, c) => a + c.comments, 0) || null },
      { id: 'rePosts', name: 'Репосты', value: posts.length && posts.reduce((a, c) => a + c.rePosts, 0) || null },
      { id: 'views', name: 'Просмотры', value: posts.length && posts.reduce((a, c) => a + c.views, 0) || null },
      { id: 'er', name: 'Вовлеченность', value: posts.length && posts.reduce((a, c) => a + c.er, 0) || null },
      { id: 'usersCount', name: 'Подписчики', value: posts.length && posts.reduce((a, c) => a + c.usersCount, 0) || null },
      { id: 'indexGrade', name: 'Эффективность', value: posts.length && posts.reduce((a, c) => a + c.indexGrade, 0) || null },
      { id: 'date', name: 'Время публикации' }
    ].filter(item => item.value !== null)

    const competitorCommunities: Array<ICommunityPicker> = communitiesStore.getCompetitorsCommunitiesBySocialType(params.type).map(item => ({
      communityID: item.communityID,
      image: item.image,
      name: item.name,
      url: item.url,
      checked: (params.competitorsIDs || []).includes(item.communityID)
    }))

    if (!competitorCommunities.length) {
      return (
        <Segment size={3}>
          <NoData
            style='advanced'
            size={400}
            message='Нужно добавить конкурентов'
            description='Здесь пусто — потому что вы ещё не добавили ни одной страницы конкурентов.'
            buttonLabel='Добавить конкурентов'
            buttonOnClick={() => params.changeParams({ addCommunity: true, addCommunityType: CommunityType.COMPETITOR })}
          />
        </Segment>
      )
    }

    return (
      <Segment size={5}>
        {/*@ts-ignore*/}
        <Helmet>
          <title>Статистика, Посты конкурентов — КУБ Suite</title>
        </Helmet>

        <Title id='content' text='Обзор постов конкурентов'>
          {/*<ButtonText icon='download'>Сохранить</ButtonText>*/}
        </Title>
        <Segment size={3} />
        <Description size='big'>
          Анализ постов конкурентов — очень важный момент. Здесь вы можете найти лучше посты по выбранной метрике, чтобы понять какой контент интересен вашей аудитории. И наоборот. Изучайте и добавляйте посты в коллекции.
        </Description>

        <Segment size={5}>
          <Toolbar2 zIndex={900} sticky stickyOffset={6}>
            <Toolbar2Group>
              <ButtonTextGroup>
                <ButtonText icon='grade_a_plus_colored' active={!!(params.grades || []).includes('a_plus')} onClick={e => this.handleToggleGrade('a_plus')} />
                <ButtonText icon='grade_a_colored' active={!!(params.grades || []).includes('a')} onClick={e => this.handleToggleGrade('a')} />
                <ButtonText icon='grade_b_colored' active={!!(params.grades || []).includes('b')} onClick={e => this.handleToggleGrade('b')} />
                <ButtonText icon='grade_c_colored' active={!!(params.grades || []).includes('c')} onClick={e => this.handleToggleGrade('c')} />
                <ButtonText icon='grade_d_colored' active={!!(params.grades || []).includes('d')} onClick={e => this.handleToggleGrade('d')} />
              </ButtonTextGroup>
            </Toolbar2Group>
            <Toolbar2Group>
              <Select list={list} value={params.sort} onSelect={e => params.changeParams({ sort: e.target.value })} />
              <ButtonText icon={ params.direction === 'asc' ? 'sort_asc' : 'sort_desc'} size='big' onClick={e => params.changeParams({ direction: params.direction === 'asc' ? 'desc' : 'asc' })} />
            </Toolbar2Group>
            <Toolbar2Group fill>
              <InputText
                icon='search'
                value={params.text}
                onChange={e => params.changeParams({ text: e.target.value })}
                label='Поиск'
              />
            </Toolbar2Group>
          </Toolbar2>

          <Segment size={5}>
            <List isLoading={postsStore.isLoading} loadingText='Загружаем посты' emptyText={params.page === 'competitors_content' && 'Нет постов'}>
              {postsStore.competitorsPosts.slice(0, this.state.postsLimit).map(post => (
                <Post
                  key={post.postID}
                  communityImage={post.image}
                  communityName={post.name}
                  communityUrl={post.url}
                  socialType={post.socialType}
                  postUrl={post.postUrl}
                  date={post.date}
                  image={post.postImage}
                  text={post.text}
                  tags={post.tags}
                  mainGrade={post.mainGrade}
                  indexGrade={post.indexGrade}
                  metrics={[
                    { name: 'Вовлеченность', value: post.er, format: '0.00%' },
                    { name: 'Реакции', value: post.interactions },
                    { name: 'Просмотры', value: post.views },
                    { name: 'Лайки', value: post.likes },
                    { name: 'Комментарии', value: post.comments },
                    { name: 'Репосты', value: post.rePosts }
                  ]}
                  mentions={post.mentions}
                  onAddMentionUrl={(url) => params.changeParams({ addCommunity: true, addUrl: url })}
                  isDeleted={post.isDeleted}
                  isAd={post.isAd}
                  onClick={() => params.changeParams({ postID: post.postID })}
                />
              ))}
            </List>
          </Segment>
          {!postsStore.isLoading && this.state.postsLimit < postsStore.competitorsPosts.length && (
            <Segment size={2}>
              <ButtonTextGroup center>
                <ButtonText color='blue' onClick={() => this.setState({ postsLimit: this.state.postsLimit + 20 })}>Показать еще</ButtonText>
              </ButtonTextGroup>
            </Segment>
          )}
        </Segment>

        <Segment size={10} />
      </Segment>
    )
  }
}

export default StatisticsCommunityContentPage
