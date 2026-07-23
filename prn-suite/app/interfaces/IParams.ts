import ISocialType from './ISocialType'

export interface IGlobalParams {
  accountID?: string
  page?: string
  hash?: string
  type?: ISocialType
  reportCommunityID?: string
  invoiceID?: string
  token?: string
  confirmToken?: boolean
  confirmCode?: string
  recoveryCode?: string
  communityID?: string
  postID?: string
  addCommunity?: boolean
  addCommunityType?: string
  addCommunityCID?: string
  addUrl?: string
  competitorsIDs?: Array<string>
  accountSettings?: boolean
  changePassword?: boolean
  editProject?: boolean
  editUser?: boolean
  isConfirmEmailClosed?: boolean
  promoCode?: string
  modal?: string
  premium?: string
}

export interface IStatisticsParams extends IGlobalParams {
  from?: string
  to?: string
  text?: string
  sort?: string
  tableSort?: string
  direction?: string
  contentType?: string
  grades?: Array<string>
  activityMetric?: string
  reactionMetric?: string
  hashtagsMetric?: string
  agesMetric?: string
  textLengthMetric?: string
  contentTypeMetric?: string
}

export interface IMessengerParams extends IGlobalParams {
  dialogID?: string
  filter?: string
  tab?: string
}
