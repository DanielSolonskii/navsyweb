<template>
  <v-card flat rounded="0" height="100%" width="100%">
    <v-tabs
        v-model="tab"
        background-color="grey darken-2"
        dark
        show-arrows
    >
      <v-tab
          v-for="(n, i) in report.sheets"
          :key="'tab-' + n.header"
      >
        <div style="font-size: small">{{ n.header }}</div>
        <v-icon small class="px-1" @click="closeTab(i)">
          mdi-close
        </v-icon>
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab" style="height: calc( 100% - 30px)">
      <v-tab-item
          v-for="item in report.sheets"
          :key="item.header"
          style="height: 100%"
      >
        <v-card flat height="100%">
          <div v-if="showMap" style="height: 300px;" class="pa-2">
            <l-map ref="reportMap" style="height: 100%; width:100%; position:relative"
                   :zoom="zoom" :center="center" @ready="mapOnReady">
              <l-tile-layer :url="url"/>
              <v-btn
                  color="grey darken-2"
                  fab
                  dark
                  small
                  absolute
                  top
                  right
                  class="close_map"
                  @click="showMap=false"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </l-map>
          </div>
          <v-expansion-panels
              v-model="panel"
              class="mt-4 overflow-y-auto align-content-start wrap_report"
              multiple
              :class="{'open_map': showMap}"

          >
            <v-expansion-panel>
              <v-expansion-panel-header class="text-center py-0 font-weight-bold" color="blue-grey lighten-5">
                <div>Поездки</div>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row class="ma-0 px-5">
                  <v-menu  :close-on-content-click="false" max-height="300px" :nudge-width="200" offset-x>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn class="ml-auto" icon v-bind="attrs" v-on="on" small>
                        <v-icon size="22">
                          mdi-cog
                        </v-icon>
                      </v-btn>
                    </template>
                    <v-card>
                      <v-list dense>
                        <div class="px-4">Столбцы</div>
                        <v-list-item-group v-model="computedHeaderTableTravel" multiple color="primary">
                          <v-list-item v-for="item in headerTableTravel" :key="'key-' + item.value" :value="item.value"
                                       dense>
                            <template v-slot:default="{ active }">
                              <v-list-item-action class="ma-1">
                                <v-checkbox :input-value="active" color="primary"></v-checkbox>
                              </v-list-item-action>

                              <v-list-item-content>
                                <div class="text-body-2">{{item.text}}</div>
                              </v-list-item-content>
                            </template>
                          </v-list-item>
                        </v-list-item-group>
                      </v-list>
                    </v-card>
                  </v-menu>
                </v-row>
                <v-data-table
                    dense
                    calculate-widths
                    :headers="tableTravel.headers"
                    :items="item.sections[0].data"
                    item-key="header"
                    class="elevation-1"
                    single-select
                    hide-default-footer
                    fixed-header
                    height="100%"
                    group-by="header"
                >
                    <template v-slot:group.header="{items, isOpen, toggle}">
                    <th colspan="12">
                      <v-icon @click="toggle"
                        >{{ isOpen ? 'mdi-minus' : 'mdi-plus' }}
                      </v-icon>
                      {{ items[0].header }} : {{items[0].rows.length}}
                    </th>
                  </template>

                  <template v-slot:item="{headers, item}">
                    <tr v-for="(row, i) in item.rows"
                       :key="item.header+'-row-'+i"

                    >
                      <td @click="showMap=true" class="point-link">
                        {{row.from.v}}
                      </td>
                      <td @click="showMap=true" class="point-link">
                        {{row.to.v}}
                      </td>
                      <td>
                        {{length}}
                      </td>
                      <td>
                        {{row.time}}
                      </td>
                      <td>
                        {{row.avg_speed}}
                      </td>
                      <td>
                        {{row.max_speed}}
                      </td>
                      <td>
                        {{row.norm_fuel_consumed}}
                      </td>
                       <td>
                        {{row.norm_fuel_consumed}}
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2">
                        <strong>
                          {{item.total.text}}
                        </strong>
                      </td>
                      <td>
                        {{item.total.length}}
                      </td>
                      <td>
                        {{item.total.time}}
                      </td>
                      <td>
                        {{item.total.avg_speed}}
                      </td>
                      <td>
                        {{item.total.max_speed}}
                      </td>
                      <td>
                        {{item.total.norm_fuel_consumed}}
                      </td>
                       <td>
                        {{item.total.norm_fuel_consumed}}
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header  class="text-center py-0 font-weight-bold" color="blue-grey lighten-5">
                <div>Всего за период</div>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row class="ma-0 px-5">
                  <v-menu  :close-on-content-click="false" max-height="300px" :nudge-width="200" offset-x>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn class="ml-auto" icon v-bind="attrs" v-on="on" small>
                        <v-icon size="22">
                          mdi-cog
                        </v-icon>
                      </v-btn>
                    </template>
                    <v-card>
                      <v-list dense>
                        <div class="px-4">Столбцы</div>
                        <v-list-item-group v-model="computedHeaderTableTotal" multiple color="primary">
                          <v-list-item v-for="item in headerTableTotal" :key="'key-' + item.value" :value="item.value"
                                       dense>
                            <template v-slot:default="{ active }">
                              <v-list-item-action class="ma-1">
                                <v-checkbox :input-value="active" color="primary"></v-checkbox>
                              </v-list-item-action>

                              <v-list-item-content>
                                <div class="text-body-2">{{item.text}}</div>
                              </v-list-item-content>
                            </template>
                          </v-list-item>
                        </v-list-item-group>
                      </v-list>
                    </v-card>
                  </v-menu>
                </v-row>
                <v-data-table
                    dense
                    calculate-widths
                    :headers="tableTotal.headers"
                    :items="item.sections[1].rows"
                    item-key="id"
                    class="elevation-1"
                    single-select
                    hide-default-footer
                    fixed-header
                    height="100%"
                >

                </v-data-table>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import {latLng} from "leaflet";
import {
  LMap,
  LTileLayer,
} from 'vue2-leaflet';
export default {
  name: "TravelReport",
  props: {
    report: Object
  },
  components: {
    LMap,
    LTileLayer,
  },
  computed: {
    computedHeaderTableTotal: {
      get() {
        return this.tableTotal.headers.map(x => x.value)
      },
      set(value) {
        this.tableTotal.headers = this.headerTableTotal.filter((item) => value.includes(item.value))
        return value
      }
    },
    computedHeaderTableTravel: {
      get() {
        return this.tableTravel.headers.map(x => x.value)
      },
      set(value) {
        this.tableTravel.headers = this.headerTableTravel.filter((item) => value.includes(item.value))
        return value
      }
    }
  },
  methods: {
    groupTravel(items, groupBy, groupDesc) {
      console.log(items,  groupBy, groupDesc)
      return items.map((v) => {return {'name': v.header, 'items': v.rows}})
     // return [{'name': 'Sam', 'items': items}]
    },
    closeTab(i) {
      this.report.sheets.splice(i, 1)
    },
    mapOnReady() {
      this.map = this.$refs['reportMap'][0].mapObject
    },
  },
  created() {
    this.tableTravel.headers = this.headerTableTravel
    this.tableTotal.headers = this.headerTableTotal
  },
  data: () => ({
    sortTravel: [],
    showMap: false,
    zoom: 16,
    center: latLng(59.930967, 30.302636),
    url: process.env.VUE_APP_OSM_SERVER + '/osm/{z}/{x}/{y}.png',
    panel: [0, 1],
    length: 15,
    tab: null,
    tableTotal: {
      headers: [],
      data: []
    },
    tableTravel: {
      headers: [],
      data: []
    },
    headerTableTravel: [
      { text: 'Начало движения', value: 'from.v', width: 150},
      { text: 'Конец движения', value: 'to.v', width: 150},
      { text: 'Сумма длин поездок, км', value: 'length', width: 150},
      { text: 'Время в пути', value: 'time', width: 150},
      { text: 'Средняя скорость, км/ч', value: 'avg_speed', width: 150},
      { text: 'Макс. скорость, км/ч', value: 'max_speed', width: 150},
      { text: 'Расход топлива по норме, л', value: 'norm_fuel_consumed' , width: 150},
      { text: 'Расход топлива по «Уровень топлива», л', value: 'xz', width: 150},
    ],
    headerTableTotal: [
      { text: 'Поездок', value: 'count', width: 150},
      { text: 'Сумма длин поездок, км', value: 'length', width: 150},
      { text: 'Время в пути', value: 'time', width: 150},
      { text: 'Средняя скорость, км/ч', value: 'avg_speed', width: 150},
      { text: 'Макс. скорость, км/ч', value: 'max_speed', width: 150},
      { text: 'Расход топлива по норме, л', value: 'norm_fuel_consumed' , width: 150},
      { text: 'Значение одометра *, км, л', value: 'odometer' , width: 150},
    ],
    items: [
      { tab: 'One', content: 'Tab 1 Content' },
      { tab: 'Two', content: 'Tab 2 Content' },
      { tab: 'Three', content: 'Tab 3 Content' },
      { tab: 'Four', content: 'Tab 4 Content' },
      { tab: 'Five', content: 'Tab 5 Content' },
      { tab: 'Six', content: 'Tab 6 Content' },
      { tab: 'Seven', content: 'Tab 7 Content' },
      { tab: 'Eight', content: 'Tab 8 Content' },
      { tab: 'Nine', content: 'Tab 9 Content' },
      { tab: 'Ten', content: 'Tab 10 Content' },
      { tab: 'Eight1', content: 'Tab 8 Content' },
      { tab: 'Nine2', content: 'Tab 9 Content' },
      { tab: 'Ten3', content: 'Tab 10 Content' },
    ],
  }),
}
</script>

<style scoped>
::v-deep .v-tabs-bar  {
  height: 30px;
}
::v-deep .v-data-table > .v-data-table__wrapper > table > thead > tr > th {
  padding: 0 5px;
}
::v-deep .v-expansion-panel-content__wrap {
  padding: 0;
}
::v-deep .v-expansion-panel--active > .v-expansion-panel-header {
  min-height: 40px;
}
::v-deep .v-expansion-panel > .v-expansion-panel-header {
  min-height: 40px;
}

.close_map {
  z-index: 1003;
  top: 5px!important;
  right: 5px;
}
.point-link {
  font-size: small;
  cursor: pointer;
}
.point-link:hover {
  color: #1f71e7;
}
.wrap_report {
  min-height: 100%;
  max-height: 200px;
}
.wrap_report.open_map {
  min-height: calc( 100% - 300px );
}
</style>