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
                    <v-btn large text class="float-right" color="indigo" @click="openMapFullScreen=false">
                        Закрыть
                    </v-btn>
                </v-card-text>
            </v-card>
        </v-overlay>
        <div class="h-100">
            <v-container fluid class="h-100 pa-2">
                <v-row class="ma-0 h-100">
                    <v-col class="vehicles-container pa-0 h-100" :class="{'active': openVehicleSidebar}">
                        <v-row class="ma-0 d-flex" style="max-width: 97%; max-height: 120px; flex-wrap: nowrap"
                            align-center>
                            <v-col cols="1" style="max-width: 80px">
                                <v-btn v-model="addCar" large fab color="primary"
                                    @click="$router.push('create-new-scheduled-task')">
                                    <v-icon>
                                        mdi-plus
                                    </v-icon>
                                </v-btn>
                            </v-col>
                            <v-col cols="11" class="ml-4">
                                <v-row>
                                    <h2 class="mt-6"> Регулярные задания</h2>
                                    <div class="search-field d-flex align-center">
                                        <div class="d-flex align-center justify-space-between pr-4">
                                            <v-text-field label="Сотрудник" prepend-icon="mdi-account-multiple">
                                            </v-text-field>
                                            <v-icon>mdi-close</v-icon>
                                        </div>
                                        <v-icon @click="showSearchBar = !showSearchBar">mdi-magnify
                                        </v-icon>
                                        <v-slide-x-transition>
                                            <v-text-field @click:clear="hideSearchOnClear" clearable
                                                v-if="showSearchBar" class="pt-0 mt-0" v-model="search" label="Поиск"
                                                single-line hide-details>
                                            </v-text-field>
                                        </v-slide-x-transition>
                                    </div>


                                </v-row>
                                <v-row justify="space-between" align="center" class="ma-0">
                                    <v-col class="wrap-tgl-sidebar" :class="{'active': openVehicleSidebar}">
                                        <v-btn absolute right top icon small class="mt-2"
                                            @click="openVehicleSidebar=!openVehicleSidebar">
                                            <v-icon size="18" class="tgl-sidebar"
                                                :class="{'active': openVehicleSidebar}">
                                                mdi-arrow-collapse-left
                                            </v-icon>
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                        <v-card fluid class="pa-0" style="height: calc(100vh - 160px);">
                            <v-row class="ma-0" align="center" style="min-height: 44px; height: 80px;">
                                <v-col class="py-1" style="max-width: 200px">
                                    <v-select v-model="tableGroup" dense single-line :items="groupsTable" hide-details
                                        class="select-group ma-0">
                                    </v-select>
                                </v-col>
                                <v-col class="py-1"></v-col>
                                <v-col class="py-1 text-center d-flex" style="max-width: 100px">
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon v-bind="attrs" v-on="on" :disabled="selected.length == 0"
                                                class="mr-3" @click.stop="dialog = true">
                                                mdi-delete</v-icon>
                                        </template>
                                        <span>Удалить</span>
                                    </v-tooltip>
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
                            <v-card>
                                <v-data-table @click:row="rowClick" style="height: 100%" :group-by="tableGroup"
                                    class="tasks-scheduled-table" :hide-default-footer="true"
                                    v-model="selected" show-select :single-select="singleSelect" :items-per-page="10"
                                    item-key="id" :headers="computedHeaders" :items="tasks" :search="search">
                                    <template v-slot:group.header="{group, toggle, isOpen}">
                                        <td class="fix-height">
                                            <v-checkbox ref="checkGroup" color="primary" @click="selectGroup(group)"
                                                @change="checkSelectGroup"></v-checkbox>
                                        </td>
                                        <td :colspan="headers.length">
                                            <div class="d-flex justify-space-between mt-0 header-group-cursor"
                                                @click="toggle">
                                                <h3>{{ group }}</h3>
                                                <v-icon class="mr-4 mt-0 pt-0">
                                                    {{ isOpen ? 'mdi-minus' : 'mdi-plus' }}
                                                </v-icon>
                                            </div>
                                        </td>
                                    </template>
                                    <template v-slot:item.actions="{ item }">
                                        <div class="actions-column">
                                            <v-icon class="mr-2" @click="editItem(item)">
                                                mdi-pencil
                                            </v-icon>
                                            <v-icon @click.stop="dialog = true">
                                                mdi-delete
                                            </v-icon>
                                        </div>
                                    </template>
                                    <template v-slot:item.tags="{ item }">
                                        <v-chip v-for="tag in item.tags" :key="tag.value" color="primary" small dark>
                                            {{ tag.text }}
                                        </v-chip>
                                    </template>
                                    <template v-slot:item.label="{ item }">
                                        <v-list-item
                                            class="d-flex flex-column employee-task-name-cell align-start pt-1 pb-1 text-truncate"
                                            style="text-overflow: ellipsis; max-width: 200px; ">
                                            <v-list-item-title class="white-space-no-wrap">{{ item.label }}
                                            </v-list-item-title>
                                            <v-list-item-subtitle class="name-subtitle white-space-no-wrap">
                                                {{ item.address_tasks }}
                                            </v-list-item-subtitle>
                                        </v-list-item>
                                    </template>
                                    <!-- store variant -->

                                    <!-- store variant -->

                                </v-data-table>
                                <!-- dialog -->
                                <v-dialog v-model="dialog" max-width="290">
                                    <v-card class="pa-4">
                                        <v-card-text>
                                            Удалить выбранные задания?
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn plain flat dense @click="dialog = false">
                                                Отмена
                                            </v-btn>
                                            <v-btn plain flat dense @click="deleteItem">
                                                Удалить
                                            </v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                                <!-- dialog -->
                            </v-card>
                        </v-card>
                    </v-col>
                    <v-col class="pa-0 h-100 d-none" style="max-width: 400px; height: 95%;" :class="{'d-block': openVehicleSidebar}">
                        <v-row justify="space-between" align="center" class="ma-0" style="height: 90px">
                            <div class="text-body-1 px-6 font-weight-medium">
                                Информация о задании
                            </div>
                        </v-row>
                        <v-card class="pa-0 ml-4" style="height: calc(100vh - 140px)">
                            <l-map ref="vehicles_map" style="max-height: 300px; width:100%; position:relative"
                                :zoom="zoom" :center="center" @ready="mapOnReady()">
                                <l-tile-layer :url="url" />
                                <l-control position="topleft">
                                    <div class="white control-fullscreen" @click="openMapFullScreen=!openMapFullScreen">
                                        <v-icon class="indigo--text">mdi-fullscreen</v-icon>
                                    </div>
                                </l-control>
                            </l-map>
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
                                        <v-list-item-subtitle>Сотрудник</v-list-item-subtitle>
                                        <h4>{{ this.itemToShowInformation.name }}</h4>
                                    </div>
                                    <v-divider></v-divider>
                                    <div class="pa-4">
                                        <v-list-item-subtitle>Название</v-list-item-subtitle>
                                        <h4>{{ this.itemToShowInformation.label }}</h4>
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
                                        <v-list-item-subtitle>Периодичность</v-list-item-subtitle>
                                        <h4>{{ this.itemToShowInformation.form }}</h4>
                                    </div>
                                    <v-divider></v-divider>
                                    <v-list-item-subtitle>Форма</v-list-item-subtitle>
                                    <h4>{{ this.itemToShowInformation.from_time }}</h4>
                                    <div class="pa-4">
                                        <v-list-item-subtitle>Теги</v-list-item-subtitle>
                                        <v-chip v-for="tag in this.itemToShowInformation.tags" :key="tag.value"
                                            color="primary" small dark>
                                            {{ tag.text }}
                                        </v-chip>
                                    </div>
                                </div>

                            </template>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </div>

        <CalendarWindow v-model="toggleCalendar" />
    </v-container>
</template>

<script>
    import CalendarWindow from "@/components/MonitoringPage/CalendarWindow";
    import moment from 'moment';
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
            CalendarWindow,
            LMap,
            LTileLayer,
            LControl
        },
        computed: {
            computedHeaders() {
                return this.headers.filter(i => !this.columnsToHide.includes(i.value));
            },
            computedHeadersCog() {
                return this.headers.filter(i => !this.columnsToHideInitially.includes(i.value));
            },
            // test
            getScheduledTasks() {
                console.log(this.$store.getters.getScheduledTasks)
                return this.$store.getters.getScheduledTasks;
            },
        },
        methods: {
            rowClick: function (item) {
                this.itemToShowInformation = item
            },
            hideSearchOnClear() {
                this.showSearchBar = false
                this.search = ''
            },
            formatTimestampToShow(unixtimestamp) {
                if (!this.isMounted)
                    return;
                let result = moment.unix(unixtimestamp).format('DD.MM.YYYY HH:mm');
                return result
            },
            checkSelectGroup(e) {
                this.selectGroupIsChecked = e
            },
            catchGroupName(e) {
                this.selectedGroup = e
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
                this.dialog = false
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
            console.log(this.$refs['checkGroup'])
            this.$root.$on("closeDatePicker", (data) => {
                console.log(data)
                this.toggleCalendar = !data

            });
            this.$root.$on("add-new-scheduled-task", (data) => {
                console.log(data)
            });

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
        data() {
            return {
                itemToShowInformation: null,
                columnsToHideInitially: ['name', 'label', 'actions'],
                showSearchBar: false,
                dialog: false,
                columnsToHide: [],
                columnHide: '',
                singleSelect: false,
                selected: [],
                search: '',
                headers: [{
                        text: 'Сотрудник',
                        align: 'left',
                        value: 'name',

                    },
                    {
                        text: 'Периодичность',
                        value: 'period',

                    },
                    {
                        text: 'Название',
                        value: 'label',


                    },
                    {
                        text: 'Время',
                        value: 'from_time'
                    },
                    {
                        text: 'Теги',
                        value: 'tags'
                    },
                    {
                        text: 'Форма',
                        value: 'form'
                    },
                    {
                        text: 'Удалить',
                        value: 'actions'
                    },

                ],
                tasks: [{
                    id: 1,
                    name: 'Аристарх Николаевич',
                    period: 'Каждую неделю (Вт)',
                    from_time: '18:00',
                    label: 'бАлкомагия на пр.Испытателей',
                    description: 'Какое-то описание',
                    address_tasks: 'Россия, Санкт-Петербург, проспект Испытателей, 31к1',
                    tags: [{
                        text: 'Тэг',
                        value: 'tag_2'
                    }],
                    form: 'Форма',
                    actions: true
                }, ],
                employeeStatus: [
                    'Не назначено',
                    'Назначено',
                    'Прибыл на задание',
                    'Выполнено',
                    'Выполнено с ошибками',
                    'С опозданием',
                    'Не выполнено',
                ],
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
                    text: 'По исполнителю',
                    value: 'name',
                }, {
                    text: 'По периоду',
                    value: 'period'
                }, {
                    text: 'По адресу',
                    value: 'address_tasks'
                }],
            }
        }
    }
</script>

<style scoped>
    .group-header-td {
        position: relative !important
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

    ::v-deep .tasks-scheduled-table .v-data-table__wrapper {
        overflow-y: auto !important;
        height: calc(100vh - 220px);
        overflow-y: auto !important;
    }

    ::v-deep .tasks-scheduled-table .v-card.v-sheet {
        height: 100% !important
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

    ::v-deep .v-data-table-header th:last-of-type {
        visibility: hidden;
        position: absolute;
        right: 0;
        z-index: 10;
    }

    ::v-deep .v-data-table td:last-of-type{
        position: absolute;
          border-bottom: none !important;
    }

    .actions-column {
        position: absolute;
        width: 70px;
        right: 30px;
        padding: 12px 5px;
        text-align: center;
        display: none
    }

    ::v-deep tr.v-data-table__selected {
        background: #e2daff !important;
    }

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

    .import-excel-btn {
        position: absolute;
        top: -45px;
        right: -55px
    }

    .employees-container {
        background-color: #ebebeb;
        overflow: hidden;
    }


    .employee-task-name-cell {
        min-height: auto;
        width: 560px;
        text-overflow: ellipsis;
    }

    ::v-deep .v-data-table-header tr th span {
        font-size: 0.9rem
    }

    ::v-deep .v-data-table-header {
        height: 48px !important;
    }


    ::v-deep .v-data-table tr td {
        height: 48px !important;
    }

      ::v-deep .overlay-map-fullscreen .v-overlay__content {
    position: absolute;
    top: 5%;
    left: 2%;
    bottom: 5%;
    right: 2%;
  }

      ::v-deep .white-space-no-wrap{
          align-self: start !important
      }
</style>