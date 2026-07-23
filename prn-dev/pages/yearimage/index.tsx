import React, { Component } from 'react'
import cx from 'classnames'
import { SingletonRouter, withRouter } from 'next/router'
import { Stores } from '../../stores/RootStore'
import { inject, observer } from 'mobx-react'
import AppUtil from '../../utils/AppUtil'
import StatisticsStore from '../../stores/StatisticsStore'
import AccountsStore from '../../stores/AccountsStore'
import NumeralUtil from '../../utils/NumeralUtil'

import s from './image.module.scss'
import SocialDataUtil from '../../utils/SocialDataUtil'
import Icon from '../../elements/Icon/Icon'
import Image from '../../elements/Image/Image'
import QRCode from 'react-qr-code'

interface IRouter extends SingletonRouter {
  /**
   * query
   */
  query: {
    /**
     * ID сообщества
     */
    cid: string
    /**
     * ScreenName сообщества
     */
    screenName: string
    /**
     * Страница
     */
    page: string
  }
}

interface IProps {
  /**
   * router
   */
  router: IRouter
  statisticsStore?: StatisticsStore
  accountsStore?: AccountsStore
}

@(withRouter as any)
@inject(Stores.STATISTICS_STORE, Stores.ACCOUNTS_STORE)
@observer
export default class AppRatingDetailPage extends Component<IProps> {
  private _timeout: NodeJS.Timeout

  // static async getInitialProps (ctx: IStoreContext): Promise<Partial<any>> {
  //   const { statisticsStore } = ctx.store
  //   const cid = String(ctx.query.cid)
  //   const page = Number(ctx.query.page)
  //   const screenName = String(ctx.query.screenName)
  //
  //   await statisticsStore.loadCommunity(cid, screenName, false, true)
  //
  //   const from = '01.01.2025'
  //   const to = '31.12.2025'
  //
  //   await Promise.all([
  //     statisticsStore.loadCommunityRetrospective(cid, screenName, from, to),
  //     page === 10 && statisticsStore.loadCommunityPosts(cid, screenName, from, to, '-interactions', 10)
  //   ])
  //
  //   return {}
  // }

  componentDidMount() {
    this.init()
  }

  componentDidUpdate() {
    this.init()
  }

  componentWillUnmount() {
    clearInterval(this._timeout)
  }

  init () {
    if (!this._timeout && AppUtil.isClientSide && this.props.statisticsStore.community?.communityStatus !== 'DONE') {
      this._timeout = setInterval(() => this.loadCommunityData(), 100)
    }
  }

  loadCommunityData = async () => {
    const { router, statisticsStore } = this.props
    const cid = String(router.query.cid)
    const page = Number(router.query.page)
    const screenName = String(router.query.screenName)

    const from = '01.01.2025'
    const to = '31.12.2025'

    await statisticsStore.loadCommunity(cid, screenName, true, true)

    if (statisticsStore.community?.communityStatus === 'DONE') {
      clearInterval(this._timeout)

      await Promise.all([
        statisticsStore.loadCommunityRetrospective(cid, screenName, from, to),
        page === 10 && statisticsStore.loadCommunityPosts(cid, screenName, from, to, '-interactions', 10)
      ])
    }
  }

  render (): JSX.Element {
    const { router, statisticsStore } = this.props

    const page = Number(router.query.page)

    const community = statisticsStore.community

    if (AppUtil.isClientSide && statisticsStore.isLoading) {
      return null
    }

    if (AppUtil.isClientSide && !statisticsStore.isLoading && !community) {
      // todo: Если сообщество не существует - выдаем сообщение об ошибке
      return <p>Нет такого сообщества</p>
    }

    const isLoading = statisticsStore.community?.communityStatus !== 'DONE'

    const usersCount = statisticsStore.communityRetrospective?.summary.current.usersCount
    const deltaUsersCount = statisticsStore.communityRetrospective?.summary.current.deltaUsersCount
    const deltaPctUsersCount = statisticsStore.communityRetrospective?.summary.prev.usersCount ? statisticsStore.communityRetrospective?.summary.current.deltaUsersCount / statisticsStore.communityRetrospective?.summary.prev.usersCount : 0
    const posts = statisticsStore.communityRetrospective?.summary.current.deltaPosts
    const avgDayPosts = statisticsStore.communityRetrospective?.summary.current.deltaPosts / 365
    let avgPostsPer = avgDayPosts
    let postsPer = 'd'
    if (avgDayPosts < 1 && avgDayPosts * 30 > 1) {
      avgPostsPer = avgDayPosts * 30
      postsPer = 'm'
    }
    if (avgDayPosts < 1 && avgDayPosts * 7 > 1) {
      avgPostsPer = avgDayPosts * 7
      postsPer = 'w'
    }

    const views = statisticsStore.communityRetrospective?.summary.current.deltaViews || 0
    const avgViews = Math.round(posts ? views / posts : 0)
    const likes = statisticsStore.communityRetrospective?.summary.current.deltaLikes || 0
    const avgLikes = Math.round(posts ? likes / posts : 0)
    const comments = statisticsStore.communityRetrospective?.summary.current.deltaComments || 0
    const avgComments = Math.round(posts ? comments / posts : 0)
    const rePosts = statisticsStore.communityRetrospective?.summary.current.deltaRePosts || 0
    const avgRePosts = Math.round(posts ? rePosts / posts : 0)
    const qualityScore = community?.qualityScore

    const bestPost = statisticsStore.communityPosts.filter(post => post.postImage)[0] || statisticsStore.communityPosts[0]

    const er = posts && views && ((likes+comments+rePosts) / views / posts) || posts && usersCount && ((likes+comments+rePosts) / usersCount / posts) || 0

    const socialType = SocialDataUtil.urlToSocialType(community?.url)
    const uri = SocialDataUtil.urlToUri(community?.url)

    setTimeout(() => {
      if (AppUtil.isClientSide && window['carrotquest'] && window['carrotquest'].removeChat) window['carrotquest'].removeChat()
    }, 500)

    // Собираем строку для метрик поста
    let postMetrics = ''
    if (bestPost?.views) postMetrics = postMetrics.concat(postMetrics ? ', ' : '').concat(NumeralUtil.format(bestPost.views, '0,0', ['просмотр', 'просмотра', 'просмотров']))
    if (bestPost?.likes) postMetrics = postMetrics.concat(postMetrics ? ', ' : '').concat(NumeralUtil.format(bestPost.likes, '0,0', ['лайк', 'лайка', 'лайков']))
    if (bestPost?.comments) postMetrics = postMetrics.concat(postMetrics ? ', ' : '').concat(NumeralUtil.format(bestPost.comments, '0,0', ['комментарий', 'комментария', 'комментариев']))
    if (bestPost?.rePosts) postMetrics = postMetrics.concat(postMetrics ? ', ' : '').concat(NumeralUtil.format(bestPost.rePosts, '0,0', ['репост', 'репоста', 'репостов']))

    if (isLoading) {
      return (
        <div className={s.element}>
          <span className={s.title}>Подготавливаем итоги года...</span>
        </div>
      )
    }

    if (page === 1) {
      // Главный слайд
      return (
        <div className={s.element}>
          <div className={s.coverTitle}>
            <span className={s.title}>Итоги 2025 года</span>
            <div className={s.subTitle}>Бот в Telegram @CubeStatBot</div>
          </div>

          <img className={s.mainImage} src={community?.image} />

          <div className={s.coverName}>
            <span className={s.mainCommunityName}>{community.name}</span>
            <a className={s.url} href={community?.url}><Icon icon={`${socialType.toLowerCase()}_colored`}/>{uri}</a>
          </div>
        </div>
      )
    }

    if (page === 2) {
      // Подписчики
      return (
        <div className={cx(s.element, s.bg1)}>
          {/*<img className={s.backgroundImage} src={postsImages[Math.round(Math.random() * postsImages.length - 1)]} /> */}

          <div className={s.community}>
            <img className={s.communityImage} src={community?.image} />
            <div className={s.communityContainer}>
              <span className={s.smallCommunityName}>{community.name}</span>
              <div className={s.smallTitle}>Итоги 2025 года. Бот в Telegram @CubeStatBot</div>
            </div>
          </div>

          <div className={s.metricBlock}>
            <span className={s.metricName}>Количество подписчиков</span>
            <span className={s.metricValue}>{NumeralUtil.format(usersCount, '0,0')}</span>
            {deltaUsersCount > 0 && (
              <div className={s.metricDeltaValue}>
                <Icon icon='stats_up' />
                {NumeralUtil.format(deltaUsersCount, '0,0')}
              </div>
            )}
          </div>

          <div className={s.textBlock}>
            {deltaPctUsersCount > 0.01 && <span>Рост составил {NumeralUtil.format(deltaPctUsersCount, '0%')}</span>}
            {deltaPctUsersCount > 0.01 && <span>по сравнению с 2024 годом</span>}
          </div>
        </div>
      )
    }

    if (page === 3) {
      // Сообщество лучше чем
      return (
        <div className={cx(s.element, s.bg2)}>
          <div className={s.community}>
            <img className={s.communityImage} src={community?.image} />
            <div className={s.communityContainer}>
              <span className={s.smallCommunityName}>{community.name}</span>
              <div className={s.smallTitle}>Итоги 2025 года. Бот в Telegram @CubeStatBot</div>
            </div>
          </div>

          <div className={s.metricBlock}>
            <span className={s.metricTitle}>В этом году мы на</span>
            <span className={s.metricValue}>{NumeralUtil.format(qualityScore, '0%')}</span>
            <span className={s.bigMetricName}>лучше других</span>
          </div>

          <div className={s.textBlock}>
            {avgRePosts > 0 && <span>В среднем наши пользователи</span>}
            {avgRePosts > 0 && <span>делились каждым постом {NumeralUtil.format(avgRePosts, '0,0', ['раз', 'раза', 'раз'])}</span>}
          </div>
        </div>
      )
    }

    if (page === 4) {
      // Постов
      return (
        <div className={cx(s.element, s.bg3)}>
          <div className={s.community}>
            <img className={s.communityImage} src={community?.image} />
            <div className={s.communityContainer}>
              <span className={s.smallCommunityName}>{community.name}</span>
              <div className={s.smallTitle}>Итоги 2025 года. Бот в Telegram @CubeStatBot</div>
            </div>
          </div>

          <div className={s.metricBlock}>
            <span className={s.metricTitle}>В этом году мы опубликовали</span>
            <span className={s.metricValue}>{NumeralUtil.format(posts, '0,0')}</span>
            <span className={s.bigMetricName}>{NumeralUtil.declination(posts, ['пост', 'поста', 'постов'])}</span>
          </div>

          <div className={s.textBlock}>
            {avgPostsPer > 1 && <span>Это примерно {NumeralUtil.format(avgPostsPer, '0,0', ['пост', 'поста', 'постов'])}</span>}
            {avgPostsPer > 1 && postsPer === 'd' && <span>каждый день</span>}
            {avgPostsPer > 1 && postsPer === 'w' && <span>каждую неделю</span>}
            {avgPostsPer > 1 && postsPer === 'm' && <span>каждый месяц</span>}
          </div>
        </div>
      )
    }

    if (page === 5) {
      // Просмотров
      return (
        <div className={cx(s.element, s.bg1)}>
          <div className={s.community}>
            <img className={s.communityImage} src={community?.image} />
            <div className={s.communityContainer}>
              <span className={s.smallCommunityName}>{community.name}</span>
              <div className={s.smallTitle}>Итоги 2025 года. Бот в Telegram @CubeStatBot</div>
            </div>
          </div>

          <div className={s.metricBlock}>
            <span className={s.metricTitle}>Наши подписчики сделали</span>
            <span className={s.metricValue}>{NumeralUtil.format(views, '0,0')}</span>
            <span className={s.bigMetricName}>{NumeralUtil.declination(views, ['просмотр', 'просмотра', 'просмотров'])}</span>
          </div>

          <div className={s.textBlock}>
            {avgViews > 1 && <span>В среднем на каждый пост</span>}
            {avgViews > 1 && <span>пришлось по {NumeralUtil.format(avgViews, '0,0', ['просмотр', 'просмотра', 'просмотров'])}</span>}
          </div>
        </div>
      )
    }

    if (page === 6) {
      // Лайков
      return (
        <div className={cx(s.element, s.bg2)}>
          <div className={s.community}>
            <img className={s.communityImage} src={community?.image} />
            <div className={s.communityContainer}>
              <span className={s.smallCommunityName}>{community.name}</span>
              <div className={s.smallTitle}>Итоги 2025 года. Бот в Telegram @CubeStatBot</div>
            </div>
          </div>

          <div className={s.metricBlock}>
            <span className={s.metricTitle}>В этом году мы набрали</span>
            <span className={s.metricValue}>{NumeralUtil.format(likes, '0,0')}</span>
            <span className={s.bigMetricName}>{NumeralUtil.declination(likes, ['лайк', 'лайка', 'лайков'])}</span>
          </div>

          <div className={s.textBlock}>
            {avgLikes > 1 && <span>Пользователи оставляли в среднем</span>}
            {avgLikes > 1 && <span>по {NumeralUtil.format(avgLikes, '0,0', ['лайк', 'лайка', 'лайков'])} на пост</span>}
          </div>
        </div>
      )
    }

    if (page === 7) {
      // Комментариев
      return (
        <div className={cx(s.element, s.bg3)}>
          <div className={s.community}>
            <img className={s.communityImage} src={community?.image} />
            <div className={s.communityContainer}>
              <span className={s.smallCommunityName}>{community.name}</span>
              <div className={s.smallTitle}>Итоги 2025 года. Бот в Telegram @CubeStatBot</div>
            </div>
          </div>

          <div className={s.metricBlock}>
            <span className={s.metricTitle}>Под нашими постами оставили</span>
            <span className={s.metricValue}>{NumeralUtil.format(comments, '0,0')}</span>
            <span className={s.bigMetricName}>{NumeralUtil.declination(comments, ['комментарий', 'комментария', 'комментариев'])}</span>
          </div>

          <div className={s.textBlock}>
            {avgComments > 1 && <span>Пользователи оставляли в среднем</span>}
            {avgComments > 1 && <span>по {NumeralUtil.format(avgComments, '0,0', ['комментарию', 'комментария', 'комментариев'])} на пост</span>}
          </div>
        </div>
      )
    }

    if (page === 8) {
      // Репостов
      return (
        <div className={cx(s.element, s.bg1)}>
          <div className={s.community}>
            <img className={s.communityImage} src={community?.image} />
            <div className={s.communityContainer}>
              <span className={s.smallCommunityName}>{community.name}</span>
              <div className={s.smallTitle}>Итоги 2025 года. Бот в Telegram @CubeStatBot</div>
            </div>
          </div>

          <div className={s.metricBlock}>
            <span className={s.metricTitle}>Было сделано</span>
            <span className={s.metricValue}>{NumeralUtil.format(rePosts, '0,0')}</span>
            <span className={s.bigMetricName}>{NumeralUtil.declination(rePosts, ['репост', 'репоста', 'репостов'])}</span>
          </div>

          <div className={s.textBlock}>
            {avgRePosts > 1 && <span>В среднем наши пользователи</span>}
            {avgRePosts > 1 && <span>делились каждым постом {NumeralUtil.format(avgRePosts, '0,0', ['раз', 'раза', 'раз'])}</span>}
          </div>
        </div>
      )
    }

    if (page === 9) {
      // Вовлеченность
      return (
        <div className={cx(s.element, s.bg2)}>
          <div className={s.community}>
            <img className={s.communityImage} src={community?.image} />
            <div className={s.communityContainer}>
              <span className={s.smallCommunityName}>{community.name}</span>
              <div className={s.smallTitle}>Итоги 2025 года. Бот в Telegram @CubeStatBot</div>
            </div>
          </div>

          <div className={s.metricBlock}>
            <span className={s.metricTitle}>В этом году мы достигли</span>
            <span className={s.metricValue}>{NumeralUtil.format(er, '0.000%')}</span>
            <span className={s.bigMetricName}>вовлеченности</span>
          </div>

          <div className={s.textBlock}>
            <span>Такой показатель вовлеченности</span>
            <span>был в среднем у наших постов</span>
          </div>
        </div>
      )
    }

    if (page === 10) {
      return (
        <div className={cx(s.element, s.bgPost)}>
          <div className={s.community}>
            <div className={s.qr}>
              <QRCode className={s.postQRCode} value={bestPost?.postUrl || ''} />
            </div>
            <img className={s.communityImage} src={community?.image} />
            <div className={s.communityContainer}>
              <span className={s.smallCommunityName}>{community.name}</span>
              <div className={s.smallTitle}>Итоги 2025 года. Бот в Telegram @CubeStatBot</div>
            </div>
          </div>

          <Image className={s.postImage} src={bestPost?.postImage} />

          <div className={s.textBlock}>
            <span className={s.postTitle}>Это был наш лучший пост в 2025 году</span>
            <span className={s.postMetrics}>Он набрал {postMetrics}</span>
          </div>
        </div>
      )
    }
  }
}
