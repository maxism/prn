import React, { Component } from 'react'
import Highcharts from 'highcharts'
// import * as HighchartsMore from 'highcharts/highcharts-more'
import HighchartsReact from 'highcharts-react-official'

// import drawLegend from './drawLegend'

// HighchartsMore(Highcharts)
// drawLegend(Highcharts)
/*Highcharts.setOptions({
  lang: {
    resetZoom: 'Сбросить'
  }
})*/

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
   * Высота графика
   */
  height?: number
}

/**
 * Модуль BaseChart
 * Рендеринг основных типов графиков
 */
class PolarChart extends Component<IProps> {
  render (): JSX.Element {
    let { series, tooltip, xTitle, yTitle, height } = this.props

    series = series.map((serie, index) => ({ ...serie, zIndex: -index, data: serie['data'].map(item => ({ ...item, y: item.y + 10 })) }))

    const config: Highcharts.Options = {
      title: {
        text: undefined
      },
      chart: {
        zoomType: 'x',
        polar: true,
        type: 'spline',
        style: {
          fontFamily: 'Arial, Helvetica, sans-serif'
        },
        height: height || 700,
        spacingRight: 0,
        animation: false,
        spacingBottom: 0
      },
      xAxis: {
        type: 'category',
        categories: series[0]['data'].map(item => item.name),
        title: {
          text: xTitle
        },
        tickWidth: 0,
        tickmarkPlacement: 'on',
        gridLineColor: '#f2f2f2',
        tickColor: '#f2f2f2',
        lineColor: '#f2f2f2',
        labels: {
          style: {
            fontFamily: 'Arial, Helvetica, sans-serif',
            fontWeight: 'bold',
            color: '#000',
            fontSize: '16px',
            lineHeight: '20px'
          }
        }
      },
      yAxis: [{
        gridLineColor: '#f2f2f2',
        tickColor: '#f2f2f2',
        lineColor: '#f2f2f2',
        tickAmount: 5,
        tickPositions: [0, 25, 50, 75, 100, 120],
        min: 0,
        max: 120,
        labels: {
          style: {
            fontFamily: 'Arial, Helvetica, sans-serif',
            color: '#999',
            fontSize: '13px',
            lineHeight: '14px'
          },
          format: '{value}%'
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
      colors: [ '#2787F5', '#FF9F00'],
      plotOptions: {
        areaspline: {
          threshold: null,
          fillOpacity: 0.1
        },
        series: {
          cursor: 'pointer',
          stickyTracking: true,
          // findNearestPointBy: 'xy',
          animation: false,
          // borderRadius: 4,
          borderWidth: 4,
          lineWidth: 4,
          dataLabels: {
            enabled: false
          },
          marker: {
            enabled: true,
            symbol: 'circle',
            radius: 10,
            lineWidth: 4,
            fillOpacity: 0,
            fillColor: '#fff',
            // lineColor: color,
            width: 24,
            height: 24,
            states: {
              hover: {
                radius: 10,
                lineWidth: 4
                // fillColor: '#fff',
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
        enabled: true,
        itemMarginBottom: 10,
        itemStyle: {
          color: '#999',
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontSize: '13px',
          fontWeight: '400',
          verticalAlign: 'middle',
          lineHeight: '16px',
          opacity: 1
        },
        itemHiddenStyle: {
          opacity: 0.2,
          color: '#999'
        },
        itemHoverStyle: {
          color: '#444'
        }
      },
      credits: {
        enabled: false
      },
      series: series.map(item => ({
        ...item
      }))
    }

    // @ts-ignore
    return (
      <HighchartsReact highcharts={Highcharts} options={config} />
    )
  }
}
export default PolarChart
