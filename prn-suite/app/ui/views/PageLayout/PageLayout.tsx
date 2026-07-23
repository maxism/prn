import React, { Component, ReactNode } from 'react'
import cx from 'classnames'

import './PageLayout.scss'

export type PageLayoutIcon = 'logo_sign' | 'none' | 'attention' | 'user'

interface IProps {
  header?: ReactNode
  footer?: ReactNode
  children: ReactNode
  center?: boolean
  full?: boolean
  icon?: string
  secondHeader?: ReactNode
}

/**
 * Вид PageLayout - обёртка для страницы
 */
class PageLayout extends Component<IProps> {
  render (): JSX.Element {
    const { header, footer, children, center, full, icon, secondHeader } = this.props

    const classes = cx('page-layout', {
      'page-layout--center': center,
      [`page-layout--icon-${icon}`]: icon,
      'page-layout--full': full,
      'page-layout--second-header': secondHeader
    })

    return (
      <div className={classes}>
        {header}
        {secondHeader && <div className='page-layout__second-header'>
          <div className='page-layout__second-header__contaner'>
            {secondHeader}
          </div>
        </div>}
        <div className='page-layout__container'>
          {children}
        </div>
        {footer}
      </div>
    )
  }
}

export default PageLayout
