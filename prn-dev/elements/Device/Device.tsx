import React, { Component } from 'react'
import cx from 'classnames'

import s from './Device.module.scss'
import Image from 'next/image'
import Text from '../Text/Text'

interface IProps {
  /**
   * Картинка
   */
  image: string
  /**
   * Подпись
   */
  label?: string
  /**
   * Изображение без рамок
   */
  noBorder?: boolean
  /**
   * Показывать видео с YouTube
   */
  youtube?: string
  /**
   * Показывать видео с VK
   */
  vkontakte?: string
}

/**
 * Блок
 * Размер задает количество занимаемых колонок
 */
export default class Device extends Component<IProps> {
  render (): JSX.Element {
    const { image, label, noBorder, youtube, vkontakte } = this.props

    const classes = cx(s.element, {
      [s.noBorder]: noBorder
    })

    return (
      <>
        <div className={classes}>
          <div className={s.shadow}></div>
          <div className={s.container}>
            <Image className={s.image} src={image} width={1397} height={871} quality={90} priority />
            {youtube && (
              <iframe className={s.video} width='560' height='315' src={youtube}
                title='YouTube video player' frameBorder='0'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen />
            )}
            {vkontakte && (
              <iframe
                className={s.video}
                width='560' height='315'
                src={vkontakte}
                allow='autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;'
                frameBorder='0'
                allowFullScreen
              />
            )}
          </div>
          <Text size='xs' center className={s.label}>{label}</Text>
        </div>
      </>
    )
  }
}
