import React, { Component } from 'react'

import './CommunityScore.scss'
import MetricPie from '../MetricPie/MetricPie'

interface IProps {
  score?: number
  name?: string
  description?: string
}

class CommunityScore extends Component<IProps> {

  static defaultProps = {
    score: 0
  }

  render (): JSX.Element {

    const { score, name, description } = this.props

    return (
        <div className='community-score'>
          <div className='community-score__pie'>
            <MetricPie big score={score} />
          </div>
          <div className='community-score__right'>
            <span className='community-score__title'>{name}</span>
            <div className='community-score__text' dangerouslySetInnerHTML={{ __html: description }} />
          </div>
        </div>
    )
  }
}

export default CommunityScore
