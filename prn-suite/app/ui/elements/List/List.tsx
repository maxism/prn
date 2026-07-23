import React, { Children, Component, MouseEventHandler, ReactElement, ReactNode, RefObject } from 'react'
import uuid from '../../behaviors/Uuid/Uuid'
import cx from 'classnames'

import './List.scss'
import { throttle } from 'lodash'
import eventStack from '../../../lib/eventStack'
import Loading from '../Loading/Loading'

type TSize = 'superSmall' | 'small' | 'middle'

interface IProps {
  /**
   * Список элементов
   */
  children: ReactNode
  /**
   *  Размер
   */
  size?: TSize
  /**
   * Текст пустого списка
   */
  emptyText?: string
  /**
   * Состояние загрузки
   */
  isLoading?: boolean
  /**
   * Скрыть список
   */
  isHide?: boolean
  /**
   * Текст загрузки
   */
  loadingText?: string
  /**
   * Состояние перекрывающей загрузки
   */
  isOverLoading?: boolean
  /**
   * Обработчик вызова дополнительной подгрузки контента
   */
  onLoadMore?: MouseEventHandler
  /**
   * Отступ сверху если внутри спискиа есть элементы
   */
  noEmptyTopOffset?: number
}

/**
 * Элемент List
 * Список
 */
class List extends Component<IProps> {
  private uuid: string
  private _throttleHandleUpdate: Function
  private listEl: RefObject<any>

  static defaultProps = {
    size: 'middle'
  }

  constructor (props) {
    super(props)
    this.uuid = uuid()
    this.listEl = React.createRef()
    this._throttleHandleUpdate = throttle(this.handleUpdate, 100)

    if (props.onLoadMore) eventStack.sub('scroll', this._throttleHandleUpdate, 'List', this.uuid)
  }

  componentWillUnmount (): void {
    eventStack.unsub('scroll', this._throttleHandleUpdate, 'List', this.uuid)
  }

  handleUpdate = (e) => {
    if (!this.listEl.current) return
    if (this.props.isLoading || this.props.isOverLoading) return

    const listRect = this.listEl.current.getBoundingClientRect()
    let bottomSpace = -Math.min(window.innerHeight - listRect.top - listRect.height, 0)

    if (bottomSpace < 100) this.props.onLoadMore(e)
  }

  render (): JSX.Element {
    const { size, children, emptyText, isLoading, loadingText, isHide, isOverLoading, noEmptyTopOffset } = this.props

    if (isHide) return null

    const classes = cx('list', {
      [`list--${size}`]: size,
      'list--over-loading': isOverLoading
    })

    const isEmpty = !Children.toArray(children as Array<ReactElement>).length

    return (
      <div
        className={classes}
        ref={this.listEl}
        style={{ paddingTop: !isEmpty && `${noEmptyTopOffset * 10}px` }}
      >
        {isLoading && <Loading size={90} message={loadingText} />}
        {!isLoading && isEmpty && emptyText && <span className='list__empty-text'>{emptyText}</span>}
        {!isLoading && children}
      </div>
    )
  }
}

export default List
