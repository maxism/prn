import React, { Component, ReactNode } from 'react'

import s from './Article.module.scss'


interface IProps {
  /**
   * Содержимое элемента
   */
  children?: ReactNode
}

/**
 * Группа блоков
 * От размера зависят отступы между и внутри блоков
 */
export default class ArticleGroup extends Component<IProps> {
  static defaultProps = {
    size: 'm'
  }

  render (): JSX.Element {
    const { children } = this.props

    return (
      <div className={s.groupElement}>
        {children}
      </div>
    )
  }
}
