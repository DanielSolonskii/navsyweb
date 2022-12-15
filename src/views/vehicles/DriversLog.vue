<template>
    <v-container fluid class="pa-0 d-flex flex-column h-100 employees-container">
        <v-overlay absolute :value="openMapFullScreen" class="overlay-map-fullscreen"
            :class="{'active': openMapFullScreen}">
            <v-card light width="100%" height="100%" rounded="0">
                <l-map style="height: calc(100% - 50px); width:100%; position:relative" ref="vehicles_map_fullscreen"
                    :zoom="zoom" :center="center" @ready="mapFullScreenOnReady">
                    <l-tile-layer :url="url" />
                </l-map>
                <v-card-text class="pa-2">
                    <v-btn text class="float-right" color="indigo" @click="openMapFullScreen=false">
                        Закрыть
                    </v-btn>
                </v-card-text>
            </v-card>
        </v-overlay>
        <div class="h-100">
            <v-container fluid class="h-100 pa-2">
                <v-row class="ma-0 h-100">
                    <v-col class="vehicles-container pa-0 h-100" :class="{'active': openVehicleSidebar}">
                        <v-row class="ma-0 d-flex" style="max-width: 98%; flex-wrap: nowrap; height: 120px"
                            align-center>
                            <v-col cols="1" style="max-width: 80px">
                                <v-btn v-model="addCar" fab large color="primary"
                                    @click="$router.push('create-new-task')">
                                    <v-icon>
                                        mdi-plus
                                    </v-icon>
                                </v-btn>
                            </v-col>
                            <v-col cols="10" class="ml-4 pb-0">
                                <v-row justify="space-between" align="center" class="ma-0 mt-2">
                                    <div class="d-flex align-center justify-space-between"
                                        style="width: 100%; margin-left: auto;">
                                        <div style="width: 100%" class="pr-4">
                                            <v-text-field single-line :value="this.dateTimeSelected"
                                                label="Дата - время" prepend-icon="mdi-calendar"
                                                @click.stop="toggleCalendar=true">
                                            </v-text-field>
                                        </div>
                                        <div class="d-flex align-center justify-space-between pr-4" style="width: 100%">

                                            <v-text-field @click="active = true" single-line label="Сотрудник"
                                                prepend-icon="mdi-map-marker">
                                            </v-text-field>
                                            <v-icon>mdi-close</v-icon>
                                        </div>
                                        <template>
                                            <v-card v-if="active" v-click-outside="onClickOutside"
                                                class="mx-auto employees-panel">
                                                <div class="history-widget pa-3 elevation-10">
                                                    <div>
                                                        <v-tabs v-model="tab" centered>
                                                            <v-tabs-slider></v-tabs-slider>
                                                            <v-tab href="#tab-1">
                                                                Все
                                                            </v-tab>
                                                            <v-tab href="#tab-2">
                                                                Выбранные
                                                            </v-tab>
                                                        </v-tabs>
                                                        <v-tabs-items v-model="tab">
                                                            <v-tab-item key="0" value="tab-1">
                                                                <div class="d-flex align-center"
                                                                    style="max-width: 80%; margin: auto">
                                                                    <v-icon class="mr-2">mdi-magnify</v-icon>
                                                                    <v-text-field label="Поиск" hide-details single-line
                                                                        class="mt-0 pt-0">
                                                                    </v-text-field>
                                                                    <v-checkbox class="ml-2 pt-0"></v-checkbox>
                                                                </div>
                                                                <div class="d-flex align-center"
                                                                    style="max-width: 300px; margin: auto">
                                                                    <v-avatar size="36px" class="mr-2" color="grey"
                                                                        style="transform: translateX(-10px)">
                                                                        <span class="white--text">ИН</span>
                                                                    </v-avatar>
                                                                    <span>Исполнитель не назначен</span>
                                                                    <v-checkbox style="margin-left: auto"></v-checkbox>
                                                                </div>
                                                                <template v-if="groupNames.success">
                                                                    <div v-for="list in this.groups"
                                                                        :key="list.individualId">
                                                                        <v-expansion-panels>
                                                                            <v-expansion-panel hide-actions>
                                                                                <v-expansion-panel-header
                                                                                    class="border-radius-zero filtred-list-label pl-4 pb-2 pt-2 expansion-panel-header-closed emloyee-widget-header">
                                                                                    <template v-slot:actions>
                                                                                        <v-icon
                                                                                            class="icon-in-expansion-header">
                                                                                            $expand
                                                                                        </v-icon>
                                                                                    </template>
                                                                                    <span
                                                                                        class="header-title text-uppercase">{{ list.title }}</span>
                                                                                    <v-checkbox
                                                                                        :indeterminate="list.indeterminate"
                                                                                        class="mt-0 expansion-header-checkbox"
                                                                                        color="info" hide-details
                                                                                        v-model="list.checked"
                                                                                        @click.stop="toggleCheckGroup(list)">
                                                                                    </v-checkbox>
                                                                                </v-expansion-panel-header>
                                                                                <v-expansion-panel-content>
                                                                                    <v-list class="pt-0">
                                                                                        <v-list-item-group
                                                                                            v-model="model">
                                                                                            <div v-for="item in list.markers"
                                                                                                :key="item.id"
                                                                                                class="bottom-light-box-shadow pt-1px">
                                                                                                <v-list-item
                                                                                                    class="expansion-panel-tracker-item pr-0 align-center">
                                                                                                    <template>
                                                                                                        <v-avatar
                                                                                                            size="36px"
                                                                                                            class="mr-2">
                                                                                                            <img src="https://cdn.vuetifyjs.com/images/john.jpg"
                                                                                                                alt="John">
                                                                                                        </v-avatar>
                                                                                                        <v-list-item-content
                                                                                                            class="pa-0 flex-column">
                                                                                                            <v-list-item-title>
                                                                                                                {{ item.label }}
                                                                                                            </v-list-item-title>
                                                                                                            <v-list-item-subtitle
                                                                                                                style="align-self: start">
                                                                                                                {{ item.label }}
                                                                                                            </v-list-item-subtitle>
                                                                                                        </v-list-item-content>
                                                                                                        <v-list-item-icon
                                                                                                            class="mr-0">
                                                                                                            <v-checkbox
                                                                                                                v-model="item.checked"
                                                                                                                class="mt-0"
                                                                                                                color="info"
                                                                                                                hide-details>
                                                                                                            </v-checkbox>
                                                                                                        </v-list-item-icon>
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
                                                            </v-tab-item>
                                                            <v-tab-item key="1" value="tab-2">

                                                            </v-tab-item>
                                                        </v-tabs-items>
                                                    </div>
                                                </div>
                                            </v-card>
                                        </template>
                                        <div style="width: 100%; transform: translateY(-6px)" class="pr-4 mt-0">
                                            <div>
                                                <v-btn outlined color="primary">Показать</v-btn>
                                            </div>
                                            <!--
                                            <v-select single-line prepend-icon="mdi-checkbox-marked" hide-details
                                                v-model="selectedStatuses" :items="employeeStatus" label="Статус" dense
                                                clearable chips multiple @change="filterTableByStatus"
                                                class="mt-0 select-statuses">
                                                <template v-slot:selection="{ item, index }">
                                                    <span class="mr-2" v-if="index === 0">
                                                        ({{ selectedStatuses.length }}
                                                        <span v-if="selectedStatuses.length === 1">статус)</span>
                                                        <span
                                                            v-else-if="selectedStatuses.length > 1 & selectedStatuses.length < 5">статуса)</span>
                                                        <span v-else>статусов)</span>
                                                    </span>
                                                    <v-icon class="list-state-marker"
                                                        :style="{ 'color': `rgb(${item.color})`}">
                                                        mdi-circle
                                                    </v-icon>
                                                </template>
                                                <template v-slot:item="{ active, item, attrs, on }">
                                                    <v-list-item v-on="on" v-bind="attrs" #default="{ active }">
                                                        <v-list-item-content class="status-list">
                                                            <v-list-item-title>
                                                                <v-row no-gutters align="center">
                                                                    <v-icon class="list-state-marker mr-3"
                                                                        :style="{ 'color': `rgb(${item.color})`}">
                                                                        mdi-circle
                                                                    </v-icon>
                                                                    <span>{{ item.text }}</span>
                                                                </v-row>
                                                            </v-list-item-title>
                                                        </v-list-item-content>
                                                        <v-list-item-action class="mr-1">
                                                            <v-checkbox :input-value="active"></v-checkbox>
                                                        </v-list-item-action>
                                                    </v-list-item>
                                                </template>
                                            </v-select>
                                            -->
                                            <!-- test -->
                                        </div>
                                    </div>
                                    <!--
                                    <v-col class="wrap-tgl-sidebar" :class="{'active': openVehicleSidebar}">
                                        <v-btn absolute right top icon small class="mt-2"
                                            @click="openVehicleSidebar=!openVehicleSidebar">
                                            <v-icon size="18" class="tgl-sidebar"
                                                :class="{'active': openVehicleSidebar}">
                                                mdi-arrow-collapse-left
                                            </v-icon>

                                        </v-btn>
                                    </v-col>
                                    -->
                                </v-row>
                            </v-col>
                        </v-row>
                        <!-- <v-card fluid class="pa-0 mt-0 hey" style="overflow: hidden"> -->
                        
                        <v-card fluid class="pa-0 mt-0 hey vehicles-cont get_over"
                            style="height: calc(100vh - 160px); overflow: hidden; display: flex">
                            <div class="pa-0 h-100 d-none" style="max-width: 400px; height: 90%;"
                                :class="{'d-block': openVehicleSidebar}">
                                <v-row justify="space-between" align="center" class="ma-0" style="height: 116px">
                                    <div class="text-body-1 px-6 font-weight-medium">
                                        Информация о задании
                                    </div>
                                </v-row>
                                <v-card class="pa-0 ml-4"
                                    style="height: calc(100vh - 160px); width: 400px; overflow: hidden">
                                    <div class="pa-4" v-if="itemToShowInformation == null">
                                        <h4 class="select-task-text">Выберите задание для просмотра его
                                            параметров</h4>
                                    </div>
                                    <template v-else>
                                        <div class="pa-0 ma-0 left-panel-styling">
                                            <div class="pa-4">
                                                <v-list-item-subtitle>Сотрудник</v-list-item-subtitle>
                                                <h4>{{ this.itemToShowInformation.name }}</h4>
                                            </div>
                                            <v-divider></v-divider>
                                            <div class="pa-4">
                                                <v-list-item-subtitle>Название</v-list-item-subtitle>
                                                <h4>{{ this.itemToShowInformation.task_name }}</h4>
                                            </div>
                                            <v-divider></v-divider>
                                            <div class="pa-4">
                                                <v-list-item-subtitle>Адрес</v-list-item-subtitle>
                                                <h4>{{ this.itemToShowInformation.address_tasks }}</h4>
                                            </div>
                                            <v-divider></v-divider>
                                            <div class="pa-4">
                                                <v-list-item-subtitle>Описание</v-list-item-subtitle>
                                                <h4>{{ this.itemToShowInformation.description }}</h4>
                                            </div>
                                            <v-divider></v-divider>
                                            <div class="pa-4">
                                                <v-list-item-subtitle>Адрес</v-list-item-subtitle>
                                                <h4>{{ this.itemToShowInformation.address_tasks }}</h4>
                                            </div>
                                            <v-divider></v-divider>
                                            <div class="pa-4">
                                                <v-list-item-subtitle>Время начала визита</v-list-item-subtitle>
                                                <div class="d-flex justify-space-between mb-1">
                                                    <div class="d-flex align-center">
                                                        <v-icon class="mr-2">
                                                            mdi-calendar
                                                        </v-icon>
                                                        <div>
                                                            <p style="white-space: nowrap; font-weight: bold"
                                                                class="mb-0">
                                                                {{ this.itemToShowformatTimestamp(this.itemToShowInformation.start).date }}
                                                                {{ this.itemToShowformatTimestamp(this.itemToShowInformation.start).month }}
                                                            </p>
                                                            <span>{{ this.itemToShowformatTimestamp(this.itemToShowInformation.start).year }}</span>
                                                        </div>
                                                    </div>
                                                    <div class="d-flex align-center">
                                                        <v-icon class="mr-1">mdi-clock-outline</v-icon>
                                                        <p class="mt-3" style=" font-weight: bold">
                                                            {{ this.itemToShowformatTimestamp(this.itemToShowInformation.start).hoursMinutes }}
                                                        </p>
                                                    </div>
                                                    <div class="d-flex align-center">
                                                        <v-icon class="mr-1">mdi-timelapse</v-icon>
                                                        <p class="mt-3" style="white-space: nowrap;  font-weight: bold">
                                                            {{ this.calcInterval(this.itemToShowInformation.start, this.itemToShowInformation.finish).minutes }}
                                                            минуты
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <v-divider></v-divider>
                                            <div class="pa-4">
                                                <v-list-item-subtitle>Идентификатор заказа</v-list-item-subtitle>
                                                <h4>{{ this.itemToShowInformation.id }}</h4>
                                            </div>
                                            <v-divider></v-divider>

                                            <div class="pa-4">
                                                <v-list-item-subtitle>Форма</v-list-item-subtitle>
                                                <h4>{{ this.itemToShowInformation.form }}</h4>
                                            </div>

                                        </div>
                                    </template>
                                </v-card>
                            </div>
                            <div style="width: 50%">
                                <v-row class="ma-0 pt-3 pb-3" align="center">
                                    <v-col class="wrap-tgl-sidebar" :class="{'active': openVehicleSidebar}">
                                        <v-btn absolute right top icon small class="mt-2"
                                            @click="openVehicleSidebar=!openVehicleSidebar">
                                            <v-icon size="18" class="tgl-sidebar"
                                                :class="{'active': openVehicleSidebar}">
                                                mdi-arrow-collapse-left
                                            </v-icon>

                                        </v-btn>
                                    </v-col>
                                    <v-col style="max-width: 250px" class="py-1">
                                        <span class="text-body-2 grey--text text--darken-1">
                                            <h3>Журнал</h3> Группировать по:
                                        </span>
                                    </v-col>
                                    <v-col class="py-1" style="max-width: 200px">
                                        <v-select @change="catchGroupName($event)" v-model="tableGroup" dense
                                            single-line :items="groupsTable" hide-details class="select-group ma-0">
                                        </v-select>
                                    </v-col>
                                    <v-col class="py-1"></v-col>
                                    <v-col class="py-1 text-center d-flex align-center" cols="5"
                                        style="display: flex; justify-content: ">
                                        <div>
                                            <v-menu :close-on-content-click="false" max-height="300px"
                                                :nudge-width="200" offset-x>
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
                                                        <v-list-item-group multiple color="indigo">
                                                            <v-list-item v-for="item in computedHeadersCog"
                                                                :key="item.value" :value="item.value" dense>
                                                                <template>
                                                                    <v-list-item-action class="ma-1">
                                                                        <v-checkbox input-value="true"
                                                                            @click="toggleColumn(item)" color="indigo">
                                                                        </v-checkbox>
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
                                        </div>
                                    </v-col>
                                </v-row>
                                <v-card class="v-table__overflow">
                                    <v-data-table @click:row="rowClick" ref="table" :group-by="tableGroup" fixed-header
                                        class="tasks-scheduled-table text-center" :hide-default-footer="true"
                                        v-model="selected" show-select :single-select="singleSelect" item-key="id"
                                        :headers="computedHeaders" :items="filterTableByStatus" :search="search">

                                        <template v-slot:group.header="{group, toggle, isOpen}">
                                            <td class="fix-height">
                                                <v-checkbox ref="checkGroup" color="primary"
                                                    @click.stop="selectGroup(group)" @change="checkSelectGroup">
                                                </v-checkbox>
                                            </td>
                                            <td :colspan="headers.length">
                                                <div class="d-flex justify-space-between mt-0 header-group-cursor"
                                                    @click="toggle">
                                                    <h3 class="white-space-no-wrap" v-if="group === 0">
                                                        Не
                                                        назначено</h3>
                                                    <h3 class="white-space-no-wrap" v-else-if="group === 1">
                                                        Назначено</h3>
                                                    <h3 class="white-space-no-wrap" v-else-if="group === 2">
                                                        Прибыл на задание</h3>
                                                    <h3 class="white-space-no-wrap" v-else-if="group === 3">
                                                        Выполнено</h3>
                                                    <h3 class="white-space-no-wrap" v-else-if="group === 4">
                                                        Выполнено с ошибками</h3>
                                                    <h3 class="white-space-no-wrap" v-else-if="group === 5">С
                                                        опозданием</h3>
                                                    <h3 class="white-space-no-wrap" v-else-if="group === 6">
                                                        Не
                                                        выполнено</h3>
                                                    <h3 v-else>{{ group }}</h3>
                                                    <v-icon class="mr-4 mt-0 pt-0">
                                                        {{ isOpen ? 'mdi-minus' : 'mdi-plus' }}
                                                    </v-icon>
                                                </div>
                                            </td>
                                        </template>
                                        <template v-slot:item.avatar="{ item }">
                                            <v-icon>{{ item.avatar }}</v-icon>
                                        </template>
                                        <template v-slot:item.name="{ item }">
                                            <v-list-item
                                                class="d-flex flex-column employee-name-cell align-start pt-1 pb-1">
                                                <v-list-item-title style="white-space: nowrap">{{ item.name }}
                                                </v-list-item-title>
                                                <v-list-item-subtitle style="white-space: nowrap">{{ item.title }}
                                                </v-list-item-subtitle>
                                            </v-list-item>
                                        </template>
                                        <template v-slot:item.start="{ item }">
                                            <span>{{ formatTimestampToShow(item.start) }}</span>
                                        </template>
                                        <template v-slot:item.finish="{ item }">
                                            <span>{{ formatTimestampToShow(item.finish) }}</span>
                                        </template>

                                        <template v-slot:item.state="{ item }">
                                            <v-list-item class="d-flex employee-name-cell align-center">

                                                <v-icon class="list-state-marker mr-2"
                                                    :style="{ 'color': `rgb(${tableMarkerColor(item.state)})`}">
                                                    mdi-circle
                                                </v-icon>
                                                <v-list-item-title class="white-space-no-wrap" v-if="item.state === 0">
                                                    Не
                                                    назначено</v-list-item-title>
                                                <v-list-item-title class="white-space-no-wrap" v-if="item.state === 1">
                                                    Назначено</v-list-item-title>
                                                <v-list-item-title class="white-space-no-wrap" v-if="item.state === 2">
                                                    Прибыл на задание</v-list-item-title>
                                                <v-list-item-title class="white-space-no-wrap" v-if="item.state === 3">
                                                    Выполнено</v-list-item-title>
                                                <v-list-item-title class="white-space-no-wrap" v-if="item.state === 4">
                                                    Выполнено с ошибками</v-list-item-title>
                                                <v-list-item-title class="white-space-no-wrap" v-if="item.state === 5">С
                                                    опозданием</v-list-item-title>
                                                <v-list-item-title class="white-space-no-wrap" v-if="item.state === 6">
                                                    Не
                                                    выполнено</v-list-item-title>
                                            </v-list-item>
                                        </template>
                                        <template v-slot:item.task_name="{ item }">
                                            <v-list-item
                                                class="d-flex flex-column employee-task-name-cell align-start pt-1 pb-1 text-truncate"
                                                style="text-overflow: ellipsis; max-width: 200px">
                                                <v-list-item-title class="white-space-no-wrap">{{ item.task_name }}
                                                </v-list-item-title>
                                                <v-list-item-subtitle class="name-subtitle white-space-no-wrap">
                                                    {{ item.address_tasks }}
                                                </v-list-item-subtitle>
                                            </v-list-item>
                                        </template>
                                        <template v-slot:item.description="{ item }">
                                            <v-list-item
                                                class="d-flex flex-column employee-task-name-cell align-start pt-1 pb-1 text-truncate"
                                                style="text-overflow: ellipsis; max-width: 200px">
                                                <v-list-item-title class="white-space-no-wrap">{{ item.description }}
                                                </v-list-item-title>
                                            </v-list-item>
                                        </template>
                                        <template v-slot:item.tags="{ item }">
                                            <div class="d-flex flex-column align-start pt-1 pb-1 text-truncate"
                                                style="text-overflow: ellipsis; max-width: 200px">
                                                <v-chip color="blue">
                                                    {{ item.tags }}
                                                </v-chip>
                                            </div>
                                        </template>

                                    </v-data-table>
                                    <!-- dialog -->
                                    <v-dialog v-model="dialog" max-width="290">
                                        <v-card class="pa-4">
                                            <v-card-text>
                                                Удалить выбранные задания?
                                            </v-card-text>
                                            <v-card-actions>
                                                <v-spacer></v-spacer>
                                                <v-btn plain text dense @click="dialog = false">
                                                    Отмена
                                                </v-btn>
                                                <v-btn plain text dense @click="deleteItem">
                                                    Удалить
                                                </v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>
                                    <!-- dialog -->
                                </v-card>
                            </div>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </div>

        <CalendarWindow v-model="toggleCalendar" />
    </v-container>
</template>

<script>
    import CalendarWindow from "@/components/TasksPage/CalendarWindow";
    import moment from 'moment';
    import {
        latLng
    } from "leaflet";
    import {
        LMap,
        LTileLayer,
        
    } from 'vue2-leaflet';

    export default {
        name: "VehiclesPage",
        components: {
            CalendarWindow,
            LMap,
            LTileLayer,
            
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
        computed: {

            computedHeaders() {
                return this.headers.filter(i => !this.columnsToHide.includes(i.value));
            },
            computedHeadersCog() {
                return this.headers.filter(i => !this.columnsToHideInitially.includes(i.value));
            },
            countItems() {
                if (!this.isMounted)
                    return;
                // console.log(this.$refs.table + 'refs test')
                return this.$refs.table.selectableItems.length
            },
            filterTableByStatus() {
                if (this.selectedStatuses.length === 0) {
                    return this.tasks
                } else {
                    return this.tasks.filter(i => this.selectedStatuses.includes(i.state));
                }
            },
        },
        methods: {
            rowClick: function (item) {
                this.itemToShowInformation = item
            },
            formData() {
                let groups = this.groupNames.list;
                groups.forEach(group => {
                    group.markers = [];
                    this.trackersList.list.forEach((marker) => {
                        if (marker.group_id === group.id) {
                            group.markers.push(marker)
                        }
                    });
                });
                return groups
            },
            onClickOutside() {
                this.active = false
            },
            checkSelectGroup(e) {
                this.selectGroupIsChecked = e
            },
            catchGroupName(e) {
                this.selectedGroup = e
                // console.log(e)
            },
            selectGroup(group) {
                for (let i = 0; i < this.tasks.length; i++) {
                    for (let property in this.tasks[i]) {
                        if (property === this.selectedGroup && this.tasks[i][property] === group) {
                            if (this.selectGroupIsChecked) {
                                this.selected.push(this.tasks[i])
                            } else {
                                this.selected.splice(this.tasks[i])
                            }
                        }
                    }

                }
            },
            calcInterval(endUnix, startUnix) {
                let start = moment.unix(startUnix, "X").format();
                let end = moment.unix(endUnix, "X").format();
                let a = moment(start);
                let b = moment(end);
                return {
                    minutes: a.diff(b, 'minutes'),
                    hours: a.diff(b, 'hours'),
                    days: a.diff(b, 'days'),
                    weeks: a.diff(b, 'weeks'),
                }
                // console.log(a.diff(b, 'minutes'))
                // console.log(a.diff(b, 'hours'))
                // console.log(a.diff(b, 'days'))
                // console.log(a.diff(b, 'weeks'))
            },
            itemToShowformatTimestamp(unixtimestamp) {
                if (!this.isMounted)
                    return;
                let result = {};
                result.date = moment.unix(unixtimestamp).format('DD');
                result.dateInMonth = moment.unix(unixtimestamp).format('MM');
                result.month = moment.unix(unixtimestamp).format('MMM');
                result.hoursMinutes = moment.unix(unixtimestamp).format('HH:mm');
                result.year = moment.unix(unixtimestamp).format('YYYY');
                return result
            },
            formatTimestampToShow(unixtimestamp) {
                if (!this.isMounted)
                    return;
                let result = moment.unix(unixtimestamp).format('DD.MM.YYYY HH:mm');
                return result
            },
            tableMarkerColor(stateNumber) {
                for (let i = 0; i < this.employeeStatus.length; i++) {
                    if (this.employeeStatus[i].value == stateNumber) {
                        let color = this.employeeStatus[i].color;
                        return color;
                    }

                }
            },
            showTableFooter() {

                return this.tasks.length > 15 ? false : true
            },
            readHover(e) {
                console.log(e)
            },
            getItemText(name) {
                console.log(name)
            },
            deleteItem() {
                for (var i = 0; i < this.selected.length; i++) {
                    const index = this.tasks.indexOf(this.selected[i]);
                    this.tasks.splice(index, 1);
                }
                this.dialog = false;
                this.selected = [];
            },
            toggleColumn(item) {
                let arr = this.columnsToHide
                if (arr.includes(item.value)) {
                    arr.splice(arr.indexOf(item.value), 1);
                    return;
                }
                arr.push(item.value);
                this.columnsToHide = arr
            },
            mapOnReady() {
                this.map = this.$refs['vehicles_map'].mapObject
                this.map.zoomControl.setPosition('topright');
            },
            mapFullScreenOnReady() {
                this.map = this.$refs['vehicles_map_fullscreen'].mapObject
                this.map.zoomControl.setPosition('topright');
            },
        },
        mounted() {
            moment.locale('ru');
            this.groups = this.formData();
            this.$root.$on("closeDatePicker", (data) => {
                this.toggleCalendar = !data
            });
            this.$root.$on("selectDate", (data) => {
                this.dateTimeSelected = data;
                this.timestampSelectedStart = moment(this.dateTimeSelected[0]).unix()
                this.timestampSelectedEnd = moment(this.dateTimeSelected[1]).unix()
                this.dateStart = moment(this.dateTimeSelected[0]).format('DD.MM.YYYY HH.mm')
                this.dateEnd = moment(this.dateTimeSelected[1]).format('DD.MM.YYYY HH.mm')
                this.dateTimeSelected = this.dateStart + ' - ' + this.dateEnd
            });
            this.isMounted = true;
        },
        data() {
            return {
                itemToShowInformation: null,
                model: 1,
                tab: null,
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
                groups: null,
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
                active: false,
                selectGroupIsChecked: false,
                selectedGroup: null,
                timestampSelectedStart: 0,
                timestampSelectedEnd: 0,
                dateTimeSelected: null,
                selectedStatuses: [],
                employeeStatus: [{
                        value: 0,
                        text: 'Не назначено',
                        color: "117, 117, 117",
                    },
                    {
                        value: 1,
                        text: 'Назначено',
                        color: "30, 150, 220",
                    },
                    {
                        value: 2,
                        text: 'Прибыл на задание',
                        color: "206, 147, 216",
                    },
                    {
                        value: 3,
                        text: 'Выполнено',
                        color: "76, 175, 80",
                    },
                    {
                        value: 4,
                        text: 'Выполнено с ошибками',
                        color: "255, 196, 13",
                    },
                    {
                        value: 5,
                        text: 'С опозданием',
                        color: "255, 160, 0",
                    },
                    {
                        value: 6,
                        text: 'Не выполнено',
                        color: "239, 83, 80",
                    }
                ],
                isMounted: false,
                columnsToHideInitially: ['name', 'actions'],
                customGroupNames: {
                    "name": "Имя",
                    "state": "Статус"
                },
                isOpen: true,
                showSearchBar: false,
                dialog: false,
                columnsToHide: [],
                columnHide: '',
                singleSelect: false,
                selected: [],
                search: '',
                headers: [

                    {
                        text: 'Тип поездки',
                        align: 'left',
                        value: 'trip_type',
                        width: "20%"
                    },
                    {
                        text: 'Начало',
                        value: 'trip_start',
                        width: "10%"
                    },
                    {
                        text: 'Конец',
                        value: 'trip_end',
                    },
                    {
                        text: 'Время в пути',
                        value: 'trip_time',
                        align: 'center'
                    },
                    {
                        text: 'начальное положение',
                        value: 'start',
                        align: 'center'
                    },
                    {
                        text: 'Одометр на начало',
                        value: 'odometer'
                    },
                    {
                        text: 'Конечное положение',
                        value: 'end',
                        align: 'center'
                    },
                    {
                        text: 'Одометр на конец',
                        value: 'odometer_end'
                    },
                    {
                        text: 'Пробег',
                        value: 'mileage'
                    },
                    {
                        text: 'Водитель',
                        value: 'driver'
                    },
                    {
                        text: 'Заметка',
                        value: 'trip_note',
                        align: 'center'
                    },

                ],
                tasks: [{
                    id: 1,
                    trip_type: 'тип',
                    trip_start: 'начало пути',
                    trip_end: 'конец пути',
                    trip_time: 'время в пути',
                    start: 'начало',
                    odometer: 'одометр',
                    end: 'конец',
                    odometer_end: 'одометр конец',
                    mileage: 'пробег',
                    driver: 'водитель',
                    trip_note: 'заметка',
                }],
                tabs: 'vehicles',
                vehicle: {
                    name: ''
                },
                garage: {
                    name: ''
                },
                toggleCalendar: false,
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
                tableGroup: null,
                selectedVehicle: null,
                groupsTable: [{
                    text: 'Не группировать',
                    value: null
                }, {
                    text: 'Исполнителю',
                    value: 'name',
                }, {
                    text: 'Статусу',
                    value: 'state'
                }, {
                    text: 'Адресу',
                    value: 'address_tasks'
                }, {
                    text: 'Названию',
                    value: 'task_name'
                }],

            }
        }
    }
</script>

<style scoped>
    ::v-deep .emloyee-widget-header .v-expansion-panel-header__icon {
        margin-left: 0
    }

    .header-title {
        order: 1;
    }

    .icon-in-expansion-header {
        order: 0;
        margin-right: 10px
    }

    .expansion-header-checkbox {
        order: 2;
        align-self: flex-end;
        max-width: 32px
    }

    ::v-deep .select-statuses .mdi-checkbox-marked {
        transform: translateY(10px)
    }

    ::v-deep .select-statuses .v-input__icon--clear {
        transform: translateY(6px)
    }

    ::v-deep .v-sheet.v-card:not(.v-sheet--outlined) {
        box-shadow: none
    }

    ::v-deep .v-data-table {
        background-color: #ebebeb !important
    }

    ::v-deep .v-data-table__wrapper {
        background-color: #FFFFFF;
    }

    .fix-height .v-input--selection-controls {}

    ::v-deep .v-row-group__header {}

    .v-data-table .v-data-table__wrapper table thead tr {
        position: fixed;
    }

    .v-data-table /deep/ .v-data-table__wrapper {
        overflow: unset;
    }

    .hey {
        overflow-y: auto;
    }

    ::v-deep .tasks-scheduled-table table {
        max-height: 800px;
        overflow-y: auto;
        overflow-x: auto;
    }

    ::v-deep .v-data-table-header th {
        white-space: nowrap !important;
    }

    td {
        text-align: center !important;
    }

    .white-space-no-wrap {
        white-space: nowrap;

    }

    .v-list-item__title {
        align-self: start;

    }

    .employee-name-cell {
        min-height: auto;
    }

    .employee-task-name-cell {
        min-height: auto;
        width: 560px;
        text-overflow: ellipsis;
    }

    .vehicles-container td {
        width: 200px !important
    }

    ::v-deep .tasks-scheduled-table .v-data-table__wrapper {
        overflow-y: auto !important;
        height: calc(100vh - 200px);
        overflow-y: auto !important;
    }

    ::v-deep .tasks-scheduled-table .v-card.v-sheet {
        height: 100% !important
    }

    ::v-deep .tasks-scheduled-table tr:hover .edit-table-section {
        display: block;
    }

    ::v-deep .tasks-scheduled-table .edit-table-section {
        transform: translateY(10px);
        display: none;

    }


    .search-field {
        margin-left: auto
    }

    .select-group .v-select__selection {
        font-size: 14px;
    }

    .table-garage tbody tr {
        height: 40px;
    }


    .overlay-form-content .v-overlay__content {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
    }

    .tabs-form-car .v-tab {
        font-size: 12px;
    }

    .v-text-field__slot label,
    .v-select__slot label,
    .v-text-field__slot input,
    .v-input__control label {
        font-size: 13px;
    }

    .overlay-confirm-remove,
    .overlay-form-content,
    .overlay-map-fullscreen {
        z-index: 1003 !important;
    }


    ::v-deep .overlay-map-fullscreen .v-overlay__content {
        position: absolute;
        top: 5%;
        left: 2%;
        bottom: 5%;
        right: 2%;
    }


    .map-fullscreen-overlay .v-overlay__content {
        position: absolute;
        top: 5%;
        left: 2%;
        bottom: 5%;
        right: 2%;
    }

    *::-webkit-scrollbar {
        background-color: rgba(0, 0, 0, 0.15);
    }

    *::-webkit-scrollbar {
        height: 8px !important;
        width: 8px !important;
    }

    .v-data-table-header th {
        white-space: nowrap;
    }
</style>

<style scoped>
    .v-icon.v-icon::after {
        display: none
    }

    .actions-column {
        position: absolute;
        right: 0;
        padding: 0 5px;
        margin-top: -18px !important;
        text-align: center;
        display: none;
    }

    /deep/ tr.v-data-table__selected {}

    /deep/ tr.v-data-table__selected .actions-column {
        display: block;
        background: #e2daff !important;
    }

    /deep/ tr:hover .actions-column {
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

    .table-cars {}

    .vehicles-container {
        transition: max-width 200ms;
        max-width: 100%;
    }

    .vehicles-cont.active {
        max-width: calc(100% - 420px);
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

    .import-excel-btn {
        position: absolute;
        top: -45px;
        right: -55px
    }

    .employees-container {
        background-color: #ebebeb;

    }

    .header-group-cursor:hover {
        cursor: pointer
    }

    ::v-deep .v-data-table-header tr th span {
        font-size: 0.9rem
    }

    ::v-deep .v-data-table-header {
        height: 48px !important;
    }

    .employees-panel {
        position: absolute;
        z-index: 4000;
        left: 40%;
        top: 30px
    }

    .v-expansion-panel-header .expansion-header-checkbox {
        display: flex !important
    }

    .v-table__overflow {
        overflow: auto;
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
        height: 100%;
    }

    @media only screen and (max-width: 1707px) {
        ::v-deep .tasks-scheduled-table .v-data-table__wrapper {
            overflow-y: auto !important;
            height: calc(100vh - 248px);
            overflow-y: auto !important;
        }
    }
</style>