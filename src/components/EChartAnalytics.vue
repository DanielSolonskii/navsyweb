<template>
  <div :style="{height:height,width:width}"></div>
</template>

<script>
  import * as echarts from 'echarts'
  import {
    debounce
  } from '@/utils/debounce'

  export default {
    props: {
      //     className: {
      //       type: String,
      //       default: 'chart'
      //     },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '300px'
      }
    },
    data() {
      return {
        chart: null
      }
    },
    mounted() {
      this.initChart()
      this.$nextTick(() => {
        this.chart.resize()
        if (window.screen.width < 840) {
          this.hideLegend()
        }
      });
      this.__resizeHanlder = debounce(() => {
        if (this.chart) {
          this.chart.resize();
          if (window.screen.width < 840) {
            this.hideLegend()
          } else {
            this.showLegend()
          }
        }
      }, 50)
      window.addEventListener('resize', this.__resizeHanlder);

    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      window.removeEventListener('resize', this.__resizeHanlder)
      this.chart.dispose()
      this.chart = null
    },
    methods: {
      showLegend(){
        this.chart.setOption({
          legend: {
            show: true,
          },
          width: '70%'
        })
      },
      hideLegend() {
        this.chart.setOption({
          legend: {
            show: false,
          },
          width: '85%'
        })
      },
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons')

        this.chart.setOption({
          toolbox: {
            // feature: {
            //   restore: {},
            // },
          },
          legend: {
            show: true,
            type: 'scroll',
            orient: 'vertical',
            right: 10,
            top: 10,
            bottom: 20,
          },
          title: {
            // text: 'Пробег за неделю (23.11.2021 - 29.11.2021)',
            top: 10,
            left: 50
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          xAxis: {
            type: 'category',
            data: ['Глазырина Валентина']
          },
          yAxis: {
            name: 'Количество заданий',
            nameLocation: 'middle',
            nameGap: 50
          },
          calculable: true,
          series: [{
              name: 'Назначено',
              type: 'bar',
              barGap: 0,
              emphasis: {
                focus: 'series'
              },
              data: [5]
            },
            {
              name: 'Выполнено',
              type: 'bar',
              emphasis: {
                focus: 'series'
              },
              data: [4]
            },
            {
              name: 'С опазданием',
              type: 'bar',
              emphasis: {
                focus: 'series'
              },
              data: [1]
            },
            {
              name: 'Просрочено',
              type: 'bar',
              emphasis: {
                focus: 'series'
              },
              data: [2]
            },
          ],
          width: '70%'
        })
      }
    }
  }
</script>