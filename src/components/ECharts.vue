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
            text: 'Пробег за неделю (23.11.2021 - 29.11.2021)',
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
            data: ['нояб. 23', 'нояб. 24', 'нояб. 25', 'нояб. 26', 'нояб. 27', 'нояб. 28', 'нояб. 29']
          },
          yAxis: {
            name: 'Пробег, км',
            nameLocation: 'middle',
            nameGap: 50
          },
          calculable: true,
          series: [{
              name: 'Мерчендайзер Валентина',
              type: 'bar',
              barGap: 0,
              emphasis: {
                focus: 'series'
              },
              data: [320, 332, 301, 334, 390, 334, 390]
            },
            {
              name: 'Антон Газель',
              type: 'bar',
              emphasis: {
                focus: 'series'
              },
              data: [220, 182, 191, 234, 290, 154, 190]
            },
            {
              name: 'МАN Фура',
              type: 'bar',
              emphasis: {
                focus: 'series'
              },
              data: [150, 232, 201, 154, 190, 99, 40]
            },
            {
              name: 'Фургон Ford',
              type: 'bar',
              emphasis: {
                focus: 'series'
              },
              data: [98, 77, 101, 99, 40, 98, 77]
            },
            {
              name: 'Менеджер Сергей',
              type: 'bar',
              emphasis: {
                focus: 'series'
              },
              data: [18, 37, 41, 81, 42]
            }
          ],
          width: '70%'
        })
      }
    }
  }
</script>