const { createWriteStream } = require('fs')
const { resolve } = require('path')
const { createGzip } = require('zlib')
const {
  SitemapAndIndexStream,
  SitemapStream
} = require('sitemap')
const axios = require("axios")

let socialTypes = [
  { socialType: 'VK', uri: 'vkontakte' },
  { socialType: 'FB', uri: 'facebook' },
  { socialType: 'INST', uri: 'instagram' },
  { socialType: 'TW', uri: 'twitter' },
  { socialType: 'OK', uri: 'odnoklassniki' },
  { socialType: 'TT', uri: 'tiktok' },
  { socialType: 'TG', uri: 'telegram' },
  { socialType: 'YZ', uri: 'yandex-zen' },
  { socialType: 'RT', uri: 'rutube' },
  { socialType: 'YT', uri: 'youtube' },
  { socialType: 'CH', uri: 'clubhouse' },
  { socialType: 'VB', uri: 'viber' },
  { socialType: 'TC', uri: 'tenchat' },
  { socialType: 'VC', uri: 'vc' },
  { socialType: 'MX', uri: 'max' }
]

async function getBlogPosts () {
  const data = await axios({
    url: 'https://prnapi.c-cube.ru/v5/blog/posts',
    params: {
      page: 1,
      perPage: 100000
    },
    timeout: 0,
    method: 'get',
    responseType: 'json'
  })

  return data.data.data
}

async function getRatingTags () {
  const data = await axios({
    url: 'https://prnapi.c-cube.ru/v5/rating/tags',
    params: {
      socialType: 'VK'
    },
    timeout: 0,
    method: 'get',
    responseType: 'json'
  })

  return data.data.data.filter(item => ['industries', 'categories', 'influencers'].includes(item.parent) && !item.hidden).map(item => item.tagID)
}

async function getCountries () {
  const data = await axios({
    url: 'https://prnapi.c-cube.ru/v5/rating/tags',
    params: {
      socialType: 'VK'
    },
    timeout: 0,
    method: 'get',
    responseType: 'json'
  })

  return data.data.data.filter(item => (item.parent === 'countries') && !item.hidden).map(item => item.tagID)
}

async function main () {
  const sms = new SitemapAndIndexStream({
    getSitemapStream: (i) => {
      const sitemapStream = new SitemapStream({ hostname: 'https://prn.c-cube.ru', lastmodDateOnly: true })

      const path = `sitemap-${i}.xml`

      sitemapStream
        // .pipe(createGzip())
        .pipe(createWriteStream(resolve('./public/' + path/* + '.gz'*/)))

      return [new URL(path, 'https://prn.c-cube.ru').toString(), sitemapStream]
    },
  })

  sms
    // .pipe(createGzip())
    .pipe(createWriteStream(resolve('./public/sitemap.xml')))

  const sitemap = [
    {
      url: 'https://prn.c-cube.ru/statistics',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/statistics/instagram',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: '/https://prn.c-cube.ru/statistics/facebook',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/statistics/twitter',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/statistics/youtube',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/statistics/vkontakte',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/statistics/odnoklassniki',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/statistics/tiktok',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/statistics/telegram',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/statistics/yandexzen',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/statistics/rutube',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/metrics/likes',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/metrics/main-metrics',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/analysis',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/analysis/instagram',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/analysis/facebook',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/analysis/twitter',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/analysis/youtube',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/analysis/vkontakte',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/analysis/odnoklassniki',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/analysis/tiktok',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/analysis/telegram',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/analysis/yandexzen',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/analysis/rutube',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/analitika',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/analitika/instagram',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/analitika/facebook',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/analitika/twitter',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/analitika/youtube',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/analitika/vkontakte',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/analitika/odnoklassniki',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/analitika/tiktok',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/analitika/telegram',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/analitika/yandexzen',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/analitika/rutube',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/metrics/ocenka_social',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/metrics/ocenit_social',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/metrics/effektivnost',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/metrics/er',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/metrics/vovlechennost',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/hashtags',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/hashtags/instagram',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/hashtags/facebook',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/hashtags/twitter',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/hashtags/youtube',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/hashtags/vkontakte',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/hashtags/odnoklassniki',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/hashtags/tiktok',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/hashtags/telegram',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/hashtags/yandexzen',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/hashtags/rutube',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/metrics/lychshee-vremya-social',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url: 'https://prn.c-cube.ru/metrics/lychshee-vremya-vk',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    }
  ]

  const posts = await getBlogPosts()

  for (let post of posts) {
    sitemap.push({
      url: `/blog/article/${post.slug || post.postID}`,
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    })
  }

  const ratingTags = await getRatingTags()
  const countries = await getCountries()

  for (let social of socialTypes) {
    for (let country of countries) {
      console.log('Формирование sitemap рейтинга и индекса соцсетей', social.socialType, country)
      for (let industry of ratingTags) {
        sitemap.push({
          url: `/app/rating/${social.uri}/${country}/${industry}`,
          changefreq: 'daily',
          priority: 1,
          lastmod: new Date()
        })
        sitemap.push({
          url: `/app/socialindex/${social.uri}/${country}/${industry}`,
          changefreq: 'daily',
          priority: 1,
          lastmod: new Date()
        })
      }
    }
  }

  sitemap.forEach(item => sms.write(item))
  sms.end()
}

main()

