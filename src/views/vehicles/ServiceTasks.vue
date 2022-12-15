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
                        <v-row class="ma-0 d-flex" style="max-width: 98%; height: 12%;  flex-wrap: nowrap" align-center>
                            <v-col cols="1" style="max-width: 80px">
                                <v-btn v-model="addCar" fab large color="primary" @click="openFormCar=!openFormCar">
                                    <v-icon>
                                        mdi-plus
                                    </v-icon>
                                </v-btn>
                            </v-col>
                            <v-col cols="11" class="ml-4">
                                <v-row justify="space-between" align="center" class="ma-0 mt-2">
                                    <div class="d-flex align-center justify-space-between"
                                        style="width: 100%; margin-left: auto;">
                                        <div style="width: 100%" class="pr-4">
                                            <h2>Сервисные работы</h2>
                                        </div>
                                        <div class="d-flex align-center justify-space-between pr-4" style="width: 100%">

                                            <v-text-field single-line label="Транспортное средство"
                                                prepend-icon="mdi-car">
                                            </v-text-field>
                                            <v-icon>mdi-close</v-icon>

                                        </div>
                                        <div style="width: 100%; transform: translateY(-6px)" class="pr-4 mt-0">
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
                                        </div>
                                    </div>
                                </v-row>
                            </v-col>
                        </v-row>
                        <v-card fluid class="pa-0 mt-0 hey" style="height: calc(100% - 130px); overflow: hidden ">
                            <v-row class="ma-0" align="center" style="min-height: 44px; height: 60px">
                                <v-col style="max-width: 150px" class="py-1">
                                    <span class="text-body-2 grey--text text--darken-1">Группировать по:</span>
                                </v-col>
                                <v-col class="py-1" style="max-width: 200px">
                                    <v-select @change="catchGroupName($event)" v-model="tableGroup" dense single-line
                                        :items="groupsTable" hide-details class="select-group ma-0">
                                    </v-select>
                                </v-col>
                                <v-col class="py-1"></v-col>
                                <v-col class="py-1 text-center d-flex" style="max-width: 560px; align-items: center">
                                    <div class="mr-7">
                                        <v-text-field v-model="search" append-icon="mdi-magnify" label="Поиск"
                                            single-line hide-details>
                                        </v-text-field>
                                    </div>
                                    <v-menu :close-on-content-click="false" max-height="300px" :nudge-width="200"
                                        offset-x>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn :disabled="selected.length == 0" icon v-bind="attrs" v-on="on" small>
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-icon v-bind="attrs" v-on="on" class="mr-3">
                                                            mdi-download</v-icon>
                                                    </template>
                                                    <span>Скачать</span>
                                                </v-tooltip>
                                            </v-btn>
                                        </template>
                                        <v-card>
                                            <v-list-item>PDF</v-list-item>
                                            <v-list-item>EXCEL</v-list-item>
                                        </v-card>
                                    </v-menu>
                                    <v-icon class="mr-3" :disabled="selected.length == 0">mdi-printer</v-icon>
                                    <v-menu :close-on-content-click="false" max-height="300px" :nudge-width="200"
                                        offset-x>
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
                                                    <v-list-item v-for="item in computedHeadersCog" :key="item.value"
                                                        :value="item.value" dense>
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
                                </v-col>
                            </v-row>
                            <v-card style="height: 100%">
                                <v-data-table ref="table" style="height: 60%" :group-by="tableGroup" fixed-header
                                    class="tasks-scheduled-table text-center" :hide-default-footer="true"
                                    v-model="selected" show-select :single-select="singleSelect" :items-per-page="10"
                                    item-key="id" :headers="computedHeaders" :items="filterTableByStatus"
                                    :search="search">
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
                                                    Просрочена</h3>
                                                <h3 v-else>{{ group }}</h3>
                                                <v-icon class="mr-4 mt-0 pt-0">
                                                    {{ isOpen ? 'mdi-minus' : 'mdi-plus' }}
                                                </v-icon>
                                            </div>
                                        </td>
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
                                            <v-list-item-title class="white-space-no-wrap" v-if="item.state === 0">Не
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
                                                Просрочена</v-list-item-title>
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
                                </v-data-table>
                                <div style="height: 40%; display: flex">
                                    <div style="width: 30%">
                                        <ECharts auto-resize></ECharts>
                                    </div>
                                    <div class="work-list-container">
                                        <h4 class="header-work-list">Всего работ: 4</h4>
                                        <ul class="work-list pl-0">
                                            <li>
                                                <v-icon class="list-state-marker" style="color: #979797">
                                                    mdi-circle
                                                </v-icon><span>Запланировано</span>
                                            </li>
                                            <li>
                                                <v-icon class="list-state-marker" style="color: #ff9800">
                                                    mdi-circle
                                                </v-icon><span>Уже пора</span>
                                            </li>
                                            <li>
                                                <v-icon class="list-state-marker" style="color:#8bc34a ">
                                                    mdi-circle
                                                </v-icon><span>Выполнено</span>
                                            </li>
                                            <li>
                                                <v-icon class="list-state-marker" style="color: #f44336">
                                                    mdi-circle
                                                </v-icon><span>Просрочено</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="work-list-container">
                                            <h4 class="header-work-list">
                                                Расходы:
                                                16950 руб.
                                            </h4>
                                        <ul class="work-list">
                                            <li>
                                                Запланированные работы:
                                                0 руб.
                                            </li>
                                            <li>
                                                Текущие работы:
                                                0 руб.
                                            </li>
                                            <li>
                                                Выполненные работы:
                                                0 руб.
                                            </li>
                                            <li>
                                                Просроченные работы:
                                                16950 руб.
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <!-- data table component with props test -->

                                <!-- data table component with props test -->
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
    import ECharts from '@/components/ServiceTaskECharts'
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
            ECharts
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
                // return this.$refs.table.selectableItems.length

                return 1
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
                        text: 'Просрочена',
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
                headers: [{
                        text: 'Имя',
                        align: 'left',
                        value: 'name',
                        width: "20%"
                    },
                    {
                        text: 'Статус',
                        value: 'state',
                        width: "10%"
                    },
                    {
                        text: 'Сервисная работа',
                        value: 'task_name',
                    },
                    {
                        text: 'Время',
                        value: 'finish',
                        align: 'center'
                    },
                    {
                        text: 'Прибытие',
                        value: 'arrival'
                    },
                    {
                        text: 'Продолжительность',
                        value: 'duration',
                        align: 'center'
                    },
                    {
                        text: 'Стоимость',
                        value: 'form'
                    },
                    {
                        text: 'Выполненные',
                        value: 'orderNumber',
                        align: 'center'
                    },

                ],
                tasks: [{
                    id: 1,
                    name: 'Ford',
                    state: 6,
                    task_name: 'Диагностика подвески',
                    address_tasks: 'Россия, Санкт-Петербург, улица Маршала Новикова, 18',
                    finish: 1637838353,
                    arrival: '--',
                    duration: '-',
                    form: '1000р',
                    description: 'Описание',
                    creationDate: '12.07.2021',
                    orderNumber: '-',
                }, {
                    id: 2,
                    name: 'Mazda 6',
                    address_tasks: 'Россия, Санкт-Петербург, улица Маршала Новикова, 2',
                    state: 6,
                    task_name: 'Диагностика подвески',
                    finish: 1637838353,
                    arrival: '--',
                    duration: '-',
                    form: '1000р',
                    description: 'Описание',
                    creationDate: '12.07.2021',
                    orderNumber: '-',
                }, {
                    id: 4,
                    name: 'Ford',
                    address_tasks: 'Россия, Санкт-Петербург, улица Маршала Новикова, 2',
                    state: 6,
                    task_name: 'Диагностика подвески',
                    finish: 1637838353,
                    arrival: '--',
                    duration: '-',
                    form: '1000р',
                    description: 'Описание',
                    creationDate: '12.07.2021',
                    orderNumber: '-',
                }, {
                    id: 5,
                    name: 'Mazda 6',
                    address_tasks: 'Россия, Санкт-Петербург, улица Маршала Новикова, 2',
                    state: 6,
                    task_name: 'Диагностика подвески',
                    finish: 1637838353,
                    arrival: '--',
                    duration: '-',
                    form: '1000р',
                    description: 'Описание',
                    creationDate: '12.07.2021',
                    orderNumber: '-',
                }, ],
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
        height: 99% !important;
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

    /deep/ tr.v-data-table__selected {
        background: #e8f4fb !important;
    }

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

    ::v-deep .overlay-map-fullscreen .v-overlay__content {
        position: absolute;
        top: 5%;
        left: 2%;
        bottom: 5%;
        right: 2%;
    }

    ::v-deep .work-list {
        list-style-type: none
    }

    .work-list li {
        margin-left: 0;
        margin-bottom: 10px
    }

    .header-work-list{
     margin-bottom: 10px   
    }

    .work-list-container{
        margin-top: 50px
    }
</style>