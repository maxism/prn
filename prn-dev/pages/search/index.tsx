import React, { Component } from 'react'

import Meta from '../../components/Meta'
import Footer from '../../elements/Footer/Footer'
import Header from '../../elements/Header/Header'
import Segment from '../../elements/Segment/Segment'
import Container from '../../elements/Container/Container'
import Row from '../../elements/Row/Row'
import Col from '../../elements/Col/Col'
import InputText from '../../elements/InputText/InputText'
import Title from '../../elements/Title/Title'
import Text from '../../elements/Text/Text'
import Community from '../../elements/Community/Community'
import ServiceBlockGroup from '../../elements/ServiceBlock/ServiceBlockGroup'
import { SingletonRouter, withRouter } from 'next/router'
import { inject, observer } from 'mobx-react'
import { IStoreContext, Stores } from '../../stores/RootStore'
import ProfileStore from '../../stores/ProfileStore'
import InfluenceStore from '../../stores/InfluenceStore'
import ButtonText from '../../elements/ButtonText/ButtonText'
import Loader from '../../elements/Loader/Loader'
import RouterUtil from '../../utils/RouterUtil'
import NumeralUtil from '../../utils/NumeralUtil'
import Page from '../../elements/Page/Page'
import CommunitiesStore from '../../stores/CommunitiesStore'
import SocialDataUtil from '../../utils/SocialDataUtil'
import TextColor from '../../elements/TextColor/TextColor'
import Notification from '../../elements/Notification/Notification'

interface IRouter extends SingletonRouter {
  /**
   * query
   */
  query: {
    /**
     * Поисковый запрос
     */
    query?: string
    /**
     * Поиск только по определенной соцсети
     */
    socialType?: string
    /**
     * Следующее действие из поиска
     */
    next?: string
    /**
     * Модалка
     */
    modal?: string
    /**
     * Ссылка на добавляемое сообщество
     */
    addCommunityUrl?: string
    planName?: string
  }
}

interface IProps {
  /**
   * router
   */
  router: IRouter
  profileStore?: ProfileStore
  influenceStore?: InfluenceStore
  communitiesStore?: CommunitiesStore
}

interface IState {
  search: string
}

@(withRouter as any)
@inject(Stores.PROFILE_STORE, Stores.INFLUENCE_STORE, Stores.COMMUNITIES_STORE)
@observer
export default class SearchPage extends Component<IProps, IState> {
  state: IState = {
    search: null
  }

  static async getInitialProps (ctx: IStoreContext): Promise<Partial<any>> {
    const { query, socialType } = ctx.query

    if (query) {
      await ctx.store.influenceStore.search({
        query: String(query || ''),
        socialType: String(socialType || '') || 'ALL'
      })
    } else {
      ctx.store.influenceStore.clear()
    }

    return { query }
  }

  render (): JSX.Element {
    const { router, influenceStore, profileStore } = this.props
    const { search } = this.state
    const query = search === null ? influenceStore.searchParams.query : search
    const isMain = !router.query.query && !influenceStore.communities.length && !influenceStore.isLoading

    return (
      <Page grey={!isMain}>
        <Meta
          title={router.query.query ? `${router.query.query} во всех социальных сетях` : 'Поиск аккаунтов во всех социальных сетях'}
          description={router.query.query ? `${router.query.query} статистика во всех социальных сетях` : 'Статистика аккаунтов во всех социальных сетях'}
          image='/images/rating_search_results.png'
          keywords={`${router.query.query}, поиск, конкуренты, статистика, анализ, анализировать, аналитика, аккаунтов, страниц, сообществ, количество подписчиков, просмотры постов, вовлеченность`}
        />

        <Header />

        <Segment background={isMain ? 'top': undefined}>
          <Container>
            {!router.query.query && !influenceStore.communities.length && !influenceStore.isLoading && (<>
              <Row padding='xxl'>
                <Col size={10} center>
                  <Title size='heavy' center>Поиск страниц</Title>
                </Col>
              </Row>
              <Row padding='m'>
                <Col size={10} center>
                  <Text size='xl' semibold center><TextColor color='super-dark'>
                    Находите аккаунты и страницы во всех социальных сетях и изучайте их статистику
                  </TextColor></Text>
                </Col>
              </Row>
            </>)}

            <Row padding='xxl'>
              <Col size={10} center>
                <InputText
                  big
                  white={!isMain}
                  icon='search'
                  label='Поиск страниц'
                  value={query}
                  onChange={e => this.setState({ search: e.target.value })}
                  onSubmit={() => RouterUtil.replaceParams(router, { query: encodeURIComponent(query) }, { shallow: false })}
                  loading={influenceStore.isLoading}
                  focus
                />
              </Col>
            </Row>

            {isMain && <Row padding='xxl' />}

            {!!router.query.query && !influenceStore.communities.length && !influenceStore.isLoading && (<>
              <Row padding='xxl'>
                <Col size={10} center>
                  <Title size='l' center><TextColor color='light'>Ничего не найдено</TextColor></Title>
                </Col>
              </Row>
              <Row padding='m'>
                <Col size={10} center>
                  <Text semibold center><TextColor color='light'>
                    К сожалению, мы не смогли ничего найти. Обычно такого не бывает, скорее всего нужно попробовать другой запрос — возможно где-то закралась ошибка ¯\_(ツ)_/¯
                  </TextColor></Text>
                </Col>
              </Row>
            </>)}

            {!!router.query.query && !!influenceStore.communities.length && (
              <>
                <Row padding='xxl'>
                  <Col size={10} center>
                    <Title>Мы нашли {NumeralUtil.format(influenceStore.totalCommunities, '0,0', ['страницу', 'страницы', 'страниц'])}</Title>
                  </Col>
                </Row>

                <Row padding='m'>
                  <Col size={10} center>
                    <Text semibold>
                      Ниже представлен список всех найденных страниц по вашему запросу. Чтобы увидеть больше информации — нажмите на интересующую страницу.
                    </Text>
                  </Col>
                </Row>
              </>
            )}

            <Row padding='xl'>
              <Col size={10} center>
                <ServiceBlockGroup>
                  {influenceStore.communities?.map(community => (
                    <Community
                      key={community.cid}
                      image={community.image}
                      name={community.name}
                      url={community.url}
                      to={`/search/${SocialDataUtil.toUri(community.socialType)}/${encodeURIComponent(community.screenName)}/${community.cid}`}
                      _blank
                      usersCount={community.usersCount}
                    />
                  ))}
                </ServiceBlockGroup>
              </Col>
            </Row>

            {influenceStore.isLoading && <Loader />}

            {!profileStore.isAuth && influenceStore.communities.length >= profileStore.userPlan.current.topRating && (
              <>
                <Row padding='xl' />
                <Notification
                  icon='admin'
                  title='Хотите увидеть больше страниц?'
                  message='Без регистрации доступно лишь 10 первых страниц. Зарегистрируйтесь, чтобы увидеть больше.'
                  to='?modal=registration&scroll=false'
                  buttonText='Зарегистрироваться'
                />
                <Row padding='l' />
              </>
            )}
            {profileStore.isAuth && influenceStore.communities.length >= profileStore.userPlan.current.topRating && (
              <>
                <Row padding='xl' />
                <Notification
                  icon='admin'
                  title='Хотите увидеть больше страниц?'
                  message={'Вы достигли лимита страниц. Чтобы увидеть больше — перейдите на тариф '.concat(profileStore.getHigherPlansList({ topRating: influenceStore.communities.length + 1 }))}
                  onClick={() => RouterUtil.replaceParams(router, { modal: 'change-plan', planName: profileStore.getHigherPlansByOptions({ topRating: influenceStore.communities.length + 1 })[0] })}
                  buttonText='Выбрать тариф'
                />
                <Row padding='l' />
              </>
            )}

          </Container>
        </Segment>

        {influenceStore.communities.length < profileStore.userPlan.current.topRating && !influenceStore.isLoading && influenceStore.hasNextPage && (
          <Segment onEnterViewport={() => influenceStore.loadListNextPage()}>
            <Container>
              <Row padding='xl'>
                <Col center>
                  <ButtonText onClick={() => influenceStore.loadListNextPage()} size='l'>Следущая страница</ButtonText>
                </Col>
              </Row>
              <Row padding='xxl' />
            </Container>
          </Segment>
        )}

        <Row padding='xxl' />
        <Row padding='xxl' />

        <Footer lite={!isMain} disableSupport />
      </Page>
    )
  }
}
