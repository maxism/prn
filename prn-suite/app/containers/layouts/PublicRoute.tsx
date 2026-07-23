import React, { Component, ComponentClass, PureComponent } from 'react'
import { Route } from 'react-router'

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
 * Публичный роут
 */
export default class PublicRoute extends PureComponent<IPropsRoute> {
  render (): JSX.Element {
    const { path, exact, component: Component } = this.props

    {/* @ts-ignore */}
    return <Route path={path} exact={exact} render={() => <Component />} />
  }
}
