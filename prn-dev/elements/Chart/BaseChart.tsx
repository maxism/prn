import React, {Component, RefObject} from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { throttle } from 'lodash'
import eventStack from '../../lib/eventStack'
import Uuid from '../Uuid/Uuid'

try {
  Highcharts.setOptions({
    lang: {
      resetZoom: 'Сбросить',
      months: [ 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь' ],
      shortMonths: [ 'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек' ],
      weekdays: [ 'Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота' ],
      shortWeekdays: [ 'вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб' ]
    }
  })
} catch (e) {
  //
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

interface IStates {
  isMobile: boolean
}

/**
 * Модуль BaseChart
 * Рендеринг основных типов графиков
 */
class BaseChart extends Component<IProps, IStates> {
  private uuid: string
  private _throttleHandleUpdate: Function
  private listEl: RefObject<any>

  state: IStates = {
    isMobile: false
}

  constructor (props) {
    super(props)
    this.uuid = Uuid()
    this.listEl = React.createRef()

    this._throttleHandleUpdate = throttle(this.handleUpdate, 100)

    eventStack.sub('resize', this._throttleHandleUpdate, 'Popup', this.uuid)
  }

  componentDidMount() {
    this._throttleHandleUpdate()
  }

  componentWillUnmount (): void {
    eventStack.unsub('resize', this._throttleHandleUpdate, 'Popup', this.uuid)
  }

  handleUpdate = () => {
    if (!this.listEl) return

    const rect = this.listEl.current.getBoundingClientRect()

    this.setState({ isMobile: rect.width <= 639 })
  }

  render (): JSX.Element {
    const { series, tooltip, xTitle, yTitle, color, height } = this.props

    const config: Highcharts.Options = {
      title: {
        text: undefined
      },
      chart: {
        zoomType: 'x',
        type: 'spline',
        style: {
          fontFamily: 'Arial, Helvetica, sans-serif'
        },
        height: height || 420,
        spacingRight: 20,
        animation: false
      },
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          millisecond: '%d.%m.%Y',
          second: '%d.%m.%Y',
          minute: '%d.%m.%Y',
          hour: '%d.%m.%Y',
          day: '%d %b',
          week: '%b %Y',
          month: '%m\ %Y',
          year: '%Y'
        },
        title: {
          text: xTitle
        },
        tickWidth: 0,
        tickmarkPlacement: 'on',
        gridLineColor: '#f2f2f2',
        tickColor: '#f2f2f2',
        lineColor: '#f2f2f2',
        crosshair: {
          dashStyle: 'Dot',
          width: 2,
          snap: true,
          zIndex: 3
        },
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
        gridLineColor: '#f2f2f2',
        tickColor: '#f2f2f2',
        lineColor: '#f2f2f2',
        labels: {
          enabled: !this.state.isMobile,
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
        column: {
          // pointWidth: 24,
          // pointPadding: 0.1,
          borderRadius: 6,
          groupPadding: 0.04,
          threshold: null
        },
        areaspline: {
          threshold: null,
          fillOpacity: 0.2
          /*fillColor: {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
            stops: [
              [0, color],
              [1, '#ffffff']
            ]
          }*/
        },
        series: {
          cursor: 'pointer',
          stickyTracking: true,
          // findNearestPointBy: 'xy',
          animation: false,
          // @ts-ignore
          borderRadius: 4,
          borderWidth: 2,
          lineWidth: 2,
          dataLabels: {
            enabled: false
          },
          marker: {
            enabled: series[0]['data']?.length === 1,
            symbol: 'circle',
            radius: 4,
            lineWidth: 0,
            fillOpacity: 0,
            width: 24,
            height: 24,
            states: {
              hover: {
                radius: 4,
                lineWidth: 2,
                fillColor: '#fff',
                lineColor: color
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
        formatter: tooltip,
        snap: 0,
        borderColor: 'transparent',
        borderRadius: 16,
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
      <div ref={this.listEl}>
        <HighchartsReact highcharts={Highcharts} options={config} />
      </div>
    )
  }
}

export default BaseChart
