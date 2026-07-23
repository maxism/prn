import development from './development'
import production from './production'
import common from './common'
import AppUtil from '../utils/AppUtil'

const forceProduction = true
const config = (AppUtil.isProduction || forceProduction) ? production : development

const full_config = {
  ...config,
  ...common,
  sitePath: (url) => url.includes('://') ? url : config.websiteUrl.concat(url)
}

export default full_config
