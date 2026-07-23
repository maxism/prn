const withImages = require('next-images')
module.exports = withImages({
  async redirects () {
    return [
      {
        source: '/ru/blog',
        destination: '/blog',
        permanent: true
      }, {
        source: '/app/rating',
        destination: '/app/rating/instagram/russia/brands',
        permanent: true
      }, {
        source: '/ru/blog/post/top-100-youtube-populyarnye-kategorii-v-rossii-200225',
        destination: '/app/rating/youtube/russia/all',
        permanent: true
      }, {
        source: '/ru/blog/post/vse-chto-nuzhno-znat-pro-vovlechennost-122275',
        destination: '/blog/article/engagement-rate',
        permanent: true
      }, {
        source: '/ru/blog/post/otrasli-v-socsetyah-rossiya-200176',
        destination: '/app/rating/vkontakte/russia/all',
        permanent: true
      }, {
        source: '/ru/blog/post/banki-v-socsetyah-203923',
        destination: '/app/rating/vkontakte/all/bank',
        permanent: true
      }, {
        source: '/ru/about/agreements',
        destination: '/agreements',
        permanent: true
      }, {
        source: '/en/about/agreements',
        destination: '/agreements',
        permanent: true
      }, {
        source: '/about/confidential',
        destination: '/docs/license/Cube_Confidential_Ru.pdf',
        permanent: true
      }, {
        source: '/about/agreements',
        destination: '/docs/license/Cube_License_Agreement_Ru_01012025.pdf',
        permanent: true
      }, {
        source: '/about/payment-and-refund',
        destination: '/docs/Payment_and_refund_policy_Cube.pdf',
        permanent: true
      }, {
        source: '/about/payment-regular',
        destination: '/docs/Payment_regular_Cube.pdf',
        permanent: true
      }, {
        source: '/ru/about',
        destination: '/',
        permanent: true
      }, {
        source: '/ru/blog/tag/sovety-po-smm',
        destination: '/blog',
        permanent: true
      }, {
        source: '/about/contacts',
        destination: '/',
        permanent: true
      }, {
        source: '/about/team',
        destination: '/contacts',
        permanent: true
      }, {
        source: '/socialindex/:path*',
        destination: '/app/socialindex/:path*',
        permanent: false
      }, {
        source: '/app/rating/instagram/:path*',
        destination: '/app/rating/vkontakte/:path*',
        permanent: false
      }, {
        source: '/app/rating/facebook/:path*',
        destination: '/app/rating/vkontakte/:path*',
        permanent: false
      }, {
        source: '/app/search/instagram/:path*',
        destination: '/app/search/vkontakte/:path*',
        permanent: false
      }, {
        source: '/app/search/facebook/:path*',
        destination: '/app/search/vkontakte/:path*',
        permanent: false
      }, {
        source: '/app/socialindex',
        destination: '/app/socialindex/instagram/russia/brands',
        permanent: false
      }, {
        source: '/registration',
        destination: '/?modal=registration',
        permanent: false
      }
    ]
  },
  async rewrites() {
    return [
    ]
  },
  images: {
    disableStaticImages: true,
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 1397],
    formats: ['image/webp', 'image/avif']
  }
})
