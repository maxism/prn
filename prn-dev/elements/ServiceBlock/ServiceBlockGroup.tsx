import React, { Children, Component, ReactNode } from 'react'
import cx from 'classnames'
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination } from "swiper"
import StackGrid from 'react-stack-grid'
import { withResizeDetector } from 'react-resize-detector'

import "swiper/css"
import "swiper/css/pagination"

import s from './ServiceBlock.module.scss'
import AppUtil from '../../utils/AppUtil'

type ISize = 'm' | 'l'

interface IProps {
  /**
   * Содержимое элемента
   */
  children?: ReactNode
  /**
   * Размер
   */
  size?: ISize
  /**
   * Режим слайдера (3 элемента на десктопе)
   */
  slider?: boolean
  /**
   * Режим слайдера (4 элемента на десктопе)
   */
  slider4?: boolean
  /**
   * Режим StackGrid
   */
  stackGrid?: boolean
  /**
   * Ширина из withResizeDetector
   */
  width?: number
}

/**
 * Группа блоков
 * От размера зависят отступы между и внутри блоков
 */
class ServiceBlockGroup extends Component<IProps> {
  static defaultProps = {
    size: 'm'
  }

  render (): JSX.Element {
    const { children, size, slider, slider4, stackGrid } = this.props

    const classes = cx(s.groupElement, {
      [s.groupSizeM]: size === 'm',
      [s.groupSizeL]: size === 'l',
      [s.slider]: slider || slider4,
      [s.stackGrid]: stackGrid,
    })

    if (stackGrid) return (
      <StackGrid
        className={classes}
        columnWidth={AppUtil.screenBreakpoint({ 0: '100%', 639: '50%', 1024: '33%' })}
        itemComponent='div'
      >
        {children}
      </StackGrid>
    )

    if (slider || slider4) return (
      <Swiper
        className={classes}
        pagination={{
          clickable: true,
        }}
        spaceBetween={32}
        breakpoints={{
          0: {
            slidesPerView: 1,
            spaceBetween: 8
          },
          639: {
            slidesPerView: 1,
            spaceBetween: 8
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 16
          },
          1023: {
            slidesPerView: 2,
            spaceBetween: 16
          },
          1024: {
            slidesPerView: slider4 ? 4 : 3,
            spaceBetween: 16
          },
          1279: {
            slidesPerView: slider4 ? 4 : 3,
            spaceBetween: 32
          }
        }}
        modules={[Pagination]}
      >
        {Children.toArray(children).filter(item => item).map((child, index) => <SwiperSlide key={index} virtualIndex={index}>{child}</SwiperSlide>)}
      </Swiper>
    )

    return (
      <div className={classes}>
        {children}
      </div>
    )
  }
}

// @ts-ignore
const wrappedServiceBlockGroup = withResizeDetector(ServiceBlockGroup)
wrappedServiceBlockGroup.displayName = 'ServiceBlockGroup'

export default wrappedServiceBlockGroup
