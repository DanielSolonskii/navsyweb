<template>
  <div>
    <div>
    </div>
    <v-row class="pt-4 ml-1 top-row">
      <div style="display: flex; justify-content: center; align-items: center">
        <v-btn class="add-btn" color="primary">
          <v-icon>mdi-plus</v-icon>
          <span>Добавить</span>
        </v-btn>
      </div>
      <div>
        <v-select :items="items"  v-model="defaultSelected">
        
          <template v-slot:selection="{ item }">
            <img class="img-select" :src="item.image">{{ item.name }}
          </template>
          <template v-slot:item="{ item }">
            <img class="img-select" :src="item.image">{{ item.name }}
          </template>
        </v-select>
      </div>
      <div>
        <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y
          min-width="auto">
          <template v-slot:activator="{ on, attrs }">
            <v-text-field v-model="date" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
          </template>
          <v-date-picker v-model="date" @input="menu2 = false"></v-date-picker>
        </v-menu>
      </div>
      <div class="checkbox-col">
        <v-checkbox v-model="ex4" label="Назначено: 1" color="info" value="info" hide-details></v-checkbox>
      </div>
      <div class="checkbox-col">
        <v-checkbox v-model="ex4" label="Выполнено: 0" color="success" value="success" hide-details></v-checkbox>
      </div>
      <div class="checkbox-col">
        <v-checkbox v-model="ex4" label="С опозданием: 0" color="orange" value="orange" hide-details></v-checkbox>
      </div>
      <div class="checkbox-col">
        <v-checkbox v-model="ex4" label="Просрочено: 1" color="red" value="red" hide-details></v-checkbox>
      </div>
      <v-btn icon>
        <v-icon @click="mapToLeft()">mdi-page-layout-sidebar-left</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon @click="mapToRight()">mdi-page-layout-sidebar-right</v-icon>
      </v-btn>
    </v-row>
    <v-row>
      <div class="test">
        <div class="top-left" :style="topLeftStyle">

          <l-map v-if="mapToLeftTrue" ref="vehicles_map"
            style="min-height: 70vh; width:100%; position:relative; overflow: hidden" :zoom="zoom" :center="center"
            @ready="mapOnReady()">
            <l-tile-layer :url="url" />
            <l-control position="topleft">
              <div class="white control-fullscreen" @click="openMapFullScreen=!openMapFullScreen">
                <v-icon class="primary--text">mdi-fullscreen</v-icon>
              </div>
            </l-control>
          </l-map>
          <v-data-table v-else group-by="executorName" :headers="surgeryInformationHeaders"
            :items="surgeryInformationDesserts" hide-default-footer class="transparent elevation-0"
            hide-default-header disable-pagination disable-sort :items-per-page="5">
            <template v-slot:group.header="{group, isOpen, toggle}">
              <th colspan="12" class="white" @click="toggle">
                <v-icon class="mr-4 mt-0 pt-0">
                  {{ isOpen ? 'mdi-minus' : 'mdi-plus' }}
                </v-icon>
                <span>Исполнитель: </span>{{ group }}
              </th>
            </template>
            <template #header="{ }">
              <thead class="v-data-table-header">
                <tr>
                  <th v-for="(h,i) in surgeryInformationHeaders" :key="i"
                    class="text-center parent-header td-border-style" :rowspan="h.children?1:2"
                    :colspan="h.children?h.children.length:1">
                    {{ h.text }}
                  </th>
                </tr>
                <tr>
                  <th v-for="(h1,i1) in getSubHeader(surgeryInformationHeaders)" :key="i1"
                    class="text-center child-header td-border-style">
                    {{ h1.text }}
                  </th>
                </tr>
              </thead>
            </template>
            <template #item="props">
              <tr class="table-row">
                <td v-for="(c,ci) in getRows(props.item)" :key="ci">
                  <div class="d-flex align-center" v-if="ci == 'status'">
                    <div class="status-indicator" :style="{ 'background-color': `${statusBackground(c)}`}"></div>
                    <div>{{ c }}</div>
                  </div>
                  <div v-else>
                    {{ c }}
                  </div>
                </td>
              </tr>
            </template>
          </v-data-table>
        </div>
        <div class="top-right" :style="topRightStyle">
          <v-data-table v-if="mapToLeftTrue" group-by="executorName" :headers="surgeryInformationHeaders" :items="surgeryInformationDesserts"
            hide-default-footer class="transparent elevation-0" hide-default-header disable-pagination disable-sort
            :items-per-page="5">
            <template v-slot:group.header="{group, isOpen, toggle}">
              <th colspan="12" class="white" @click="toggle">
                <v-icon class="mr-4 mt-0 pt-0">
                  {{ isOpen ? 'mdi-minus' : 'mdi-plus' }}
                </v-icon>
                <span>Исполнитель: </span>{{ group }}
              </th>
            </template>
            <template #header="{ }">
              <thead class="v-data-table-header">
                <tr>
                  <th v-for="(h,i) in surgeryInformationHeaders" :key="i"
                    class="text-center parent-header td-border-style" :rowspan="h.children?1:2"
                    :colspan="h.children?h.children.length:1">
                    {{ h.text }}
                  </th>
                </tr>
                <tr>
                  <th v-for="(h1,i1) in getSubHeader(surgeryInformationHeaders)" :key="i1"
                    class="text-center child-header td-border-style">
                    {{ h1.text }}
                  </th>
                </tr>
              </thead>
            </template>
            <template #item="props">
              <tr class="table-row">
                <td v-for="(c,ci) in getRows(props.item)" :key="ci">
                  <div class="d-flex align-center" v-if="ci == 'status'">
                    <div class="status-indicator" :style="{ 'background-color': `${statusBackground(c)}`}"></div>
                    <div>{{ c }}</div>
                  </div>
                  <div v-else>
                    {{ c }}
                  </div>
                </td>
              </tr>
            </template>
          </v-data-table>
                    <l-map v-else ref="vehicles_map"
            style="min-height: 70vh; width:100%; position:relative; overflow: hidden" :zoom="zoom" :center="center"
            @ready="mapOnReady()">
            <l-tile-layer :url="url" />
            <l-control position="topleft">
              <div class="white control-fullscreen" @click="openMapFullScreen=!openMapFullScreen">
                <v-icon class="primary--text">mdi-fullscreen</v-icon>
              </div>
            </l-control>
          </l-map>
        </div>
        <div class="bottom-right" :style="bottomRightStyle">
        </div>

        <div class="left-right divider" draggable="true" @dragstart="dividerDragStart" @drag="lrDividerDrag"
          :style="lrDividerStyles">
          <div @click="mapCollapse()" class="collapse-divider"></div>
        </div>
        <div class="right-top-bottom divider" draggable="true" @drag="rtbDividerDrag" @dragstart="dividerDragStart"
          :style="rtbDividerStyles"></div>
        <!--
        <div class="left-top-bottom divider" draggable="true" @drag="ltbDividerDrag" @dragstart="dividerDragStart"
          :style="ltbDividerStyles"></div>
          -->
      </div>
      <!--
      <v-col cols="6">
        <l-map ref="vehicles_map" style="min-height: 70vh; width:100%; position:relative" :zoom="zoom" :center="center"
          @ready="mapOnReady()">
          <l-tile-layer :url="url" />
          <l-control position="topleft">
            <div class="white control-fullscreen" @click="openMapFullScreen=!openMapFullScreen">
              <v-icon class="primary--text">mdi-fullscreen</v-icon>
            </div>
          </l-control>
        </l-map>
      </v-col>
      <v-col cols="6">
        <v-data-table group-by="executorName" :headers="surgeryInformationHeaders" :items="surgeryInformationDesserts"
          hide-default-footer class="transparent elevation-0" hide-default-header disable-pagination disable-sort
          :items-per-page="5">
          <template v-slot:group.header="{group, isOpen, toggle}">
            <th colspan="12" class="white" @click="toggle">
              <v-icon class="mr-4 mt-0 pt-0">
                {{ isOpen ? 'mdi-minus' : 'mdi-plus' }}
              </v-icon>
              <span>Исполнитель: </span>{{ group }}
            </th>
          </template>
          <template #header="{ }">
            <thead class="v-data-table-header">
              <tr>
                <th v-for="(h,i) in surgeryInformationHeaders" :key="i"
                  class="text-center parent-header td-border-style" :rowspan="h.children?1:2"
                  :colspan="h.children?h.children.length:1">
                  {{ h.text }}
                </th>
              </tr>
              <tr>
                <th v-for="(h1,i1) in getSubHeader(surgeryInformationHeaders)" :key="i1"
                  class="text-center child-header td-border-style">
                  {{ h1.text }}
                </th>
              </tr>
            </thead>
          </template>
          <template #item="props">
            <tr class="table-row">
              <td v-for="(c,ci) in getRows(props.item)" :key="ci">
                <div class="d-flex align-center" v-if="ci == 'status'">
                  <div class="status-indicator" :style="{ 'background-color': `${statusBackground(c)}`}"></div>
                  <div>{{ c }}</div>
                </div>
                <div v-else>
                  {{ c }}
                </div>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
      -->
    </v-row>
    <template>
      <div>
        <div id="ganttastic-wrapper" :style="ganttasticStyle">
          <g-gantt-chart :chart-start="chartStart" :chart-end="chartEnd" :grid="grid" :hide-timeaxis="hideTimeaxis"
            :push-on-overlap="pushOnOverlap" :highlighted-hours="highlightedHours"
            :row-label-width="`${rowLabelWidth}%`" :row-height="rowHeight" :theme="selectedTheme"
            @contextmenu-bar="onContextmenuBar($event)" @dragend-bar="stoppedDraggingBar($event)">
            <g-gantt-row v-for="row in rowList" :key="row.title" :label="row.label" :bars="row.barList"
              :highlight-on-hover="highlightOnHover" bar-start="myStart" bar-end="myEnd">
              <template #bar-label="{ bar }">
                <img v-if="bar.image" :src="require(`@/assets/${bar.image}`)" height="20" width="20" class="mr-1" />
                <span>{{ bar.label }}</span>
              </template>
            </g-gantt-row>
          </g-gantt-chart>
        </div>
      </div>
    </template>

  </div>
</template>

<script>
  import {
    LControl,
  } from 'vue2-leaflet';
  import {
    GGanttChart,
    GGanttRow
  } from "vue-ganttastic";
  import {
    latLng
  } from "leaflet";
  // import "vue2vis/dist/vue2vis.css";
  import _ from 'lodash';
  import {
    LMap,
    LTileLayer,
  } from 'vue2-leaflet';

  export default {
    components: {
      LMap,
      LTileLayer,
      GGanttChart,
      GGanttRow,
      LControl
    },
    name: "Dispatcher",

    data() {
      return {
        mapToLeftTrue: true,
        observer: null,
        width: null,
        navigatioDrawerWidth: 0,
        lrDividerPos: -1,
        rtbDividerPos: -1,
        ltbDividerPos: -1,
        openMapFullScreen: true,
        ex4: true,
        chartStart: "2020-03-02 00:00",
        chartEnd: "2020-03-03 00:00",
        pushOnOverlap: true,
        grid: false,
        rowHeight: 40,
        rowLabelWidth: 15,
        hideTimeaxis: false,
        highlightOnHover: false,
        hours: [...Array(24).keys()],
        highlightedHours: [10, 12],
        showContextmenu: false,
        contextmenuTimeout: null,
        contextmenuX: 0,
        contextmenuY: 0,
        selectedTheme: "default",
        themes: [
          "default",
          "vue",
          "dark",
          "material-blue",
          "creamy",
          "slumber",
          "sky",
          "crimson",
          "grove",
          "fuchsia",
          "flare",
        ],
        center: latLng(59.930967, 30.302636),
        url: process.env.VUE_APP_OSM_SERVER + '/osm/{z}/{x}/{y}.png',
        defaultSelected:{
            name: 'Глазырина Валентина',
            image: 'https://i1.wp.com/s-knights.co.uk/wp-content/uploads/2016/04/avatar-small.jpg?resize=30%2C30'          
        },
        items: [{
            name: 'Анонимный сотрудник',
            image: 'https://i1.wp.com/s-knights.co.uk/wp-content/uploads/2016/04/avatar-small.jpg?resize=30%2C30'
          },
          {
            name: 'Глазырина Валентина',
            image: 'https://i1.wp.com/s-knights.co.uk/wp-content/uploads/2016/04/avatar-small.jpg?resize=30%2C30'
          },
        ],
        date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        menu: false,
        modal: false,
        menu2: false,
        zoom: 16,
        surgeryInformationHeaders: [{
            text: "Статус",
            align: "center",
            sortable: false,
            value: "status"
          },
          {
            text: "Название",
            align: "center",
            value: "name"
          },
          {
            text: "Адрес",
            value: "address"
          },
          {
            text: "План",
            value: "plan",
            divider: true,
            children: [{
              text: "С"
            }, {
              text: "По"
            }]
          },
          {
            text: "Факт",
            value: "fact",
            divider: true,
            children: [{
              text: "Прибыл"
            }, {
              text: "Про-дть"
            }]
          },
        ],
        rowList: [{
          label: "Задания",
          barList: [{
              myStart: "2020-03-02 10:00",
              myEnd: "2020-03-02 12:00",
              label: "Загрузиться в ТД Мороз Спиритс",
              ganttBarConfig: {
                color: "white",
                backgroundColor: "#049cdb",
                opacity: 1,
                immobile: true,
                borderRadius: 0,
              },
            },
            {
              myStart: "2020-03-02 13:00",
              myEnd: "2020-03-02 17:00",
              label: "Загрузиться в ТД Мороз Спиритс",
              ganttBarConfig: {
                color: "white",
                backgroundColor: "#de3930",
                opacity: 1,
                immobile: true,
                borderRadius: 0,
              },
            },
          ],
        }, ],
        surgeryInformationDesserts: [
          //
          {
            executorName: 'Валентина',
            status: 0,
            name: "Загрузиться в ТД Мороз Спиритс",
            address: "Россия, Москва, 1-я улица Измайловского Зверинца, 1",
            planFrom: '2020-03-02 10:00',
            planTo: '2020-03-02 12:00',
            factOne: '-',
            factTwo: 'N/A',
          },
          {
            executorName: 'Валентина',
            status: 3,
            name: "Загрузиться в ТД Мороз Спиритс",
            address: "Россия, Москва, 1-я улица Измайловского Зверинца, 1",
            planFrom: '2020-03-02 13:00',
            planTo: '2020-03-02 17:00',
            factOne: '-',
            factTwo: 'N/A',
          }
        ]
      }
    },
    beforeDestroy() {
      if (this.observer) this.observer.disconnect();
    },
    mounted() {
      this.$nextTick(() => {
        this.$el.querySelector('.v-data-table__wrapper').style.height = '51vh';
        const box = this.$parent.$parent.$el.querySelector('.v-navigation-drawer');
        this.width = box.clientWidth;
        this.initObserver();
      })
    },
    methods: {
      mapToLeft() {
       this.mapToLeftTrue = true
         this.map.invalidateSize()
      },
      mapToRight() {
        this.mapToLeftTrue = false
          this.map.invalidateSize()
      },
      initObserver() {
        const box = this.$parent.$parent.$el.querySelector('.v-navigation-drawer'),
          vm = this,
          config = {
            attributes: true
          };
        // create the observer
        const observer = new MutationObserver(function (mutations) {
          mutations.forEach(function (mutation) {
            // check if the mutation is attributes and update the width and height data if it is.
            if (mutation.type === "attributes") {
              // let {
              //   width
              // } = box.style;
              let width = box.clientWidth
              vm.width = width;
              // this.width = this.width.slice(0, -1); 
              console.log(vm.width)
              // vm.height = height;
            }
          });
        });
        // observe element's specified mutations
        observer.observe(box, config);
        this.observer = observer;
      },
      getWidth() {
        this.$nextTick(() => {
          console.log(this.$parent.$parent.$el.querySelector('.v-navigation-drawer').clientWidth)
        })
      },
      lrDividerDrag: function (e) {
        if (e.clientX) {
          this.lrDividerPos = e.clientX;
        }
        this.map.invalidateSize()
      },
      ltbDividerDrag: function (e) {
        if (e.clientY) {
          this.ltbDividerPos = e.clientY;
        }
      },
      rtbDividerDrag: function (e) {
        if (e.clientY) {
          this.rtbDividerPos = e.clientY;
        }

      },
      dividerDragStart: function (e) {
        e.dataTransfer.setDragImage(new Image, 0, 0);
      },
      statusBackground(c) {
        let color = null
        switch (c) {
          case 'Назначено':
            color = '#049cdb'
            break;
          case 'Выполнено':
            color = '#66c011'
            break;
          case 'С опозданием':
            color = '#ffc40d'
            break;
          case 'Просрочено':
            color = '#de3930'
            break;
        }
        return color
      },
      stoppedDraggingBar() {},
      onContextmenuBar(e) {
        e.event.preventDefault();
        this.contextmenuY = e.event.clientY;
        this.contextmenuX = e.event.clientX;
        this.showContextmenu = true;
        if (this.contextmenuTimeout) {
          clearTimeout(this.contextmenuTimeout);
        }
        this.contextmenuTimeout = setTimeout(
          () => (this.showContextmenu = false),
          3000
        );
      },
      mapOnReady() {
        this.map = this.$refs['vehicles_map'].mapObject
        this.map.zoomControl.setPosition('topright');
      },
      getMainHeader(headers) {
        return headers.filter((i) => i.children);
      },
      getSubHeader(headers) {
        let result = [];
        headers
          .filter((i) => i.children)
          .forEach((v) => {
            result = result.concat(v.children);
          });
        return result;
      },
      getRows(rows) {
        const result = {};
        _.forEach(rows, (i, key) => {
          if (key == 'executorName') {
            return
          }
          if (i.children) {
            _.forEach(i.children, (i1, key1) => {
              result["c" + key1] = i1;
            });
          } else result[key] = i;
          if (key == 'status') {
            switch (i) {
              case 0:
                result[key] = "Назначено"
                break;
              case 1:
                result[key] = 'Выполнено'
                break;
              case 2:
                result[key] = 'С опозданием'
                break;
              case 3:
                result[key] = 'Просрочено'
                break;
            }
          }
        });
        return result;
      }
    },
    computed: {
      // bottomLeftStyle: function () {
      //   return {
      //     height: this.ltbDividerPos > -1 ? (window.innerHeight - this.ltbDividerPos) + 'px' : '',
      //     top: this.ltbDividerPos > -1 ? this.ltbDividerPos + 'px' : '',
      //     width: this.lrDividerPos > -1 ? this.lrDividerPos + 'px' : ''
      //   };
      // },
      ganttasticStyle: function () {
        return {
          marginTop: this.rtbDividerPos > -1 ? this.rtbDividerPos - 54 + 'px' : '',
        }
      },
      bottomRightStyle: function () {
                this.$nextTick(() => {
          this.rtbDividerPos > -1 ?
            this.$el.querySelector('.v-data-table__wrapper').style.height = this.rtbDividerPos - 80 + 'px' :
            ''
        })
        return {
          height: this.rtbDividerPos > -1 ? (window.innerHeight - this.rtbDividerPos) + 'px' : '',
          left: this.lrDividerPos > -1 ? this.lrDividerPos + 'px' : '',
          top: this.rtbDividerPos > -1 ? this.rtbDividerPos + 'px' : '',
          width: this.lrDividerPos > -1 ? (window.innerWidth - this.lrDividerPos + 2) + 'px' : ''
        };
      },
      leftDividerStyles: function () {
                this.$nextTick(() => {
          this.rtbDividerPos > -1 ?
            this.$el.querySelector('.v-data-table__wrapper').style.height = this.rtbDividerPos - 80 + 'px' :
            ''
        })
        return {
          width: this.lrDividerPos > -1 ? (this.lrDividerPos + 2) + 'px' : ''
        };
      },
      ltbDividerStyles: function () {
                this.$nextTick(() => {
          this.rtbDividerPos > -1 ?
            this.$el.querySelector('.v-data-table__wrapper').style.height = this.rtbDividerPos - 80 + 'px' :
            ''
        })
        return {
          top: this.ltbDividerPos > -1 ? this.ltbDividerPos + 'px' : '',
          width: this.lrDividerPos > -1 ? this.lrDividerPos + 2 + 'px' : ''
        };
      },
      lrDividerStyles: function () {
                this.$nextTick(() => {
          this.rtbDividerPos > -1 ?
            this.$el.querySelector('.v-data-table__wrapper').style.height = this.rtbDividerPos - 80 + 'px' :
            ''
        })
        return {
          left: this.lrDividerPos > -1 ? this.lrDividerPos - this.width + 'px' : '',
          height: this.rtbDividerPos > -1 ? this.rtbDividerPos - 60 + 'px' : '',
        };
      },
      rtbDividerStyles: function () {
        this.$nextTick(() => {
          this.rtbDividerPos > -1 ?
            this.$el.querySelector('.v-data-table__wrapper').style.height = this.rtbDividerPos - 80 + 'px' :
            ''
        })
        return {
          // left: this.lrDividerPos > -1 ? this.lrDividerPos + 'px' : '',
          top: this.rtbDividerPos > -1 ? this.rtbDividerPos + 'px' : '',
          // width: this.lrDividerPos > -1 ? (window.innerWidth - this.lrDividerPos + 2) + 'px' : ''
        };
      },
      topLeftStyle: function () {
                this.$nextTick(() => {
          this.rtbDividerPos > -1 ?
            this.$el.querySelector('.v-data-table__wrapper').style.height = this.rtbDividerPos - 80 + 'px' :
            ''
        })
        return {
          // height: this.ltbDividerPos > -1 ? this.ltbDividerPos + 'px' : '',
          height: this.rtbDividerPos > -1 ? this.rtbDividerPos - 60 + 'px' : '',
          width: this.lrDividerPos > -1 ? this.lrDividerPos - this.width + 'px' : ''
        };
      },
      topRightStyle: function () {
        this.$nextTick(() => {
          this.rtbDividerPos > -1 ?
            this.$el.querySelector('.v-data-table__wrapper').style.height = this.rtbDividerPos - 80 + 'px' :
            ''
        })
        return {
          height: this.rtbDividerPos > -1 ? this.rtbDividerPos - 60 + 'px' : '',
          left: this.lrDividerPos > -1 ? this.lrDividerPos - this.width + 'px' : '',
          width: this.lrDividerPos > -1 ? (window.innerWidth - this.lrDividerPos + 2) + 'px' : ''
        };
      }
    }
  }
</script>
<style scoped>
  .top-row {
    background-color: #f5f5f5;
  }

  ::v-deep .checkbox-col .v-label {
    font-size: 13px;
  }

  .add-btn {
    font-size: 0.7rem !important;
  }

  .top-row div {
    padding: 2px;
  }

  .time-table {
    width: 100%;
    empty-cells: show;
    border-collapse: collapse;
  }

  .time-table td {
    text-align: center;
  }


  .time-table .hours-row td {
    width: 10%;
    text-align: center;
    background-color: #e0e0e3;
  }

  .under-hours-row {
    height: 40px
  }

  .timeline {
    position: absolute;
    height: 10px;
    width: 40px;
    background-color: #bbbbbb;
    bottom: -10px;
    left: 40%;
  }

  .timeline-1 {
    position: absolute;
    height: 10px;
    width: 60px;
    background-color: #bbbbbb;
    bottom: -10px;
    left: 60%;
  }

  .img-select {
    margin-right: 2px;
  }

  ::v-deep .v-select__selections input {
    display: none;
  }

  .v-data-table-header th {
    border: thin solid rgba(0, 0, 0, 0.12);
  }


  ::v-deep .g-gantt-row-label,
  ::v-deep .g-timeaxis-empty-space {
    /*width: 0% !important*/
  }

  .table-row {
    text-align: center
  }

  .status-indicator {
    display: inline-block;
    width: 12px;
    height: 12px;
    margin-right: 5px;
    vertical-align: middle;
    border: 1px solid #fff;
  }

  ::v-deep .v-data-table__wrapper {
    height: 66vh
  }

  ::v-deep #g-timeaxis-marker {
    display: none !important
  }

  ::v-deep .g-gantt-bar-label {
    font-size: 15px
  }

  /*test */
  .text-area {
    margin: 10px;
  }

  .top-left {
    position: absolute;
    overflow: hidden;
    top: 60px;
    left: 0;
    height: 50%;
    width: 50%;
  }

  .top-right {
    position: absolute;
    overflow: scroll;
    top: 60px;
    left: 50%;
    height: 50%;
    width: 50%;
  }

  /*
  .bottom-left {
    position: absolute;
    background-color: lightblue;
    overflow: scroll;
    top: 50%;
    left: 0;
    height: 50%;
    width: 50%;
  }
*/
  .bottom-right {
    position: absolute;
    overflow: scroll;
    top: 55%;
    left: 0;
    height: 50%;
    width: 100%;
  }

  .divider {
    position: absolute;
    background-color: #E0E0E3;
  }

  .left-right {
    width: 10px;
    height: 538px;
    top: 60px;
    left: calc(50% - 8px / 2);
    z-index: 400;  
    }

  .right-top-bottom {
    width: 100%;
    height: 4px;
    top: calc(55% - 1px / 2);
    left: 0;
  }

  .left-top-bottom {
    width: 50%;
    height: 4px;
    top: calc(50% - 4px / 2);
    left: 0;
  }

  .left-right:hover {
    cursor: col-resize;
  }

  .left-top-bottom:hover,
  .right-top-bottom:hover {
    cursor: row-resize;
  }

  ::-webkit-scrollbar {
    height: 0;
    width: 0;
  }

  #ganttastic-wrapper {
    margin-top: 540px;
  }

  .collapse-divider {
    width: 10px;
    background-color: #f0f0f3;
    border: 1px solid #c0c0c9;
    height: 48px;
    margin-top: 240px;
  }

  ::v-deep .v-data-table-header {
    background-color: #e0e0e3
  }
/*
   ::v-deep #g-timeaxis>.g-timeaxis-empty-space{
width: 0 !important
}

 ::v-deep #g-timeaxis>.g-timeaxis-days{
width: 100% !important
}

::v-deep .g-gantt-row>.g-gantt-row-label{
  width: 0 !important
}

::v-deep  .g-gantt-row>.g-gantt-row-bars-container{
  width: 100% !important
}
*/
</style>