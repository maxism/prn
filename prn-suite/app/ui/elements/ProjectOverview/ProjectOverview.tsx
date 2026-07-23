import React, { Component, MouseEventHandler } from 'react'
import cx from 'classnames'

import './ProjectOverview.scss'

import MetricPie from '../MetricPie/MetricPie'
import ProjectInfo from '../ProjectInfo/ProjectInfo'
import Description from '../Description/Description'
import MetricPieButton from '../MetricPieButton/MetricPieButton'
import ICommunity from '../../../interfaces/ICommunity'

interface IProps {
  image: string
  name: string
  description?: string
  communities?: Array<ICommunity>
  onSettings?: MouseEventHandler
  score?: number
  scoreName?: string
  scoreDescription?: string
  onAdd?: MouseEventHandler
  onClick?: MouseEventHandler
}

/**
 * Элемент ProjectOverview.
 * Информация о сообществе на странице обзора
 */
class ProjectOverview extends Component<IProps> {
  render (): JSX.Element {
    const {
      image, name, communities, description,
      onSettings, score,
      scoreName, scoreDescription, onAdd,
      onClick
    } = this.props

    const classes = cx('project-overview', {
      'project-overview__link': onClick
    })

    return (
      <div className={classes} onClick={onClick}>

        <div className='project-overview__left'>
          <ProjectInfo
            image={image}
            name={name}
            communities={communities}
            description={description}
          />
        </div>

        {score && (
          <div className='project-overview__right'>
            <div className='project-overview__content-right'>
              <div className='project-overview__title'>{scoreName}</div>
              <Description className='project-overview__text'>{scoreDescription}</Description>
            </div>
            <div className='project-overview__pie'>
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

export default ProjectOverview
