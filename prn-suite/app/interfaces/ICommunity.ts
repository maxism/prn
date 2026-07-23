import CommunityType from '../types/CommunityType'
import CommunityStatus from '../types/CommunityStatus'
import CallbackStatus from '../types/CallbackStatus'
import ISocialType from './ISocialType'

export interface ICommunityGeoItem {
  category: string
  name: string
  value: number
}

export interface ICommunityGenderAges {
  data: Array<{ category: string, f: number, m: number }>
  summary: { avgAges: string, f: number, m: number }
}

export interface ICommunityMemberType {
  name: string
  percent: number
}

export interface IBrandSafety {
  ad: number
  not_marked_ad: number
  alcohol: number
  toxic: number
  religious: number
  negative: number
  offensive: number
  political: number
  crime: number
  adult: number
  pranks: number
  totalScore: number
}

export default interface ICommunity {
  communityID: string
  accountID: string
  communityType: CommunityType
  name: string
  url: string
  image: string
  socialType: ISocialType
  groupID: string
  color: string
  usersCount: number
  avgER: number
  avgViews: number
  avgInteractions: number
  communityStatus: CommunityStatus
  callbackStatus: CallbackStatus
  cid: string
  isInsights: boolean
  isPaid: boolean
  isBlocked: boolean
  isClosed: boolean
  verified: boolean
  isAdding: boolean
  timeAutoReport: Date
  timeAdd: Date
  qualityScore: number
  membersCities: Array<ICommunityGeoItem>
  membersCountries: Array<ICommunityGeoItem>
  topAudienceCountryCode: string
  topAudienceCity: string
  membersGendersAges: ICommunityGenderAges
  membersTypes: Array<ICommunityMemberType>
  pctFakeFollowers: number
  timeLoop: Date
  timePostsLoaded: Date
  timeShortLoop: Date
  isLoadingShortLoop: boolean
  timeLongLoop: Date
  isLoadingRunLongLoop: boolean
  brandSafety: IBrandSafety
}
