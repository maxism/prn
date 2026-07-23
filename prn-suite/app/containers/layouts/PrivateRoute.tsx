import React, { Component, ComponentClass } from 'react'
import { Route } from 'react-router'
import { inject, observer } from 'mobx-react'
import AccountsStore from '../../stores/AccountsStore'
import ProfileStore from '../../stores/ProfileStore'
import { Stores } from '../../stores/RootStore'
import withParams, { ParamsProps } from '../../utils/withParams'

interface IPropsComponent {
  component: ComponentClass
  params?: ParamsProps
  accountsStore?: AccountsStore
  profileStore?: ProfileStore
}

@withParams
@inject(Stores.PROFILE_STORE, Stores.ACCOUNTS_STORE)
@observer
class PrivateComponent extends Component<IPropsComponent> {
  render (): JSX.Element {
    const { profileStore, accountsStore, component: Component } = this.props

    if (profileStore.isLoading || accountsStore.isLoading) return null

    if (!profileStore.isAuth || !accountsStore.currentAccount) {
      this.props.params.changeUrl('/access-denied')
      return null
    }

    // @ts-ignore
    return <Component {...this.props} />
  }
}

interface IPropsRoute {
  /**
   * Путь
   */
  path: string,
  /**
   * Приватный доступ
   */
  private?: boolean
  /**
   * Точное совпадение пути
   */
  exact?: boolean,
  /**
   * Компонент
   */
  component: ComponentClass
}

/**
 * Приватный роут
 */
export default class PrivateRoute extends Component<IPropsRoute> {
  render (): JSX.Element {
    const { path, exact, component } = this.props

    {/* @ts-ignore */}
    return <Route path={path} exact={exact} render={() => <PrivateComponent component={component} />} />
  }
}
