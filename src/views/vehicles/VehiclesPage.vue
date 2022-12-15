<template>
  <v-container fluid class="pa-0 d-flex flex-column h-100">
    <v-overlay absolute :value="openFormRouteTask" class="overlay-confirm-remove"
      :class="{'active': openFormRouteTask}">
      <v-card light width="400px" height="100%" rounded="0">
        <v-card-text>
          <v-form ref="form_route_task">
            <p class="text-h6 font-weight-normal">Путевой лист</p>
            <v-row>
              <v-col cols="12">
                <div>Шаблон путевого листа</div>
                <v-radio-group dense>
                  <v-radio label="Типовая форма №4-с (Грузовой автомобиль)" value="radio-1"></v-radio>
                  <v-radio label="Типовая форма №4-с (Грузовой автомобиль)" value="radio-2"></v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="12">
                <v-menu :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y
                  min-width="auto">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field label="Отчётный период" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on">
                    </v-text-field>
                  </template>
                  <v-date-picker></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="6">
                <v-text-field label="Серия" hide-details="auto" dense></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field label="Номер" hide-details="auto" dense></v-text-field>
              </v-col>
              <v-col cols="12" class="py-0">
                <v-checkbox label="Заполнять данные о поездках" hide-details dense></v-checkbox>
              </v-col>
              <v-col cols="12" class="py-0">
                <v-checkbox label="Использовать данные одометра" hide-details dense></v-checkbox>
              </v-col>
              <v-col style="max-width: 230px;" class="ml-auto">
                <v-btn text small @click="openFormRouteTask=false">
                  Отмена
                </v-btn>
                <v-btn text small color="primary">
                  <v-icon>mdi-download</v-icon>
                  Скачать
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-overlay>
    <v-overlay absolute :value="confirmRemoveVehicle" class="overlay-confirm-remove"
      :class="{'active': confirmRemoveVehicle}">
      <v-card light width="400px" height="100px" rounded="0">
        <v-card-text>
          <v-row>
            <v-col>Удалить выбранное транспортное средство <span>"{{vehicle.name}}"</span>?</v-col>
          </v-row>
          <v-row>
            <v-col class="ml-auto pa-1" style="max-width: 180px">
              <v-btn text small @click="confirmRemoveVehicle=false">
                Отмена
              </v-btn>
              <v-btn text small color="primary">
                Удалить
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-overlay>
    <v-overlay absolute :value="confirmRemoveGarage" class="overlay-confirm-remove"
      :class="{'active': confirmRemoveGarage}">
      <v-card light width="300px" height="100px" rounded="0">
        <v-card-text>
          <v-row>
            <v-col>Удалить выбранный гараж <span>"{{garage.name_organization}}"</span>?</v-col>
          </v-row>
          <v-row>
            <v-col class="ml-auto pa-0" style="max-width: 180px">
              <v-btn text small @click="confirmRemoveGarage=false">
                Отмена
              </v-btn>
              <v-btn text small color="primary">
                Удалить
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-overlay>
    <v-overlay absolute :value="openMapFullScreen" class="overlay-map-fullscreen"
      :class="{'active': openMapFullScreen}">
      <v-card light width="100%" height="100%" rounded="0">
        <l-map style="height: calc(100% - 50px); width:100%; position:relative" ref="vehicles_map_fullscreen"
          :zoom="zoom" :center="center" @ready="mapFullScreenOnReady">
          <l-tile-layer :url="url" />
        </l-map>
        <v-card-text class="pa-2">
          <v-btn text class="float-right" color="primary" @click="openMapFullScreen=false">
            Закрыть
          </v-btn>
        </v-card-text>
      </v-card>
    </v-overlay>
    <v-overlay absolute :value="openFormCar" class="overlay-form-content" :class="{'active': openFormCar}">
      <v-card light width="600" height="100%" rounded="0" class="d-flex flex-column pa-4">
        <div>
          <v-row align="center" class="ma-0">
            <v-col cols="2">
              <v-btn icon class="text-center" @click="openFormCar=!openFormCar">
                <v-icon>
                  mdi-close
                </v-icon>
              </v-btn>
            </v-col>
            <v-col>
              <span class="text-h5 font-weight-light">Новое ТС</span>
            </v-col>
          </v-row>
          <v-tabs v-model="tabsFormCar" height="40px" color="primary darken-1" class="tabs-form-car">
            <v-tab href="#data_ts">
              Транспорт
            </v-tab>
            <v-tab href="#specifications">
              Характеристики
            </v-tab>
            <v-tab href="#fuel_sensor">
              Датчик топлива
            </v-tab>
            <v-tab href="#insurance">
              Страхование
            </v-tab>
          </v-tabs>
          <v-divider></v-divider>
        </div>
        <v-row class="ma-0 overflow-y-auto" style="min-height: 0">
          <v-form ref="form-car">
            <v-tabs-items v-model="tabsFormCar" class="h-100">
              <v-tab-item key="f1" value="data_ts" class="h-100">

                <v-row class="ma-0">
                  <v-col cols="6">
                    <v-select label="Маячок" dense>
                    </v-select>
                  </v-col>
                  <v-col cols="12" class="pa-0">
                    <v-card-title class="pa-1">Основная информация</v-card-title>
                  </v-col>
                  <v-col cols="6">

                    <v-text-field label="Название" hide-details="auto" dense></v-text-field>
                  </v-col>
                  <v-col cols="6">

                    <v-text-field label="Гос Номер" hide-details="auto" dense></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field label="VIN" hide-details="auto" dense></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field label="Цвет" hide-details="auto" dense></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-select label="Тип автомобиля" dense>
                    </v-select>
                  </v-col>
                  <v-col cols="6">
                    <v-select label="Подтип" dense>
                    </v-select>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field label="Модель" hide-details="auto" dense></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-select label="Гараж" dense>
                    </v-select>
                  </v-col>
                  <v-col cols="12" class="pa-0">
                    <v-card-title class="pa-1">Дополнительная информация</v-card-title>
                  </v-col>
                  <v-col cols="12">
                    <v-select label="Теги" dense>
                    </v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field label="Дополнительно" hide-details="auto" dense></v-text-field>
                  </v-col>
                </v-row>
              </v-tab-item>
              <v-tab-item key="f2" value="specifications" class="h-100">
                <v-row class="ma-0">


                  <v-col cols="12" class="pa-0">
                    <v-card-title class="pa-1">Размер</v-card-title>
                  </v-col>
                  <v-col cols="2">
                    <v-text-field label="Длина" hide-details="auto" dense>
                    </v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <v-text-field label="Ширина" hide-details="auto" dense>
                    </v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <v-text-field label="Высота" hide-details="auto" dense>
                    </v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field label="Грузоподъёмность" hide-details="auto" dense>
                    </v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field label="Полная масса" hide-details="auto" dense>
                    </v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field label="Кол-во пассажиров" hide-details="auto" dense>
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" class="pa-0">
                    <v-card-title class="pa-1">Колёсная база</v-card-title>
                  </v-col>
                  <v-col cols="3">
                    <v-text-field label="Всего" hide-details="auto" dense>
                    </v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <v-text-field label="Ведущие" hide-details="auto" dense>
                    </v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field label="Размер шин" hide-details="auto" dense>
                    </v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field label="Число шин" hide-details="auto" dense>
                    </v-text-field>
                  </v-col>

                  <v-col cols="12" class="pa-0">
                    <v-card-title class="pa-1">Дополнительная информация</v-card-title>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field label="Разрешённая скорость" hide-details="auto" dense>
                    </v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field label="Номер шасси" hide-details="auto" dense>
                    </v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field label="Прицеп" hide-details="auto" dense>
                    </v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field label="Год выпуска" hide-details="auto" dense>
                    </v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field label="Номер кузова" hide-details="auto" dense>
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-tab-item>
              <v-tab-item key="f3" value="fuel_sensor" class="h-100">
                <v-row class="ma-0">
                  <v-col cols="6">
                    <v-select label="Тип топлива" hide-details="auto" dense>
                    </v-select>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field label="Марка топлива" hide-details="auto" dense>
                    </v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field label="Стоимость (за 1 л)" hide-details="auto" dense>
                    </v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field label="Ёмкость бака" hide-details="auto" dense>
                    </v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field label="Норма расхода на 100 км" hide-details="auto" dense>
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-tab-item>
              <v-tab-item key="f4" value="insurance" class="h-100">
                <v-row class="ma-0">
                  <v-col cols="6">
                    <v-text-field label="Номер страхования ОСАГО" hide-details="auto" dense>
                    </v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-menu :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y
                      min-width="auto">
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field placeholder="Дата окончания ОСАГО" prepend-icon="mdi-calendar" dense hide-details
                          readonly v-bind="attrs" v-on="on"></v-text-field>
                      </template>
                      <v-date-picker></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field label="Номер страхования КАСКО" hide-details="auto" dense>
                    </v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-menu :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y
                      min-width="auto">
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field placeholder="Дата окончания КАСКО" prepend-icon="mdi-calendar" dense hide-details
                          readonly v-bind="attrs" v-on="on"></v-text-field>
                      </template>
                      <v-date-picker></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-tab-item>
            </v-tabs-items>
          </v-form>
        </v-row>
        <v-card-actions class="mt-auto">
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" text small @click="openFormCar = false">
            Отмена
          </v-btn>
          <v-btn color="primary darken-1" text small @click="openFormCar = false">
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-overlay>
    <v-overlay absolute :value="openFormGarage" class="overlay-form-content">
      <v-card light max-width="420px" height="100%" rounded="0" class="d-flex flex-column pa-4">
        <div>
          <v-row align="center" class="ma-0">
            <v-col cols="2">
              <v-btn icon class="text-center" @click="openFormGarage=!openFormGarage">
                <v-icon>
                  mdi-close
                </v-icon>
              </v-btn>
            </v-col>
            <v-col>

              <span class="text-h5 font-weight-light">Новый гараж</span>

            </v-col>
          </v-row>
        </div>

        <v-row class="ma-0 overflow-y-auto" style="min-height: 0">
          <v-form ref="form-garage">
            <v-row class="ma-0">


              <v-col cols="12">
                <v-text-field label="Название организаций" hide-details="auto"></v-text-field>
              </v-col>
              <v-col cols="12">

                <v-text-field label="Фио механика" hide-details="auto"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Фио диспетчера" hide-details="auto"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Адрес" hide-details="auto"></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-row>
        <v-card-actions class="mt-auto">
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" text small @click="openFormGarage = false">
            Отмена
          </v-btn>
          <v-btn color="primary darken-1" text small @click="openFormGarage = false">
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-overlay>
    <v-tabs v-model="tabs" class="vehicles-tabs" background-color="grey lighten-3" color="primary" height="40px"
      light>
      <v-tab href="#vehicles">Транспорт</v-tab>
      <v-tab href="#garage">Гаражи</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tabs" class="grey lighten-3 h-100">
      <v-tab-item key="1" value="vehicles" class="h-100">
        <v-container fluid class="h-100 pa-2">
          <v-row class="ma-0 h-100">
            <v-col class="vehicles-container pa-0 h-100" :class="{'active': openVehicleSidebar}">
              <v-row justify="space-between" align="center" class="ma-0">
                <v-col style="max-width: 70px">
                  <v-speed-dial v-model="addCar" open-on-hover direction="bottom" transition="slide-y-transition"
                    class="add-car-btn">
                    <template v-slot:activator>
                      <v-btn v-model="addCar" fab dark small color="primary" @click="openFormCar=!openFormCar">
                        <v-icon>
                          mdi-plus
                        </v-icon>

                      </v-btn>
                    </template>
                    <v-btn fab dark small color="white" title="Импортировать excel">
                      <v-icon color="primary">mdi-file-excel</v-icon>
                    </v-btn>
                  </v-speed-dial>
                </v-col>
                <v-col>
                  <div class="font-weight-medium vehicle-header">
                    Транспортные средства
                  </div>
                </v-col>
                <v-col style="max-width: 45px">
                  <v-btn icon small @click="openSearchCar()">
                    <v-icon size="22">
                      mdi-magnify
                    </v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="auto" class="px-0">

                  <v-text-field v-model="searchCar" ref="search-car" label="Поиск машины" placeholder="Поиск машины"
                    dense single-line hide-details :append-icon="showSearchCar ? 'mdi-close' : ''"
                    @click:append="clearSearchCar" :class="{'show': showSearchCar}" class="vehicles-search">
                  </v-text-field>

                </v-col>


                <v-col class="wrap-tgl-sidebar" :class="{'active': openVehicleSidebar}">
                  <v-btn absolute right top icon small class="mt-2" @click="openVehicleSidebar=!openVehicleSidebar">
                    <v-icon size="18" class="tgl-sidebar" :class="{'active': openVehicleSidebar}">
                      mdi-arrow-collapse-left
                    </v-icon>

                  </v-btn>
                </v-col>
              </v-row>

              <v-card fluid class="pa-0 white" style="height: calc(100% - 64px)">
                <v-row class="ma-0" align="center" style="min-height: 44px">
                  <v-col style="max-width: 150px" class="py-1">
                    <span class="text-body-2 grey--text text--darken-1">Группировать по:</span>
                  </v-col>
                  <v-col class="py-1" style="max-width: 200px">
                    <v-select v-model="tableCarsGroup" dense single-line :items="groupsTable" hide-details
                      class="select-group ma-0">
                    </v-select>
                  </v-col>
                  <v-col class="py-1"></v-col>
                  <v-col class="py-1 text-center" style="max-width: 65px">

                    <v-menu :close-on-content-click="false" max-height="300px" :nudge-width="200" offset-x>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn icon v-bind="attrs" v-on="on" small>
                          <v-icon size="22">
                            mdi-cog
                          </v-icon>
                        </v-btn>
                      </template>

                      <v-card>
                        <v-list dense>
                          <div class="px-4">Столбцы</div>
                          <v-list-item-group v-model="computedHeaderTableCars" multiple color="primary">
                            <v-list-item v-for="item in headerTableCars" :key="'key-' + item.value" :value="item.value"
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

                  </v-col>
                </v-row>
                <v-data-table dense calculate-widths :headers="tableCars.headers" :items="tableCars.data" item-key="id"
                  class="elevation-1 table-cars" @dblclick:row="editVehicle" @click:row="rowClick" single-select
                  :loading="loadingCars" :group-by="tableCarsGroup" hide-default-footer fixed-header height="100%">
                  <template v-slot:item.name="{ item }">
                    <v-avatar class="ma-1" width="34" height="34" min-width="34">
                      <v-img :src="item.photo"></v-img>
                    </v-avatar>
                    {{ item.name }}
                  </template>
                  <template v-slot:item.tags="{ item }">
                    <v-chip v-for="tag in item.tags" :key="tag.value" color="primary" small dark>
                      {{ tag.text }}
                    </v-chip>
                  </template>
                  <template v-slot:item.actions="{item}">
                    <div class="actions-column">
                      <v-btn icon @click="createRouteTask(item)">
                        <v-icon class="px-1">
                          mdi-view-list
                        </v-icon>
                      </v-btn>
                      <v-btn icon @click="editVehicle(item)">
                        <v-icon class="px-1">
                          mdi-pencil
                        </v-icon>
                      </v-btn>
                      <v-btn icon @click="removeVehicle(item)">
                        <v-icon class="px-1">
                          mdi-trash-can-outline
                        </v-icon>
                      </v-btn>
                    </div>

                  </template>
                  <template v-slot:group.header="{group}">
                    <th colspan="12" class="white">
                      {{ group }}
                    </th>
                  </template>
                </v-data-table>
              </v-card>
            </v-col>
            <v-col class="pa-0 h-100 d-none" style="max-width: 400px" :class="{'d-block': openVehicleSidebar}">
              <v-row justify="space-between" align="center" class="ma-0" style="height: 64px">
                <div class="text-body-1 px-6 font-weight-medium">
                  Информация о ТС
                </div>
              </v-row>
              <v-card class="pa-0 ml-4" style="height: calc(100% - 64px)">
                <l-map ref="vehicles_map" style="max-height: 300px; width:100%; position:relative" :zoom="zoom"
                  :center="center" @ready="mapOnReady()">
                  <l-tile-layer :url="url" />
                  <l-control position="topleft">
                    <div class="white control-fullscreen" @click="openMapFullScreen=!openMapFullScreen">
                      <v-icon class="primary--text">mdi-fullscreen</v-icon>
                    </div>
                  </l-control>
                </l-map>
                <div class="overflow-y-auto" style="height: calc(100% - 300px)">
                  <v-row class="ma-0">
                    <v-col cols="4">
                      <v-avatar width="68" height="68">
                        <v-img :src="detailCar.photo" />
                      </v-avatar>
                      <div class="py-1" v-if="detailCar.online">
                        <i class="mdi mdi-circle green--text" style="font-size: 12px;">
                        </i>
                        <span style="font-size: 12px;">
                          На связи
                        </span>
                      </div>
                      <div class="py-1" v-else>
                        <i class="mdi mdi-circle grey--text" style="font-size: 12px;">
                        </i>
                        <span style="font-size: 12px;">
                          Нет связи
                        </span>
                      </div>
                    </v-col>
                    <v-col col="8">
                      <v-list class="transparent pa-0">
                        <v-list-item class="pa-0 detail-car__item">
                          <v-list-item-content class="pa-0">
                            <div class="detail-car__text grey--text">
                              Название
                            </div>
                            <div class="detail-car__text">
                              {{detailCar.name}}
                            </div>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item class="pa-0 detail-car__item">
                          <v-list-item-content class="pa-0">
                            <div class="detail-car__text grey--text">
                              Гос Номер
                            </div>
                            <div class="detail-car__text">
                              {{detailCar.gos_number}}
                            </div>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item class="pa-0 detail-car__item">
                          <v-list-item-content class="pa-0">
                            <div class="detail-car__text grey--text">
                              Топливо
                            </div>
                            <div class="detail-car__text">
                              {{detailCar.fuel_level}}
                            </div>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item class="pa-0 detail-car__item">
                          <v-list-item-content class="pa-0">
                            <div class="detail-car__text grey--text">
                              Пробег
                            </div>
                            <div class="detail-car__text">
                              {{detailCar.mileage}}
                            </div>
                          </v-list-item-content>

                        </v-list-item>
                        <v-list-item class="pa-0 detail-car__item">
                          <v-list-item-content class="pa-0">
                            <div class="detail-car__text grey--text">
                              Страховка
                            </div>
                            <div class="detail-car__text">
                              {{detailCar.insurance}}
                            </div>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-col>
                  </v-row>
                  <v-divider></v-divider>
                  <v-row class="ma-0">
                    <v-col cols="4">
                      <v-avatar width="78" height="78">
                        <v-img :src="detailCar.photo_driver" />
                      </v-avatar>
                    </v-col>
                    <v-col col="8">
                      <v-list class="transparent pa-0">
                        <v-list-item class="pa-0 detail-car__item">
                          <v-list-item-content class="pa-0">
                            <div class="detail-car__text grey--text">
                              Водитель
                            </div>
                            <div class="detail-car__text">
                              {{detailCar.driver}}
                            </div>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item class="pa-0 detail-car__item">
                          <v-list-item-content class="pa-0">
                            <div class="detail-car__text grey--text">
                              Номер телефона
                            </div>
                            <div class="detail-car__text">
                              {{detailCar.phone}}
                            </div>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item class="pa-0 detail-car__item">
                          <v-list-item-content class="pa-0">
                            <div class="detail-car__text grey--text">
                              Отдел
                            </div>
                            <div class="detail-car__text">
                              {{detailCar.departament}}
                            </div>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-col>
                  </v-row>
                </div>

              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>
      <v-tab-item key="2" value="garage" class="h-100">
        <v-container fluid class="h-100 pa-2">
          <v-row justify="space-between" align="center" class="ma-0">
            <v-col style="max-width: 80px">
              <v-btn fab dark small color="primary" @click="openFormGarage=!openFormGarage">
                <v-icon>
                  mdi-plus
                </v-icon>

              </v-btn>
            </v-col>
            <v-col>
              <div class="font-weight-medium vehicle-header">
                Гаражи
              </div>
            </v-col>
            <v-col style="max-width: 45px">
              <v-btn icon @click="openSearchGarage" small>
                <v-icon size="22">
                  mdi-magnify
                </v-icon>
              </v-btn>
            </v-col>
            <v-col cols="auto" class="px-0">

              <v-text-field v-model="searchGarage" ref="search-garage" label="Поиск гаража" placeholder="Поиск гаража"
                dense single-line hide-details :append-icon="showSearchGarage ? 'mdi-close' : ''"
                @click:append="clearSearchGarage" :class="{'show': showSearchGarage}" class="vehicles-search">
              </v-text-field>
            </v-col>
          </v-row>
          <v-card style="height: calc(100% - 64px)" class="pa-0">
            <v-data-table dense calculate-widths :headers="tableGarage.headers" :items="tableGarage.data" item-key="id"
              class="elevation-1 table-garage" @dblclick:row="editGarage" @click:row="rowClick" single-select
              :loading="loadingGarage" hide-default-footer fixed-header height="100%">
              <template v-slot:item.actions="{item}">
                <div class="actions-column">
                  <v-btn icon @click="editGarage(item)">
                    <v-icon class="px-1">
                      mdi-pencil
                    </v-icon>
                  </v-btn>
                  <v-btn icon @click="removeGarage(item)">
                    <v-icon class="px-1">
                      mdi-trash-can-outline
                    </v-icon>
                  </v-btn>

                </div>
              </template>
            </v-data-table>
          </v-card>
        </v-container>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
  import {
    latLng
  } from "leaflet";
  import {
    LMap,
    LTileLayer,
    LControl,
  } from 'vue2-leaflet';

  export default {
    name: "VehiclesPage",
    components: {
      LMap,
      LTileLayer,
      LControl
    },
    computed: {
      computedHeaderTableCars: {
        get() {
          return this.tableCars.headers.map(x => x.value)
        },
        set(value) {
          this.tableCars.headers = this.headerTableCars.filter(item => value.includes(item.value))
          return value
        }
      }
    },
    methods: {
      clearSearchCar() {
        this.searchCar = ''
        this.showSearchCar = false
        this.$refs["search-car"].blur();
      },
      openSearchCar() {
        this.showSearchCar = true
        this.$refs["search-car"].focus();
      },
      clearSearchGarage() {
        this.searchGarage = ''
        this.showSearchGarage = false
        this.$refs["search-garage"].blur();
      },
      openSearchGarage() {
        this.showSearchGarage = true;
        this.$refs["search-garage"].focus();
      },

      mapOnReady() {
        this.map = this.$refs['vehicles_map'].mapObject
        this.map.zoomControl.setPosition('topright');
      },
      mapFullScreenOnReady() {
        this.map = this.$refs['vehicles_map_fullscreen'].mapObject
        this.map.zoomControl.setPosition('topright');
      },
      editGarage(item) {
        this.garage = item;
        this.openFormGarage = true;
      },
      editVehicle(item) {
        this.vehicle = item;
        this.openFormCar = true;
      },
      removeVehicle(item) {
        this.vehicle = item;
        this.confirmRemoveVehicle = true
      },
      removeGarage(item) {
        this.garage = item;
        this.confirmRemoveGarage = true
      },
      createRouteTask() {
        this.openFormRouteTask = true
      },
      rowClick: function (item, row) {
        row.select(!row.isSelected);
      }
    },
            watch: {
            openVehicleSidebar(val) {
                if (val) {
                    setTimeout(() => {
                        this.$refs.vehicles_map.mapObject.invalidateSize();
                    }, 100);
                }
            }
        },
    data: () => ({
      tabs: 'vehicles',
      vehicle: {
        name: ''
      },
      garage: {
        name: ''
      },
      openFormGarage: false,
      openFormCar: false,
      confirmRemoveVehicle: false,
      confirmRemoveGarage: false,
      openFormRouteTask: false,
      tabsFormCar: 'data_ts',
      searchCar: '',
      showSearchCar: false,
      searchGarage: '',
      showSearchGarage: false,
      openVehicleSidebar: false,
      openMapFullScreen: false,
      zoom: 16,
      center: latLng(59.930967, 30.302636),
      url: process.env.VUE_APP_OSM_SERVER + '/osm/{z}/{x}/{y}.png',
      addCar: false,
      loadingCars: false,
      loadingGarage: false,
      tableCarsGroup: null,
      selectedVehicle: null,
      detailCar: {
        name: 'Name 1',
        photo: 'https://picsum.photos/500/300?image=69',
        gos_number: 'o111oo 222',
        status: 'Стоит 3 часа',
        fuel_level: '2.09 л',
        mileage: '200334 км',
        insurance: '0002659248',
        driver: 'Дальнобой Дальнобоев',
        phone: '+7 (918) 999 33 21',
        photo_driver: 'https://picsum.photos/500/300?image=799',
        departament: 'Водители',
        online: true,
      },
      groupsTable: [{
        text: 'Не группировать',
        value: null
      }, {
        text: 'По типу',
        value: 'type_vehicle'
      }, {
        text: 'По гаражу',
        value: 'garage'
      }],
      headerTableCars: [{
          text: 'Название',
          value: 'name',
          width: 150
        },
        {
          text: 'ГосНомер',
          value: 'gos_number',
          width: 150
        },
        {
          text: 'Теги',
          value: 'tags',
          width: 150
        },
        {
          text: 'Модель',
          value: 'model_name',
          width: 150
        },
        {
          text: 'Тип автомобиля',
          value: 'type_vehicle',
          width: 150
        },
        {
          text: 'Гараж',
          value: 'garage',
          width: 150
        },
        {
          text: 'VIN',
          value: 'vin',
          width: 150,
        },
        {
          text: 'Пробег',
          value: 'mileage',
          width: 150
        },
        {
          text: 'Маячок',
          value: 'gps_block',
          width: 150
        },
        {
          text: 'Уровень топлива',
          value: 'fuel_level',
          width: 150
        },
        {
          text: 'Тип топлива',
          value: 'fuel_type',
          width: 150
        },
        {
          text: 'Марка топлива',
          value: 'fuel_brand',
          width: 150
        },
        {
          text: 'Норма расхода на 100 км',
          value: 'consumption_on_100km',
          width: 200
        },
        {
          text: 'Ёмкость бака',
          value: 'volume_tank',
          width: 150
        },
        {
          text: 'Грузоподъёмность',
          value: 'carrying',
          width: 160
        },
        {
          text: 'Номер шасси',
          value: 'number_chassis',
          width: 150
        },
        {
          text: 'Подтип',
          value: 'subtype',
          width: 150
        },
        {
          text: 'Колёсная формула',
          value: 'wheel_formula',
          width: 180
        },
        {
          text: 'Число шин',
          value: 'number_tires',
          width: 150
        },
        {
          text: 'Размер шин',
          value: 'size_tires',
          width: 150
        },
        {
          text: 'Разрешённая скорость',
          value: 'allowed_speed',
          width: 200
        },
        {
          text: 'Кол-во пассажиров',
          value: 'number_passengers',
          width: 200
        },
      ],
      tableCars: {
        data: [{
            id: 2,
            name: 'bame 2',
            photo: 'https://picsum.photos/500/300?image=260',
            gos_number: 'o111oo 222',
            tags: [{
              text: 'Тэг 2',
              value: 'tag_2'
            }],
            model_name: 'Maz',
            type_vehicle: 'Грузовик',
            garage: 'Garage 2',
            vin: 'ovsdfbb2423bjkbkj',
            mileage: 445555,
            gps_block: '2377',
            fuel_level: 30,
            fuel_type: 'petrol',
            fuel_brand: 'XZ',
            consumption_on_100km: 15,
            volume_tank: 140,
            carrying: 7000,
            number_chassis: '9999435',
            subtype: 'Subtype 2',
            wheel_formula: 'Test 2',
            number_tires: 6,
            size_tires: 120,
            allowed_speed: 120,
            number_passengers: 3,
          },
          {
            id: 3,
            name: 'Name 2',
            photo: 'https://picsum.photos/500/300?image=268',
            gos_number: 'o111oo 222',
            tags: [{
              text: 'Тэг 2',
              value: 'tag_2'
            }],
            model_name: 'Maz',
            type_vehicle: 'Грузовик',
            garage: 'Garage 2',
            vin: 'ovsdfbb2423bjkbkj',
            mileage: 445555,
            gps_block: '2377',
            fuel_level: 30,
            fuel_type: 'petrol',
            fuel_brand: 'XZ',
            consumption_on_100km: 15,
            volume_tank: 140,
            carrying: 7000,
            number_chassis: '9999435',
            subtype: 'Subtype 2',
            wheel_formula: 'Test 2',
            number_tires: 6,
            size_tires: 120,
            allowed_speed: 120,
            number_passengers: 3,
          },
          {
            id: 4,
            name: 'Name 3',
            photo: 'https://picsum.photos/500/300?image=269',
            gos_number: 'o111oo 222',
            tags: [{
              text: 'Тэг 2',
              value: 'tag_2'
            }],
            model_name: 'Maz',
            type_vehicle: 'Грузовик',
            garage: 'Garage 2',
            vin: 'ovsdfbb2423bjkbkj',
            mileage: 445555,
            gps_block: '2377',
            fuel_level: 30,
            fuel_type: 'petrol',
            fuel_brand: 'XZ',
            consumption_on_100km: 15,
            volume_tank: 140,
            carrying: 7000,
            number_chassis: '9999435',
            subtype: 'Subtype 2',
            wheel_formula: 'Test 2',
            number_tires: 6,
            size_tires: 120,
            allowed_speed: 120,
            number_passengers: 3,
          },
        ],
        headers: [{
            text: 'Название',
            value: 'name',
            width: 150
          },
          {
            text: 'ГосНомер',
            value: 'gos_number',
            width: 150
          },
          {
            text: 'Теги',
            value: 'tags',
            width: 150
          },
          {
            text: 'Модель',
            value: 'model_name',
            width: 150
          },
          {
            text: 'Тип автомобиля',
            value: 'type_vehicle',
            width: 150
          },
          {
            text: 'Гараж',
            value: 'garage',
            width: 150
          },
          {
            text: 'VIN',
            value: 'vin',
            width: 150
          },
          {
            text: '',
            value: 'actions',
            sortable: false,
            width: 150
          },
        ]
      },
      tableGarage: {
        data: [{
            id: 1,
            name_organization: 'Garage 1',
            fio_meh: 'Тест Тестович',
            fio_dispatch: 'Тестырян Тестырянович',
            address: 'Main Street 12'
          },
          {
            id: 2,
            name_organization: 'Garage 2',
            fio_meh: 'Тест Тестович',
            fio_dispatch: 'Тестырян Тестырянович',
            address: 'Main Street 10'
          },
          {
            id: 3,
            name_organization: 'Garage 2',
            fio_meh: 'Тест Тестович',
            fio_dispatch: 'Тестырян Тестырянович',
            address: 'Main Street 22'
          },
        ],
        headers: [{
            text: 'Название организации',
            value: 'name_organization',
            width: 150
          },
          {
            text: 'ФИО механика',
            value: 'fio_meh',
            width: 150
          },
          {
            text: 'ФИО механика',
            value: 'fio_dispatch',
            width: 150
          },
          {
            text: 'Адрес',
            value: 'address',
            width: 150
          },
          {
            text: '',
            value: 'actions',
            sortable: false,
            width: 150
          },
        ]
      }
    })
  }
</script>
<style>

</style>

<style scoped>
  ::v-deep .select-group .v-select__selection {
    font-size: 14px;
  }

  ::v-deep .table-garage tbody tr {
    height: 40px;
  }


  ::v-deep .overlay-form-content .v-overlay__content {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
  }

  ::v-deep .tabs-form-car .v-tab {
    font-size: 12px;
  }

  ::v-deep .v-text-field__slot label,
  .v-select__slot label,
  .v-text-field__slot input,
  .v-input__control label {
    font-size: 13px;
  }

  ::v-deep .overlay-confirm-remove,
  ::v-deep .overlay-form-content,
  ::v-deep .overlay-map-fullscreen {
    z-index: 1003 !important;
  }

  ::v-deep .overlay-map-fullscreen .v-overlay__content {
    position: absolute;
    top: 5%;
    left: 2%;
    bottom: 5%;
    right: 2%;
  }


  .actions-column {
    position: absolute;
    right: 0;
    padding: 0 5px;
    margin-top: -18px !important;
    text-align: center;
    display: none;
  }

  ::v-deep tr.v-data-table__selected {
    background: #e2daff !important;
  }
/*
  ::v-deep tr.v-data-table__selected .actions-column {
    display: block;
    background: #e2daff !important;
  }
*/
  ::v-deep tr:hover .actions-column {
    display: block;
    background: #eeeeee;
  }

  .control-fullscreen {
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
    width: 36px;
    height: 36px;
    line-height: 36px;
    vertical-align: middle;
    text-align: center;
    border-radius: 5px;
    cursor: pointer;
  }

  .control-fullscreen:hover {
    background-color: #eeeeee !important;
  }

  .v-btn::before {
    background-color: transparent;
  }

  .detail-car__text {
    font-size: 13px !important
  }

  .detail-car__item {
    min-height: 40px;
  }

  .w-100 {
    width: 100%;
  }

  .h-100 {
    height: 100%;
  }

  .vehicles-tabs {
    border-bottom: #d4d4d4 1px solid;
  }

  .vehicles-tabs .v-tab {
    min-width: 160px;
  }

  .vehicle-header {
    font-size: 20px;
    color: #2f2f2f;
  }

  .vehicles-search {
    padding: 0;
    transition: max-width 300ms;
    max-width: 1px;
  }

  .vehicles-search.show {
    padding: 0 10px;
    max-width: 320px;
  }

  .table-garage {
    height: 100%;
  }

  .table-cars {
    height: calc(100% - 44px);
  }

  .vehicles-container {
    transition: max-width 200ms;
    max-width: 100%;
  }

  .vehicles-container.active {
    max-width: calc(100% - 400px);
  }

  .wrap-tgl-sidebar {
    transition: max-width 200ms;
    max-width: 45px;
  }

  .wrap-tgl-sidebar.active {
    max-width: 0;
    padding: 0;
  }

  .tgl-sidebar {
    transform: rotate(0deg);
    transition: transform 200ms;
  }

  .tgl-sidebar.active {
    transform: rotate(-180deg);
  }

  .add-car-btn {
    z-index: 3;
  }
</style>