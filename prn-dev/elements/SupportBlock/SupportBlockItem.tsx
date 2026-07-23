import React, { Component } from 'react'

import s from './SupportBlock.module.scss'
import Text from '../Text/Text'
import Icon from '../Icon/Icon'
import Link from '../Link/Link'

interface IProps {
  /**
   * Заголовок статьи
   */
  title: string
  /**
   * Бэйдж раздела
   */
  service?: string
  /**
   * Ссылка
   */
  to?: string
}

/**
 * Блок одного вопроса и ответа
 */
export default class SupportBlockItem extends Component<IProps> {

  render (): JSX.Element {
    const { title, service, to } = this.props

    return (
      <Link className={s.itemElement} to={to}>
        {service && <div className={s.tag}>
          <Text size='xs' semibold>{service}</Text>
        </div>}
        <Text size='s' maxWidth semibold>{title}</Text>
        <Icon icon='arrow_right' size='m' />
      </Link>
    )
  }
}
