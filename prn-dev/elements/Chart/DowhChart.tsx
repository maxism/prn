import React, { Component } from 'react'
import Highcharts from 'highcharts'
import HighchartsMore from 'highcharts/highcharts-more'
import HighchartsReact from 'highcharts-react-official'
import MathUtil from '../../utils/MathUtil'
import AppUtil from '../../utils/AppUtil'

//import drawLegend from './drawLegend'

if (typeof Highcharts === 'object') {
  HighchartsMore(Highcharts)
}

interface IProps {
  /**
   * Массив серий
   */
  series: Array<Highcharts.SeriesOptionsType>
  /**
   * Функция форматирования tooltip
   */
  tooltip: Highcharts.TooltipFormatterCallbackFunction
  /**
   * подпись оси Y
   */
  yTitle: string
  /**
   * подпись оси X
   */
  xTitle: string
  /**
   * Цвет графика
   */
  color?: string
  /**
   * Высота графика
   */
  height?: number
}

/**
 * Модуль DowhChart
 * Рендеринг графика активности с точками по дням недели и времени суток
 */
class DowhChart extends Component<IProps> {
  render (): JSX.Element {
    let { series, tooltip, yTitle, color, height } = this.props

    const yAxisLabels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
    // const yAxisLabels = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

    series = series.map((serie, index) => ({ ...serie, zIndex: -index, data: serie['data'].map(item => ({ ...item, y: item.y, z: item.z })) }))

    const bubbleMaxSize = AppUtil.isClientSide && MathUtil.score([320, 1439], window.innerWidth, 5, 35) || 35 // 35

    const config: Highcharts.Options = {
      title: {
        text: undefined
      },
      chart: {
        type: 'bubble',
        plotBorderWidth: 0,
        style: {
          fontFamily: 'Arial, Helvetica, sans-serif'
        },
        height: height || 700,
        spacingRight: 1,
        animation: false,
        spacingBottom: 0
      },
      xAxis: {
        tickWidth: 0,
        tickmarkPlacement: 'on',
        gridLineColor: '#f2f2f2',
        tickColor: '#f2f2f2',
        lineColor: '#f2f2f2',

        gridLineWidth: 1,
        tickInterval: 1,
        startOnTick: true,
        min: -1,
        max: 24,
        labels: {
          style: {
            fontFamily: 'Arial, Helvetica, sans-serif',
            color: '#999',
            fontSize: '13px',
            lineHeight: '14px'
          },
          formatter: function () {
            return String((this.value > 23 || this.value < 0) ? '' : this.value)
          }
        }

      },
      yAxis: [{
        gridLineColor: '#f2f2f2',
        tickColor: '#f2f2f2',
        lineColor: '#f2f2f2',
        tickInterval: 1,
        min: 0,
        max: 8,
        reversed: true,
        labels: {
          style: {
            fontFamily: 'Arial, Helvetica, sans-serif',
            color: '#999',
            fontSize: '13px',
            lineHeight: '14px'
          },
          formatter: function () {
            return (this.value > 7 || this.value < 1) ? '' : yAxisLabels[Number(this.value) - 1]
          }
        },
        title: {
          text: yTitle,
          style: {
            fontFamily: 'Arial, Helvetica, sans-serif',
            color: '#999',
            fontSize: '13px',
            lineHeight: '14px'
          }
        }
      }],
      colors: [ color],
      plotOptions: {
        bubble: {
          minSize: 1,
          maxSize: bubbleMaxSize,
          states: {
            hover: {
              enabled: true,
              lineWidthPlus: 0
            }
          },
          tooltip: {
            headerFormat: ''
          }
        },
        series: {
          cursor: 'pointer',
          stickyTracking: true,
          // findNearestPointBy: 'xy',
          animation: false,
          // borderRadius: 4,
          borderWidth: 4,
          dataLabels: {
            enabled: false
          },
          marker: {
            enabled: true,
            symbol: 'circle',
            radius: 10,
            lineWidth: 4,
            fillOpacity: 0.5,
            // fillColor: '#fff',
            // lineColor: color,
            width: 24,
            height: 24,
            states: {
              hover: {
                // radius: 10,
                // lineWidth: 4,
                fillColor: '#fff',
                // lineColor: 'auto'
              }
            }
          },
          states: {
            hover: {
              enabled: true,
              lineWidthPlus: 0
              // fillOpacity: 1
            }
          }
        }
      },
      tooltip: {
        // crosshairs: false,
        formatter: tooltip,
        snap: 0,
        borderColor: 'transparent',
        borderRadius: 10,
        borderWidth: 0,
        padding: 0,
        distance: 20,
        shared: true,
        backgroundColor: null,
        shadow: false,
        hideDelay: 10,
        useHTML: true,
        style: {
          padding: '0',
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontSize: '11px',
          lineHeight: '14px',
          boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.2)'
        }
      },
      legend: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      series: series.map(item => ({
        ...item
      }))
    }

    return (
      <HighchartsReact highcharts={Highcharts} options={config} />
    )
  }
}
export default DowhChart
