import React, { Component, MouseEventHandler } from 'react'

import './CommunityOverview.scss'
import MetricPie from '../MetricPie/MetricPie'
import MetricPieButton from '../MetricPieButton/MetricPieButton'
import CommunityInfo from '../CommunityInfo/CommunityInfo'
import ICommunity from '../../../interfaces/ICommunity'

interface IProps {
  community: ICommunity
  score?: number
  name?: string
  description?: string
  onSettings?: MouseEventHandler
  onAdd?: MouseEventHandler
}

/**
 * Элемент CommunityOverview
 * Информация о сообществе на странице обзора
 */

class CommunityOverview extends Component<IProps> {
  render (): JSX.Element {
    const { community, score, name, description, onSettings, onAdd } = this.props

    return (
      <div className='community-overview'>

        <div className='community-overview__left'>
          <CommunityInfo small community={community} onSettings={onSettings} />
        </div>

        {score && (
          <div className='community-overview__right'>
            <div className='community-overview__content-right'>
              <div className='community-overview__title'>{name}</div>
              <span className='community-overview__text' dangerouslySetInnerHTML={{ __html: description }} />
            </div>
            <div className='community-overview__pie'>
              <MetricPie score={score} />
            </div>
          </div>
        ) || onAdd && (
          <div className='community-overview__right'>
            <div className='community-overview__content-right'>
              <div className='community-overview__title community-overview__title-grey'>Добавьте конкурентов</div>
              <span className='community-overview__text'>Чтобы мы смогли посчитать показатель эффективности этой страницы — добавьте несколько страниц конкурентов.</span>
            </div>
            <div className='community-overview__pie'>
             <MetricPieButton onClick={onAdd} />
            </div>
          </div>
        )}
      </div >
    )
  }
}

export default CommunityOverview
