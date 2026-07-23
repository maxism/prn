import React, { Component, RefObject } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

// import drawLegend from './drawLegend'

// HighchartsMore(Highcharts)
// drawLegend(Highcharts)
/*Highcharts.setOptions({
  lang: {
    resetZoom: 'Сбросить',
    months: [ 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь' ],
    shortMonths: [ 'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек' ],
    weekdays: [ 'Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота' ],
    shortWeekdays: [ 'вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб' ]
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
   * Цвет графика
   */
  color?: string
  /**
   * Цвет графика
   */
  categories?: Array<string>
  /**
   * Высота графика
   */
  height?: number
}

/**
 * Модуль BaseChart
 * Рендеринг основных типов графиков
 */
class BaseChart extends Component<IProps> {
  private ref: RefObject<any>

  constructor (props) {
    super(props)
    this.ref = React.createRef()
  }

  getTickPositions = (categories) => {
    let tickPositions = []

    if (!categories || !this.ref) return []

    const count = categories.length
    const stepCount = 7 // Math.ceil(this.state.chartWidth / 120)
    const centerTickInterval = Math.ceil(count / stepCount)

    for (let i = 0; i < count; i += centerTickInterval) tickPositions.push(i)

    return tickPositions
  }

  render (): JSX.Element {
    const { series, tooltip, xTitle, yTitle, color, categories, height } = this.props

    const config: Highcharts.Options = {
      title: {
        text: undefined
      },

      chart: {
        zoomType: 'x',
        type: 'column',
        style: {
          fontFamily: 'Arial, Helvetica, sans-serif'
        },
        height: height || 420,
        spacingRight: 20,
        animation: false
      },

      xAxis: {
        type: 'category',
        categories: categories,
        tickPositions: this.getTickPositions(categories),
        title: {
          text: xTitle
        },
        tickWidth: 0,
        tickmarkPlacement: 'on',
        gridZIndex: -100,
        gridLineColor: '#f2f2f2',
        tickColor: '#f2f2f2',
        lineColor: '#e6e6e6',
        crosshair: false,
        labels: {
          // formatter: function (): string { return this.value },
          style: {
            fontFamily: 'Arial, Helvetica, sans-serif',
            color: '#999',
            fontSize: '11px',
            lineHeight: '14px'
          }
        }
      },

      yAxis: [{
        gridZIndex: -100,
        gridLineColor: '#f2f2f2',
        tickColor: '#f2f2f2',
        lineColor: '#f2f2f2',
        labels: {
          style: {
            fontFamily: 'Arial, Helvetica, sans-serif',
            color: '#999',
            fontSize: '13px',
            lineHeight: '14px'
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

      colors: color ? [color] : ['#91d339'],

      plotOptions: {
        series: {
          cursor: 'pointer',
          // @ts-ignore
          borderRadius: 10,
          zIndex: 1000,
          stickyTracking: true,
          animation: {
            duration: 1000
          },
          dataLabels: {
            enabled: false
          },
          states: {
            hover: {
              enabled: true,
              borderWidth: 4,
              borderColor: color,
              color: '#FFFFFF'
            }
          }
        }
      },

      tooltip: {
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
        enabled: false,
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

    return (
      <HighchartsReact highcharts={Highcharts} options={config} />
    )
  }
}
export default BaseChart
