import development from './development'
import production from './production'
import common from './common'

// todo: for test on production
const forceProduction = true
const config = (process.env.NODE_ENV === 'production' || forceProduction) ? production : development

const full_config = {
  ...config,
  ...common
}

export default full_config
