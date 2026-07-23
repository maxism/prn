import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import ISocialType from '../../interfaces/ISocialType'
import { IStatisticsParams } from '../../interfaces/IParams'
import CommunitiesStore from '../../stores/CommunitiesStore'
import { Stores } from '../../stores/RootStore'
import ButtonText from '../../ui/elements/ButtonText/ButtonText'
import ButtonTextGroup from '../../ui/elements/ButtonText/ButtonTextGroup'
import List from '../../ui/elements/List/List'
import Segment from '../../ui/elements/Segment/Segment'
import Select from '../../ui/elements/Select/Select'
import Toolbar2 from '../../ui/elements/Toolbar2/Toolbar2'
import Toolbar2Group from '../../ui/elements/Toolbar2/Toolbar2Group'
import withParams, { ParamsProps } from '../../utils/withParams'
import InputText from '../../ui/elements/InputText/InputText'
import SocialDataUtil from '../../utils/SocialDataUtil'
import Title from '../../ui/elements/Title/Title'
import NumeralUtil from '../../utils/NumeralUtil'
import CommunityStats from '../../ui/elements/CommunityStats/CommunityStats'
import Checkbox from '../../ui/elements/Checkbox/Checkbox'
import ProfileStore from '../../stores/ProfileStore'

interface IProps {
  params?: ParamsProps<IStatisticsParams>
  profileStore?: ProfileStore
  communitiesStore?: CommunitiesStore
}

@withParams
@inject(Stores.PROFILE_STORE, Stores.COMMUNITIES_STORE)
@observer
class GlobalSearchPage extends Component<IProps> {
  state = {
    q: '',
    socialType: 'ALL',
    accountType: '',
    location: '',
    language: '',
    category: '',
    interest: '',
    gender: '',
    minAge: '',
    maxAge: '',
    minUsersCount: '',
    maxUsersCount: '',
    minER: '',
    maxER: '',
    minViews: '',
    maxViews: '',
    audienceLocation: '',
    audienceGender: '',
    minAudienceAge: '',
    maxAudienceAge: '',
    maxFakeFollowers: '',
    minQualityScore: '',
    minAudienceLocationsPercent: '50',
    minAudienceGendersPercent: '60',
    minAudienceAgePercent: '30',
    isVerified: '',
    isActive: '',
    sort: '',
    page: 1,
    showResults: false
  }

  constructor (props: IProps) {
    super(props)

    this.search()
  }

  search = (newState: object = {}) => {
    const state = {
      ...this.state,
      showResults: true,
      page: 1,
      ...newState
    }
    this.setState(state)

    this.props.communitiesStore.search(state.q, {
      socialType: state.socialType,
      tags: [state.accountType].filter(Boolean),
      locations: [state.location].filter(Boolean),
      language: state.language,
      category: state.category,
      interest: state.interest,
      genders: state.gender,
      minAge: state.minAge ? NumeralUtil.fromString(state.minAge) : undefined,
      maxAge: state.maxAge ? NumeralUtil.fromString(state.maxAge) : undefined,
      minUsersCount: state.minUsersCount ? NumeralUtil.fromString(state.minUsersCount) : undefined,
      maxUsersCount: state.maxUsersCount ? NumeralUtil.fromString(state.maxUsersCount) : undefined,
      minER: state.minER ? NumeralUtil.fromString(state.minER) / 100 : undefined,
      maxER: state.maxER ? NumeralUtil.fromString(state.maxER) / 100 : undefined,
      minViews: state.minViews ? NumeralUtil.fromString(state.minViews) : undefined,
      maxViews: state.maxViews ? NumeralUtil.fromString(state.maxViews) : undefined,
      audienceLocations: [state.audienceLocation].filter(Boolean),
      audienceGenders: state.audienceGender,
      minAudienceAge: state.minAudienceAge ? NumeralUtil.fromString(state.minAudienceAge) : undefined,
      maxAudienceAge: state.maxAudienceAge ? NumeralUtil.fromString(state.maxAudienceAge) : undefined,
      maxFakeFollowers: state.maxFakeFollowers ? NumeralUtil.fromString(state.maxFakeFollowers) : undefined,
      minQualityScore: state.minQualityScore ? NumeralUtil.fromString(state.minQualityScore) : undefined,
      minAudienceLocationsPercent: state.minAudienceLocationsPercent ? NumeralUtil.fromString(state.minAudienceLocationsPercent) : undefined,
      minAudienceGendersPercent: state.minAudienceGendersPercent ? NumeralUtil.fromString(state.minAudienceGendersPercent) : undefined,
      minAudienceAgePercent: state.minAudienceAgePercent ? NumeralUtil.fromString(state.minAudienceAgePercent) : undefined,
      isVerified: Boolean(state.isVerified) || undefined,
      isActive: Boolean(state.isActive) || undefined,
      page: state.page,
      sort: state.sort
    })
  }

  render (): JSX.Element {
    const { params, profileStore, communitiesStore } = this.props
    const state = this.state

    const socialTypes = ['ALL', 'VK', 'FB', 'INST', 'TW', 'OK', 'TT', 'TG', 'YZ', 'RT', 'YT', 'VB', 'TC', 'VC', 'MX']
    let socialTypesList = socialTypes.map(socialType => ({
      id: socialType,
      icon: `${socialType.toLowerCase()}_colored`,
      name: SocialDataUtil.getSocialTypeName(socialType as ISocialType)
    }))

    const accountTypeList = [
      { id: '', name: 'Все аккаунты' },
      { id: 'influencer', name: 'Блогеры' },
      { id: 'business', name: 'Бизнес' },
    ]

    const sortList = [
      { id: '-score', name: 'По релевантности' },
      { id: '-usersCount', name: 'По подписчикам' },
      { id: '-avgViews', name: 'По просмотрам' },
      { id: '-avgER', name: 'По вовлеченности' },
      { id: '-qualityScore', name: 'По качеству' },
      { id: '-avgDeltaUsersCountPerWeek', name: 'По приросту подписчиков' },
      { id: '-toMentions180d', name: 'По упоминаниям' },
      { id: '-toMentionsCommunities180d', name: 'По упоминающим' },
      { id: '-toMentionsViews180d', name: 'По охвату упоминаний' },
      { id: '-fromMentions180d', name: 'По рекламе' },
      { id: '-fromMentionsCommunities180d', name: 'По рекламодателям' },
      { id: '-fromMentionsViews180d', name: 'По охвату рекламы' },
      { id: '-pctUsersCount180d', name: 'По % прироста подписчиков' },
    ]

    const gendersList = [
      { id: '', name: 'Любой пол' },
      { id: 'f', name: 'Женщины' },
      { id: 'm', name: 'Мужчины' },
    ]

    const fakeFollowersList = [
      { id: '', name: 'Любое' },
      { id: '0.05', name: 'Очень мало, до 5%' },
      { id: '0.1', name: 'Мало, до 10%' },
      { id: '0.2', name: 'Средне, до 20%' },
      { id: '0.3', name: 'Много, до 30%' },
      { id: '0.4', name: 'Очень много, до 40%' }
    ]

    const qualityScoreList = [
      { id: '', name: 'Любой' },
      { id: '0.9', name: 'Отличный, от 90%' },
      { id: '0.8', name: 'Очень хороший, от 80%' },
      { id: '0.6', name: 'Хороший, от 60%' },
      { id: '0.4', name: 'Средний, от 60%' },
      { id: '0.25', name: 'Можно лучше, от 25%' }
    ]

    const gtePercentsList = [
      { id: '', name: 'Любой' },
      { id: '90', name: 'Больше 90%' },
      { id: '80', name: 'Больше 80%' },
      { id: '70', name: 'Больше 70%' },
      { id: '60', name: 'Больше 60%' },
      { id: '50', name: 'Больше 50%' },
      { id: '40', name: 'Больше 40%' },
      { id: '30', name: 'Больше 30%' },
      { id: '20', name: 'Больше 20%' },
      { id: '10', name: 'Больше 10%' },
    ]

    return (
      <Segment size={0}>
        <Title size='small' text='Расширенный поиск' />
        <Segment size={1}>
          <Toolbar2>
            <Toolbar2Group fill>
              <InputText
                icon='search'
                value={state.q}
                onChange={e => this.setState({ q: e.target.value })}
                onEnter={e => this.search({ q: e.target.value })}
                onClear={e => this.search({ q: '' })}
                label='Название страницы, ссылка или ключевые слова'
              />
            </Toolbar2Group>
            <Toolbar2Group>
              <Select
                label='Социальная сеть'
                icon={`${this.state.socialType.toLowerCase()}_colored`}
                list={socialTypesList} value={this.state.socialType}
                onSelect={e => this.search({ socialType: e.target.value as ISocialType })}
                maxHeight={320}
                scrolling
              />
            </Toolbar2Group>
            <Toolbar2Group>
              <Select
                label='Тип аккаунта'
                list={accountTypeList} value={state.accountType}
                onSelect={e => this.search({ accountType: e.target.value })}
                maxHeight={320}
                scrolling
              />
            </Toolbar2Group>
          </Toolbar2>
        </Segment>
        <Segment>
          <Toolbar2>
            <Toolbar2Group fill>
              <Select
                label='Страна или город'
                list={communitiesStore.getLocations.map(tag => ({ id: tag.tagID, name: tag.name }))} value={state.location}
                onSelect={e => this.search({ location: e.target.value })}
                maxHeight={320}
                scrolling
                filtered={200}
                emptyName='Любая страна и город'
              />
            </Toolbar2Group>
            <Toolbar2Group>
              <Select
                label='Пол автора'
                list={gendersList} value={state.gender}
                onSelect={e => this.search({ gender: e.target.value })}
                maxHeight={320}
              />
            </Toolbar2Group>
            <Toolbar2Group>
              <InputText
                value={state.minAge}
                onChange={e => this.setState({ minAge: e.target.value })}
                onEnter={e => this.search({ minAge: e.target.value })}
                onClear={e => this.search({ minAge: '' })}
                label='Возраст От'
              />
              <InputText
                value={state.maxAge}
                onChange={e => this.setState({ maxAge: e.target.value })}
                onEnter={e => this.search({ maxAge: e.target.value })}
                onClear={e => this.search({ maxAge: '' })}
                label='Возраст До'
              />
            </Toolbar2Group>
          </Toolbar2>
        </Segment>
        <Segment>
          <Toolbar2>
            <Toolbar2Group>
              <Select
                label='Категория'
                list={communitiesStore.getCategories.map(tag => ({ id: tag.tagID, name: tag.name }))} value={state.category}
                onSelect={e => this.search({ category: e.target.value })}
                maxHeight={320}
                scrolling
                filtered
                showAllItems
                emptyName='Любая категория'
              />
            </Toolbar2Group>
            <Toolbar2Group>
              <Select
                label='Интересы'
                list={communitiesStore.getInterests.map(tag => ({ id: tag.tagID, name: tag.name }))} value={state.interest}
                onSelect={e => this.search({ interest: e.target.value })}
                maxHeight={320}
                scrolling
                filtered
                showAllItems
                emptyName='Любые интересы'
              />
            </Toolbar2Group>
            <Toolbar2Group>
              <Select
                label='Язык'
                list={communitiesStore.getLanguages.map(tag => ({ id: tag.tagID, name: tag.name }))} value={state.language}
                onSelect={e => this.search({ language: e.target.value })}
                maxHeight={320}
                scrolling
                filtered
                showAllItems
                emptyName='Любой язык'
              />
            </Toolbar2Group>
            <Toolbar2Group fill>

            </Toolbar2Group>
          </Toolbar2>
        </Segment>
        <Segment>
          <Toolbar2>
            <Toolbar2Group>
              <InputText
                value={state.minUsersCount}
                onChange={e => this.setState({ minUsersCount: e.target.value })}
                onEnter={e => this.search({ minUsersCount: e.target.value })}
                onClear={e => this.search({ minUsersCount: '' })}
                label='Подписчиков От'
              />
              <InputText
                value={state.maxUsersCount}
                onChange={e => this.setState({ maxUsersCount: e.target.value })}
                onEnter={e => this.search({ maxUsersCount: e.target.value })}
                onClear={e => this.search({ maxUsersCount: '' })}
                label='Подписчиков До'
              />
            </Toolbar2Group>
            <Toolbar2Group>
              <InputText
                value={state.minER}
                onChange={e => this.setState({ minER: e.target.value })}
                onEnter={e => this.search({ minER: e.target.value })}
                onClear={e => this.search({ minER: '' })}
                label='Вовлеченность От'
              />
              <InputText
                value={state.maxER}
                onChange={e => this.setState({ maxER: e.target.value })}
                onEnter={e => this.search({ maxER: e.target.value })}
                onClear={e => this.search({ maxER: '' })}
                label='Вовлеченность До'
              />
            </Toolbar2Group>
            <Toolbar2Group fill>
              <Select
                label='Quality Score'
                list={qualityScoreList} value={state.minQualityScore}
                onSelect={e => this.search({ minQualityScore: e.target.value })}
                maxHeight={320}
                scrolling
              />
            </Toolbar2Group>
          </Toolbar2>
        </Segment>
        <Segment>
          <Toolbar2>
            <Toolbar2Group>
              <InputText
                value={state.minViews}
                onChange={e => this.setState({ minViews: e.target.value })}
                onEnter={e => this.search({ minViews: e.target.value })}
                onClear={e => this.search({ minViews: '' })}
                label='Просмотров От'
              />
              <InputText
                value={state.maxViews}
                onChange={e => this.setState({ maxViews: e.target.value })}
                onEnter={e => this.search({ maxViews: e.target.value })}
                onClear={e => this.search({ maxViews: '' })}
                label='Просмотров До'
              />
            </Toolbar2Group>
            <Toolbar2Group fill>
              <Checkbox label='Только активные' checked={!!state.isActive} onChange={e => this.search({ isActive: e.target.value })} />
              <Checkbox label='Только верифицированные' checked={!!state.isVerified} onChange={e => this.search({ isVerified: e.target.value })}  />
            </Toolbar2Group>
          </Toolbar2>
        </Segment>

        <Segment size={2} />
        <Title size='small' text='Аудитория' />
        <Segment>
          <Toolbar2>
            <Toolbar2Group fill>
              <Select
                label='Страна или город'
                list={communitiesStore.getLocations.map(tag => ({ id: tag.tagID, name: tag.name }))} value={state.audienceLocation}
                onSelect={e => this.search({ audienceLocation: e.target.value })}
                maxHeight={320}
                scrolling
                filtered
                emptyName='Любая страна и город'
              />
              <Select
                label='% аудитории'
                list={gtePercentsList} value={state.minAudienceLocationsPercent}
                onSelect={e => this.search({ minAudienceLocationsPercent: e.target.value })}
                maxHeight={320}
                maxWidth={150}
                scrolling
              />
            </Toolbar2Group>
            <Toolbar2Group>
              <Select
                label='Количество ботов'
                list={fakeFollowersList} value={state.maxFakeFollowers}
                onSelect={e => this.search({ maxFakeFollowers: e.target.value })}
                maxHeight={320}
                scrolling
              />
            </Toolbar2Group>
          </Toolbar2>
        </Segment>
        <Segment>
          <Toolbar2>
            <Toolbar2Group>
              <Select
                label='Пол'
                list={gendersList} value={state.audienceGender}
                onSelect={e => this.search({ audienceGender: e.target.value })}
                maxHeight={320}
              />
              <Select
                label='% аудитории'
                list={gtePercentsList} value={state.minAudienceGendersPercent}
                onSelect={e => this.search({ minAudienceGendersPercent: e.target.value })}
                maxHeight={320}
                maxWidth={150}
                scrolling
              />
            </Toolbar2Group>
            <Toolbar2Group fill>
              <InputText
                value={state.minAudienceAge}
                onChange={e => this.setState({ minAudienceAge: e.target.value })}
                onEnter={e => this.search({ minAudienceAge: e.target.value })}
                onClear={e => this.search({ minAudienceAge: '' })}
                label='Возраст От'
              />
              <InputText
                value={state.maxAudienceAge}
                onChange={e => this.setState({ maxAudienceAge: e.target.value })}
                onEnter={e => this.search({ maxAudienceAge: e.target.value })}
                onClear={e => this.search({ maxAudienceAge: '' })}
                label='Возраст До'
              />
              <Select
                label='% аудитории'
                list={gtePercentsList} value={state.minAudienceAgePercent}
                onSelect={e => this.search({ minAudienceAgePercent: e.target.value })}
                maxHeight={320}
                maxWidth={150}
                scrolling
              />
            </Toolbar2Group>
          </Toolbar2>
        </Segment>

        <Segment size={2}>
          <Toolbar2>
            <Toolbar2Group>
              <ButtonText color='blue' onClick={() => this.search()} loading={communitiesStore.isSearchLoading}>Найти страницы</ButtonText>
            </Toolbar2Group>
            <Toolbar2Group fill>
              {!!communitiesStore.searchTotalResults && (
                <>Найдено {NumeralUtil.format(communitiesStore.searchTotalResults, '0,0')}</>
              )}
            </Toolbar2Group>
            <Toolbar2Group right>
              <Select
                label='Сортировка'
                list={sortList}
                value={state.sort}
                onSelect={e => this.search({ sort: e.target.value })}
                maxHeight={320}
                scrolling
              />
            </Toolbar2Group>
          </Toolbar2>
        </Segment>
          <Segment size={5}>
            <List
              isLoading={communitiesStore.isSearchLoading && this.state.page === 1}
              loadingText='Ищем страницы'
              emptyText='Страницы не найдены'
              isHide={!this.state.showResults}
            >
              {communitiesStore.searchCommunities.map(community => (
                <CommunityStats
                  key={community.cid}
                  image={community.image}
                  name={community.name}
                  url={community.url}
                  isVerified={community.verified}
                  metrics={[
                    { name: 'Quality Score', value: community.qualityScore, type: 'qualityScore' },
                    { name: 'Подписчиков', value: community.usersCount },
                    { name: 'Вовлеченность', value: community.avgER, format: '0.000%' },
                    { name: 'Просмотров', value: community.avgViews },
                    { name: 'Реакций', value: community.avgInteractions },
                    { name: 'Аудитория', value: [community.membersGendersAges?.summary?.m, community.membersGendersAges?.summary?.avgAges, community?.topAudienceCountryCode, community?.membersCities?.[0]?.name], type: 'audience' },
                  ]}
                  onClick={() => params.changeParams({ addCommunityCID: community.cid })}
                />
              ))}
            </List>
          </Segment>
          {!!communitiesStore.searchTotalResults && communitiesStore.communities.length < communitiesStore.searchTotalResults && (
            <Segment size={2}>
              <ButtonTextGroup center>
                <ButtonText
                  color='blue'
                  onClick={() => profileStore.profile.plan.topRating >= 20 ? this.search({ page: this.state.page + 1 }) : params.changeParams({ premium: 'true' })}
                  loading={communitiesStore.isSearchLoading}
                >Показать еще</ButtonText>
              </ButtonTextGroup>
            </Segment>
          )}

        <Segment size={10} />
      </Segment>
    )
  }
}

export default GlobalSearchPage
