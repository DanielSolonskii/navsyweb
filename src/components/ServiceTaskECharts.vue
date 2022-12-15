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
      showLegend() {
        this.chart.setOption({
          legend: {
            show: false,
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
          tooltip: {
            trigger: 'item'
          },
          series: [{
            name: 'Тип работы',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: false,
                fontSize: '40',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              {
                value: 735,
                name: 'Direct'
              },
              {
                value: 580,
                name: 'Email'
              },
              {
                value: 484,
                name: 'Union Ads',
                color: 'rgb(77, 119, 255)'
              },
              {
                value: 300,
                name: 'Video Ads',
                color:  'rgb(0, 221, 255)'
              }
            ]
          }]
    
        })
      }
    }
  }
</script>