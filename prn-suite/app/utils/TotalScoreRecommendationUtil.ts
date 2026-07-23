import ISocialType from '../interfaces/ISocialType'
import SocialDataUtil from './SocialDataUtil'

interface IScores {
  socialType: ISocialType
  totalScore: number
}

interface IScoreRecommendation {
  score: number
  name: string
  description: string
}

/**
 * Утилита для получения рекомендаций по scores
 */
export default class TotalScoreRecommendationUtil {
  private _myScores: Array<IScores> = []

  constructor (myScores: Array<IScores>) {
    this._myScores = myScores.filter(score => score.totalScore !== undefined)
  }

  getMyTotalRecommendation (): IScoreRecommendation {
    let score = this._myScores.map(score => score.totalScore).reduce((accumulator, currentValue) => accumulator + currentValue, 0) / this._myScores.length

    const worstScores = this._myScores.sort((a, b) => a.totalScore - b.totalScore).slice(0, 2)

    const worstSocials = worstScores.map(score => `**${SocialDataUtil.getSocialTypeName(score.socialType)}**`).join(' и ')

    if (score >= 0 && score <= 0.2) {
      return {
        score: score,
        name: 'Плохо',
        description: `Это общий показатель эффективности проекта. На данный момент проект не эффективен. Вам нужно серьезно отнестись к продвижению. Особенно к ${worstSocials}.`
      }
    }
    if (score > 0.2 && score <= 0.4) {
      return {
        score: score,
        name: 'Можно лучше',
        description: `Это общий показатель эффективности проекта. Пока дела идут не очень хорошо. Ваши конкуренты лучше справляются с ${worstSocials}.`
      }
    }
    if (score > 0.4 && score <= 0.6) {
      return {
        score: score,
        name: 'Нормально',
        description: `Это общий показатель эффективности проекта. В основном ваш контент работает хорошо, а пользователи весьма лояльны. Обратите внимание на ${worstSocials}.`
      }
    }
    if (score > 0.6 && score <= 0.8) {
      return {
        score: score,
        name: 'Хорошо',
        description: `Это общий показатель эффективности проекта. Вы уверенно обгоняете большинство конкурентов, но с ${worstSocials} ещё нужно поработать.`
      }
    }
    if (score > 0.8 && score <= 1) {
      return {
        score: score,
        name: 'Отлично!',
        description: `Это общий показатель эффективности проекта. Можно сказать, что ваш проект один из лучших. Вот только с ${worstSocials} можно поработать ещё :)`
      }
    }
    return {
      score: score,
      name: 'Не определен',
      description: 'Для оценки эффективности проекта нужно добавить конкурентов. Чем больше конкурентов вы загрузите, тем точнее будут показатели.'
    }
  }
}
