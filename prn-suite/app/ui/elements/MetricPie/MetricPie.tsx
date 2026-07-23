import React, { Component } from 'react'
import * as Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import cx from 'classnames'

import './MetricPie.scss'

interface IProps {
  score: number
  big?: boolean
  small?: boolean
}

class MetricPie extends Component<IProps> {
  render (): JSX.Element {
    const { score, big, small } = this.props

    const series: Array<Highcharts.SeriesOptionsType> = [{
      type: 'pie',
      data: [score, 1 - score]
    }]

    let percentColor = '#d9d9d9'
    if (score > 0.2) percentColor = '#ee2e30'
    if (score > 0.4) percentColor = '#ff9f00'
    if (score > 0.6) percentColor = '#00e000'
    if (score > 0.8) percentColor = '#00ff00'

    const config: Highcharts.Options = {
      title: null,
      chart: {
        type: 'pie',
        animation: false,
        backgroundColor: 'transparent',
        margin: [0,0,0,0],
        spacing: [0,0,0,0]
      },
      yAxis: {
        lineWidth: 0,
        tickWidth: 0,
        minorTickInterval: null,
      },
      plotOptions: {
        pie: {
          slicedOffset: 0,
          dataLabels: {
            enabled: false
          },
          states: {
            hover: {
              animation: false,
              brightness: 0,
              halo: {
                size: 0
              }
            },
            inactive: {
              animation: false,
              opacity: 1
            }
          },
          innerSize: '60%',
          animation: false
        }
      },
      colors: [percentColor, '#ffffff'],
      tooltip: { enabled: false },
      legend: { enabled: false },
      credits: { enabled: false },
      series: series
    }

    const classes = cx('metric-pie', {
      'metric-pie--small': small
    })

    return (
      <div className={classes}>
        <HighchartsReact containerProps={{ className: 'metric-pie__chart' }} highcharts={Highcharts} options={config} />
        <div className='metric-pie__center'>
          {big && <span className='metric-pie__score'>Score</span> }
          <span className='metric-pie__value'>{Math.round(score * 100)}{!small && '%'}</span>
        </div>
      </div>
    )
  }
}

export default MetricPie
