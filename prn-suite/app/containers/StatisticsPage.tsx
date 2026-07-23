import { observer } from 'mobx-react'
import React, { Component } from 'react'
import { IStatisticsParams } from '../interfaces/IParams'
import withParams, { ParamsProps } from '../utils/withParams'

import StatisticsCommunityPage from './statistics/StatisticsCommunityPage'
import StatisticsProjectPage from './statistics/StatisticsProjectPage'

interface IProps {
  params?: ParamsProps<IStatisticsParams>
}

/**
 * Страница StatisticsPage
 */
@withParams
@observer
class StatisticsPage extends Component<IProps> {

  render (): JSX.Element {
    if (this.props.params.type === 'ALL') return <StatisticsProjectPage />
    return <StatisticsCommunityPage />
  }
}

export default StatisticsPage
