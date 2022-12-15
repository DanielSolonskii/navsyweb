<template>
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
                                            <v-sheet height="24" width="24" :color="active ? 'primary lighten-4': ''"
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
                                    :max="maxTimeControl.unix()" :min="minTimeControl.unix()" step="1800" hide-details>
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
                        <v-row style="height: 44px; background-color: #505a64; color: white; padding: 10px"
                            class="ma-0">
                            Водители
                        </v-row>
                        <v-row class="ma-0 employees-selection-tree-wrapper">
                            <div class="employees-selection-tree">
                                <v-treeview open-on-click selectable :items="employees" open-all return-object>
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
                                            <v-sheet height="24" width="24" :color="active ? 'primary lighten-4': ''"
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
                    <v-row class="ma-0" style="background-color: #505a64; color: white; padding: 10px">
                        Качество вождения</v-row>
                    <v-row class="h-100 ma-0">
                        <v-col class="pl-0 pt-0 pb-0 h-100 relative reports_view" style="max-width: 344px">
                            <v-card height="100%" width="100%" class="">
                                <!-- test new -->
                                <v-row class="ma-0">
                                    <v-col class="pa-0">
                                        <v-tabs v-model="tab" background-color="#505a64" color="white" left>
                                            <v-tabs-slider></v-tabs-slider>

                                            <v-tab href="#subscribe">
                                                Отчет
                                            </v-tab>

                                            <v-tab href="#contact">
                                                Расписание
                                            </v-tab>
                                        </v-tabs>

                                        <v-tabs-items v-model="tab">
                                            <v-tab-item :key="1" value="subscribe">
                                                <v-card flat>
                                                    <v-row class="ma-0 mx-2">Временной интервал:</v-row>
                                                    <v-row class="ma-0 mx-2">
                                                        <menu-date-time-picker-range v-model="computedDateRange">
                                                        </menu-date-time-picker-range>
                                                    </v-row>
                                                    <v-row class="ma-0">
                                                        <v-col class="px-2 py-1">
                                                            <div>
                                                                Дни контроля:
                                                            </div>
                                                            <div>
                                                                <v-item-group
                                                                    v-model="parametersReport.time_filter.weekdays"
                                                                    multiple>
                                                                    <v-item v-for="(date, i) in arrayWeekDays"
                                                                        :key="'day-' + i" v-slot="{ active, toggle }"
                                                                        :value="date.day()">
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
                                                            <v-range-slider v-model="computedControlTimeRange"
                                                                color="primary" :max="maxTimeControl.unix()"
                                                                :min="minTimeControl.unix()" step="1800" hide-details>
                                                            </v-range-slider>
                                                            <div class="text-center mt-n2">
                                                                <span class="primary--text pointer-on-hover px-1"
                                                                    style="font-size: small"
                                                                    @click="setControlRangeTimeDay()">
                                                                    День
                                                                </span>
                                                                <span class="primary--text pointer-on-hover px-1"
                                                                    style="font-size: small"
                                                                    @click="setControlRangeTimeNight()">
                                                                    Ночь
                                                                </span>
                                                                <span class="primary--text pointer-on-hover px-1"
                                                                    style="font-size: small"
                                                                    @click="setControlRangeTimeDefault()">
                                                                    Всегда
                                                                </span>
                                                            </div>
                                                        </v-col>
                                                    </v-row>
                                                    <v-row class="ma-0">
                                                        <v-checkbox style="margin-left: 20px" v-model="showSeconds"
                                                            label="Показывать секунды"></v-checkbox>
                                                    </v-row>
                                                    <v-row class="ma-0 mb-1">
                                                        <v-btn style="width: 80%; margin: auto"
                                                            @click="penaltyOptionsShow" color="primary">
                                                            Настройки штрафов</v-btn>
                                                    </v-row>
                                                    <v-row
                                                        style="height: 44px; background-color: #505a64; color: white; padding: 10px"
                                                        class="ma-0">
                                                        Водители
                                                    </v-row>
                                                    <v-row class="ma-0 employees-selection-tree-wrapper">
                                                        <div class="employees-selection-tree">
                                                            <v-treeview open-on-click selectable :items="employees"
                                                                open-all return-object>
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

                                            </v-tab-item>
                                            <v-tab-item :key="2" value="contact">
                                                <v-card flat>
                                                    <v-btn text small width="100%" class="mt-2" title="Добавить отчёт"
                                                        color="primary " @click="fixMe()">
                                                        <v-icon class="px-2">mdi-plus</v-icon>
                                                        Создать расписание для отчета
                                                    </v-btn>
                                                </v-card>
                                            </v-tab-item>
                                        </v-tabs-items>
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
                        <v-col class="report_view h-100" :class="{'show': selectedReport}">
                            <v-card v-if="selectedReport" height="100%" width="100%">
                                <v-col class="d-md-none" cols="2">
                                    <v-btn icon color="blue " @click="selectedReport = null">
                                        <v-icon>
                                            mdi-chevron-left
                                        </v-icon>
                                    </v-btn>
                                </v-col>
                                <v-col>
                                    <h4 class="text-center">Отчёт {{selectedReport}}</h4>
                                </v-col>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>

    </v-container>
</template>

<script>
    import moment from "moment";
    import MenuDateTimePickerRange from "@/components/EcoDrivingDateTimePickerRange";
    import ReportsService from "@/services/timeTableReports";

    export default {
        name: "ReportPage",
        components: {
            MenuDateTimePickerRange
        },
        filters: {
            formatDateCreatedReport(value) {
                if (!value) return value
                return moment(value * 1000).format('DD.MM.YYYY в HH:mm')
            }
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
            }
        },
        watch: {
            selectedNewReport(val) {
                return val ? this.openParametersNewReport() : '';
            },
        },
        methods: {
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

        },
        created() {
            this.loadingListReports = true;
            ReportsService.getListReports().then((data) => {
                this.listReports = data;
                this.loadingListReports = false;
            })
        },
        data: () => ({
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
        }),
    }
</script>

<style scoped>
    .h-100 {
        height: 100%;
    }

    ::v-deep .v-input__control label {
        font-size: 14px;
    }

    ::v-deep .v-text-field .v-input__control .v-input__slot .v-text-field__slot input {
        font-size: 14px;
    }

    ::v-deep .group-reports.v-list-group .v-list-item__icon.v-list-group__header__append-icon {
        min-width: 24px;
        margin-left: 4px;
    }

    ::v-deep .group-reports.v-list-group>.v-list-item {
        min-height: 34px;
        padding-left: 0;
        padding-right: 10px;
        background-color: #f5f5f5;

    }

    ::v-deep .v-list-item--dense.v-list-item--two-line,
    .v-list--dense .v-list-item.v-list-item--two-line {
        min-height: 50px;
    }

    ::v-deep .group-reports.v-list-group .group-reports__item {
        min-height: 34px;
    }

    .parameters-report {
        left: 320px;
    }

    .group-devises__color {
        height: 100%;
        width: 5px;
        position: absolute;
        left: -10px;
        top: 0;
    }

    ::v-deep .group-devises.v-list-group .v-list-item {
        min-height: 34px;
        padding: 0 10px;
    }

    ::v-deep .v-input .v-input__slot {
        min-height: 30px !important;
    }

    .border-primary {
        border: 1px solid #283593;
    }

    .v-list-item:hover .list-item-edit__icon,
    .v-list-item.v-list-item--active .list-item-edit__icon {
        display: inline-flex !important;
    }

    .list-item-edit__icon:hover {
        color: #3f51b5;
    }

    ::v-deep .employees-selection-tree .v-treeview-node__toggle,
    ::v-deep .employees-selection-tree .v-treeview-node__level {
        display: none
    }

    ::v-deep .v-tabs-items {
        height: calc(100vh - 130px)
    }

    ::v-deep .employees-selection-tree-wrapper>div {
        width: 100%
    }


    /*
    ::v-deep .v-treeview-node__root {
        background-color: #f4f7f9
    }
    */
</style>