<template>
  <l-control position="topleft" class="elevation-10">
    <v-slide-x-transition>

      <button v-if="hideOnlineTrackers" type="button" class="v-btn show-online-trackers"
        @click="hideOnlineTrackers = false">
        <v-icon class="rotate-icon">mdi-menu-open</v-icon>
      </button>
    </v-slide-x-transition>
    <v-slide-x-transition>
      <v-card v-if="!hideOnlineTrackers" class="mx-auto container-" width="400">
        <!-- test datepicker -->
        <!-- 
         <v-list-group>
        <v-list-item-group v-model="parametersReport.trackers" multiple>
          <v-list-item v-for="(device, i) in group.devices" :key="i" :value="device.id" dense
            class="group-devises__item px-4">
            <div style="font-size: 13px">{{device.name}}</div>
          </v-list-item>
        </v-list-item-group>
        </v-list-group>
        -->

        <!-- test datepicker -->

        <v-card-text class="tracker-list-header">
          <v-row class="pb-2" cols="12">
            <v-col cols="1">
              <button type="button" class="v-btn v-btn--icon theme--light tracker-list-header__icon"
                @click="hideOnlineTrackers = true">
                <v-icon>mdi-menu-open</v-icon>
              </button>
            </v-col>
            <v-col cols="9">
              <h3 class="tracker-list-header__title">
                Маячки</h3>
            </v-col>
            <v-col cols="2">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon style="transform: translateX(10px)">
                    <v-icon v-bind="attrs" v-on="on" @click.stop="toggleMarkersSettings">mdi-cog</v-icon>
                  </v-btn>
                </template>
                <span>Настройки</span>
              </v-tooltip>
            </v-col>
            <div class="spacer"></div>
          </v-row>
          <v-row class="d-flex top-box-shadow">
            <v-expansion-panels v-model="openedPanel" multiple flat>
              <v-expansion-panel>
                <v-expansion-panel-content class="markers-settings-expansion-panels">
                  <div class="d-flex justify-space-between align-center">
                    <v-btn icon>
                      <v-icon @click="toggleOneList">mdi-format-list-bulleted
                      </v-icon>
                    </v-btn>
                    <v-btn icon>
                      <v-icon @click="toggleOrderMarkers">mdi-sort-alphabetical-descending-variant</v-icon>
                    </v-btn>
                    <v-btn icon>
                      <v-icon @click="toggleOrderMarkersByStatus">mdi-checkbox-blank-circle</v-icon>
                    </v-btn>
                    <v-btn icon>
                      <v-icon>mdi-bullseye</v-icon>
                    </v-btn>
                    <v-btn icon>
                      <v-icon>mdi-target</v-icon>
                    </v-btn>
                    <v-menu offset-y :close-on-content-click="false">
                      <template v-slot:activator="{ on, attrs }">
                        <v-list-item-icon v-bind="attrs" v-on="on" class="ml-0">
                          <v-btn icon @click="disableHide">
                            <v-icon>mdi-dots-vertical</v-icon>
                          </v-btn>
                        </v-list-item-icon>
                      </template>
                      <v-list>
                        <v-list-item v-for="(item, index) in infoWidgetOptions" :key="index">
                          <v-checkbox color="info">
                          </v-checkbox>
                          <v-list-item-title>{{ item.title }}</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>

            <!--
              <v-col cols="1" class="pa-0 mx-1 text-center" align-self="center">
                <v-btn
                    small
                    color="white"
                    dark
                    icon
                    title="Фильтр по группам"
                    @click="openFilterCar = !openFilterCar"
                >
                  <v-icon>mdi-filter</v-icon>
                </v-btn>
              </v-col>
              -->
          </v-row>
          <v-row>
            <v-checkbox class="check-all-checkbox ml-3 mt-1" color="info" :indeterminate="indeterminateAll" hide-details
              @change="selectAll($event)">
            </v-checkbox>
            <v-text-field v-model="searchQuery" label="Быстрый поиск" hide-details single-line flat solo dense
              clear-icon="mdi-close-circle-outline" @focus="onFocusSearch" @blur="onFocusSearch"></v-text-field>
            <v-btn icon v-if="searchMarker === ''">
              <v-icon class="pr-3" :class="magnifierActive && 'magnifier-active'">
                mdi-magnify</v-icon>
            </v-btn>
            <v-btn icon v-else>
              <v-icon class="pr-2" color="primary" @click="searchMarker = ''">mdi-close</v-icon>
            </v-btn>

          </v-row>
        </v-card-text>
        <template v-if="groupNames.success && !oneList">
          <div class="expansion-panel-tracker" v-for="list in filteredgroupsWithMarkers" :key="list.individualId">
            <v-expansion-panels>
              <v-expansion-panel hide-actions>
                <v-expansion-panel-header :style="{ 'border-left': `4px solid #${list.color}`}"
                  class="border-radius-zero filtred-list-label pl-4 pb-2 pt-2 pr-4 expansion-panel-header-closed">
                  <v-checkbox :indeterminate="list.indeterminate" class="mt-0" color="info" hide-details
                    v-model="list.checked" @change="changeCheckGroup" @click.stop="toggleCheckGroup(list)">
                  </v-checkbox>
                  <span>{{ list.name }}</span><span>&nbsp;</span><span v-if="list.length > 0">
                    ({{ list.length }})</span>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-list class="pt-0">
                    <v-list-item-group v-model="model">
                      <div v-for="item in list.marker" :key="item.id" class="bottom-light-box-shadow pt-1px"
                        @mouseover="showInfoActions(item)" @mouseleave="hideInfoActions">
                        <v-list-item class="expansion-panel-tracker-item align-center"
                          :style="{ 'border-left': `4px solid #${list.color}` }">
                          <template>
                            <v-list-item-icon class="mr-0">
                              <v-checkbox v-model="item.checked" class="mt-0" color="info" hide-details>
                              </v-checkbox>
                            </v-list-item-icon>
                            <v-list-item-content class="pa-0">
                              <v-list-item-title class="filtred-marker-item-label">{{ item.title }}</v-list-item-title>
                              <v-list-item-subtitle v-if="item.speed">{{ item.speed }} км/ч</v-list-item-subtitle>
                            </v-list-item-content>
                            <template v-if="sw === item.id">
                              <div class="inform-btns-section">
                                <v-tooltip bottom>
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-btn icon>
                                      <v-icon @click="clickHandlerTest(item.id)" v-bind="attrs" v-on="on">
                                        mdi-information-outline
                                      </v-icon>
                                    </v-btn>
                                  </template>
                                  <span>Информация об устройстве</span>
                                </v-tooltip>
                                <v-menu offset-y v-model="menuOpened">
                                  <template #activator="{ on: onMenu }">
                                    <v-tooltip bottom>
                                      <template #activator="{ on: onTooltip }">
                                        <v-btn icon class="mdi-dots-icon">
                                          <v-icon @click="disableHide" v-on="{ ...onMenu, ...onTooltip }">
                                            mdi-dots-vertical</v-icon>
                                        </v-btn>
                                      </template>
                                      <span>Действия с маячком</span>
                                    </v-tooltip>
                                  </template>
                                  <v-list>
                                    <v-list-item v-for="(item, index) in actionsWithTracker" :key="index">
                                      <v-list-item-title>{{ item.title }} </v-list-item-title>
                                    </v-list-item>
                                  </v-list>
                                </v-menu>
                              </div>
                            </template>
                            <template v-else>
                              <v-icon class="list-state-marker" :class="item.status ?  'online':'offline'">mdi-circle
                              </v-icon>
                            </template>
                          </template>
                        </v-list-item>
                      </div>
                    </v-list-item-group>
                  </v-list>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
        </template>
        <!-- search -->

        <template v-if="oneList">

          <v-list class="pt-0 pl-1 pr-4">
            <v-list-item-group v-model="model">
              <div v-for="item in filteredgroupsWithMarkers" :key="item.id" class="bottom-light-box-shadow">
                <v-list-item class="expansion-panel-tracker-item" @mouseover="showInfoActions(item)"
                  @mouseleave="hideInfoActions">
                  <template>
                    <v-list-item-icon class="mr-0">
                      <v-checkbox class="mt-0" color="info" hide-details>
                      </v-checkbox>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title class="filtred-marker-item-label">{{ item.title }}</v-list-item-title>
                      <v-list-item-subtitle v-if="item.speed">{{ item.speed }} км/ч</v-list-item-subtitle>
                    </v-list-item-content>
                    <template v-if="sw === item.id">
                      <v-list-item-icon>
                        <v-icon @click="clickHandlerTest(item.id)">
                          mdi-information-outline
                        </v-icon>
                      </v-list-item-icon>
                      <v-menu offset-y>
                        <template v-slot:activator="{ on, attrs }">
                          <v-list-item-icon v-bind="attrs" v-on="on">
                            <v-icon @click="disableHide">mdi-dots-vertical
                            </v-icon>
                          </v-list-item-icon>
                        </template>
                        <v-list>
                          <v-list-item v-for="(item, index) in actionsWithTracker" :key="index">
                            <v-list-item-title>{{ item.title }}</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </template>
                    <template v-else>
                      <v-list-item-icon>
                        <v-icon class="list-state-marker" :class="item.status ? 'online' : 'offline'">mdi-circle
                        </v-icon>
                      </v-list-item-icon>
                    </template>
                  </template>
                </v-list-item>
              </div>
            </v-list-item-group>
          </v-list>

        </template>

        <v-alert type="error" :value="errorListCars.value" transition="scale-transition">
          {{errorListCars.text}}
        </v-alert>

        <!--          <v-sheet class="pa-4 primary">-->
        <!--            <v-text-field-->
        <!--                v-model="search"-->
        <!--                label="Поиск машины"-->
        <!--                dark-->
        <!--                dense-->
        <!--                flat-->
        <!--                solo-inverted-->
        <!--                hide-details-->
        <!--                clearable-->
        <!--                clear-icon="mdi-close-circle-outline"-->
        <!--            ></v-text-field>-->
        <!--          </v-sheet>-->
        <!--          <v-lazy-->
        <!--              height="75vh"-->
        <!--              class="overflow-auto"-->
        <!--          >-->
        <!--            <v-treeview-->
        <!--                :items="tree"-->
        <!--                :open="open"-->
        <!--                selectable-->
        <!--                item-disabled="locked"-->
        <!--                selected-color="purple"-->
        <!--                :search="search"-->
        <!--                :filter="filter"-->
        <!--            >-->
        <!--            </v-treeview>-->
        <!--          </v-lazy>-->
        <div class="history-btn-panel">
          <menu-date-time-picker-range v-model="computedDateRange"></menu-date-time-picker-range>
          <!--
          <v-tooltip left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn fab color="primary" class="history-btn">
                <v-icon v-bind="attrs" v-on="on" @click.stop="toggleCalendar=true">mdi-history</v-icon>
              </v-btn>
            </template>
            <span>История</span>
          </v-tooltip>
          -->
        </div>
      </v-card>
    </v-slide-x-transition>
    <!-- <CalendarWindow v-model="toggleCalendar" /> -->

  </l-control>



</template>
<script>
  import moment from "moment";
  import MenuDateTimePickerRange from "@/components/MonitoringPage/monitoringDatePicker";
  // import CalendarWindow from "@/components/MonitoringPage/CalendarWindow";
  import HttpClient from "@/api";
  // import VDatePicker from "@/components/VDatePicker";
  import _ from 'lodash';
  import L from 'leaflet';
  import {
    MonitoringService
  } from "@/services/monitoring";
  import {
    latLng
  } from 'leaflet';
  import {
    LControl,
  } from 'vue2-leaflet';
  export default {
    name: "LeafletControlBlock",
    components: {
      LControl,
      MenuDateTimePickerRange
      // CalendarWindow
      // VDatePicker,

    },
    data() {
      return {
      //  panelMarkers: [0, 1, 2]
        // test datepicker
        parametersReport: {
          title: '',
          trackers: [],
          from: moment().toDate(),
          to: moment().toDate(),
          time_filter: {
            from: moment().toDate(),
            to: moment().toDate(),
            weekdays: []
          },
          plugin: {}
        },
        // test datepicker
        menuOpened: false,
        disableHideTrigger: false,
        currentGroupSelect: false,
        openedPanel: [],
        groupsWithMarkers: {
          "id": "123123",
          "group": [{
              "name": "Автотранспорт",
              "color": "FF6600",
              "id": 8,
              "checked": false,
              "marker": [{
                  "id": 324710,
                  "title": "Антон Газель",
                  "group_id": 8,
                  "status": false,
                  "source": {
                    "id": 74703,
                    "device_id": "356173068289250",
                    "model": "telfm1125_a8",
                    "blocked": false,
                    "tariff_id": 1294,
                    "phone": null,
                    "status_listing_id": null,
                    "creation_date": "2016-04-30",
                    "tariff_end_date": "2021-11-02"
                  },
                  "tag_bindings": [],
                  "clone": true,
                  "checked": false,
                },
                {
                  "id": 545806,
                  "title": "МАN Фура",
                  "group_id": 8,
                  "status": false,
                  "checked": false,
                  "source": {
                    "id": 74703,
                    "device_id": "356173068289250",
                    "model": "telfm1125_a8",
                    "blocked": false,
                    "tariff_id": 1294,
                    "phone": null,
                    "status_listing_id": null,
                    "creation_date": "2016-04-30",
                    "tariff_end_date": "2021-11-02"
                  },
                  "tag_bindings": [],
                  "clone": true,

                },
              ]
            },
            {
              "name": "Промоутеры и мерчендайзеры",
              "color": "008000",
              "id": 11,
              "checked": false,
              "marker": [{
                  "id": 35278,
                  "title": "Мерчендайзер Валентина",
                  "group_id": 8,
                  "status": false,
                  "source": {
                    "id": 74703,
                    "device_id": "356173068289250",
                    "model": "telfm1125_a8",
                    "blocked": false,
                    "tariff_id": 1294,
                    "phone": null,
                    "status_listing_id": null,
                    "creation_date": "2016-04-30",
                    "tariff_end_date": "2021-11-02"
                  },
                  "tag_bindings": [],
                  "clone": true,
                  "checked": false,
                },

              ]
            },

          ]
        },
        searchQuery: '',
        groups: null,
        indeterminateAll: false,
        indeterminateGroup: false,
        toggleBlueButton: false,
        magnifierActive: false,
        selectedMarkers: [],
        hideOnlineTrackers: false,
        orderMarkers: false,
        orderMarkersByStatus: false,
        sw: null,
        // panel: [1],
        expand: false,
        oneList: false,
        // clean cut start
        searchMarker: '',
        groupNames: {
          "success": true,
          "list": [{
              "title": "Автотранспорт",
              "color": "FF6600",
              "id": 8
            },
            {
              "title": "Промоутеры и мерчендайзеры",
              "color": "008000",
              "id": 11
            },
          ]
        },
        trackersListDetailed: {
          "success": true,
          "list": [{
              "id": 5,
              "avatar_file_name": "f2d47fe62e9c322ecfc0f550c227e2c3.jpeg",
              "tracker_id": 35278,
              "first_name": "Валентина",
              "middle_name": "",
              "last_name": "Глазырина",
              "email": "v.glazyirina@company.ru",
              "phone": "79184697134",
              "driver_license_number": "",
              "driver_license_cats": "",
              "driver_license_valid_till": null,
              "hardware_key": null,
              "department_id": 2,
              "location": {
                "lat": 60.07237789,
                "lng": 30.37033081,
                "address": "Домостроительная улица, 14, Санкт-Петербург, Россия, 194292",
                "radius": 150
              }
            },
            {
              "id": 48,
              "avatar_file_name": "832e536bf256290c62527339000ecd11.jpeg",
              "tracker_id": null,
              "first_name": "Сергей",
              "middle_name": "",
              "last_name": "Романов",
              "email": "s.romanov@navixy.com",
              "phone": "79104381279",
              "driver_license_number": "",
              "driver_license_cats": "",
              "driver_license_valid_till": null,
              "hardware_key": null,
              "department_id": 1,
              "location": {
                "lat": 59.83967282,
                "lng": 30.37996531,
                "address": "Пловдивская улица, 1 корпус 2, Санкт-Петербург, Россия, 192281",
                "radius": 150
              },
              "personnel_number": ""
            },
            {
              "id": 44819,
              "icon_id": 12,
              "tracker_id": 324710,
              "first_name": "Антон",
              "middle_name": "",
              "last_name": "Лебедев",
              "email": "a.lebedev@company.ru",
              "phone": "79154992235",
              "driver_license_number": "",
              "driver_license_cats": "",
              "driver_license_valid_till": null,
              "hardware_key": null,
              "department_id": 4,
              "personnel_number": "",
              "location": {
                "lat": 59.83967282,
                "lng": 30.37996531,
                "address": "улица, 1 корпус 2, Санкт-Петербург, Россия, 192281",
                "radius": 150
              },
            },
            {
              "id": 44820,
              "icon_id": 5,
              "tracker_id": 591574,
              "first_name": "Иван",
              "middle_name": "",
              "last_name": "Соломатин",
              "email": "i.solomatin@company.com",
              "phone": "79881356799",
              "driver_license_number": "",
              "driver_license_cats": "",
              "driver_license_valid_till": null,
              "hardware_key": null,
              "department_id": null,
              "personnel_number": "",
              "location": {
                "lat": 59.83967282,
                "lng": 30.37996531,
                "address": "66 улица, 1 корпус 2, Санкт-Петербург, Россия, 192281",
                "radius": 150
              },
            },
            {
              "id": 45479,
              "icon_id": 5,
              "tracker_id": 545806,
              "first_name": "Олег",
              "middle_name": "",
              "last_name": "Бухтияров",
              "email": "o.buhtiyarov@company.com",
              "phone": "79991923302",
              "driver_license_number": "",
              "driver_license_cats": "",
              "driver_license_valid_till": null,
              "hardware_key": null,
              "department_id": 4,
              "personnel_number": "",
              "location": {
                "lat": 59.83967282,
                "lng": 30.37996531,
                "address": "любая улица, 1 корпус 2, Санкт-Петербург, Россия, 192281",
                "radius": 150
              },
            },
            {
              "id": 45480,
              "icon_id": 29,
              "tracker_id": null,
              "first_name": "Евгений",
              "middle_name": "",
              "last_name": "Поташов",
              "email": "e.potashov@company.com",
              "phone": "79399093411",
              "driver_license_number": "",
              "driver_license_cats": "",
              "driver_license_valid_till": null,
              "hardware_key": null,
              "department_id": 956,
              "personnel_number": "",
              "location": {
                "lat": 59.83967282,
                "lng": 30.37996531,
                "address": "другая улица, 1 корпус 2, Санкт-Петербург, Россия, 192281",
                "radius": 150
              },
            }
          ]
        },
        trackersList: {
          "success": true,
          "list": [{
              "id": 35278,
              "label": "Мерчендайзер Валентина",
              "group_id": 11,
              "avatar_file_name": "cd1c9160133c00087c1da04b90906a25.jpeg",
              "status": true,
              "source": {
                "id": 33055,
                "device_id": "864251020015339",
                "model": "gv500",
                "blocked": true,
                "tariff_id": 1294,
                "phone": null,
                "status_listing_id": null,
                "creation_date": "2014-08-01",
                "tariff_end_date": "2022-05-04"
              },
              "tag_bindings": [],
              "clone": true
            },
            {
              "id": 324710,
              "label": "Унтон Газель",
              "group_id": 8,
              "status": false,
              "source": {
                "id": 74703,
                "device_id": "356173068289250",
                "model": "telfm1125_a8",
                "blocked": false,
                "tariff_id": 1294,
                "phone": null,
                "status_listing_id": null,
                "creation_date": "2016-04-30",
                "tariff_end_date": "2021-11-02"
              },
              "tag_bindings": [],
              "clone": true
            },
            {
              "id": 545806,
              "label": "МАN Фура",
              "group_id": 8,
              "status": false,
              "source": {
                "id": 104930,
                "device_id": "357454070772460",
                "model": "telfm1120_fw0114_a6",
                "blocked": false,
                "tariff_id": 1297,
                "phone": null,
                "status_listing_id": null,
                "creation_date": "2016-11-08",
                "tariff_end_date": "2021-11-02"
              },
              "tag_bindings": [],
              "clone": true
            },
            {
              "id": 591574,
              "label": "Фургон Ford",
              "group_id": 8,
              "status": true,
              "source": {
                "id": 50872,
                "device_id": "356173064805273",
                "model": "telfm1120_a6",
                "blocked": false,
                "tariff_id": 1294,
                "phone": null,
                "status_listing_id": null,
                "creation_date": "2015-08-28",
                "tariff_end_date": "2021-11-02"
              },
              "tag_bindings": [],
              "clone": true
            },
          ]
        },
        // clean cut end
        infoWidgetOptions: [{
            title: 'Кластеризовать метки маячков'
          },
          {
            title: 'Названия объектов'
          },
          {
            title: 'Показать след'
          },
          {
            title: 'Анимация движения'
          },
          {
            title: 'Отображать только выбранные маячки'
          },
          {
            title: 'Скрывать маячки не на связи'
          },
        ],
        actionsWithTracker: [{
            title: 'Изменить иконку'
          },
          {
            title: 'Перейти к параметрам'
          },
          {
            title: 'Перейти к контролю событий'
          },
          {
            title: 'Перейти к отчетам'
          },
        ],
        showInfoSingle: false,
        toggleCalendar: false,
        singleInfo: {
          "data": {
            "source_id": 104930,
            "gps": {
              "updated": "2021-10-08 11:07:09",
              "signal_level": 100,
              "location": {
                "lat": 55.8624133,
                "lng": 36.9392216
              },
              "heading": 199,
              "speed": 63,
              "alt": 168
            },
            "connection_status": "active",
            "movement_status": "moving",
            "gsm": {
              "updated": "2021-10-08 11:07:09",
              "signal_level": 77,
              "network_name": "МТС",
              "roaming": false
            },
            "last_update": "2021-10-08 11:07:13",
            "battery_level": 90,
            "battery_update": "2021-10-08 11:07:09",
            "inputs": [true, false, false],
            "inputs_update": "2021-10-08 11:07:09",
            "outputs": [true, true],
            "outputs_update": "2021-10-08 11:07:09",
            "actual_track_update": "2021-10-08 09:27:05"
          },
          "user_time": "2021-10-08 11:07:13",
          "type": "event",
          "event": "state"
        },
        overlay: false,
        items: [{
            icon: 'mdi-inbox',
            text: 'Антон газель',
            subtitle: 'true'
          },
          {
            icon: 'mdi-star',
            text: 'Андрей Андреевич',
            online: false
          },
          {
            icon: 'mdi-send',
            text: 'Андрей',
            speed: '57',
            online: true
          },
          {
            icon: 'mdi-email-open',
            text: 'Андрей Андрееви',
            online: true
          },
        ],
        model: 1,
        settings: [{
            icon: 'mdi-inbox',
          },
          {
            icon: 'mdi-star',
          },
          {
            icon: 'mdi-send',
          },
          {
            icon: 'mdi-email-open',
          },
        ],

        zoom: 10,
        center: latLng(59.930967, 30.302636),
        url: process.env.VUE_APP_OSM_SERVER + '/osm/{z}/{x}/{y}.png',
        iconSizeText: 10,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
        course: 0,
        icon: null,
        marker_ll: latLng(59.970960, 30.302630),
        //tree: [],
        tree: [{
          id: -1,
          name: "/",
          children: []
        }],
        layerCars: null,
        visibleAllMarker: true,
        connection: null,
        cars: [],
        catalogGroups: [],
        selectedCar: '',
        selectedGroup: [],
        open: [],
        openFilterCar: false,
        searchCar: '',
        caseSensitive: false,
        tgl_left_panel: true,
        loadingListCars: false,
        errorListCars: {
          value: false,
          text: ''
        },

      }
    },
    mounted() {
      // this.compiledTrackersList()
      this.groups = this.formData();
      // console.log('группы: ' + JSON.stringify(this.groups, null, 2))
      this.$root.$on("closeDatePicker", (data) => {
        console.log(data)
        this.toggleCalendar = !data
      });

      this.trackersList.list.forEach((marker) => {
        marker.checked = false
      });

    },
    watch: {
      menuOpened: function (val) {
        // console.log(val)
        if (!val) {
          this.sw = null
        }
      },
      hideOnlineTrackers: function (oldValue, newValue) {
        if (oldValue != newValue) {
          this.$root.$emit("hide-online-trackers", newValue);
        }
      }
    },
    computed: {
      // datepicker test
      // computedControlTimeRange: {
      //   get() {
      //     return [moment(this.parametersReport.time_filter.from).unix(), moment(this.parametersReport.time_filter.to)
      //       .unix()
      //     ]
      //   },
      //   set(range) {
      //     this.parametersReport.time_filter.from = new Date(range[0] * 1000)
      //     this.parametersReport.time_filter.to = new Date(range[1] * 1000)
      //     return range
      //   },
      // },
      // computeControlTimeTitle: {
      //   get() {
      //     return "Время контроля: " + moment(this.parametersReport.time_filter.from).format('HH:mm') + " - " +
      //       moment(this.parametersReport.time_filter.to).format('HH:mm')
      //   }
      // },
      computedDateRange: {
        get() {
          return [this.parametersReport.from, this.parametersReport.to]
        },
        set(val) {
          this.parametersReport.from = val[0];
          this.parametersReport.to = val[1]
          return val
        }
      },
      // datepicker test
      filteredgroupsWithMarkers() {
        // simple search
        if (this.searchQuery) {
          return this.groupsWithMarkers.group.reduce((groups, {
            name,
            color,
            marker
          }) => {
            marker = marker.filter(this.matchFilter);

            if (marker.length > 0) {
              const length = marker.length
              groups.push({
                name,
                color,
                marker,
                length
              });
            }

            return groups;

          }, []);

        }
        // show in one list (withut groups)
        else if (this.oneList) {
          const noGroup = []
          this.groupsWithMarkers.group.forEach(markers => {
            markers.marker.forEach(marker => {
              noGroup.push(marker)
            })
          })
          console.log('сортировка: ' + JSON.stringify(noGroup, null, 2))
          return noGroup
        }
        // return alphabetical
        else if (this.orderMarkers) {

          this.groupsWithMarkers.group.forEach(markers => {
            const sorted = _.orderBy(markers.marker, ['title'], ['asc'])
            markers.marker = sorted
          })
          console.log('сортировка: ' + JSON.stringify(this.groupsWithMarkers, null, 2))
          return this.groupsWithMarkers.group
        } else {
          // default return
          console.log(this.groupsWithMarkers)
          return this.groupsWithMarkers.group;
        }
      },

      // filteredMarkers() {
      //   function compare(a, b) {
      //     if (a.name < b.name) return -1;
      //     if (a.name > b.name) return 1;
      //     return 0;
      //   }
      //   let test = this.trackersList.list

      //   let searchResults = test.filter(marker => {
      //     return (
      //       marker.label
      //       .toLowerCase()
      //       .indexOf(this.searchMarker.toLowerCase()) != -1
      //     );
      //   });
      //   searchResults.sort(compare);
      //   if (this.orderMarkers) {
      //     return _.orderBy(searchResults, 'label')
      //   } else if (this.orderMarkersByStatus) {
      //     searchResults.sort(function (a, b) {
      //       return b.status - a.status
      //     });
      //     return searchResults
      //   } else {
      //     return searchResults
      //   }
      // },
      // compiledTrackersList() {
      //   let groups = this.groupNames.list;
      //   groups.forEach((group) => {
      //     group.indeterminate = false;
      //   })
      // let lists = this.trackersList.list;
      // lists.forEach((item) => {
      //   item['individualId'] = item['id']
      //   item.checked = false;
      //   item.indeterminate = false
      // });
      // let merged = [];
      // for (let i = 0; i < groups.length; i++) {
      //   merged.push({
      //     ...groups[i],
      //     ...(lists.find((itmInner) => itmInner.id === groups[i].group_id))
      //   });
      // }
      // return groups
      // },
      appBarIcon() {
        return this.test ? "mdi-chevron-right" : "mdi-chevron-left"
      },
      styleCourse() {
        return {
          transform: 'rotate(' + this.course + 'deg)'
        }
      },
      listCars() {
        let filter_cars = this.cars
        if (this.selectedGroup.length > 0) {
          filter_cars = filter_cars.filter(car => this.selectedGroup.includes(car.groupId));
        }
        if (this.searchCar) {
          filter_cars = filter_cars.filter(car =>
            !!car.name && car.name.includes(this.searchCar) ||
            !!car.gosNumber && car.gosNumber.includes(this.searchCar))
        }
        return filter_cars;
      },
      filter() {
        return this.caseSensitive ?
          (item, search, textKey) => item[textKey].indexOf(search) > -1 :
          undefined
      },
      // iconCar () {
      //   console.log(this)
      //   let htmlIcon = `
      //        <img class="marker-icon__course" src=${require('../assets/img/marker_blue.svg')} style="transform: rotate(0deg)"/>
      //        <div class="marker-icon__container">
      //             <i class="mdi mdi-car marker-icon__icon" style="font-size: ${this.iconSizeText}px"></i>
      //          </div>`
      //   return  L.divIcon({
      //     html: htmlIcon,
      //     iconSize: this.iconSize,
      //     iconAnchor: this.iconAnchor,
      //   });

      //  let rot = 'rotate('+ this.course +'deg)'
      //  //let rot = 'rotate(' +  this.course + 'deg)'
      //  if (this.$refs['driverMarker']) {
      //    this.$refs['driverMarker'].mapObject.getElement().querySelector('.marker-icon__course').style.transform=rot
      //   console.log(this.$refs['driverMarker'].mapObject.getElement().querySelector('.marker-icon__course'))
      //    return this.$refs['driverMarker'].icon
      //  }

      //},
    },
    methods: {
      //test date picker
      openParametersNewReport() {
        this.nameReport = this.selectedNewReport.name;
        this.parametersReport.title = this.selectedNewReport.title;
        this.parametersReport.trackers = [];
        this.parametersReport.from = moment().add(-1, 'week').days(0).hours(0).minutes(0).seconds(0).toDate();
        this.parametersReport.to = moment().add(-1, 'week').days(6).hours(23).minutes(59).seconds(59).toDate();
        this.parametersReport.time_filter.from = moment().hours(0).minutes(0).seconds(0).toDate();
        this.parametersReport.time_filter.to = moment().hours(23).minutes(59).seconds(59).toDate();
        this.parametersReport.time_filter.weekdays = [1, 2, 3, 4, 5, 6, 0];
        this.parametersReport.plugin = this.selectedNewReport.plugin
      },
      openParametersReport(val) {
        this.selectedParamsReport = val
        this.parametersReport.title = val.title
        this.parametersReport.plugin = val.parameters.plugins[0]
        this.parametersReport.trackers = val.parameters.trackers
        this.parametersReport.time_filter.weekdays = val.time_filter.weekdays
        this.parametersReport.from = moment(val.from * 1000).toDate()
        this.parametersReport.to = moment(val.from * 1000).toDate()
        this.parametersReport.time_filter.from = moment(val.time_filter.from * 1000).toDate()
        this.parametersReport.time_filter.to = moment(val.time_filter.to * 1000).toDate()
      },
      // test date picker
      disableHide() {
        this.disableHideTrigger = true;
        console.log(this.disableHideTrigger)
      },
      showInfoActions(item) {
        this.sw = item.id
      },
      hideInfoActions() {
        if (!this.disableHideTrigger) {
          this.sw = null
        }
        //  else if (this.disableHideTrigger && !this.menuOpened){
        //    console.log(this.disableHideTrigger)
        //    console.log(this.menuOpened)
        //   this.sw = null
        // }
        //  else if (!this.menuOpened){
        //   this.sw = null
        // }

      },
      changeCheckGroup(e) {
        this.currentGroupSelect = e;
      },
      matchFilter(item) {
        const
          search = this.searchQuery.toLowerCase(),
          term = (item.title || '').toLowerCase();

        return term.includes(search);
      },
      formData() {
        let groups = this.groupNames.list;
        // 
        // this.trackersList.list.forEach((marker) => {
        //   groups.forEach(group => {
        //     if (marker.group_id === group.id) {
        //       // group.markers.push(marker)
        //       marker.label
        //     }
        //   })
        // });
        // 
        groups.forEach(group => {
          group.markers = [];
          this.trackersList.list.forEach((marker) => {
            if (marker.group_id === group.id) {
              group.markers.push(marker)
            }
          });
        });
        //  console.log('группы: ' + JSON.stringify(this.groupNames , null, 2)) 
        // console.log('группы' + groups)
        return groups
      },
      // singleMarkerCheck(id, item) {
      // let thisGroup = []
      // this.filteredMarkers.forEach(marker => {
      //   if (marker.group_id === id) {
      //     thisGroup.push(marker)
      //   }
      // });
      // let checker = thisGroup.some(v => v.checked === true);
      // if (thisGroup.every(v => v.checked === true)) {
      //   checker = false
      //   item.checked = true
      // }
      // item.checked = false
      // item.indeterminate = checker
      // console.log(thisGroup)
      // console.log(checker)
      // this.compiledTrackersList.forEach(group => {
      //   if (id == group.id){
      //     console.log(item)
      //   }
      // if ((id == group.id) & (item.checked)){
      //     group.indeterminate = !group.indeterminate
      // }
      // console.log(group)
      // });
      // },
      toggleCheckGroup(list) {
        list.marker.forEach(marker => {
          marker.checked = this.currentGroupSelect
        });
        // this.filteredMarkers.forEach(marker => {
        //   if (list.id == marker.group_id) {
        //     marker.checked = !marker.checked
        //   }
        // });
        // this.indeterminateAll = !this.indeterminateAll
      },
      selectAll(e) {
        this.groupsWithMarkers.group.forEach(markers => {
          markers.checked = e
          markers.marker.forEach(marker => {
            marker.checked = e
          })
        })

      },
      // toggleBlueButtonFunc() {
      //   this.toggleBlueButton = !this.toggleBlueButton
      // },
      onFocusSearch() {
        this.magnifierActive = !this.magnifierActive;
      },
      toggleOrderMarkers() {
        this.orderMarkers = !this.orderMarkers
      },
      toggleOrderMarkersByStatus() {
        this.orderMarkersByStatus = !this.orderMarkersByStatus
      },
      toggleOneList() {
        this.oneList = !this.oneList;
        // this.toggleBlueButtonFunc()
      },
      toggleMarkersSettings() {
        if (this.openedPanel.length == 0) {
          this.openedPanel = [0]
        } else {
          this.openedPanel = []
        }
      },
      clickHandlerTest: function (id) {
        this.$root.$emit("some-root-event", id);
        // trackersListDetailed.list.tracker_id
        console.log('About $root.$emit', id)
      },
      test(id) {
        let car = this.cars.find(x => x.id === id);
        car.course > 360 ? car.course = 0 : car.course += 90
        //this.getIcon(car.deviceId, car.course)
        //car.ll = latLng(59.930967, 30.302636)
        //this.$refs['driverMarker'].$el
        //this.course > 360 ? this.course=0 : this.course += 90
        //this.iconSizeText = this.iconSizeText + 5
        // console.log(car.course)
        //this.course = true;
        // let htmlIcon = `
        //       <img class="marker-icon__course" src=${require('../assets/img/marker_blue.svg')} style="transform: rotate(${this.course}deg)"/>
        //       <div class="marker-icon__container">
        //           <i class="mdi mdi-car marker-icon__icon" style="font-size: ${this.iconSizeText}px"></i>
        //        </div>`
        // this.icon.options.html = htmlIcon
        // this.marker_ll = latLng(this.marker_ll.lat + 0.01, this.marker_ll.lng + 0.01);
        //let rot = 'rotate(' +  this.course + 'deg)'
        // console.log(this.$refs['driverMarker'])
        // this.$refs['driverMarker'].icon = L.divIcon({
        //    html: '<img class="marker-icon__course" src=' + require('../assets/img/marker_blue.svg') +
        //     ' style="transform:'+ rot + '"/>',
        //     iconSize: this.iconSize,
        //     iconAnchor: this.iconAnchor,
        // })
        //el.style.transform = rot;
      },
      // updateCourse(icon) {
      //   console.log('ipdate icon', icon);
      // },
      getIcon(id) {
        console.log('getIcon')
        let car = this.cars.find(x => x.id === id);
        // <img class="marker-icon__course" src=${require('../assets/img/marker_blue.svg')} style="transform: rotate(${car.course}deg)"/>
        let htmlIcon = `
          <div  class="marker-icon__course" style="background: #0d47a1;transform: rotate(${car.course}deg);"></div>
          <div class="marker-icon__container">
                <i class="mdi mdi-car marker-icon__icon" style="font-size: ${this.iconSizeText}px"></i>
             </div>`
        // let elem = document.createElement('div');
        // let course_elm = document.createElement('div');
        // let container_icon = document.createElement('div');
        // let icon = document.createElement('i');
        // course_elm.classList.add('marker-icon__course');
        // course_elm.style.transform = 'rotate(' + course + 'deg)';
        // course_elm.style.background = '#0d47a1';
        // container_icon.classList.add('marker-icon__container');
        // icon.classList.add('mdi', 'mdi-car', 'marker-icon__icon');
        // icon.style.fontSize = this.iconSizeText;
        // elem.appendChild(course_elm);
        // container_icon.appendChild(icon);
        // elem.appendChild(container_icon);
        return L.divIcon({
          html: htmlIcon,
          iconSize: this.iconSize,
          iconAnchor: this.iconAnchor,
        });
        //let ref_marker = this.$refs['car-' + id]
        // if (ref_marker && ref_marker[0].mapObject.getElement()) {
        //   console.log(ref_marker[0].mapObject)
        //   ref_marker[0].mapObject.getElement().innerHTML = htmlIcon
        //   return ref_marker[0].mapObject.getIcon()
        //   // ref_marker[0].mapObject.getElement().querySelector('.marker-icon__course').style.transform=`rotate(${course}deg`
        //   // ref_marker[0].mapObject.getElement().querySelector('.mdi-car').style.fontSize=this.iconSizeText
        //   // ref_marker[0].icon.options.iconSize = this.iconSize
        //   // ref_marker[0].icon.options.iconAnchor = this.iconAnchor
        //   //  console.log('up getIcon', id)
        //   // return ref_marker[0].icon
        // }

        //<img class="marker-icon__course" src=${require('../assets/img/marker_blue.svg')} style="transform: rotate(${car.course}deg)"/>

        // console.log('getIcon', car.deviceId)

      },
      boundMarker(id) {
        let car = this.cars.find(x => x.id === id);
        // console.log(car.ll)
        this.map.setView(car.ll, 15)

      },
      showAllMarker(flag) {
        this.visibleAllMarker = flag;
        this.cars.forEach(x => x.visible_marker = flag);
      },
      showMarker(flag, id) {
        let car = this.cars.find(x => x.id === id);
        car.visible_marker = flag;
        //car.ll = latLng(car.ll.lat + 0.1, car.ll.lng)
        // let marker = L.marker([msg.latitude, msg.longitude], {block_id: block_id});
        // marker.bindPopup('Блок ' + msg.BlockNumber);
        // this.layerCars.addLayer(marker);
      },
      mapOnReady() {
        this.map = this.$refs['monitoring_map'].mapObject
        this.map.zoomControl.setPosition('topright');

        let controlContainer = this.map._controlContainer
        controlContainer.insertBefore(this.$refs['sidebar-content-left'].$el, controlContainer.firstChild);

        this.map.on('zoomend', (ev) => {
          console.log('event zoom')
          if (ev.target.getZoom() > 13) {
            this.iconSizeText = 18;
            this.iconSize = [32, 32]
            this.iconAnchor = [16, 16]
          } else if (ev.target.getZoom() > 11 && ev.target.getZoom() < 14) {
            this.iconSizeText = 14;
            this.iconSize = [26, 26]
            this.iconAnchor = [13, 13]
          } else {
            this.iconSizeText = 10;
            this.iconSize = [18, 18]
            this.iconAnchor = [9, 9]
          }
          // this.cars.forEach(car => {
          //  this.getIcon(car.deviceId, car.course);
          // });
        });

        //this.layerCars = L.featureGroup()
        //this.layerCars.addTo(this.map);
        //this.layerCars = this.$refs['layerCars']

        //console.log(this.layerCars);
        this.connection = MonitoringService.connectionWS();
        this.connection.onmessage = (event) => {
          try {
            let msg = JSON.parse(event.data);
            let car = this.cars.find(x => x.deviceId === msg.BlockNumber);
            if (car && msg.latitude && msg.longitude) {
              //console.log(car.deviceId, msg.latitude, msg.longitude, this.visibleAllMarker)
              car.ll = latLng(msg.latitude, msg.longitude);
              car.visible_marker = this.visibleAllMarker;
              car.course = msg.course;
              car.speed = msg.speed;
              car.fuel_level = msg.fuel_level;
              //this.updateCourse(car);
              //this.getIcon(car.deviceId, car.course);
            }
          } catch (e) {
            console.log(e);
          }
        }
        this.connection.onclose = function (event) {
          console.log('Close', event)
        }
        this.connection.onopen = function () {
          console.log("Successfully connected")
        }
        this.connection.error = function (error) {
          console.log('Error', error)
        }
      },
      loadCars() {
        this.loadingListCars = true;
        return HttpClient.api.getCar()
          .then(response => {
            this.cars = response.data.data.map((car) => {
              car.ll = latLng(car.latitude, car.longitude);
              car.visible_marker = false;
              car.course = 0;
              car.speed = 0;
              car.fuel_level = 0;
              car.mileage = 0;
              return car;
            });
          })
          .catch(err => {
            console.log(err)
            this.errorListCars = {
              value: true,
              text: 'Ошибка при загрузке списка машин! ' + err
            }

          }).finally(() => {
            this.loadingListCars = false;
          })
      },
      loadsCatalogGroup() {
        HttpClient.api.catalogGroups().then(response => this.catalogGroups = response.data).catch();
      },
      loadTreeCars() {
        HttpClient.api.getTreeCars()
          .then((response) => {
            console.log(response.data)
            this.tree[0].children = response.data
            console.log(this.open)
            this.open.push(-1)
          });
      },

    },
  }
</script>
<style scoped>
  ::v-deep .v-expansion-panel::before {
    box-shadow: none;
  }


  .history-btn-panel {
    width: 100%;
    display: flex;
    justify-content: flex-end
  }

  .v-list-item--link:before {
    display: none
  }

  ::v-deep .expansion-panel-tracker-item {
    padding-right: 0px
  }

  ::v-deep .mdi-dots-icon {
    height: 14px;
    width: 14px;
  }
</style>