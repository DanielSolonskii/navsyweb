<template>
    <div>
        <v-dialog v-model="newSingleTask">
            <div class="new-single-task ma-2">
                <v-row class="ma-0 pa-1" style="background-color: #505a64; color: white">Новое одиночное задание</v-row>
                <v-row class="ma-2">
                    <v-col cols="6">
                        <v-textarea outlined style="background-color: white" value="Новое задание"></v-textarea>
                        <v-textarea outlined style="background-color: white" value="Подробное описание">
                        </v-textarea>
                        <new-task-date-time-picker-range v-model="computedNewTaskDateRange">
                        </new-task-date-time-picker-range>
                        <v-textarea class="pt-2" outlined style="background-color: white" value="Адрес"></v-textarea>
                        <div>Радиус: </div>
                        <div class="d-flex align-center">или укажите значение: <v-text-field min="0"
                                style="max-width: 30px" type="number"></v-text-field>
                        </div>
                        <v-select :items="items" v-model="defaultSelected">

                            <template v-slot:selection="{ item }">
                                <img class="img-select" :src="item.image">{{ item.name }}
                            </template>
                            <template v-slot:item="{ item }">
                                <img class="img-select" :src="item.image">{{ item.name }}
                            </template>
                        </v-select>
                    </v-col>
                    <v-col cols="6">
                        <l-map v-if="mapToLeftTrue" ref="vehicles_map"
                            style="min-height: 70vh; width:100%; position:relative; overflow: hidden" :zoom="zoom"
                            :center="center" @ready="mapOnReady()">
                            <l-tile-layer :url="url" />
                        </l-map>
                    </v-col>
                </v-row>
            </div>
        </v-dialog>
        <v-dialog v-model="dialogNewTask" width="800px">
            <div class="new-task">
                <v-row class="ma-2">Задание</v-row>
                <v-row class="pa-3 pt-4 pb-4">
                    <v-col @click="newSingleTask = !newSingletask" class="ma-3" style="background-color: white;"
                        align="center">
                        <v-icon color="black">mdi-map-marker</v-icon>
                        <div><span style="color: black">Одиночное задание</span></div>
                    </v-col>
                    <v-col @click="newRouteTask = !newRoutetask" class="ma-3" style="background-color: white"
                        align="center">
                        <v-icon color="black">mdi-map-marker-path</v-icon>
                        <div><span style="color: black">Маршрутное задание</span></div>
                    </v-col>
                    <v-col class="ma-3" style="background-color: white" align="center">
                        <v-icon color="black">mdi-file-excel</v-icon>
                        <div><span style="color: black">Импортировать из excel</span></div>
                    </v-col>
                    <v-col class="ma-3" style="background-color: white" align="center">
                        <v-icon color="black">mdi-text-box-multiple-outline</v-icon>
                        <div><span style="color: black">Импортировать из текста</span></div>
                    </v-col>
                </v-row>
            </div>
        </v-dialog>
        <div class="ml-1 top-row">
            <v-row class="pt-4">
                <div class="btn-col ml-2">
                    <v-btn class="add-btn mt-1 mr-1" color="primary" @click="addNew">
                        <v-icon>mdi-plus</v-icon>
                        <span>Добавить</span>
                    </v-btn>
                </div>
                <v-col cols="3" class="mr-1">
                    <menu-date-time-picker-range v-model="computedDateRange">
                    </menu-date-time-picker-range>
                </v-col>
                <v-col cols="6">
                    <v-text-field style="width: 100%" label="Поиск по ключевым словам" solo></v-text-field>
                </v-col>
            </v-row>
            <v-row class="mt-0 pb-2">
                <div class="d-flex">
                    <div>
                        <v-btn class="ma-2" outlined color="primary" style="font-size: 10px">
                            Сегодня
                        </v-btn>
                    </div>
                    <div>
                        <v-btn class="ma-2" outlined color="primary" style="font-size: 10px">
                            Завтра
                        </v-btn>
                    </div>
                    <div>
                        <v-btn class="ma-2" outlined color="primary" style="font-size: 10px">
                            Неделя
                        </v-btn>
                    </div>
                    <div>
                        <v-btn class="ma-2" outlined color="primary" style="font-size: 10px">
                            Месяц
                        </v-btn>
                    </div>
                    <div>
                        <v-btn class="ma-2" outlined color="primary" style="font-size: 10px">
                            Статус: любой
                        </v-btn>
                    </div>
                </div>
            </v-row>
        </div>
        <v-container fluid class="h-100 pa-0 grey lighten-4 relative">
            <v-slide-x-transition>
                <v-card v-show="openAddNewReport" class="absolute-box ma-3" min-width="320px" max-width="320px"
                    elevation="0" style="z-index: 4">
                    <v-toolbar dense dark color="primary " elevation="0">
                        <v-icon class="mr-2">
                            mdi-file-table
                        </v-icon>
                        <v-toolbar-title class="font-weight-bold" style="font-size: medium">
                            Доступные отчёты
                        </v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-icon @click="openAddNewReport = false" right>
                            mdi-chevron-left
                        </v-icon>
                    </v-toolbar>
                    <v-row class="ma-0">
                        <v-col class="pa-0">
                            <v-text-field v-model="searchReport" label="Быстрый поиск" dense flat solo single-line
                                hide-details="auto" clearable clear-icon="mdi-close" color="primary " class="pt-2">
                                <template v-slot:append>
                                    <v-icon v-if="!searchReport" color="primary "> mdi-magnify </v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <v-list height="calc( 100% - 86px )" width="100%" class="overflow-y-auto overflow-x-hidden">
                        <v-list-group v-for="(group, i) in groups_catalog_reports" :key="'group-' + i" :value="group"
                            class="group-reports" color="primary " sub-group prepend-icon="">
                            <template v-slot:appendIcon>
                                <v-icon class="">
                                    mdi-chevron-down
                                </v-icon>
                            </template>

                            <template v-slot:activator>
                                <v-list-item class="group-reports__item">
                                    <v-list-item-title class=" font-weight-bold pr-3" style="font-size: 14px">
                                        {{group.name}}
                                    </v-list-item-title>
                                </v-list-item>

                            </template>

                            <v-list-item-group v-model="selectedNewReport">
                                <template v-for="(report, i) in group.reports">
                                    <v-list-item :key="i" :value="report" dense class=" px-4" two-line>
                                        <v-list-item-content class="py-0">
                                            <v-list-item-title style="font-size: 13px">
                                                <strong>{{report.name}}</strong>
                                            </v-list-item-title>
                                            <v-list-item-subtitle style="font-size: 12px">{{report.description}}
                                            </v-list-item-subtitle>
                                        </v-list-item-content>

                                    </v-list-item>
                                    <v-divider v-if="i < group.reports.length - 1" :key="'br-'+i"></v-divider>
                                </template>
                            </v-list-item-group>
                        </v-list-group>
                    </v-list>
                </v-card>
            </v-slide-x-transition>

            <v-slide-x-transition>
                <v-card v-show="selectedNewReport" class="absolute-box ma-3" width="640px" style="left: 320px">
                    <div class="d-flex h-100 overflow-hidden">
                        <v-card class="h-100" elevation="0" rounded="0" min-width="320px" max-width="320px">
                            <v-toolbar dense dark color="#505a64 " elevation="0">
                                <v-toolbar-title class="font-weight-bold" style="font-size: medium">
                                    {{nameReport}}
                                </v-toolbar-title>
                            </v-toolbar>

                            <v-row class="ma-0">
                                <v-col class="px-2 py-1">
                                    <div style="font-size: small">
                                        Дни контроля:
                                    </div>
                                    <div>
                                        <v-item-group v-model="parametersReport.time_filter.weekdays" multiple>
                                            <v-item v-for="(date, i) in arrayWeekDays" :key="'day-' + i"
                                                v-slot="{ active, toggle }" :value="date.day()">
                                                <v-sheet height="24" width="24"
                                                    :color="active ? 'primary lighten-4': ''"
                                                    class="float-left text-center pointer-on-hover"
                                                    style="line-height: 20px; vertical-align: middle; margin: 1px"
                                                    @click="toggle">
                                                    {{date.format('dd')}}
                                                </v-sheet>
                                            </v-item>
                                        </v-item-group>
                                    </div>

                                </v-col>
                            </v-row>
                            <v-row class="ma-0">
                                <v-col class="px-2 py-1">
                                    <div style="font-size: small">
                                        {{computeControlTimeTitle}}

                                    </div>
                                    <v-range-slider v-model="computedControlTimeRange" color="primary "
                                        :max="maxTimeControl.unix()" :min="minTimeControl.unix()" step="1800"
                                        hide-details>
                                    </v-range-slider>
                                    <div class="text-center mt-n2">
                                        <span class="primary--text pointer-on-hover px-1" style="font-size: small"
                                            @click="setControlRangeTimeDay()">
                                            День
                                        </span>
                                        <span class="primary--text pointer-on-hover px-1" style="font-size: small"
                                            @click="setControlRangeTimeNight()">
                                            Ночь
                                        </span>
                                        <span class="primary--text pointer-on-hover px-1" style="font-size: small"
                                            @click="setControlRangeTimeDefault()">
                                            Всегда
                                        </span>
                                    </div>
                                </v-col>
                            </v-row>
                            <v-row v-if="'show_seconds' in parametersReport.plugin" class="ma-0 px-2">
                                <v-checkbox v-model="parametersReport.plugin.show_seconds" label="Показывать секунды"
                                    color="primary " hide-details class="mt-0"></v-checkbox>
                            </v-row>
                            <v-row class="ma-0 mb-1">
                                <v-btn style="width: 80%; margin: auto" @click="penaltyOptionsShow" color="primary">
                                    Настройки штрафов</v-btn>
                            </v-row>
                            <v-row style="height: 44px; background-color: #aeb0ba; color: white; padding: 10px"
                                class="ma-0">
                                Водители
                            </v-row>
                            <v-text-field class="search-test" v-model="search" hide-details clearable
                                clear-icon="mdi-close-circle-outline">
                            </v-text-field>
                            <v-row class="ma-0 employees-selection-tree-wrapper">
                                <div class="employees-selection-tree">
                                    <v-treeview :search="search" open-on-click selectable :items="employees" open-all
                                        return-object>
                                        <template v-slot:label="{ item }">
                                            <div style="display: flex; flex-direction: column">
                                                <div>
                                                    {{ item.name }}
                                                </div>
                                                <div>
                                                    {{ item.subtitle }}
                                                </div>
                                            </div>
                                        </template>
                                        <template v-slot:append="{ item, open }">
                                            <v-icon v-if="!item.subtitle">
                                                {{ open ? 'mdi-chevron-down' : 'mdi-chevron-up' }}
                                            </v-icon>
                                        </template>
                                        <template slot="prepend" slot-scope="{ item }">
                                            <img :src="item.img" />
                                        </template>
                                    </v-treeview>
                                </div>
                            </v-row>

                        </v-card>

                        <v-card class="h-100" elevation="0" rounded="0" min-width="320px" max-width="320px">
                            <v-toolbar dense dark color="#505a64" elevation="0">
                                <v-toolbar-title class="font-weight-bold" style="font-size: medium">
                                    Параметры расписания
                                </v-toolbar-title>
                            </v-toolbar>
                            <v-row class="ma-0">
                                <v-col class="px-2 py-1">
                                    <div style="font-size: small">
                                        Название отчёта
                                    </div>
                                    <v-text-field v-model="parametersReport.title" dense outlined hide-details="auto"
                                        color="primary " class="mt-1">
                                    </v-text-field>
                                </v-col>
                            </v-row>
                            <v-row class="ma-0">
                                <v-col class="px-2 py-1">
                                    <v-radio-group v-model="ex7" column>
                                        <v-radio label="Каждую неделю" value="true"></v-radio>
                                        <v-radio label="Каждый месяц"></v-radio>

                                    </v-radio-group>
                                </v-col>
                            </v-row>
                            <v-row class="ma-0">
                                <v-col class="px-2 py-1">
                                    <div style="font-size: small">
                                        Получать отчет в эти дни недели:
                                    </div>
                                    <div>
                                        <v-item-group v-model="parametersReport.time_filter.weekdays" multiple>
                                            <v-item v-for="(date, i) in arrayWeekDays" :key="'day-' + i"
                                                v-slot="{ active, toggle }" :value="date.day()">
                                                <v-sheet height="24" width="24"
                                                    :color="active ? 'primary lighten-4': ''"
                                                    class="float-left text-center pointer-on-hover"
                                                    style="line-height: 20px; vertical-align: middle; margin: 1px"
                                                    @click="toggle">
                                                    {{date.format('dd')}}
                                                </v-sheet>
                                            </v-item>
                                        </v-item-group>
                                    </div>
                                </v-col>
                            </v-row>
                            <v-row class="ma-0">
                                <v-select class="px-2" v-model="select" :items="timeSelect" label="Время отправки"
                                    single-line></v-select>
                            </v-row>
                            <v-row class="ma-0">
                                <span>За:</span>
                                <v-text-field style="width:20px;" type="number">
                                </v-text-field>
                                <v-select class="px-2" style="width: 20px" v-model="select" :items="periodSelect"
                                    single-line></v-select>
                            </v-row>
                            <v-row class="pa-0 px-2 mt-0">
                                <v-checkbox label="Присылать отчеты по Email"></v-checkbox>
                            </v-row>

                            <v-row class="ma-0 pa-2 text-center">
                                <v-btn small width="100" color="primary" outlined rounded style="color: white"
                                    @click="closeParametersReport()">
                                    Отмена
                                </v-btn>
                                <v-btn small width="200" class="ml-auto" :disabled="!parametersReport.trackers.length"
                                    color="primary " rounded style="color: white" @click="generationNewReport()">
                                    Сохранить расписание
                                </v-btn>
                            </v-row>
                        </v-card>
                    </div>
                </v-card>
            </v-slide-x-transition>
            <v-slide-x-transition>
                <v-card v-show="penaltyOptionsTrigger" class="absolute-box ma-3" width="960px" style="left: 320px">
                    <div class="h-100 overflow-hidden">
                        <v-expansion-panels>
                            <v-expansion-panel class="exp-panel">
                                <v-expansion-panel-header>
                                    Скоростные решения
                                </v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    1
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                            <v-expansion-panel>
                                <v-expansion-panel-header>
                                    Агрессивное вождение
                                </v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    2
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                            <v-expansion-panel>
                                <v-expansion-panel-header>
                                    Нарушение режима труда и отдыха
                                </v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    3
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </div>
                </v-card>
            </v-slide-x-transition>
            <v-row class="ma-0">
                <v-col>
                    <v-card>
                        <v-row class="h-100 ma-0">
                            <v-col class="pl-0 pt-0 pb-0 h-100 relative reports_view pr-0" style="max-width: 344px">
                                <v-card height="100%" width="100%" class="">
                                    <v-row class="ma-0">
                                        <v-col class="pa-0">
                                            <v-tabs v-model="tab" left>
                                                <v-tabs-slider></v-tabs-slider>
                                                <v-tab @click="tabChange" href="#map">
                                                    Карта
                                                    <v-icon>mdi-earth</v-icon>
                                                </v-tab>
                                                <v-tab @click="tabChange" href="#list">
                                                    Список
                                                    <v-icon>mdi-view-list</v-icon>
                                                </v-tab>
                                                <v-tab @click="tabChange" href="#team">
                                                    Команда
                                                    <v-icon>mdi-account-group</v-icon>
                                                </v-tab>
                                                <v-tab @click="tabChange" href="#time">
                                                    Время
                                                    <v-icon>mdi-clock-outline</v-icon>
                                                </v-tab>
                                                <v-tab @click="tabChange" href="#total">
                                                    Итоги
                                                    <v-icon>mdi-chart-bar</v-icon>
                                                </v-tab>
                                            </v-tabs>

                                            <v-card flat>
                                                <v-row class="ma-0">
                                                    <v-col class="px-2 py-1">
                                                        <div>
                                                            Статус:
                                                        </div>

                                                    </v-col>
                                                </v-row>
                                                <v-row class="ma-0">
                                                    <v-col>
                                                        <v-checkbox class="mt-0" color="#7b7f8b" v-model="checkbox1"
                                                            label="Не назначено"></v-checkbox>
                                                        <v-checkbox class="mt-0" color="#049cdb" v-model="checkbox2"
                                                            label="Назначено"></v-checkbox>
                                                        <v-checkbox class="mt-0" color="#ce93d8" v-model="checkbox3"
                                                            label="Прибыл на задание"></v-checkbox>
                                                        <v-checkbox class="mt-0" color="#66c011" v-model="checkbox4"
                                                            label="Выполнено"></v-checkbox>
                                                        <v-checkbox class="mt-0" color="#ffc40d" v-model="checkbox5"
                                                            label="С опазданием"></v-checkbox>
                                                        <v-checkbox class="mt-0" color="#de3930" v-model="checkbox6"
                                                            label="Просрочено"></v-checkbox>
                                                    </v-col>
                                                </v-row>
                                                <v-row
                                                    style="height: 44px; background-color: #aeb0ba; color: white; padding: 10px"
                                                    class="ma-0">
                                                    Водители
                                                </v-row>
                                                <v-row class="ma-0 employees-selection-tree-wrapper">
                                                    <div class="employees-selection-tree">
                                                        <v-treeview open-on-click selectable :items="employees" open-all
                                                            return-object>
                                                            <template v-slot:label="{ item }">
                                                                <div style="display: flex; flex-direction: column">
                                                                    <div>
                                                                        {{ item.name }}
                                                                    </div>
                                                                    <div>
                                                                        {{ item.subtitle }}
                                                                    </div>
                                                                </div>
                                                            </template>
                                                            <template v-slot:append="{ item, open }">
                                                                <v-icon v-if="!item.subtitle">
                                                                    {{ open ? 'mdi-chevron-down' : 'mdi-chevron-up' }}
                                                                </v-icon>
                                                            </template>
                                                            <template slot="prepend" slot-scope="{ item }">
                                                                <img :src="item.img" />
                                                            </template>
                                                        </v-treeview>
                                                    </div>
                                                </v-row>


                                            </v-card>
                                        </v-col>
                                    </v-row>
                                    <!-- test new -->
                                    <!--
                    <v-divider class="pb-1"></v-divider>
                    <v-progress-linear v-if="loadingListReports" indeterminate class="pt-1" color="primary "
                        style="width: 100%;"></v-progress-linear>
                    <v-row class="overflow-y-auto ma-0" style="height: calc( 100% - 90px)">
                        <v-list style="min-width: 100%">
                            <v-list-item-group v-model="selectedReport" color="primary">
                                <template v-for="(item , i) in listReports">

                                    <v-list-item :key="'report-' + i" :value="item" class="overflow-hidden px-4" dense
                                        two-line>
                                        <v-progress-linear v-if="loadNewReport === item.id" absolute
                                            color="primary lighten-4" height="100%"
                                            :style="{left: '-' + progressLoadNewReport + '%'}" style="width: 200%"
                                            value="100" striped>
                                        </v-progress-linear>
                                        <v-list-item-content class="pa-0" style="z-index: 3">
                                            <v-list-item-title>
                                                {{ item.title }}
                                            </v-list-item-title>
                                            <v-list-item-title>
                                                <v-icon class="mr-1">mdi-email-outline</v-icon>{{ item.periodicity }}
                                            </v-list-item-title>
                                            <v-list-item-subtitle v-if="loadNewReport !== item.id">
                                                Последний запуск {{ item.created | formatDateCreatedReport}}
                                            </v-list-item-subtitle>
                                        </v-list-item-content>
                                        <v-list-item-action>
                                            <div>
                                                <v-icon class="d-none pointer-on-hover list-item-edit__icon">
                                                    mdi-trash-can-outline</v-icon>
                                            </div>

                                        </v-list-item-action>

                                    </v-list-item>
                                    <v-divider v-if="i < 100" :key="'border_' + i"></v-divider>
                                </template>
                            </v-list-item-group>
                        </v-list>
                    </v-row>
                    -->
                                </v-card>
                            </v-col>
                            <v-col class="report_view h-100 show">
                                <v-tabs-items v-model="tab">
                                    <v-tab-item :key="1" value="map">
                                        <l-map v-if="mapToLeftTrue" ref="vehicles_map"
                                            style="min-height: 70vh; width:100%; position:relative; overflow: hidden"
                                            :zoom="zoom" :center="center" @ready="mapOnReady()">
                                            <l-tile-layer :url="url" />
                                            <l-control position="topleft">
                                                <div class="white control-fullscreen"
                                                    @click="openMapFullScreen=!openMapFullScreen">
                                                    <v-icon class="primary--text">mdi-fullscreen</v-icon>
                                                </div>
                                            </l-control>
                                        </l-map>
                                    </v-tab-item>
                                    <v-tab-item :key="2" value="list">
                                        <v-data-table v-if="mapToLeftTrue" group-by="executorName"
                                            :headers="surgeryInformationHeaders" :items="surgeryInformationDesserts"
                                            hide-default-footer class="transparent elevation-0" hide-default-header
                                            disable-pagination disable-sort :items-per-page="5">
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
                                                            class="text-center parent-header td-border-style"
                                                            :rowspan="h.children?1:2"
                                                            :colspan="h.children?h.children.length:1">
                                                            {{ h.text }}
                                                        </th>
                                                    </tr>
                                                    <tr>
                                                        <th v-for="(h1,i1) in getSubHeader(surgeryInformationHeaders)"
                                                            :key="i1" class="text-center child-header td-border-style">
                                                            {{ h1.text }}
                                                        </th>
                                                    </tr>
                                                </thead>
                                            </template>
                                            <template #item="props">
                                                <tr class="table-row">
                                                    <td v-for="(c,ci) in getRows(props.item)" :key="ci">
                                                        <div class="d-flex align-center" v-if="ci == 'status'">
                                                            <div class="status-indicator"
                                                                :style="{ 'background-color': `${statusBackground(c)}`}">
                                                            </div>
                                                            <div>{{ c }}</div>
                                                        </div>
                                                        <div v-else>
                                                            {{ c }}
                                                        </div>
                                                    </td>
                                                </tr>
                                            </template>
                                        </v-data-table>
                                    </v-tab-item>
                                    <v-tab-item :key="3" value="team" style="height: 100%">
                                        <div style="background-color: #aeb0ba; width: 250px;">
                                            <div style="width: fit-content; margin: auto; padding: 5px">
                                                <span style="color: white; font-size: 1rem">Ожидают
                                                    назначения</span>
                                                <v-icon class="ml-1 mr-1" color="white">mdi-plus-circle-outline</v-icon>
                                            </div>
                                        </div>
                                        <div
                                            style="height: 70vh; width: 250px;     background-image: -webkit-gradient(linear, 0 100%, 100% 0, color-stop(0.25, #fafafa), color-stop(0.25, transparent), color-stop(0.5, transparent), color-stop(0.5, #fafafa), color-stop(0.75, #fafafa), color-stop(0.75, transparent), to(transparent)); background-image: linear-gradient(45deg, #fafafa 25%,rgba(0,0,0,0) 25%,rgba(0,0,0,0) 50%,#fafafa 50%,#fafafa 75%,rgba(0,0,0,0) 75%,rgba(0,0,0,0));background-size: 30px 30px;">
                                        </div>
                                    </v-tab-item>
                                    <v-tab-item :key="4" value="time">
                                        <g-gantt-chart :chart-start="chartStart" :chart-end="chartEnd" :grid="grid"
                                            :hide-timeaxis="hideTimeaxis" :push-on-overlap="pushOnOverlap"
                                            :highlighted-hours="highlightedHours" :row-label-width="`${rowLabelWidth}%`"
                                            :row-height="rowHeight" :theme="selectedTheme"
                                            @contextmenu-bar="onContextmenuBar($event)"
                                            @dragend-bar="stoppedDraggingBar($event)">
                                            <g-gantt-row v-for="row in rowList" :key="row.title" :label="row.label"
                                                :bars="row.barList" :highlight-on-hover="highlightOnHover"
                                                bar-start="myStart" bar-end="myEnd">
                                                <template #bar-label="{ bar }">
                                                    <img v-if="bar.image" :src="require(`@/assets/${bar.image}`)"
                                                        height="20" width="20" class="mr-1" />
                                                    <span>{{ bar.label }}</span>
                                                </template>
                                            </g-gantt-row>
                                        </g-gantt-chart>
                                    </v-tab-item>
                                    <v-tab-item :key="5" value="total">
                                        <ECharts auto-resize></ECharts>

                                    </v-tab-item>
                                </v-tabs-items>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>

        </v-container>

    </div>
</template>

<script>
    import moment from "moment";
    import ECharts from '@/components/EChartAnalytics'
    import MenuDateTimePickerRange from "@/components/EcoDrivingDateTimePickerRange";
    import NewTaskDateTimePickerRange from "@/components/EcoDrivingDateTimePickerRange";
    import ReportsService from "@/services/timeTableReports";
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
            LControl,
            MenuDateTimePickerRange,
            ECharts,
            NewTaskDateTimePickerRange
        },
        name: "Dispatcher",

        data() {
            return {
                defaultSelected: {
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
                newSingleTask: false,
                newRouteTask: false,
                dialogNewTask: false,
                search: '',
                checkbox1: true,
                checkbox2: true,
                checkbox3: true,
                checkbox4: true,
                checkbox5: true,
                checkbox6: true,
                penaltyOptionsTrigger: false,
                tab: "subscribe",
                employees: [{
                        id: 1,
                        name: 'Без отдела',
                        children: [{
                                id: 2,
                                name: 'Соломатин Иван',
                                subtitle: 'Ford',
                                img: 'https://i1.wp.com/s-knights.co.uk/wp-content/uploads/2016/04/avatar-small.jpg?resize=30%2C30'
                            },
                            {
                                id: 3,
                                subtitle: 'Ford',
                                name: 'Соломатин Николай',
                                img: 'https://i1.wp.com/s-knights.co.uk/wp-content/uploads/2016/04/avatar-small.jpg?resize=30%2C30'
                            },
                        ],
                    },
                    {
                        id: 5,
                        name: 'Отдел продаж',
                        children: [{
                                id: 6,
                                subtitle: 'Ford',
                                name: 'Глызина София',
                                img: 'https://i1.wp.com/s-knights.co.uk/wp-content/uploads/2016/04/avatar-small.jpg?resize=30%2C30'
                            },
                            {
                                id: 10,
                                subtitle: 'Ford',
                                name: 'Глызина Настя',
                                img: 'https://i1.wp.com/s-knights.co.uk/wp-content/uploads/2016/04/avatar-small.jpg?resize=30%2C30'
                            },
                        ],
                    },
                ],
                selectedNewReport: null,
                selectedNewReportPre: {
                    "id": 1,
                    "name": "Параметра отчета",
                    "description": "Подробная информация о всех поездках",
                    "title": "Качество вождения",
                    "plugin": {
                        "hide_empty_tabs": true,
                        "show_seconds": false,
                        "include_summary_sheet_only": false,
                        "split": true,
                        "show_idle_duration": false,
                        "show_coordinates": false,
                        "filter": true,
                        "group_by_driver": false
                    }
                },
                timeSelect: ["00: 00", "01: 00", "02: 00", "03: 00", "04: 00", "05: 00", "06: 00", "07: 00",
                    "08: 00", "09: 00", "10: 00", "11: 00", "12: 00", "13: 00", "14: 00", "15: 00", "16: 00",
                    "17: 00", "18: 00", "19: 00", "20: 00", "21: 00", "22: 00", "23: 00"

                ],
                periodSelect: ["неделю", "месяц", "день"],
                listReports: [],
                searchReport: '',
                selectedReport: null,
                // selectedNewReport: null,
                selectedParamsReport: null,
                loadingListReports: false,
                openAddNewReport: false,
                menuDateRangeFilter: false,
                loadNewReport: null,
                progressLoadNewReport: 0,
                nameReport: '',
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
                arrayWeekDays: [1, 2, 3, 4, 5, 6, 0].map(i => moment().day(i)),
                minTimeControl: moment().hours(0).minutes(0).seconds(0),
                maxTimeControl: moment().hours(23).minutes(59).seconds(59),
                groups_catalog_reports: [{
                    id: 1,
                    name: 'Поездки',
                    reports: [{
                        id: 1,
                        name: 'Поездки',
                        description: 'Подробная информация о всех поездках',
                        title: 'Отчёт по поездкам',
                        plugin: {
                            hide_empty_tabs: true,
                            show_seconds: false,
                            include_summary_sheet_only: false,
                            split: true,
                            show_idle_duration: false,
                            show_coordinates: false,
                            filter: true,
                            group_by_driver: false,
                        }
                    }, ]
                }, ],
                grouping_devices: [{
                        id: 1,
                        name: 'Группа 1',
                        color: '#f54040',
                        devices: [{
                                id: 201,
                                name: '201 Машина',
                                group_name: 'Группа 1',
                                group_id: 1,
                                danger_driving: false,
                                radius_lbs_error: 3,
                                unauth_movement: true,
                                start_auth_move: 1,
                                radius_auth_move: 100,
                                proxy_numbers: ['111', '222', '333'],
                                source_gps_data_id: 1,
                                source_gps_data: 'GPS',
                                odometer: 312404,
                                units_odometer_id: 1,
                                correction_gps: 0,
                                update_gps_meter: 100,
                                update_gps_sec: 60,
                                fix_rotation_deg: 15,
                                motionless_sec: 180,
                                detected_motion_id: 1,
                                detected_motion: 'по GPS',
                                sleep_in_motionless: false,
                                fix_rotation: true,
                                ignition_id: 1,
                                ignition: 'Наприжение бортовой сети',
                                ignition_min_v: 13.00,
                                ignition_max_v: 30.00,
                                group_work_status: 'Не назначен',
                                group_work_status_id: 1,
                                fix_parking_minutes: 1,
                                min_speed_for_fix_parking: 3,
                                fix_parking_ignition: false,
                                fix_parking_detected_motion: true,
                                sensors: [{
                                        id: 8,
                                        name: 'Уровень топлива',
                                        sensor_type_id: 1,
                                        sensor_type_name: 'Датчик топлива',
                                        pin: 1
                                    },
                                    {
                                        id: 5,
                                        name: 'Автосигнализация',
                                        sensor_type_id: 2,
                                        sensor_type_name: 'Автосигнализация',
                                        pin: 4
                                    },
                                ],
                                tags: [{
                                        id: 1,
                                        text: 'tag 1'
                                    },
                                    {
                                        id: 2,
                                        text: 'tag 2'
                                    },
                                    {
                                        id: 3,
                                        text: 'tag 3'
                                    },
                                    {
                                        id: 4,
                                        text: 'tag 4'
                                    },
                                ]
                            },
                            {
                                id: 202,
                                name: '202 Машина',
                                group_name: 'Группа 1',
                                group_id: 1,
                                danger_driving: true,
                                radius_lbs_error: 2,
                                unauth_movement: true,
                                start_auth_move: 1,
                                radius_auth_move: 100,
                                proxy_numbers: [],
                                source_gps_data_id: 1,
                                odometer: 312404,
                                source_gps_data: 'GPS',
                                units_odometer_id: 1,
                                correction_gps: 0,
                                update_gps_meter: 100,
                                update_gps_sec: 60,
                                fix_rotation_deg: 15,
                                motionless_sec: 180,
                                detected_motion_id: 1,
                                detected_motion: 'по GPS',
                                sleep_in_motionless: false,
                                fix_rotation: true,
                                ignition_id: 1,
                                ignition: 'Наприжение бортовой сети',
                                ignition_min_v: 13.00,
                                ignition_max_v: 30.00,
                                group_work_status: 'Не назначен',
                                group_work_status_id: 1,
                                fix_parking_minutes: 1,
                                min_speed_for_fix_parking: 3,
                                fix_parking_ignition: false,
                                fix_parking_detected_motion: true,
                                sensors: [{
                                    id: 1,
                                    name: 'Уровень топлива',
                                    sensor_type_id: 1,
                                    sensor_type_name: 'Датчик топлива',
                                    pin: 1
                                }, ],
                                tags: [{
                                        id: 1,
                                        text: 'tag 1'
                                    },
                                    {
                                        id: 4,
                                        text: 'tag 4'
                                    },
                                ]
                            },
                            {
                                id: 203,
                                name: '203 Машина',
                                group_name: 'Группа 1',
                                group_id: 1,
                                danger_driving: false,
                                radius_lbs_error: 3,
                                unauth_movement: true,
                                start_auth_move: 1,
                                radius_auth_move: 100,
                                proxy_numbers: [],
                                source_gps_data_id: 1,
                                source_gps_data: 'GPS',
                                odometer: 312404,
                                units_odometer_id: 1,
                                correction_gps: 0,
                                update_gps_meter: 100,
                                update_gps_sec: 60,
                                fix_rotation_deg: 15,
                                motionless_sec: 180,
                                detected_motion_id: 1,
                                detected_motion: 'по GPS',
                                sleep_in_motionless: false,
                                fix_rotation: true,
                                ignition_id: 1,
                                ignition: 'Наприжение бортовой сети',
                                ignition_min_v: 13.00,
                                ignition_max_v: 30.00,
                                group_work_status: 'Не назначен',
                                group_work_status_id: 1,
                                fix_parking_minutes: 1,
                                min_speed_for_fix_parking: 3,
                                fix_parking_ignition: false,
                                fix_parking_detected_motion: true,
                                sensors: [{
                                        id: 1,
                                        name: 'Уровень топлива',
                                        sensor_type_id: 1,
                                        sensor_type_name: 'Датчик топлива',
                                        pin: 1
                                    },
                                    {
                                        id: 2,
                                        name: 'Автосигнализация',
                                        sensor_type_id: 2,
                                        sensor_type_name: 'Автосигнализация',
                                        pin: 2
                                    },
                                ],
                                tags: [{
                                        id: 3,
                                        text: 'tag 3'
                                    },
                                    {
                                        id: 4,
                                        text: 'tag 4'
                                    },
                                ]
                            },
                            {
                                id: 204,
                                name: '204 Машина',
                                group_name: 'Группа 1',
                                group_id: 1,
                                danger_driving: true,
                                radius_lbs_error: 4,
                                unauth_movement: true,
                                start_auth_move: 1,
                                radius_auth_move: 100,
                                proxy_numbers: [],
                                source_gps_data_id: 1,
                                source_gps_data: 'GPS',
                                odometer: 312404,
                                units_odometer_id: 1,
                                correction_gps: 0,
                                update_gps_meter: 100,
                                update_gps_sec: 60,
                                fix_rotation_deg: 15,
                                motionless_sec: 180,
                                detected_motion_id: 1,
                                detected_motion: 'по GPS',
                                sleep_in_motionless: false,
                                fix_rotation: true,
                                ignition_id: 1,
                                ignition: 'Наприжение бортовой сети',
                                ignition_min_v: 13.00,
                                ignition_max_v: 30.00,
                                group_work_status: 'Не назначен',
                                group_work_status_id: 1,
                                fix_parking_minutes: 1,
                                min_speed_for_fix_parking: 3,
                                fix_parking_ignition: false,
                                fix_parking_detected_motion: true,
                                sensors: [{
                                    id: 3,
                                    name: 'Автосигнализация',
                                    sensor_type_id: 2,
                                    sensor_type_name: 'Автосигнализация',
                                    pin: 1
                                }, ],
                                tags: [{
                                        id: 1,
                                        text: 'tag 1'
                                    },
                                    {
                                        id: 2,
                                        text: 'tag 2'
                                    },
                                    {
                                        id: 3,
                                        text: 'tag 3'
                                    },
                                    {
                                        id: 4,
                                        text: 'tag 4'
                                    },
                                ]
                            },
                            {
                                id: 205,
                                name: '205 Машина',
                                group_name: 'Группа 1',
                                group_id: 1,
                                danger_driving: false,
                                radius_lbs_error: 1,
                                unauth_movement: true,
                                start_auth_move: 1,
                                radius_auth_move: 100,
                                proxy_numbers: [],
                                source_gps_data_id: 1,
                                odometer: 312404,
                                units_odometer_id: 1,
                                correction_gps: 0,
                                update_gps_meter: 100,
                                update_gps_sec: 60,
                                fix_rotation_deg: 15,
                                motionless_sec: 180,
                                detected_motion_id: 1,
                                detected_motion: 'по GPS',
                                sleep_in_motionless: false,
                                fix_rotation: true,
                                ignition_id: 1,
                                ignition: 'Наприжение бортовой сети',
                                ignition_min_v: 13.00,
                                ignition_max_v: 30.00,
                                group_work_status: 'Не назначен',
                                group_work_status_id: 1,
                                fix_parking_minutes: 1,
                                min_speed_for_fix_parking: 3,
                                fix_parking_ignition: false,
                                fix_parking_detected_motion: true,
                                sensors: [],
                                tags: [{
                                    id: 4,
                                    text: 'tag 4'
                                }, ]
                            },
                        ],
                    },
                    {
                        id: 2,
                        name: 'Группа 2',
                        color: '#4097f5',
                        devices: [{
                                id: 301,
                                name: '301 Машина',
                            },
                            {
                                id: 302,
                                name: '302 Машина',
                            },
                        ],
                    },
                    {
                        id: 3,
                        name: 'Группа 3',
                        color: '#aaf540',
                        devices: [{
                                id: 401,
                                name: '401 Машина',
                            },
                            {
                                id: 402,
                                name: '402 Машина',
                            },
                            {
                                id: 403,
                                name: '403 Машина',
                            },
                        ],
                    },
                    {
                        id: 4,
                        name: 'Группа 4',
                        color: '#d440f5',
                        devices: [

                        ]
                    }
                ],
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
                    label: "Не назначен",
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
        filters: {
            formatDateCreatedReport(value) {
                if (!value) return value
                return moment(value * 1000).format('DD.MM.YYYY в HH:mm')
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
        watch: {
            selectedNewReport(val) {
                return val ? this.openParametersNewReport() : '';
            },
        },
        methods: {
            addNew() {
                this.dialogNewTask = !this.dialogNewTask
            },
            tabChange() {
                this.map.invalidateSize()
            },
            penaltyOptionsShow() {
                this.penaltyOptionsTrigger = !this.penaltyOptionsTrigger
            },
            fixMe() {
                this.selectedNewReport = this.selectedNewReportPre
            },
            generationNewReport() {
                this.openAddNewReport = false;
                this.selectedNewReport = null;
                this.selectedParamsReport = null;
                this.loadNewReport = Math.random();
                this.listReports.push({
                    "created": moment().unix(),
                    "title": this.parametersReport.title,
                    "id": this.loadNewReport,
                    "from": moment(this.parametersReport.from).unix(),
                    "to": moment(this.parametersReport.to).unix(),
                    "parameters": {
                        "trackers": this.parametersReport.trackers,
                        "plugins": [this.parametersReport.plugin],
                    },
                    "time_filter": {
                        "from": moment(this.parametersReport.time_filter.from).unix(),
                        "to": moment(this.parametersReport.time_filter.to).unix(),
                        "weekdays": this.parametersReport.time_filter.weekdays,
                    }
                });
                let interval_id = setInterval(() => {
                    if (this.progressLoadNewReport >= 100) {
                        this.progressLoadNewReport = 0
                    }
                    this.progressLoadNewReport += 10
                }, 300);
                ReportsService.createReport(this.parametersReport).then(() => {
                    this.loadNewReport = false
                    clearInterval(interval_id);
                })
            },
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
            closeParametersReport() {
                this.selectedParamsReport = null;
                this.selectedNewReport = null;
            },
            setControlRangeTimeDay() {
                this.parametersReport.time_filter.from = moment().hours(9).minutes(0).seconds(0).toDate();
                this.parametersReport.time_filter.to = moment().hours(18).minutes(0).seconds(0).toDate();
            },
            setControlRangeTimeNight() {
                this.parametersReport.time_filter.from = moment().hours(0).minutes(0).seconds(0).toDate();
                this.parametersReport.time_filter.to = moment().hours(6).minutes(0).seconds(0).toDate();
            },
            setControlRangeTimeDefault() {
                this.parametersReport.time_filter.from = moment().hours(0).minutes(0).seconds(0).toDate();
                this.parametersReport.time_filter.to = moment().hours(23).minutes(59).seconds(0).toDate();
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
        created() {
            this.loadingListReports = true;
            ReportsService.getListReports().then((data) => {
                this.listReports = data;
                this.loadingListReports = false;
            })
        },
        computed: {
            computeControlTimeTitle: {
                get() {
                    return "Время контроля: " + moment(this.parametersReport.time_filter.from).format('HH:mm') +
                        " - " +
                        moment(this.parametersReport.time_filter.to).format('HH:mm')
                }
            },
            computedControlTimeRange: {
                get() {
                    return [moment(this.parametersReport.time_filter.from).unix(), moment(this.parametersReport
                            .time_filter.to)
                        .unix()
                    ]
                },
                set(range) {
                    this.parametersReport.time_filter.from = new Date(range[0] * 1000)
                    this.parametersReport.time_filter.to = new Date(range[1] * 1000)
                    return range
                },
            },
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
            computedNewTaskDateRange: {
                get() {
                    return [this.parametersReport.from, this.parametersReport.to]
                },
                set(val) {
                    this.parametersReport.from = val[0];
                    this.parametersReport.to = val[1]
                    return val
                }
            },
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
                        this.$el.querySelector('.v-data-table__wrapper').style.height = this.rtbDividerPos -
                        80 + 'px' :
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
                        this.$el.querySelector('.v-data-table__wrapper').style.height = this.rtbDividerPos -
                        80 + 'px' :
                        ''
                })
                return {
                    width: this.lrDividerPos > -1 ? (this.lrDividerPos + 2) + 'px' : ''
                };
            },
            ltbDividerStyles: function () {
                this.$nextTick(() => {
                    this.rtbDividerPos > -1 ?
                        this.$el.querySelector('.v-data-table__wrapper').style.height = this.rtbDividerPos -
                        80 + 'px' :
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
                        this.$el.querySelector('.v-data-table__wrapper').style.height = this.rtbDividerPos -
                        80 + 'px' :
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
                        this.$el.querySelector('.v-data-table__wrapper').style.height = this.rtbDividerPos -
                        80 + 'px' :
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
                        this.$el.querySelector('.v-data-table__wrapper').style.height = this.rtbDividerPos -
                        80 + 'px' :
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
                        this.$el.querySelector('.v-data-table__wrapper').style.height = this.rtbDividerPos -
                        80 + 'px' :
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

    ::v-deep .v-tab {
        font-size: 10px;
        display: flex;
        flex-direction: column;
        min-width: 0 !important;
        padding: 0 10px !important;
    }

    ::v-deep .v-slide-group__content {
        justify-content: center;
    }

    ::v-deep .employees-selection-tree .v-treeview-node__toggle,
    ::v-deep .employees-selection-tree .v-treeview-node__level {
        display: none
    }

    ::v-deep .report_view {
        padding: 0
    }

    ::v-deep .v-dialog--active .new-task {
        height: 250px;
        overflow: hidden;
        background-color: #505a64 !important;
        color: white
    }



    ::v-deep .new-single-task .col,
    ::v-deep .new-single-task {
        /* height: 650px; */
        background-color: white !important;
    }
</style>