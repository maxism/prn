import React from 'react'
import ReactDOM, { unmountComponentAtNode } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'mobx-react'
import App from './containers/App'
import rootStore from './stores/RootStore'
import { createBrowserHistory } from 'history'
import { syncHistoryWithStore } from 'mobx-react-router'
import { Router } from 'react-router'

// import './utils/Logging'

import i18n from './lib/i18n'
import locale_en from '../assets/locales/en.json'
import locale_ru from '../assets/locales/ru.json'

import locale_de from '../assets/locales/de.json'

const locales = {
  en: locale_en,
  ru: locale_ru,
  de: locale_de
}

export const _frontmatter = {}

const locale = i18n.getLangFromPath()

const i18nTools = new i18n.Tools({ localeData: locales[locale], locale })

window['i18n'] = i18nTools

const browserHistory = createBrowserHistory()

const history = syncHistoryWithStore(browserHistory, rootStore.routingStore)

const mountNode = document.getElementById('root')

const renderApp = () => {
  const App = require('./containers/App').default

  ReactDOM.render(
    /* @ts-ignore */
    <AppContainer>
      <Provider {...rootStore} routing={rootStore.routingStore}>
        {/* @ts-ignore */}
        <i18n.Provider i18n={i18nTools}>
          {/* @ts-ignore */}
          <Router history={history}>
            <App />
          </Router>
        </i18n.Provider>
      </Provider>
    </AppContainer>,
    mountNode
  )
}

if (module.hot) {
  module.hot.accept('./containers/App', () => {
    unmountComponentAtNode(mountNode)
    renderApp()
  })
}

renderApp()

// Хак для вывода ошибок
const overlay = require('webpack-dev-server/client/overlay')
const show = overlay.showMessage
overlay.showMessage = (messages) => {
  const newMessages = []
  messages.map(
    msg => {
      newMessages.push(`${msg.moduleName}\n${msg.message}`)
    }
  )
  show(newMessages)
}
//
