import React, { Component, PureComponent } from 'react'
import { Stores } from '../stores/RootStore'
import ObjectUtil from './ObjectUtil'
import qs from './QSUtil'
import { inject, observer } from 'mobx-react'
import { RouterStore } from 'mobx-react-router'
import { RouteComponentProps, withRouter } from 'react-router'
import scrollToElement from 'scroll-to-element'

interface IWrapperProps extends RouteComponentProps {
  routing?: RouterStore
}

interface IParams<T> {
  setDefaultParams: (defaultParams?: T) => void
  changeParams: (replaceParams?: T) => void
  changeUrl: (url: string, params?: T) => void
  currentPath: () => string
}

export type ParamsProps<T = {}> = { [P in keyof T]: T[P] } & IParams<T> & IWrapperProps

/**
 * Компонент высшего уровня для парсинга location в params
 */
function withParams (Component: any): any {
  @inject(Stores.ROUTING)
  @observer
  class Wrapper extends PureComponent<IWrapperProps> {
    componentDidUpdate (prevProps: Readonly<IWrapperProps>, prevState: Readonly<{}>, snapshot?: any): void {
      this.scrollToHash()
    }

    changeParams = (replaceParams: object): void => {
      let newParams = ObjectUtil.removeUndefined({
        ...this.props.match.params,
        ...qs.parse(this.props.location?.search),
        ...replaceParams
      })

      Object.keys(newParams).forEach(key => {
        if (newParams[key] === undefined || Array.isArray(newParams[key]) && !newParams[key].length) newParams[key] = null
      })

      if (newParams['hash'] === 'top') {
        window.scrollTo(0, 0)
        delete newParams['hash']
      }

      // console.log('changeParams', this.props)

      this.props.routing.push(qs.stringify(this.props.location.pathname, newParams))
    }

    scrollToHash = (): void => {
      // @ts-ignore
      const { hash = undefined } = qs.parse(this.props.location?.search)
      if (!hash) return

      const element = document.querySelector(`#${hash}`)
      if (element) {
        scrollToElement(element, {
          offset: -60,
          // align: 'middle',
          duration: 1500
        })

        this.changeParams({ hash: undefined })
      }
    }

    render (): JSX.Element {
      const params = {
        ...this.props.match.params,
        ...qs.parse(this.props.location?.search),
        setDefaultParams: (defaultParams: object): void => {
          const matchParams = {
            ...this.props.match.params,
            ...qs.parse(this.props.location?.search)
          }
          Object.keys(defaultParams).map(key => matchParams[key] = matchParams[key] || defaultParams[key])
          setTimeout(() => this.props.routing.push(qs.stringify(this.props.location.pathname, matchParams)), 1)
        },
        changeParams: this.changeParams,
        changeUrl: (url: string, params?: object): void => {
          if (this.props.routing) {
            let newParams = ObjectUtil.removeUndefined({
              ...this.props.match.params,
              ...qs.parse(this.props.location?.search),
              ...params
            })

            Object.keys(newParams).forEach(key => {
              if (newParams[key] === undefined || Array.isArray(newParams[key]) && !newParams[key].length) newParams[key] = null
            })

            // console.log('changeUrl', this.props)

            this.props.routing.push(qs.stringify(url, { ...newParams }))
            window.scrollTo(0, 0)
          }
        },
        currentPath: (): string => {
          return this.props.match.path
        }
      }

      return (
        <Component
          {...this.props}
          params={params}
        />
      )
    }
  }

  return withRouter(Wrapper)
}

export default withParams
