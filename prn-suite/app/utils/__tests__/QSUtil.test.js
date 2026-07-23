import QSUtil from '../QSUtil'

describe('qsUtil', () => {
  it('.parse: Простые параметры', async () => {
    const url = '?name=12121&reportID=5e6111d82f212000feb88172&backUrl=%2Fru%2Fsuite%2F5d7f882058338a16195fd93f%2Fanalytics%2Freports&currentDateFrom=26.02.2020'

    expect(QSUtil.parse(url)).toEqual({
      name: '12121',
      reportID: '5e6111d82f212000feb88172',
      backUrl: '/ru/suite/5d7f882058338a16195fd93f/analytics/reports',
      currentDateFrom: '26.02.2020'
    })
  })

  it('.stringify: Простые параметры', async () => {
    const obj = {
      name: 12121,
      reportID: '5e6111d82f212000feb88172',
      backUrl: '/ru/suite/5d7f882058338a16195fd93f/analytics/reports',
      currentDateFrom: '26.02.2020'
    }

    expect(QSUtil.stringify('', obj)).toEqual(
      '?name=12121&reportID=5e6111d82f212000feb88172&backUrl=%2Fru%2Fsuite%2F5d7f882058338a16195fd93f%2Fanalytics%2Freports&currentDateFrom=26.02.2020')
  })

  it('.parse: Вложенные параметры', async () => {
    const url = '?items[0][type]=community&items[0][communityID]=5e6b7ec4e6214c01247163f8' +
      '&items[1][type]=tag&items[1][communityID]=1247165e6b7ec4e6214c03f8&items[1][color]=%2385c3fe' +
      '&currentFilters[0][type]=like&currentFilters[0][name]=text&currentFilters[0][values][0]=&currentFilters[1][type]=in&currentFilters[1][name]=mainGrade'

    expect(QSUtil.parse(url)).toEqual({
      items: [
        { type: 'community', communityID: '5e6b7ec4e6214c01247163f8' },
        { type: 'tag', communityID: '1247165e6b7ec4e6214c03f8', color: '#85c3fe' }
      ],
      currentFilters: [
        { name: 'text', type: 'like', values: [''] },
        { name: 'mainGrade', type: 'in' }
      ]
    })
  })

  it('.stringify: Вложенные параметры', async () => {
    const obj = {
      items: [
        { type: 'community', communityID: '5e6b7ec4e6214c01247163f8' },
        { type: 'tag', communityID: '1247165e6b7ec4e6214c03f8', color: '#85c3fe' }
      ],
      currentFilters: [
        { type: 'like', name: 'text', values: [''] },
        { type: 'in', name: 'mainGrade' }
      ]
    }

    expect(QSUtil.stringify('', obj)).toEqual('?items[0][type]=community&items[0][communityID]=5e6b7ec4e6214c01247163f8' +
      '&items[1][type]=tag&items[1][communityID]=1247165e6b7ec4e6214c03f8&items[1][color]=%2385c3fe' +
      '&currentFilters[0][type]=like&currentFilters[0][name]=text&currentFilters[0][values][0]=&currentFilters[1][type]=in&currentFilters[1][name]=mainGrade')
  })

  it('.parse: Смешанные параметры', async () => {
    const url = '?name=%D0%9D%D0%BE%D0%B2%D1%8B%D0%B9%20%D0%BE%D1%82%D1%87%D1%91%D1%82' +
      '&items[0][type]=community&items[0][communityID]=5e6b7ec4e6214c01247163f8&items[0][color]=%2385c3fe' +
      '&currentDateFrom=22.03.2020&currentDateTo=29.03.2020&currentType=last_7_days&visibility=private&chart=likes' +
      '&sort=date&backUrl=%2Fru%2Fsuite%2F5d7f882058338a16195fd93f%2Fanalytics%2Fcommunities&currentFilters[0][type]=like' +
      '&currentFilters[0][name]=text&currentFilters[0][values][0]=&currentFilters[1][type]=in&currentFilters[1][name]=mainGrade'

    expect(QSUtil.parse(url)).toEqual({
      backUrl: '/ru/suite/5d7f882058338a16195fd93f/analytics/communities',
      chart: 'likes',
      currentDateFrom: '22.03.2020',
      currentDateTo: '29.03.2020',
      currentFilters: [
        {
          name: 'text',
          type: 'like',
          values: ['']
        },
        {
          name: 'mainGrade',
          type: 'in'
        }
      ],
      currentType: 'last_7_days',
      items: [
        {
          color: '#85c3fe',
          communityID: '5e6b7ec4e6214c01247163f8',
          type: 'community'
        }
      ],
      name: 'Новый отчёт',
      sort: 'date',
      visibility: 'private'
    })
  })

  it('.parse & .stringify: Параметр с пустым массивом', async () => {
    const url = '?array='

    const obj = {
      array: []
    }

    expect(QSUtil.parse(url)).toEqual({
      array: ''
    })
    expect(QSUtil.stringify('', obj)).toEqual('')
  })
})
