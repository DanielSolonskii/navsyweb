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
            <v-card v-show="selectedNewReport || selectedParamsReport" class="absolute-box ma-3" width="960px"
                style="left: 320px">
                <div class="d-flex h-100 overflow-hidden">
                    <v-card class="h-100" elevation="0" rounded="0" min-width="320px" max-width="320px">
                        <v-toolbar dense dark color="primary " elevation="0">
                            <v-icon class="mr-2">
                                mdi-map-marker-radius
                            </v-icon>
                            <v-toolbar-title class="font-weight-bold" style="font-size: medium">
                                Маячки
                            </v-toolbar-title>
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

                        <v-list height="calc(100% - 90px)" class="overflow-y-auto">
                            <v-list-group v-for="(group, i) in grouping_devices" :key="'group-' + i" :value="group"
                                class="group-devises" color="primary " sub-group prepend-icon="">
                                <template v-slot:appendIcon>
                                    <v-icon class="">
                                        mdi-chevron-down
                                    </v-icon>
                                </template>

                                <template v-slot:activator>
                                    <v-list-item>
                                        <div class="group-devises__color" :style="{'background-color': group.color}">
                                        </div>
                                        <v-list-item-title class=" font-weight-bold pr-3" style="font-size: 14px">
                                            {{group.name}} ({{group.devices.length}})
                                        </v-list-item-title>
                                    </v-list-item>
                                </template>

                                <v-list-item-group v-model="parametersReport.trackers" multiple>
                                    <v-list-item v-for="(device, i) in group.devices" :key="i" :value="device.id" dense
                                        class="group-devises__item px-4">
                                        <div style="font-size: 13px">{{device.name}}</div>
                                    </v-list-item>
                                </v-list-item-group>
                            </v-list-group>
                        </v-list>
                    </v-card>

                    <v-card class="h-100" elevation="0" rounded="0" min-width="320px" max-width="320px">
                        <v-toolbar dense dark color="primary " elevation="0">
                            <v-toolbar-title class="font-weight-bold" style="font-size: medium">
                                {{nameReport}}
                            </v-toolbar-title>
                        </v-toolbar>
                        <!--
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
                <menu-date-time-picker-range v-model="computedDateRange"></menu-date-time-picker-range>
              </v-col>
            </v-row>
            -->
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
                        <v-row v-if="'hide_empty_tabs' in parametersReport.plugin" class="ma-0 px-2">
                            <v-checkbox v-model="parametersReport.plugin.hide_empty_tabs" label="Скрывать пустые вклаки"
                                color="primary " hide-details class="mt-0"></v-checkbox>
                        </v-row>
                        <v-row v-if="'show_seconds' in parametersReport.plugin" class="ma-0 px-2">
                            <v-checkbox v-model="parametersReport.plugin.show_seconds" label="Показывать секунды"
                                color="primary " hide-details class="mt-0"></v-checkbox>
                        </v-row>
                        <v-row v-if="'include_summary_sheet_only' in parametersReport.plugin" class="ma-0 px-2">
                            <v-checkbox v-model="parametersReport.plugin.include_summary_sheet_only"
                                label="Показывать только общий отчёт" color="primary " hide-details class="mt-0">
                            </v-checkbox>
                        </v-row>
                        <v-row v-if="'split' in parametersReport.plugin" class="ma-0 pa-2">
                            <div style="font-size: small; z-index: 3" class="white ml-2 pa-1 mb-n4">Дополнительно</div>
                            <v-card style="border: 1px solid #888888" class="pa-2" elevation="0" width="100%">
                                <v-checkbox v-model="parametersReport.plugin.split" label="Разделять стоянками"
                                    color="primary " hide-details class="mt-0"></v-checkbox>
                                <v-checkbox v-model="parametersReport.plugin.show_idle_duration"
                                    label="Показывать длительные стоянки" color="primary " hide-details class="mt-0">
                                </v-checkbox>
                                <v-checkbox v-model="parametersReport.plugin.show_coordinates"
                                    label="Показывать координаты" color="primary " hide-details class="mt-0">
                                </v-checkbox>
                                <v-checkbox v-model="parametersReport.plugin.filter" label="Использовать умный фильтр"
                                    color="primary " hide-details class="mt-0"></v-checkbox>
                                <v-checkbox v-model="parametersReport.plugin.group_by_driver"
                                    label="Группировать по водителям" color="primary " hide-details class="mt-0">
                                </v-checkbox>
                            </v-card>

                        </v-row>
                        <!--
            <v-row class="ma-0 pa-2 text-center">
              <v-btn small width="120" color="primary " outlined rounded style="color: white"
                @click="closeParametersReport()">
                Отмена
              </v-btn>
              <v-btn small width="160" class="ml-auto" :disabled="!parametersReport.trackers.length"
                color="primary " rounded style="color: white" @click="generationNewReport()">
                Сгенерировать
              </v-btn>
            </v-row>
            -->
                    </v-card>
                    <!-- test -->
                    <v-card class="h-100" elevation="0" rounded="0" min-width="320px" max-width="320px">
                        <v-toolbar dense dark color="primary " elevation="0">
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
                        <!--
            <v-row class="ma-0">
              <v-col class="px-2 py-1">
                <div style="font-size: small">
                  {{computeControlTimeTitle}}

                </div>
                <v-range-slider v-model="computedControlTimeRange" color="primary " :max="maxTimeControl.unix()"
                  :min="minTimeControl.unix()" step="1800" hide-details></v-range-slider>
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
            <v-row v-if="'hide_empty_tabs' in parametersReport.plugin" class="ma-0 px-2">
              <v-checkbox v-model="parametersReport.plugin.hide_empty_tabs" label="Скрывать пустые вклаки"
                color="primary " hide-details class="mt-0"></v-checkbox>
            </v-row>
            <v-row v-if="'show_seconds' in parametersReport.plugin" class="ma-0 px-2">
              <v-checkbox v-model="parametersReport.plugin.show_seconds" label="Показывать секунды"
                color="primary " hide-details class="mt-0"></v-checkbox>
            </v-row>
            <v-row v-if="'include_summary_sheet_only' in parametersReport.plugin" class="ma-0 px-2">
              <v-checkbox v-model="parametersReport.plugin.include_summary_sheet_only"
                label="Показывать только общий отчёт" color="primary " hide-details class="mt-0"></v-checkbox>
            </v-row>
            <v-row v-if="'split' in parametersReport.plugin" class="ma-0 pa-2">
              <div style="font-size: small; z-index: 3" class="white ml-2 pa-1 mb-n4">Дополнительно</div>
              <v-card style="border: 1px solid #888888" class="pa-2" elevation="0" width="100%">
                <v-checkbox v-model="parametersReport.plugin.split" label="Разделять стоянками" color="primary "
                  hide-details class="mt-0"></v-checkbox>
                <v-checkbox v-model="parametersReport.plugin.show_idle_duration" label="Показывать длительные стоянки"
                  color="primary " hide-details class="mt-0"></v-checkbox>
                <v-checkbox v-model="parametersReport.plugin.show_coordinates" label="Показывать координаты"
                  color="primary " hide-details class="mt-0"></v-checkbox>
                <v-checkbox v-model="parametersReport.plugin.filter" label="Использовать умный фильтр"
                  color="primary " hide-details class="mt-0"></v-checkbox>
                <v-checkbox v-model="parametersReport.plugin.group_by_driver" label="Группировать по водителям"
                  color="primary " hide-details class="mt-0"></v-checkbox>
              </v-card>

            </v-row>
-->
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
                    <!-- test -->
                </div>
            </v-card>
        </v-slide-x-transition>

        <v-row class="h-100 ma-0">
            <v-col class="h-100 relative reports_view" style="max-width: 344px">
                <v-card height="100%" width="100%" class="">
                    <v-toolbar dense dark color="primary ">
                        <v-icon class="mr-2">
                            mdi-file-table
                        </v-icon>
                        <v-toolbar-title class="font-weight-bold" style="font-size: medium">
                            Расписание отчётов
                        </v-toolbar-title>
                    </v-toolbar>
                    <v-row class="ma-0">
                        <v-col class="pa-0">
                            <v-btn text small width="100%" class="mt-2" title="Добавить отчёт" color="primary "
                                @click="openAddNewReport=!openAddNewReport">
                                <v-icon class="px-2">mdi-plus</v-icon>
                                Создать расписание для отчета
                            </v-btn>
                        </v-col>
                    </v-row>
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
    </v-container>
</template>

<script>
    import moment from "moment";
    //   import MenuDateTimePickerRange from "../components/MenuDateTimePickerRange";
    import ReportsService from "../services/timeTableReports";

    export default {
        name: "ReportPage",
        components: {
            //   MenuDateTimePickerRange
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
            timeSelect: ["00: 00", "01: 00", "02: 00", "03: 00", "04: 00", "05: 00", "06: 00", "07: 00",
                "08: 00", "09: 00", "10: 00", "11: 00", "12: 00", "13: 00", "14: 00", "15: 00", "16: 00",
                "17: 00", "18: 00", "19: 00", "20: 00", "21: 00", "22: 00", "23: 00"

            ],
            periodSelect: ["неделю", "месяц", "день"],
            listReports: [],
            searchReport: '',
            selectedReport: null,
            selectedNewReport: null,
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
                        },
                        {
                            id: 2,
                            name: 'Стоянки',
                            description: 'Подробная информация о всех стоянках',
                            plugin: {}
                        },
                        {
                            id: 3,
                            name: 'Поездки и стоянки по сменам',
                            description: 'Информация о поездках и стоянках по сменам'
                        },

                    ]
                },
                {
                    id: 2,
                    name: 'Геозоны',
                    reports: [{
                            id: 1,
                            name: 'Посещение геозон',
                            description: 'Дата, время и пробег в гео-зоне',
                            title: 'Отчет по посещениям геозон',
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
                        },
                        {
                            id: 2,
                            name: 'Посещение мест',
                            description: 'Дата, время и количество посещений мест',
                            title: 'Отчет по посещениям мест',
                            plugin: {}
                        },

                    ]
                },
                {
                    id: 3,
                    name: 'Безопасность и охрана',
                    reports: [{
                            id: 1,
                            name: 'Безопасность автомобиля',
                            description: 'Срабатывания автосигнализации, эвакуация, события AutoControl, ДТП',
                            title: 'Отчет "Безопасность автомобиля',
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
                        },
                        {
                            id: 2,
                            name: 'Тревожная кнопка (SOS)',
                            description: 'Информация о нажатиях тревожной кнопки',
                            title: 'Отчет "Тревожная кнопка (SOS)',
                            plugin: {}
                        },
                        {
                            id: 3,
                            name: 'Падение / встряска',
                            description: 'Срабатывание датчика падения (встряски)',
                            title: 'Отчет "Падение / встряска"',
                            plugin: {}
                        },
                        {
                            id: 4,
                            name: 'Снятие устройства',
                            description: 'Снятие устройства с объекта наблюдения',
                            title: 'Отчет "Снятие устройства',
                            plugin: {}
                        },
                        {
                            id: 5,
                            name: 'Агрегированный отчет по безопасности',
                            description: 'Все события касательно безопасности и охраны',
                            title: 'Агрегированный отчет по безопасности',
                            plugin: {}
                        },

                    ]
                },
                {
                    id: 4,
                    name: 'Эксплуатация транспорта',
                    reports: [{
                            id: 1,
                            name: 'Моточасы',
                            description: 'Время движения и работы на холостом ходе',
                            title: 'Отчет по моточасам',
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
                        },
                        {
                            id: 2,
                            name: 'Объем топлива',
                            description: 'Заправки, сливы, расход (по датчику уровня)',
                            title: 'Отчет по расходу топлива',
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
                        },
                        {
                            id: 3,
                            name: 'Расход топлива',
                            description: 'Расход топлива по расходомеру',
                            title: 'Отчёт по расходомеру',
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
                        },
                        {
                            id: 4,
                            name: 'Показания приборов',
                            description: 'Информация из CAN-шины автомобиля, OBDII',
                            title: 'Отчет "Показания приборов"',
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
                        },
                    ]
                },
                {
                    id: 5,
                    name: 'Статус работы устройств',
                    reports: [{
                            id: 1,
                            name: 'Включение и отключение',
                            description: 'Включение и отключение выключателем',
                            title: 'Отчет "Включение и отключение устройства"',
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
                        },
                        {
                            id: 2,
                            name: 'Потеря GSM связи',
                            description: 'Длительные отсутствия связи с сервером',
                            title: 'Отчет по GSM-соединению',
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
                        },

                    ]
                },
                {
                    id: 6,
                    name: 'Внешнее оборудование',
                    reports: [{
                            id: 1,
                            name: 'Измерительные датчики',
                            description: 'История измерений с помощью датчиков',
                            title: 'Отчет по измерительным приборам',
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
                        },
                        {
                            id: 2,
                            name: 'Время работы оборудования',
                            description: 'Наработка агрегатов и механизмов',
                            title: 'Отчет по времени работы оборудования',
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
                        },

                    ]
                },
                {
                    id: 7,
                    name: 'Бизнес',
                    reports: [{
                            id: 1,
                            name: 'Выполнение заданий',
                            description: 'Отчет о статусе выполнения заданий',
                            title: 'Отчёт по заданиям',
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
                        }, {
                            id: 2,
                            name: 'Формы заданий',
                            description: 'Статистика заполнения полей формы',
                            title: 'Отчёт по заполнению форм',
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
                        },
                        {
                            id: 3,
                            name: 'Изменение рабочего статуса',
                            description: 'История изменений рабочих статусов маячка',
                            title: 'Отчёт по сменам рабочих статусов',
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
                        },
                        {
                            id: 4,
                            name: 'Отметки',
                            description: 'Отметки на карте, отправленные мобильными сотрудниками',
                            title: 'Отчет по отметкам на карте ',
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
                        },
                        {
                            id: 5,
                            name: 'Назначение и снятие водителей',
                            description: 'Учет пересменок водителей',
                            title: 'Идентификация водителей',
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
                        },
                        {
                            id: 6,
                            name: 'Пробег в регионе',
                            description: 'Учет пересменок водителей',
                            title: 'Идентификация водителей',
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
                        },
                    ]
                },
                {
                    id: 8,
                    name: 'Прочие отчеты',
                    reports: [{
                            id: 1,
                            name: 'Агрегированный по всем типам событий',
                            description: 'Общий отчет по всевозможным типам событий',
                            title: 'Отчет по событиям',
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
                        }, {
                            id: 2,
                            name: 'События вход/выход из геозоны',
                            description: 'Отчет по событиям входа/выхода из гео-зоны',
                            title: 'События вход/выход из геозоны',
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
                        },
                        {
                            id: 3,
                            name: 'SMS-запросы местонахождения',
                            description: 'История запросов местонахождения по SMS-каналу',
                            title: 'Отчет "SMS-запросы местонахождения"',
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
                        },
                        {
                            id: 4,
                            name: 'Детализация переданных данных',
                            description: 'Информация о переданных точках за сутки',
                            title: 'Детализация переданных данных ',
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
                        },
                    ]
                },
            ],
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
</style>