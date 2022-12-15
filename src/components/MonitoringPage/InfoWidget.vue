<template>
  <v-slide-x-transition>
    <l-control v-if="displayInfoWidget" position="topleft" class="panel-on-map left leaflet-control info-widget"
      disableClickPropagation disableScrollPropagation ref='sidebar-content-left'>
      <div class="online-trackers elevation-10">
        <div class="tracker-list-header tracker-list-row d-flex justify-space-between align-center">
          <div>
            <h3 class="tracker-list-header__title">
              {{ this.selectedInfo.last_name }} {{ this.selectedInfo.first_name }}</h3>
          </div>
          <div>
            <v-icon @click="closeInfoWidget()">mdi-close</v-icon>
          </div>
        </div>
        <div class="tracker-list-row">
          <v-list class="pa-3">

            <v-list-item class="ml-3 mr-3">
              <h2>Виджеты</h2>
              <div class="ml-auto">
                <v-icon class="mr-3">mdi-chevron-down</v-icon>
                <v-icon class="mr-3" @click="enableDraggable = !enableDraggable">mdi-format-line-spacing</v-icon>
                <v-menu offset-y :close-on-content-click="false">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-bind="attrs" v-on="on" class="mr-3">mdi-cog</v-icon>
                  </template>
                  <v-list>
                    <v-list-item v-for="(item, i) in infoWidgetOptions" :key="i">
                      <v-list-item-title>{{ item.title }}</v-list-item-title>
                      <input type="checkbox" :id="infoWidgetOptions[i].display" :value="infoWidgetOptions[i].display"
                        v-model="infoWidgetOptions[i].display">
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </v-list-item>
            <v-list-item class="expansion-panel-tracker-item pa-0">
              <v-expansion-panels flat :disabled="enableDraggable">
                <draggable :disabled='!enableDraggable'>
                  <!-- first item start -->
                  <v-container class="pa-0 connection-battery-row" v-if="infoWidgetOptions[0].display">
                    <v-expansion-panel>
                      <v-expansion-panel-header expand-icon="" class="expansion-panel-info-header pa-0"
                        v-on:mouseover="displayExpandIcon(0)" v-on:mouseleave="displayExpandIcon(0)">
                        <template v-slot:default="{ open }">
                          <v-list-item-content class="single-info-row icon-row">
                            <v-list-item-title v-if="!open" key="0" class="d-flex justify-space-between align-end">
                              <div>
                                <v-icon class="list-state-marker mr-2"
                                  :class="singleInfo.data.connection_status ? 'online' : 'offline'">mdi-circle
                                </v-icon>
                                <template v-if="singleInfo.data.connection_status">
                                  <span>На связи</span>
                                </template>
                                <template v-else>
                                  <span>Отключен</span>
                                </template>
                              </div>
                              <!-- battery-indicator start-->
                              <div class="battery mr-2">
                                <v-icon class="progress-icon-grey">
                                  mdi-battery</v-icon>
                                <v-icon class="progress-icon-green"
                                  style="color: rgb(139, 195, 74); caret-color: rgb(139, 195, 74); clip: rect(4px, 24px, 24px, 0px);">
                                  mdi-battery</v-icon>
                              </div>
                              <div class="ml-1">
                                <span>{{ singleInfo.data.battery_level }} %</span>
                              </div>
                              <!-- battery-indicator end -->
                              <!-- signal strength indicator -->
                              <div class="battery mr-2">
                                <v-icon style="clip-path: polygon(100% 0px, 0px 100%, 100% 100%);"
                                  class="progress-icon-grey">mdi-checkbox-blank</v-icon>
                                <v-icon class="progress-icon-green"
                                  style="color: rgb(139, 195, 74); caret-color: rgb(139, 195, 74); clip: rect(14px, 24px, 24px, 0px); clip-path: polygon(100% 0px, 0px 100%, 100% 100%);">
                                  mdi-checkbox-blank</v-icon>
                              </div>
                              <div class="ml-1">
                                <span>{{ singleInfo.data.battery_level }} %</span>
                              </div>
                              <!-- signal strength indicator -->
                              <div>
                              </div>
                              <transition name="fade">
                                <div v-if="enableDraggable">
                                  <v-icon>mdi-drag</v-icon>
                                </div>
                              </transition>
                            </v-list-item-title>
                            <v-list-item-title v-else key="1" class="d-flex justify-space-between align-center">
                              <div>
                                <v-icon class="info-icon mr-2">
                                  mdi-information
                                </v-icon>
                              </div>
                              <span>
                                Модель: ГдеМои A6 (FMB130)
                                ID: 3596 3310 2865 404
                              </span>
                            </v-list-item-title>
                          </v-list-item-content>
                        </template>
                        <template v-if="false" v-slot:actions>
                          <v-icon>
                            $expand
                          </v-icon>
                        </template>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-list>
                          <v-list-item-group>
                            <v-list-item class="expansion-panel-tracker-item">
                              <v-list-item-icon>
                                <v-icon class="list-state-marker"
                                  :class="singleInfo.data.connection_status ? 'online' : 'offline'">mdi-circle
                                </v-icon>
                              </v-list-item-icon>
                              <v-list-item-content>
                                <v-list-item-title> <template v-if="singleInfo.data.connection_status">
                                    <span>На связи</span>
                                  </template>
                                  <template v-else>
                                    <span>Отключен</span>
                                  </template></v-list-item-title>
                                <v-list-item-subtitle>Стоит 3 часа</v-list-item-subtitle>
                              </v-list-item-content>
                            </v-list-item>
                            <v-list-item class="expansion-panel-tracker-item">
                              <!-- battery-indicator -->
                              <div class="d-flex justify-space-between align-center">
                                <div class="battery mr-2">
                                  <div class="battery-level" :style="{ height: singleInfo.data.battery_level + '%' }">
                                  </div>
                                </div>
                              </div>
                              <!-- battery-indicator -->
                              <v-list-item-content>
                                <v-list-item-title>Заряд батареи - <span>{{ singleInfo.data.battery_level }} %</span>
                                </v-list-item-title>
                                <v-list-item-subtitle>Несколько секунд назад</v-list-item-subtitle>
                              </v-list-item-content>
                            </v-list-item>
                          </v-list-item-group>
                        </v-list>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-container>
                  <!-- first item end -->
                  <!-- second item start -->

                  <v-container class="pa-0" v-if="infoWidgetOptions[1].display">
                    <v-expansion-panel v-bind:class="{ 'd-flex': enableDraggable }">
                      <v-expansion-panel-header expand-icon="" class="expansion-panel-info-header pa-0"
                        v-on:mouseover="displayExpandIcon(1)" v-on:mouseleave="displayExpandIcon(1)">
                        <template v-slot:default="{ open }">
                          <v-icon class="info-icon mr-2">mdi-account</v-icon>
                          <v-list-item-content class="single-info-row  ml-2">
                            <v-list-item-title v-if="!open" key="0">
                              <!--           {{ this.selectedInfo.last_name }} {{ this.selectedInfo.first_name }}
                  -->
                              <div class="widget-title-wrap"><b>Антонов Антон</b></div>

                            </v-list-item-title>
                            <v-list-item-title v-else key="1">Водитель
                            </v-list-item-title>
                            <v-list-item-subtitle>2 года назад</v-list-item-subtitle>
                          </v-list-item-content>
                        </template>
                      </v-expansion-panel-header>

                      <v-expansion-panel-content>
                        <v-select :items="drivers" label="Антонов Антон"></v-select>
                        <!--
                        <p>Телефон: <a class="text-decoration-none" href="tel:+6494461709"> {{ this.selectedInfo.phone }}</a></p>
                        -->
                        <p>Телефон: <a class="text-decoration-none" href="tel:+6494461709"> +6494461709</a></p>
                      </v-expansion-panel-content>

                      <div v-if="enableDraggable">
                        <v-icon>mdi-drag</v-icon>
                      </div>
                    </v-expansion-panel>
                  </v-container>
                  <!-- second item end -->
                  <!-- next item start -->
                  <v-container class="pa-0" v-if="infoWidgetOptions[2].display">
                    <v-expansion-panel>
                      <v-expansion-panel-header expand-icon="" class="pa-0" v-on:mouseover="displayExpandIcon(2)"
                        v-on:mouseleave="displayExpandIcon(2)">
                        <v-icon class="info-icon mr-2 grey-icon">mdi-map-marker</v-icon>
                        <div class="flex-column align-start ml-2" v-if="this.selectedInfo.location">
                          <v-list-item-content class="single-info-row">
                          <div class="widget-title-wrap">
                              <b>
                                {{ this.selectedInfo.location.address }}
                              </b>
                              </div>
                            <v-list-item-subtitle>2 минуты назад</v-list-item-subtitle>
                          </v-list-item-content>

                        </div>
                        <div>
                        </div>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-list>
                          <v-list-item-group>
                            <v-list-item class="expansion-panel-tracker-item">
                              <!-- signal strength indicator -->
                              <div class="battery mr-2">
                                <v-icon style="clip-path: polygon(100% 0px, 0px 100%, 100% 100%);"
                                  class="progress-icon-grey">mdi-checkbox-blank</v-icon>
                                <v-icon class="progress-icon-green"
                                  style="color: rgb(139, 195, 74); caret-color: rgb(139, 195, 74); clip: rect(14px, 24px, 24px, 0px); clip-path: polygon(100% 0px, 0px 100%, 100% 100%);">
                                  mdi-checkbox-blank</v-icon>
                              </div>
                              <div class="ml-1">
                                <span>{{ singleInfo.data.battery_level }} %</span>
                              </div>
                              <!-- signal strength indicator -->
                            </v-list-item>
                            <v-list-item class="expansion-panel-tracker-item">
                              <v-list-item-content>
                                <v-list-item-title>

                                  97К-009, 101 к721Б,<br> Новочебоксарск, Чувашия, 429965
                                </v-list-item-title>
                                <v-list-item-subtitle style='font-size: 14px'>56.056705, 47.513127 (высота 78 метров)
                                </v-list-item-subtitle>
                                <v-list-item-subtitle>Скорость: 0 км/ч</v-list-item-subtitle>
                              </v-list-item-content>
                            </v-list-item>
                          </v-list-item-group>
                        </v-list>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-container>
                  <!-- next item end -->
                  <!-- third item start -->
                  <v-container class="pa-0" v-if="infoWidgetOptions[3].display">
                    <v-expansion-panel v-bind:class="{ 'd-flex': enableDraggable }">
                      <v-expansion-panel-header expand-icon="" class="pa-0" v-on:mouseover="displayExpandIcon(3)"
                        v-on:mouseleave="displayExpandIcon(3)">
                        <v-icon class="info-icon mr-2">mdi-cash</v-icon>
                        <div class="flex-column align-start ml-2">
                          <v-list-item-content class="single-info-row">
                            <b>
                              Тарифный план: <a href="/#">Деловой</a>
                            </b>
                            <v-list-item-subtitle>Следующий платеж: 14 октября 2021 г.</v-list-item-subtitle>
                          </v-list-item-content>

                        </div>
                        <div>
                        </div>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        750 руб. / месяц (ежедневное списание)
                      </v-expansion-panel-content>

                      <div v-if="enableDraggable">
                        <v-icon>mdi-drag</v-icon>
                      </div>
                    </v-expansion-panel>

                  </v-container>
                  <!-- third item end-->
                  <!-- thourth item start-->
                  <v-container class="pa-0" v-if="infoWidgetOptions[4].display">
                    <v-expansion-panel v-bind:class="{ 'd-flex': enableDraggable }">
                      <v-expansion-panel-header expand-icon="" class="pa-0" v-on:mouseover="displayExpandIcon(4)"
                        v-on:mouseleave="displayExpandIcon(4)">
                        <v-icon class="info-icon mr-2">mdi-scanner</v-icon>
                        <div class="flex-column align-start ml-2">
                          <v-list-item-content class="single-info-row">
                            <b>OBD2 & CAN</b>
                            <v-list-item-subtitle>
                              2 минуты назад
                            </v-list-item-subtitle>
                          </v-list-item-content>
                        </div>

                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        Уровень топлива: 54 л
                      </v-expansion-panel-content>

                      <div v-if="enableDraggable">
                        <v-icon>mdi-drag</v-icon>
                      </div>
                    </v-expansion-panel>
                  </v-container>
                  <!-- thourth item end-->
                  <!-- fifth item start-->
                  <v-container class="pa-0" v-if="infoWidgetOptions[5].display">
                    <v-expansion-panel v-bind:class="{ 'd-flex': enableDraggable }">
                      <v-expansion-panel-header class="px-0" expand-icon="" v-on:mouseover="displayExpandIcon(5)"
                        v-on:mouseleave="displayExpandIcon(5)">
                        <v-icon class="info-icon mr-2">mdi-pulse</v-icon>
                        <div class="flex-column align-start ml-2">
                          <b>Показания датчиков</b>
                          <v-list-item-subtitle>
                            нет данных
                          </v-list-item-subtitle>
                        </div>

                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        Уровень топлива: 54 л
                      </v-expansion-panel-content>

                      <div v-if="enableDraggable">
                        <v-icon>mdi-drag</v-icon>
                      </div>
                    </v-expansion-panel>
                  </v-container>
                  <!-- fifth item end-->
                  <!-- six item start-->
                  <!--  
                  <v-container class="pa-0">
                    <v-expansion-panel>
                      <v-form>
                        <v-text-field prepend-icon="mdi-road" v-model="message"
                          :append-outer-icon="message ? 'mdi-check' : ' '" filled clear-icon="mdi-close-circle"
                          clearable type="text" @click:append="toggleMarker" @click:append-outer="sendMessage"
                          @click:clear="clearMessage">
                        </v-text-field>
                      </v-form>
                    </v-expansion-panel>
                  </v-container>-->

                  <!-- six item end-->
                  <v-container class="pa-0" v-if="infoWidgetOptions[6].display">
                    <div class="d-flex justify-space-between align-center">
                      <div class="d-flex justify-space-between align-center">
                        <v-icon class="mr-2">mdi-road</v-icon>
                        <div class="ml-2">
                          <v-list-item-content class="single-info-row">
                            <b>
                              <a href="#" class="engine-hours-text text-decoration-none">Настроить одометр</a>
                            </b>
                          </v-list-item-content>
                        </div>
                      </div>
                      <div v-if="enableDraggable">
                        <v-icon>mdi-drag</v-icon>
                      </div>
                    </div>
                  </v-container>
                  <!-- seventh item start-->
                  <v-container class="pa-0" v-if="infoWidgetOptions[7].display">
                    <div class="d-flex justify-space-between align-center">
                      <div class="d-flex justify-space-between align-center">
                        <v-icon class="mr-2">mdi-clock</v-icon>
                        <div class="ml-2">
                          <v-list-item-content class="single-info-row">
                            <b>
                              <a href="#" class="engine-hours-text text-decoration-none">Настроить моточасы</a>
                            </b>
                          </v-list-item-content>
                        </div>
                      </div>
                      <div v-if="enableDraggable">
                        <v-icon>mdi-drag</v-icon>
                      </div>
                    </div>
                  </v-container>
                  <!-- seventh item end-->
                  <v-container class="pa-0" v-if="infoWidgetOptions[8].display">
                    <v-expansion-panel v-bind:class="{ 'd-flex': enableDraggable }">
                      <v-expansion-panel-header class="pa-0" expand-icon="" v-on:mouseover="displayExpandIcon(8)"
                        v-on:mouseleave="displayExpandIcon(8)">
                        <template v-slot:default="{ open }">
                          <v-icon class="info-icon mr-2">mdi-login-variant</v-icon>
                          <v-list-item-content class="single-info-row  ml-2">
                            <v-list-item-title v-if="!open" key="0">
                              <div class="input-icon__index" title="Вход">
                                <span class="absolute-number-icon">1</span>
                              </div>
                            </v-list-item-title>
                            <v-list-item-title v-else key="1">
                              Входы
                            </v-list-item-title>
                            <v-list-item-subtitle>Несколько секунд назад</v-list-item-subtitle>

                          </v-list-item-content>
                        </template>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content class="expansion-panel-fix">
                        <div class="input-icon__index mr-2" title="Вход">
                          <span class="absolute-number-icon">1</span>
                        </div>
                        <v-list-item-subtitle>
                          Дискретный вход
                        </v-list-item-subtitle>
                      </v-expansion-panel-content>
                      <div v-if="enableDraggable">
                        <v-icon>mdi-drag</v-icon>
                      </div>
                    </v-expansion-panel>
                  </v-container>
                  <!-- more -->
                  <v-container class="pa-0" v-if="infoWidgetOptions[9].display">
                    <v-expansion-panel v-bind:class="{ 'd-flex': enableDraggable }">
                      <v-expansion-panel-header class="pa-0" expand-icon="" v-on:mouseover="displayExpandIcon(9)"
                        v-on:mouseleave="displayExpandIcon(9)">
                        <v-icon class="info-icon mr-2 rotate-icon">mdi-logout-variant</v-icon>
                        <div class="flex-column align-start ml-2">
                          <div class="input-icon__index-logout" title="Вход">
                            1
                          </div>
                          <v-list-item-subtitle>
                            нет данных
                          </v-list-item-subtitle>
                        </div>

                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-switch class="pink-switch" color="#ff9999"></v-switch>
                      </v-expansion-panel-content>

                      <div v-if="enableDraggable">
                        <v-icon>mdi-drag</v-icon>
                      </div>
                    </v-expansion-panel>
                  </v-container>
                  <!-- more -->
                  <v-container class="pa-0" v-if="infoWidgetOptions[10].display">
                    <v-expansion-panel v-bind:class="{ 'd-flex': enableDraggable }">
                      <v-expansion-panel-header class="pa-0" expand-icon="" v-on:mouseover="displayExpandIcon(10)"
                        v-on:mouseleave="displayExpandIcon(10)">
                        <template v-slot:default="{ open }">
                          <v-icon class="info-icon mr-2">mdi-bell</v-icon>
                          <v-list-item-content class="single-info-row  ml-2">
                            <v-list-item-title v-if="!open" key="0">
                            <div class="widget-title-wrap">
                              <b>Антон Газель: Превышение скорости</b>
                              </div>
                            </v-list-item-title>
                            <v-list-item-title v-else key="1">Последние события
                            </v-list-item-title>
                            <v-list-item-subtitle>29 минут назад</v-list-item-subtitle>

                          </v-list-item-content>
                        </template>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content class="expansion-panel-fix">
                        <div class="input-icon__index mr-2" title="Вход">
                          <span class="absolute-number-icon">1</span>
                        </div>
                        <v-list-item-subtitle>
                          Дискретный вход
                        </v-list-item-subtitle>
                      </v-expansion-panel-content>
                      <div v-if="enableDraggable">
                        <v-icon>mdi-drag</v-icon>
                      </div>
                    </v-expansion-panel>
                  </v-container>
                  <!-- more -->
                </draggable>
              </v-expansion-panels>
            </v-list-item>

          </v-list>

        </div>
      </div>
    </l-control>
  </v-slide-x-transition>
</template>
<script>
  import draggable from "vuedraggable";
  import {
    LControl,
  } from 'vue2-leaflet';

  export default {
    name: 'InfoWidget',

    components: {
      draggable,
      LControl
    },
    data() {
      return {
        showHistory: false,
        expandIcon: [false, false, false, false, false, false, false, ],
        selectedInfo: {},
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
        singleInfoTest: {},
        infoWidgetOptions: [{
            title: 'Статус устройства',
            display: true
          },
          {
            title: 'Водитель',
            display: true
          },
          {
            title: 'Местоположение',
            display: true
          },
          {
            title: 'Тарифный план',
            display: true
          },
          {
            title: 'OBD2 & CAN',
            display: true
          },
          {
            title: 'Показания датчиков',
            display: true
          },
          {
            title: 'Одометер',
            display: true
          },
          {
            title: 'Моточасы',
            display: true
          },
          {
            title: 'Входы',
            display: true
          },
          {
            title: 'Выходы',
            display: true
          },
          {
            title: 'Последние события',
            display: true
          },
        ],
        enableDraggable: false,
        displayInfoWidget: true,
        distance: '32112 км',
        drivers: [
          'Петр Петров',
          'Иван Иванов'
        ],
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
        password: 'Password',
        show: false,
        message: '341111 км',
        marker: true,
        iconIndex: 0,
        icons: [
          'mdi-emoticon',
          'mdi-emoticon-cool',
          'mdi-emoticon-dead',
          'mdi-emoticon-excited',
          'mdi-emoticon-happy',
          'mdi-emoticon-neutral',
          'mdi-emoticon-sad',
          'mdi-emoticon-tongue',
        ],
      }
    },
    mounted() {
      this.closeInfoWidget()
      this.$root.$on("some-root-event", (data) => {
        this.closeInfoWidget()
        this.selectedInfo = this.selectInfo(data);
        if (this.displayInfoWidget == false) {
          this.closeInfoWidget()
        }
      });
      this.$root.$on("show-history", (data) => {
        this.closeDatePicker = data
        // console.log('[jq' + data)
        this.displayInfoWidget = false
        this.showHistory = true
        // this.launchHidtoryWidget()
      });


    },
    computed: {
      icon() {
        return this.icons[this.iconIndex]
      },
    },
    methods: {

      displayExpandIcon(i) {
        this.expandIcon[i] = !this.expandIcon[i];
      },
      selectInfo(id) {
        const list = this.trackersListDetailed.list;
        const result = list.find(item => item.tracker_id === id);
        return result;
      },
      // fix meeeeeee
      closeInfoWidget() {
        this.displayInfoWidget = !this.displayInfoWidget;
      },
      toggleMarker() {
        this.marker = !this.marker
      },
      sendMessage() {
        this.resetIcon()
        // this.clearMessage()
      },
      clearMessage() {
        this.message = ''
      },
      resetIcon() {
        this.iconIndex = 0
      },
      changeIcon() {
        this.iconIndex === this.icons.length - 1 ?
          this.iconIndex = 0 :
          this.iconIndex++
      },
    }
  }
</script>
<style scoped>
  .v-list .v-list-item--active .v-icon {
    color: rgba(0, 0, 0, 0.38);
  }

  /*
  .v-ripple__container {
    display:none !important;
    
}
*/

  .fade-enter-active,
  .fade-leave-active {
    /*
  transition: opacity .5s ease;
  transform: rotate(180deg);
  
  transition: opacity 150ms ease;
    transform: rotate( 180deg ); 
    */
  }

  .fade-enter-from,
  .fade-leave-to {
    transform: rotate(-180deg);
    transition: transform 150ms ease;
  }

  .v-list-item__title,
  .v-list-item__subtitle {
    flex: 1 1 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
  }

  .online-trackers {
    position: absolute;
    left: 70px;
    box-shadow: 0px 6px 6px -3px rgb(0 0 0 / 20%), 0px 10px 14px 1px rgb(0 0 0 / 14%), 0px 4px 18px 3px rgb(0 0 0 / 12%) !important;

  }

  .tracker-list-row {}

  .v-list-item__title {
    font-size: 14px
  }

  .widget-title-wrap {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 250px;
  }
</style>