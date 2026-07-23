import React, { Component } from 'react'
import Head from 'next/head'
import config from '../config'
import { SingletonRouter, withRouter } from 'next/router'
import ProfileStore from '../stores/ProfileStore'
import BlogStore from '../stores/BlogStore'

interface IProps {
  router?: SingletonRouter
  title?: string
  description?: string
  image?: string
  keywords?: string
  noindex?: boolean
  canonicalUrl?: string
}
interface IProps {

  profileStore?: ProfileStore
  blogStore?: BlogStore
}

/**
 * Компонент добавления meta тегов на страницу
 */
@(withRouter as any)
export default class Meta extends Component<IProps> {

  static defaultProps = {
    title: 'КУБ — сервисы для эффективной работы с социальными сетями',
    description: 'Комплексная аналитика КУБ охватывает все необходимые данные для эффективной работы в социальных медиа: от конкурентного анализа по количественным и качественным показателям до оценки эффективности платных кампаний',
    image: '/images/sharing.png',
    keywords: ''
  }

  render (): JSX.Element {
    const { router, title, description, image, keywords, noindex, canonicalUrl } = this.props

    return (
      <Head>
        <title>{`${title} — КУБ`}</title>
        <meta name='title' content={`${title} — КУБ`} />
        <meta name='description' content={description} />
        <meta name='keywords' content={keywords} />
        <meta property='og:title' content={`${title} — КУБ`} />
        <meta property='og:description' content={description} />
        <meta property='og:image' content={config.sitePath(image)} />
        <meta property="og:image:alt" content={`${title} — КУБ`} />
        <meta property='og:url' content={config.sitePath(router.asPath)} />
        <meta property="og:type" content="website" />
        <meta property="fb:app_id" content="642699282449616" />
        <meta name='viewport' content='width=device-width, initial-scale=1, viewport-fit=cover' />
        {noindex && <meta name='robots' content='noindex' />}
        {canonicalUrl && <link rel='canonical' href={`${config.sitePath(canonicalUrl)}`} />}
      </Head>
    )
  }
}
