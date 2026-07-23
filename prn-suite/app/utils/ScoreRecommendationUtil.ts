
interface IScores {
  total: number
  usersCount: number
  deltaUsersCount: number
  deltaInteractions: number
  deltaLikes: number
  deltaRePosts: number
  deltaComments: number
  er: number
  deltaViews: number
  deltaPosts: number
}

interface IScoreRecommendation {
  name: string
  description: string
}

interface IGeneralDescription {
  name: string
  myDescription: string
  competitorDescription: string
}

/**
 * Утилита для получения рекомендаций по scores
 */
export default class ScoreRecommendationUtil {
  private _competitorScores: Array<IScores> = []

  constructor (competitorScores: Array<IScores>) {
    this._competitorScores = competitorScores
  }

  getMyRecommendation (scores: IScores): IScoreRecommendation {
    if (!scores) return { name: '', description: '' }

    const general = this.getGeneralDescription(scores?.total)

    let detailDescription = this.getCompareDescription(scores, this._competitorScores)

    let detailDescriptionText = ''
    detailDescription = detailDescription.map(name => {
      if (name === 'deltaLikes') name = '<strong>лайки</strong>'
      if (name === 'deltaRePosts') name = '<strong>репосты</strong>'
      if (name === 'deltaComments') name = '<strong>комментарии</strong>'
      if (name === 'er') name = '<strong>вовлеченность</strong>'
      if (name === 'deltaPosts') name = '<strong>количество постов</strong>'

      return name
    })

    if (detailDescription.length) detailDescriptionText = ' и попробуйте подтянуть показатели, в которых есть проседания — ' + detailDescription.join(' и ') + '.'
    else detailDescriptionText = ' и пробуйте новые идеи.'

    return {
      name: general.name,
      description: general.myDescription + ' Продолжайте работать' + detailDescriptionText
    }
  }

  getCompetitorRecommendation (myScores: IScores, competitorScores: IScores): IScoreRecommendation {
    if (!myScores || !competitorScores) return { name: '', description: '' }
    const general = this.getGeneralDescription(competitorScores?.total)

    let detailDescription = this.getCompareDescription(myScores, [competitorScores])

    let detailDescriptionText = ''
    detailDescription = detailDescription.map(name => {
      if (name === 'deltaLikes') name = 'они собирают больше <strong>лайков</strong>'
      if (name === 'deltaRePosts') name = 'они собирают больше <strong>репостов</strong>'
      if (name === 'deltaComments') name = 'они собирают больше <strong>комментариев</strong>'
      if (name === 'er') name = 'у них более <strong>вовлекающие</strong> посты'
      if (name === 'deltaPosts') name = 'у них публикуется больше <strong>постов</strong>'

      return name
    })

    if (detailDescription.length) detailDescriptionText = ' Посмотрите на контент этой страницы — ' + detailDescription.join(' и ') + '.'
    else detailDescriptionText = ''

    return {
      name: general.name,
      description: general.competitorDescription + ' ' + detailDescriptionText
    }
  }

  getGeneralDescription (score: number): IGeneralDescription {
    if (score >= 0 && score <= 0.2) {
      return {
        name: 'Плохо',
        myDescription: 'Будем честны — ваша страница не в лучшей форме.',
        competitorDescription: 'Ваш конкурент плохо работает с соцсетями — так делать точно не стоит.'
      }
    }
    if (score > 0.2 && score <= 0.4) {
      return {
        name: 'Можно лучше',
        myDescription: 'Неплохо, но ваши показатели могут быть лучше.',
        competitorDescription: 'Этот конкурент не показывает блестящих результатов. Есть над чем подумать.'
      }
    }
    if (score > 0.4 && score <= 0.6) {
      return {
        name: 'Нормально',
        myDescription: 'Ваша страница на среднем уровне.',
        competitorDescription: 'Конкурент на среднем уровне относительно всех.'
      }
    }
    if (score > 0.6 && score <= 0.8) {
      return {
        name: 'Хорошо',
        myDescription: 'Ваша страница лучше, чем у половины конкурентов.',
        competitorDescription: 'Вам попался хороший конкурент, тут с работой в соцсетях всё в порядке.'
      }
    }
    if (score > 0.8 && score <= 1) {
      return {
        name: 'Отлично!',
        myDescription: 'Ваша страница одна из лучших среди конкурентов.',
        competitorDescription: 'Очень достойный конкурент, всё делает правильно.'
      }
    }
    return {
      name: 'Не определен',
      myDescription: 'Необходимо добавить конкурентов.',
      competitorDescription: ''
    }
  }

  getCompareDescription (myScores: IScores, compareScores: Array<IScores>): Array<string> {
    // console.log('this._competitorScores', this._competitorScores)

    const bestCompetitorScores = compareScores.filter(s => s?.total > myScores?.total)

    // console.log('bestCompetitorScores', bestCompetitorScores)

    if (!bestCompetitorScores.length) return []

    const avgBestCompetitorScores = {
      usersCount: bestCompetitorScores.map(scores => scores.usersCount).reduce((accumulator, currentValue) => accumulator + currentValue, 0) / bestCompetitorScores.length,
      deltaUsersCount: bestCompetitorScores.map(scores => scores.deltaUsersCount).reduce((accumulator, currentValue) => accumulator + currentValue, 0) / bestCompetitorScores.length,
      deltaInteractions: bestCompetitorScores.map(scores => scores.deltaInteractions).reduce((accumulator, currentValue) => accumulator + currentValue, 0) / bestCompetitorScores.length,
      deltaLikes: bestCompetitorScores.map(scores => scores.deltaLikes).reduce((accumulator, currentValue) => accumulator + currentValue, 0) / bestCompetitorScores.length,
      deltaRePosts: bestCompetitorScores.map(scores => scores.deltaRePosts).reduce((accumulator, currentValue) => accumulator + currentValue, 0) / bestCompetitorScores.length,
      deltaComments: bestCompetitorScores.map(scores => scores.deltaComments).reduce((accumulator, currentValue) => accumulator + currentValue, 0) / bestCompetitorScores.length,
      er: bestCompetitorScores.map(scores => scores.er).reduce((accumulator, currentValue) => accumulator + currentValue, 0) / bestCompetitorScores.length,
      deltaViews: bestCompetitorScores.map(scores => scores.deltaViews).reduce((accumulator, currentValue) => accumulator + currentValue, 0) / bestCompetitorScores.length,
      deltaPosts: bestCompetitorScores.map(scores => scores.deltaPosts).reduce((accumulator, currentValue) => accumulator + currentValue, 0) / bestCompetitorScores.length
    }

    let significance = [
      // { name: 'usersCount', index: avgBestCompetitorScores.usersCount - myScores.usersCount },
      // { name: 'deltaUsersCount', index: avgBestCompetitorScores.deltaUsersCount - myScores.deltaUsersCount },
      // { name: 'deltaInteractions', index: avgBestCompetitorScores.deltaInteractions - myScores.deltaInteractions },
      { name: 'deltaLikes', index: avgBestCompetitorScores.deltaLikes - myScores.deltaLikes },
      { name: 'deltaRePosts', index: avgBestCompetitorScores.deltaRePosts - myScores.deltaRePosts },
      { name: 'deltaComments', index: avgBestCompetitorScores.deltaComments - myScores.deltaComments },
      { name: 'er', index: avgBestCompetitorScores.er - myScores.er },
      // { name: 'deltaViews', index: avgBestCompetitorScores.deltaViews - myScores.deltaViews },
      { name: 'deltaPosts', index: avgBestCompetitorScores.deltaPosts - myScores.deltaPosts }
    ]

    significance = significance.sort((a, b) => b.index - a.index).filter(s => s.index > 0)

    // console.log('significance', significance)

    return significance.map(s => s.name).slice(0, 2)
  }
}
