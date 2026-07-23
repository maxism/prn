import React, { Children, Component, ReactNode } from 'react'
import cx from 'classnames'
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination } from "swiper"

import "swiper/css"
import "swiper/css/pagination"

import s from './Block.module.scss'

type ISize = 'z' | 's' | 'm' | 'l'

interface IProps {
  /**
   * Размер группы блоков
   */
  size?: ISize
  /**
   * Содержимое элемента
   */
  children?: ReactNode
  /**
   * Режим слайдера (3 элемента на десктопе)
   */
  slider?: boolean
  /**
   * Режим слайдера (4 элемента на десктопе)
   */
  slider4?: boolean
  /**
   * Центрировать блоки
   */
  center?: boolean
}

/**
 * Группа блоков
 * От размера зависят отступы между и внутри блоков
 */
export default class BlockGroup extends Component<IProps> {
  static defaultProps = {
    size: 'm'
  }

  render (): JSX.Element {
    const { size, children, slider, slider4, center } = this.props

    const classes = cx(s.groupElement, {
      [s.groupSizeZ]: size === 'z',
      [s.groupSizeS]: size === 's',
      [s.groupSizeM]: size === 'm',
      [s.groupSizeL]: size === 'l',
      [s.slider]: slider || slider4,
      [s.center]: center
    })

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
