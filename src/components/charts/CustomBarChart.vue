<script>
import Chart from 'chart.js'
import Vue from 'vue'
import { generateChart } from 'vue-chartjs'

export const BarChartEventBus = new Vue()

Chart.defaults.BarWithLine = Chart.defaults.bar

Chart.pluginService.register({
  id: 'lineOnHoverPlugin',
  beforeDraw: function (chart) {
    if (chart.tooltip._active && chart.tooltip._active.length) {
      const activePoint = chart.controller.tooltip._active[0]
      const ctx = chart.ctx
      const x = activePoint.tooltipPosition().x
      const topY = chart.chartArea.top
      const bottomY = chart.chartArea.bottom

      ctx.save()
      ctx.beginPath()
      ctx.moveTo(x, topY)
      ctx.lineTo(x, bottomY)
      ctx.lineWidth = 1
      ctx.strokeStyle = '#333333'
      ctx.stroke()
      ctx.restore()

      const barIndex = chart.controller.tooltip._active[0]._index

      BarChartEventBus.$emit('bar-hover', barIndex)
    }
  }
})

Chart.defaults.BarWithLine = Chart.defaults.bar
Chart.controllers.BarWithLine = Chart.controllers.bar.extend({
  draw: function (ease) {
    Chart.controllers.bar.prototype.draw.call(this, ease)
  }
})

const CustomBarChart = generateChart('custom-bar', 'BarWithLine')

export default {
  extends: CustomBarChart,
  props: {
    chartdata: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: null
    }
  },
  mounted () {
    this.renderChart(this.chartdata, this.options)
  },
  watch: {
    chartdata: function (val) {
      this.renderChart(val, this.options)
    }
  }
}
</script>
