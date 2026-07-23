import * as Highcharts from 'highcharts'

let instance = false

export default (highcharts: typeof Highcharts): void => {
  if (instance) return
  instance = true
  highcharts.wrap(highcharts.Series.prototype, 'drawLegendSymbol', function (proceed, legend): any {
    // @ts-ignore
    proceed.call(this, legend)

    // @ts-ignore
    this.legendLine = this.chart.renderer.circle(8.5, 10, 8)
      .attr({
        'stroke-width': 0,
        // @ts-ignore
        fill: this.chart.series[this.index].color,
        cursor: 'pointer'
      })
      .addClass('custom-legend')
      // @ts-ignore
      .add(this.legendGroup)

    // @ts-ignore
    this.negativeLine = this.chart.renderer.circle(8.5, 10, 8)
      .attr({
        'stroke-width': 0,
        // @ts-ignore
        fill: this.chart.series[this.index].color,
        cursor: 'pointer'
      })
      .addClass('custom-legend')
      // @ts-ignore
      .add(this.legendGroup)
  })
}
