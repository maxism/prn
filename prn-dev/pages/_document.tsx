import Document, { DocumentContext, Html, Head, Main, NextScript } from 'next/document'
import React from 'react'

export default class HtmlDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)

    return initialProps
  }

  render() {
    return (
      <Html lang='ru'>
        <Head>
          <meta charSet='UTF-8' />
          <meta httpEquiv='X-UA-Compatible' content='ie=edge' />
          {/*<meta name='title' content='КУБ' />*/}
          {/*<meta name='description'*/}
          {/*      content='КУБ - статистика и аналитика сообществ в социальных сетях ВКонтакте, Facebook, Instagram, YouTube, Twitter, Одноклассники и Telegram' />*/}
          {/*<meta property='og:title' content='КУБ - статистика и аналитика сообществ социальных сетей' />*/}
          {/*<meta property='og:description'*/}
          {/*      content='КУБ - статистика и аналитика сообществ в социальных сетях ВКонтакте, Facebook, Instagram, YouTube, Twitter, Одноклассники и Telegram' />*/}
          {/*<meta property='og:url' content='https://prn.c-cube.ru' />*/}
          {/*<meta property='og:image' content='/images/og-3.png' />*/}
          {/*<link rel='image_src' href='/images/og-3.png' />*/}

          {/*<link rel='alternate' href='https://prn.c-cube.ru' hrefLang='ru' />*/}
          {/*<link rel='canonical' href='https://prn.c-cube.ru' />*/}

          <link rel='apple-touch-icon' sizes='180x180' href='/favicons/apple-touch-icon.png' />
          <link rel='icon' type='image/png' sizes='32x32' href='/favicons/favicon-32x32.png' />
          <link rel='icon' type='image/png' sizes='16x16' href='/favicons/favicon-16x16.png' />
          <link rel='manifest' href='/favicons/site.webmanifest' />
          <link rel='mask-icon' href='/favicons/safari-pinned-tab.svg' color='#311E9D' />
          <meta name='msapplication-TileColor' content='#ffffff' />
          <meta name='theme-color' content='#ffffff' />
        </Head>
        <body>
          <Main />
          <NextScript />

          <div className='global-loader' />
        </body>
      </Html>
    )
  }
}
