import BaseAPI from './BaseAPI'

interface ISigninData {
  token: string
  validationErrors: object
}

interface ISignupData {
  token: string
  validationErrors: object
}

interface IProfileData {
  userID: string
  email: string
  confirmedEmail: boolean
  name: string
  city: string
  company: string
  country: string
  phone: string
  post: string
  role: string
  showSurvey: boolean
  isDemo: boolean
  activeToDate: Date
  currentCommunities: number
  maxCommunities: number
  creditsCommunities: number
  appVersion: string
  plan: any
  validationErrors: object
  carrotquestToken: string
}

interface ISurveyData {
  representative: string
  tasks: Array<string>
  comment: string
}

interface IPasswordData {
  token: string
  validationErrors: object
}

interface ISuccessData {
  validationErrors: object
}

export default class ProfileAPI extends BaseAPI {
  async signin (email: string, password: string): Promise<Partial<ISigninData>> {
    try {
      const data = await this.get('signin', { email, password })

      return {
        token: data.data.data.token
      }
    } catch (e: any) {
      return {
        validationErrors: e.response.data.meta.errors
      }
    }
  }

  async signup (email: string, password: string, promoCode: string): Promise<Partial<ISignupData>> {
    try {
      const data = await this.post('signup', { email, password, promoCode, lang: 'ru' })

      return {
        token: data.data.data.token
      }
    } catch (e: any) {
      console.log('Error', e.response)

      return {
        validationErrors: e.response.data.meta.errors
      }
    }
  }

  async getProfile (token: string): Promise<Partial<IProfileData>> {
    try {
      const data = await this.get('profile/personal', { token, fields: 'carrotquestToken' })
      const profile = data.data.data

      return {
        userID: profile.userID,
        email: profile.email,
        confirmedEmail: profile.confirmedEmail,
        name: profile.name,
        country: profile.country,
        city: profile.city,
        phone: profile.phone,
        company: profile.company,
        post: profile.post,
        role: profile.role,
        showSurvey: profile.showSurvey,
        isDemo: profile.isDemo,
        activeToDate: profile.activeToDate,
        currentCommunities: profile.currentCommunities,
        maxCommunities: profile.maxCommunities,
        creditsCommunities: profile.creditsCommunities,
        appVersion: profile.appVersion || '',
        plan: profile.plan,
        carrotquestToken: profile.carrotquestToken
      }
    } catch (e: any) {
      return {
        validationErrors: e.response.data.meta.errors
      }
    }
  }

  async updateProfile (token: string, fields: Partial<IProfileData>): Promise<ISuccessData> {
    try {
      await this.patch('profile/personal', {
        fields: 'email,name,country,city,phone,company,confirmedEmail,post',
        token,
        ...fields
      })
    } catch (e: any) {
      return {
        validationErrors: e.response.data.meta.errors
      }
    }

    return {
      validationErrors: null
    }
  }

  async sendSurvey (token: string, data: Partial<ISurveyData>): Promise<ISuccessData> {
    try {
      await this.post('profile/survey', {
        token,
        ...data
      })
    } catch (e: any) {
      return {
        validationErrors: e.response.data.meta.errors
      }
    }

    return {
      validationErrors: null
    }
  }

  async resetPassword (email: string): Promise<Partial<ISuccessData>> {
    try {
      await this.post('profile/reset-password', { email })

      return {}
    } catch (e: any) {
      return {
        validationErrors: e.response.data.meta.errors
      }
    }
  }

  async setPassword (recoveryHash: string, password: string): Promise<Partial<IPasswordData>> {
    try {
      const data = await this.patch('profile/reset-password', { recovery_hash: recoveryHash, password })

      const profile = data.data.data

      return {
        token: profile.token
      }
    } catch (e: any) {
      return {
        validationErrors: e.response.data.meta.errors
      }
    }
  }
}
