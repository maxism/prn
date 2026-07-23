import React, { Component, ReactNode } from 'react'
import { Map, Marker } from 'yandex-map-react'

import s from './YandexMap.module.scss'


interface IProps {
  /**
   * Текст
   */
  children?: ReactNode
}

/**
 * Элемент карты
 */
class YandexMap extends Component<IProps> {
  static defaultProps = {
    size: 'm'
  }

  render (): JSX.Element {
    return (<div className={s.element}>
      <Map center={[55.956360, 38.042512]} zoom={17} width='100%' height='100%'>
        <Marker lat={55.956360} lon={38.042512} >
          {/*<MarkerLayout>
            <div style={{borderRadius: '50%', overflow: 'hidden'}}>
              <img src="http://loremflickr.com/80/80"/>
            </div>
          </MarkerLayout>*/}
        </Marker>
      </Map>
    </div>)
  }
}

export default YandexMap
