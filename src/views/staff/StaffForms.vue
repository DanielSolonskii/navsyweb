<template>
    <v-container fluid class="pa-0 d-flex flex-column h-100">
        <v-overlay absolute :value="confirmRemoveGarage" class="overlay-confirm-remove"
            :class="{'active': confirmRemoveGarage}">
            <v-card light width="400px" height="100px" rounded="0">
                <v-card-text>
                    <v-row>
                        <v-col>Удалить форму <span>"{{ garage.name }}"</span>?</v-col>
                    </v-row>
                    <v-row>
                        <v-col class="ml-auto pa-0" style="max-width: 180px">
                            <v-btn text small @click="confirmRemoveGarage=false">
                                Отмена
                            </v-btn>
                            <v-btn text small color="primary" @click="deleteItem()">
                                Удалить
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-overlay>
        <v-overlay absolute :value="openFormGarage" class="overlay-form-content">
            <v-card light width="100%" height="100%" rounded="0" class="d-flex flex-column pa-4">
                <div>
                    Редактирование формы
                </div>

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

        <v-container fluid class="h-100 pa-2" style="height: calc(100% - 90px);">
            <v-row justify="space-between" align="center" class="ma-0">
                <v-col style="max-width: 80px">
                    <v-btn fab dark large color="primary" @click="openFormGarage=!openFormGarage">
                        <v-icon>
                            mdi-plus
                        </v-icon>
                    </v-btn>
                </v-col>
                <v-col>
                    <div class="font-weight-medium vehicle-header">
                        <h3>Формы</h3>
                    </div>
                </v-col>
                <v-col style="max-width: 55px">
                    <v-btn icon @click="showSearchBar = !showSearchBar">
                        <v-icon size="28">
                            mdi-magnify
                        </v-icon>
                    </v-btn>
                </v-col>
                <v-slide-x-transition>
                    <v-col cols="auto" class="px-0" v-if="showSearchBar">
                        <v-row class="mr-2">
                            <v-text-field @click:clear="hideSearchOnClear" clearable class="pt-0 mt-0" v-model="search"
                                label="Поиск" single-line hide-details>
                            </v-text-field>

                        </v-row>
                    </v-col>
                </v-slide-x-transition>
                <v-col cols="auto" class="px-0">
                </v-col>
            </v-row>
            <v-card style="height: calc(100% - 80px)" class="pa-0">
                <v-row class="ma-0" align="center" style="min-height: 44px; height: 80px    ">
                    <v-col style="max-width: 150px" class="py-1">
                        <span class="text-body-2 grey--text text--darken-1">Группировать по:</span>
                    </v-col>
                    <v-col class="py-1" style="max-width: 200px">
                        <v-select v-model="tableGroup" dense single-line :items="groupsTable" hide-details
                            class="select-group ma-0">
                        </v-select>
                    </v-col>
                    <v-col class="py-1"></v-col>
                    <v-col class="py-1 text-center d-flex" style="max-width: 50px">
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
                                    <v-list-item-group multiple color="primary">
                                        <v-list-item v-for="item in computedHeadersCog" :key="item.value"
                                            :value="item.value" dense>
                                            <template>
                                                <v-list-item-action class="ma-1">
                                                    <v-checkbox input-value="true" @click="toggleColumn(item)"
                                                        color="primary">
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
                <v-data-table v-model="selected" show-select :group-by="tableGroup" dense calculate-widths
                    :headers="computedHeaders" :items="tasks" item-key="id" class="elevation-1 table-staff-forms"
                    @dblclick:row="editGarage" :search="search" @click:row="rowClick" :loading="loadingGarage"
                    hide-default-footer fixed-header height="100%">
                    <template v-slot:item.actions="{item}">
                        <div class="actions-column">
                            <v-btn icon>
                                <v-icon class="px-1">
                                    mdi-clipboard-check
                                </v-icon>
                            </v-btn>
                            <v-btn icon @click="editGarage(item)">
                                <v-icon class="px-1">
                                    mdi-pencil
                                </v-icon>
                            </v-btn>
                            <v-btn icon>
                                <v-icon class="px-1">
                                    mdi-content-copy
                                </v-icon>
                            </v-btn>
                            <v-btn icon>
                                <v-icon class="px-1">
                                    mdi-star
                                </v-icon>
                            </v-btn>
                            <v-btn icon @click.stop="dialog = true">
                                <v-icon class="px-1">
                                    mdi-trash-can-outline
                                </v-icon>
                            </v-btn>
                        </div>

                    </template>
                    <template v-slot:item.created="{ item }">
                        <span>{{ formatTimestampToShow(item.created) }}</span>
                    </template>
                    <template v-slot:item.changed="{ item }">
                        <span>{{ formatTimestampToShow(item.changed) }}</span>
                    </template>
                    <template v-slot:group.header="{group, toggle, isOpen}">
                        <td class="fix-height">
                            <v-checkbox ref="checkGroup" color="primary" @click="selectGroup(group)"
                                @change="checkSelectGroup"></v-checkbox>
                        </td>
                        <td :colspan="headers.length">
                            <div class="d-flex justify-space-between mt-0 header-group-cursor" @click="toggle">
                                <h3>{{ formatTimestampToShow(group) }}</h3>
                                <v-icon class="mr-4 mt-0 pt-0">
                                    {{ isOpen ? 'mdi-minus' : 'mdi-plus' }}
                                </v-icon>
                            </div>
                        </td>
                    </template>
                </v-data-table>
                <!-- dialog -->
                <v-dialog v-model="dialog" max-width="290">
                    <v-card class="pa-4">
                        <v-card-text>
                            Удалить выбранные формы?
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
        </v-container>
    </v-container>
</template>

<script>
    import moment from 'moment';
    export default {
        name: "StaffForms",
        components: {},
        computed: {
            computedHeaders() {
                return this.headers.filter(i => !this.columnsToHide.includes(i.value));
            },
            computedHeadersCog() {
                return this.headers.filter(i => !this.columnsToHideInitially.includes(i.value));
            },
        },
        methods: {
            toggleColumn(item) {
                let arr = this.columnsToHide
                if (arr.includes(item.value)) {
                    arr.splice(arr.indexOf(item.value), 1);
                    return;
                }
                arr.push(item.value);
                this.columnsToHide = arr
            },
            deleteItem() {
                for (var i = 0; i < this.selected.length; i++) {
                    const index = this.tasks.indexOf(this.selected[i]);
                    this.tasks.splice(index, 1);
                }
                this.dialog = false;
            },
            hideSearchOnClear() {
                this.showSearchBar = false
                this.search = ''
            },
            formatTimestampToShow(unixtimestamp) {
                if (!this.isMounted)
                    return;
                let result = moment.unix(unixtimestamp).format('DD.MM.YYYY');
                return result
            },
            clearSearchCar() {
                this.searchCar = ''
                this.showSearchCar = false
                this.$refs["search-car"].blur();
            },
            openSearchCar() {
                this.showSearchCar = true
                this.$refs["search-car"].focus();
            },
            // clearSearchGarage() {
            //   this.searchGarage = ''
            //   this.showSearchGarage = false
            //   this.$refs["search-garage"].blur();
            // },
            // openSearchGarage() {
            //   this.showSearchGarage=true;
            //   this.$refs["search-garage"].focus();
            // },

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
            dialog: false,
            selected: [],
            showSearchBar: false,
            tableGroup: null,
            columnsToHide: [],
            columnsToHideInitially: ['name', 'actions'],
            isMounted: false,
            tabs: 'vehicles',
            vehicle: {
                name: ''
            },
            garage: {
                name: ''
            },
            headers: [{
                    text: 'Название формы',
                    align: 'left',
                    value: 'name',

                },
                {
                    text: 'Описание формы',
                    value: 'description',

                },
                {
                    text: 'Создана',
                    value: 'created',

                },
                {
                    text: 'Изменена',
                    value: 'changed'
                },
                {
                    text: 'Заполнений',
                    value: 'filled_times'
                },
                {
                    text: 'Полей',
                    value: 'fields_count'
                },
                {
                    text: 'Форма по умолчанию',
                    value: 'default_form'
                },
                {
                    text: 'Удалить',
                    value: 'actions'
                },

            ],
            tasks: [{
                    id: 1,
                    name: 'Ремонт оборудования',
                    description: 'Заполнить по итогам ремонта',
                    created: 1637838093,
                    changed: 1637838353,
                    filled_times: 6,
                    fields_count: 7,
                    default_form: '-',
                },

            ],
            openFormGarage: false,
            openFormCar: false,
            confirmRemoveVehicle: false,
            confirmRemoveGarage: false,
            openFormRouteTask: false,
            tabsFormCar: 'data_ts',
            searchCar: '',
            showSearchCar: false,
            searchGarage: '',
            openVehicleSidebar: false,
            openMapFullScreen: false,
            addCar: false,
            loadingCars: false,
            loadingGarage: false,
            tableCarsGroup: null,
            selectedVehicle: null,
            groupsTable: [{
                text: 'Не группировать',
                value: null
            }, {
                text: 'Создана',
                value: 'created',
            }, {
                text: 'Изменена',
                value: 'changed'
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
        }),
        mounted() {
            this.isMounted = true;
        },

    }
</script>
<style>

</style>

<style scoped>
    ::v-deep .v-data-table-header th:last-of-type {
        display: none
    }

    ::v-deep .select-group .v-select__selection {
        font-size: 14px;
    }

    ::v-deep .table-staff-forms tbody tr {
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
        width: 270px;
        right: 30px;
        text-align: center;
        display: none;

    }

    ::v-deep .v-data-table td:last-of-type {
        position: absolute;
          border-bottom: none !important;
    }


    ::v-deep tr.v-data-table__selected {
        background: #e2daff !important;
    }

    ::v-deep tr.v-data-table__selected .actions-column {
        position: absolute;
        width: 170px;
        right: 30px;
        padding: 12px 5px;
        text-align: center;
        display: none
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

    .table-staff-forms {
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

    ::v-deep .v-data-table-header tr th span {
        font-size: 0.9rem
    }

    ::v-deep .v-data-table-header {
        height: 48px !important;
    }


    ::v-deep .table-staff-forms tr:hover .edit-table-section {
        display: block;

    }

    ::v-deep .table-staff-forms .edit-table-section {
        transform: translateY(10px);
        display: none;

    }

    ::v-deep .table-staff-forms tr>td:last-of-type .edit-table-section {
        position: absolute;
        right: 0;
        top: auto;
        z-index: 10;
        transform: translate(-40%, -40%);
    }

      ::v-deep .overlay-map-fullscreen .v-overlay__content {
    position: absolute;
    top: 5%;
    left: 2%;
    bottom: 5%;
    right: 2%;
  }

</style>