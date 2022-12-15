<template>
    <v-slide-x-transition>
        <l-control position="topleft" disableClickPropagation disableScrollPropagation>
            <div class="d-flex">
                <v-btn @click="$router.push('tasks')" class="left-panel-go-back-btn white elevation-4 mr-3" icon
                    color>
                    <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
                <v-card ref="form" class="elevation-10 new-task-left-panel">
                    <v-card-text class="pa-3">
                        <v-combobox v-if="!selectedEmployee || selectedEmployee.id == null" @click="active = true"
                            single-line label="Выберите исполнителя">
                        </v-combobox>
                        <div>
                            <template v-if="selectedEmployee && selectedEmployee.id != null">

                                <v-list-item class="pr-0 align-center" @click="active = true">
                                    <v-avatar size="36px" class="mr-2">
                                        <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John">
                                    </v-avatar>
                                    <v-list-item-content style="justify-content: space-between">
                                        <div class="pa-0 flex-column">
                                            <v-list-item-title style="align-self: start">
                                                {{ selectedEmployee.label }}
                                            </v-list-item-title>
                                            <v-list-item-subtitle style="align-self: start">
                                                {{ selectedEmployee.label }}
                                            </v-list-item-subtitle>
                                        </div>
                                        <div>
                                            <v-icon class="select-chevron" :class="{activated: active}">mdi-chevron-down
                                            </v-icon>
                                            <v-icon class="ml-3">mdi-crosshairs-gps</v-icon>
                                        </div>
                                    </v-list-item-content>
                                </v-list-item>
                            </template>
                        </div>
                        <v-card v-if="active" v-click-outside="onClickOutside"
                            class="mx-auto employees-panel elevation-15">
                            <div style="position: absolute !important; left: -40px; top:-50px; z-index: 10000"
                                class="employee-task-select-panel pa-3 elevation-15">
                                <div>
                                    <v-tabs v-model="tab" centered>
                                        <v-tabs-slider></v-tabs-slider>
                                        <v-tab href="#tab-1">
                                            По алфавиту
                                        </v-tab>
                                        <v-tab href="#tab-2">
                                            По расстоянию
                                        </v-tab>
                                    </v-tabs>
                                    <v-tabs-items v-model="tab">
                                        <v-tab-item key="0" value="tab-1">
                                            <div class="d-flex align-center mb-6 mt-6"
                                                style="max-width: 300px; margin: auto ">
                                                <v-icon class="mr-2">mdi-magnify</v-icon>
                                                <v-text-field label="Поиск" hide-details single-line class="mt-0 pt-0">
                                                </v-text-field>
                                            </div>
                                            <v-divider></v-divider>
                                            <template v-if="groupNames.success">
                                                <div v-for="list in this.groups" :key="list.individualId">
                                                    <v-list class="pt-0">
                                                        <v-list-item-group v-model="model">
                                                            <div v-for="item in list.markers" :key="item.id"
                                                                class="bottom-light-box-shadow pt-1px">
                                                                <v-list-item class="pr-0 align-center"
                                                                    @click="selectEmployee(item)">
                                                                    <template>

                                                                        <v-avatar size="36px" class="mr-2">
                                                                            <img src="https://cdn.vuetifyjs.com/images/john.jpg"
                                                                                alt="John">
                                                                        </v-avatar>
                                                                        <v-list-item-content class="pa-0 flex-column">
                                                                            <v-list-item-title
                                                                                style="align-self: start">
                                                                                {{ item.label }}
                                                                            </v-list-item-title>
                                                                            <v-list-item-subtitle
                                                                                style="align-self: start">
                                                                                {{ item.label }}
                                                                            </v-list-item-subtitle>
                                                                        </v-list-item-content>
                                                                    </template>
                                                                </v-list-item>
                                                            </div>
                                                        </v-list-item-group>
                                                    </v-list>
                                                </div>
                                            </template>
                                        </v-tab-item>
                                        <v-tab-item key="1" value="tab-2">

                                        </v-tab-item>
                                    </v-tabs-items>
                                </div>
                            </div>
                        </v-card>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-dialog v-model="dialog" class="v-dialog-left-panel pa-3">
                        <v-card>
                            <v-tabs v-model="dateTabControl" color="primary accent-4" centered>
                                <v-tab href="#week-tab">Каждую неделю</v-tab>
                                <v-tab href="#month-tab">Каждый месяц</v-tab>

                                <v-tab-item value="week-tab">
                                    <v-container fluid class="pa-5">
                                        <v-row class="mb-2">
                                            Выполнять задание в эти дни недели:
                                        </v-row>
                                        <v-row style="margin: auto; justify-content: space-between;">
                                            <v-avatar :key="item.id" v-for="item in weekDays"
                                                v-bind:class="{ active: item.active }" v-on:click="toggleActive(item)"
                                                size="36px" class="mr-2 pointer-on-hover" color="grey">
                                                <span class="white--text">{{item.text}}</span>
                                            </v-avatar>
                                        </v-row>
                                        <v-row
                                            style="justify-content: space-between; max-width: 80%; margin:auto; margin-top: 24px">
                                            <v-chip :key="item.id" v-for="item in daysPresets"
                                                v-bind:class="{ active: item.active }"
                                                v-on:click="toggleActivePreset(item)" class="pointer-on-hover">
                                                {{ item.text }}</v-chip>
                                        </v-row>
                                    </v-container>
                                </v-tab-item>
                                <v-tab-item value="month-tab">
                                    <v-container fluid>
                                        <v-row>
                                            <span class="pa-2">Выполнять задание в эти дни месяца:</span>
                                            <div class="month-picker-days">
                                                <div class="month-picker-day pointer-on-hover" :key="item.text"
                                                    v-for="item in monthDays" v-bind:class="{ active: item.active }"
                                                    v-on:click="toggleActive(item)">
                                                    {{ item.text }}</div>
                                            </div>
                                        </v-row>
                                    </v-container>
                                </v-tab-item>
                            </v-tabs>
                            <v-card-actions style="align-items: end">
                                <v-btn style="align-self: right" color="primary" text @click="selectSchedule">
                                    Выбрать
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-text-field v-model="task.name" class="pa-4 large-task-field" label="Название маршрута"
                        placeholder="Новый маршрут" required>
                    </v-text-field>
                    <v-row cols="12" class="pa-3">
                        <v-col cols="4">
                            <v-icon class="mr-1">mdi-map-marker</v-icon>
                            <span>{{ taskPoints.length }} места</span>
                        </v-col>
                        <v-col cols="4">
                            <v-icon class="mr-1">mdi-road</v-icon>
                            <span>0:00 км</span>
                        </v-col>
                        <v-col cols="4">
                        </v-col>
                    </v-row>
                    <v-divider></v-divider>
                    <div class="task-point-panel" style="overflow-x: hidden">
                        <draggable v-model="taskPoints" :disabled='!enableDraggable'>
                            <v-list-item v-for="(taskPoint, index) in taskPoints" :key="taskPoint.name"
                                @click="toggleTaskActivePoint(index)" @mouseover="showDeleteButton(index)"
                                @mouseleave="showDeleteIndex = null" class="task-point-item">
                                <v-list-item-content class="task-item pa-3">
                                    <div v-if="activeTask === index" class="task-item-selected-line"></div>
                                    <div class="task-item-index">
                                        {{index + 1}}</div>
                                    <div>
                                        <h2>{{ taskPoint.name}}</h2>
                                        <v-list-item-title v-if="taskPoint.address">{{ taskPoint.address}}
                                        </v-list-item-title>
                                        <v-list-item-title v-else>Адрес не указан</v-list-item-title>
                                        <v-list-item-subtitle>Время начала:
                                            {{ taskPoint.startTime.text}}<span>&nbsp;</span>({{ taskPoint.duration }}<span>&nbsp;</span>{{ showDurationVariant(taskPoint.durationVariant, taskPoint.duration) }})
                                        </v-list-item-subtitle>
                                    </div>
                                    <v-icon @mouseover="enableDraggableOnHover" @mouseleave="disableDraggableOnLeave"
                                        v-if="showDeleteIndex === index" class="drag-task-point-btn">mdi-drag
                                    </v-icon>
                                    <v-icon class="delete-task-point-btn" v-if="showDeleteIndex === index"
                                        @click.stop="deleteTaskPoint(index)">mdi-close</v-icon>
                                </v-list-item-content>
                            </v-list-item>
                        </draggable>
                    </div>
                    <div>
                        <v-divider></v-divider>
                        <v-list-item class="add-new-point-section" @click="addNewPoint()">
                            <v-icon class="mr-2" style="font-size: 30px; color: #1e96dc !important;">
                                mdi-plus-circle-outline
                            </v-icon>
                            <h3 class="new-form">Добавить новую точку</h3>
                        </v-list-item>
                    </div>
                </v-card>
            </div>
        </l-control>
    </v-slide-x-transition>
</template>
<script>
    import draggable from "vuedraggable";
    import units from '@/utils/units';
    import {
        LControl,
    } from 'vue2-leaflet';

    export default {
        name: 'RightPanel',

        components: {
            LControl,
            draggable
        },
        data() {
            return {
                hhCases: {
                    nom: 'час',
                    gen: 'часа',
                    plu: 'часов'
                },
                isMounted: false,
                id: 4,
                everyDay: true,
                selectedEmployee: null,
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
                enableDraggable: null,
                showDeleteIndex: null,
                activeTask: null,
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
                task: {
                    name: 'Новый маршрут',
                    selectedEmployeeLabel: '',
                },
                taskPoints: [{
                    id: 1,
                    name: 'Новое задание 1',
                    address: 'Адрес не указан',
                    startTime: '0:00',
                    duration: 1,
                    durationVariant: {
                        text: 'минут',
                        value: 'mm'
                    },
                }, ],
                tab: null,
                scheduledDays: [],
                dateTabControl: '',
                triggerScheduleVariant: 'week-tab',
                daysPresetActive: false,
                daysPresets: [{
                        text: 'Всегда',
                        active: false,
                        id: 11
                    },
                    {
                        text: 'Будни',
                        active: false,
                        id: 12
                    },
                    {
                        text: 'Выходные',
                        active: false,
                        id: 13
                    }
                ],
                weekDays: [{
                        text: 'пн',
                        active: false,
                        id: 1,
                    },
                    {
                        text: 'вт',
                        active: false,
                        id: 2,
                    },
                    {
                        text: 'ср',
                        active: false,
                        id: 3,
                    },
                    {
                        text: 'чт',
                        active: false,
                        id: 4,
                    },
                    {
                        text: 'пт',
                        active: false,
                        id: 5,
                    },
                    {
                        text: 'сб',
                        active: false,
                        id: 6,
                    },
                    {
                        text: 'вс',
                        active: false,
                        id: 7,
                    }
                ],
                groups: null,
                monthDays: [],
                dialog: false,
                active: false,
                showRightPanel: true,
                errorMessages: '',
                address: null,
                city: null,
                state: null,
                zip: null,
                country: null,
                formHasErrors: false,
                countries: ['Afghanistan', 'Albania']
            }
        },
        methods: {
            taskActiveEdit(index) {

                // console.log(index)
                index = (typeof index !== 'undefined') ? index : 0;
                this.$root.$emit("active-task-point", this.taskPoints[index]);
                // return this.taskPoints[index];
            },
            addNewPoint() {
                // const curentIndex = this.taskPoints.length - 1;
                // this.taskActiveEdit(curentIndex);
                this.$root.$emit("add-new-point-btn-pressed", true);
            },
            setUndefinedEmployee() {
                this.undefinedEmployeeSelected = true
            },
            selectEmployee(item) {
                this.selectedEmployee = item;
                this.active = false;
            },
            showDeleteButton(index) {
                this.showDeleteIndex = index;
            },
            disableDraggableOnLeave() {
                this.enableDraggable = false;
            },
            enableDraggableOnHover() {
                this.enableDraggable = true;
            },
            deleteTaskPoint(index) {
                // console.log(index)
                this.taskPoints.splice(index, 1)
                this.$root.$emit('task-deleted', this.taskPoints);
            },
            toggleTaskActivePoint(index) {
                this.activeTask = index;
                this.taskActiveEdit(index);
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
                groups[0].markers.push({
                    "id": null,
                    "label": "Исполнитель не выбран",
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
                })
                return groups
            },
            onClickOutside() {
                this.active = false
            },
            initSchedule() {
                this.triggerScheduleVariant = 'week-tab';
                this.weekDays.forEach(day => {
                    day.active = true
                    this.scheduledDays.push(day)
                });

            },
            selectSchedule() {
                this.dialog = false
                this.scheduledDays = []
                let selectArray = (this.dateTabControl === 'month-tab') ? this.monthDays : this.weekDays;
                selectArray.forEach(day => {
                    if (day.active === true) {
                        this.scheduledDays.push(day)
                    }
                });
                this.triggerScheduleVariant = this.dateTabControl;

            },
            toggleActivePreset(item) {
                this.daysPresetActive = !this.daysPresetActive
                this.daysPresets.forEach(day => {
                    day.active = false
                })
                item.active = !item.active;
                if (item.id === 11) {
                    this.weekDays.forEach(weekday => {
                        weekday.active = true
                    })
                }
                let switchWeekend = false
                if (item.id === 12 || item.id === 13) {
                    if (item.id === 12) {
                        switchWeekend = false
                    } else if (item.id === 13) {
                        switchWeekend = true
                    }
                    // console.log(switchWeekend)
                    for (let weekday of this.weekDays) {
                        weekday.active = !switchWeekend
                        if (weekday.id === 6 || weekday.id === 7) {
                            weekday.active = switchWeekend
                        }
                    }
                }
            },
            toggleActive(item) {
                item.active = !item.active;
                if (item.id === 11) {
                    this.weekDays.forEach(weekday => {
                        weekday.active = true
                    })
                }
            },
            populate() {
                for (var i = 1; i < 32; i++) {
                    this.monthDays.push({
                        text: i,
                        active: false
                    });
                }
            },
            addressCheck() {
                this.errorMessages = this.address && !this.name ?
                    `Hey! I'm required` :
                    ''

                return true
            },
            resetForm() {
                this.errorMessages = []
                this.formHasErrors = false

                Object.keys(this.form).forEach(f => {
                    this.$refs[f].reset()
                })
            },
            saveScheduleToTask() {
                this.task.scheduledDays = this.scheduledDays;
                this.task.scheduleVariant = this.triggerScheduleVariant;
            },
            submit() {
                this.formHasErrors = false
                Object.keys(this.form).forEach(f => {
                    if (!this.form[f]) this.formHasErrors = true
                    this.$refs[f].validate(true)
                })
            },
            showDurationVariant(durationVariant, duration) {
                if (!this.isMounted)
                    return;
                return units(duration, durationVariant.value);
            }
        },
        beforeMount() {
            this.initSchedule();
            this.saveScheduleToTask();
        },
        mounted() {
            this.isMounted = true;
            // this.taskActiveEdit();
            this.$root.$on("add-new-scheduled-task", (data) => {
                if (data) {
                    this.task.taskPoints = this.taskPoints;
                    this.saveScheduleToTask();
                    if (this.selectedEmployee) {
                        this.task.selectedEmployeeLabel = this.selectedEmployee.label
                    } else {
                        this.task.selectedEmployeeLabel = 'Исполнитель не выбран'
                    }

                    // console.log(JSON.stringify(this.task))
                }
            });
            this.$root.$on("add-new-point", (data) => {
                // console.log(data)
                // data.id = this.id;
                // this.id +=1;
                // let taskPoint = {
                //     ...data
                // };
                let taskPoint = JSON.parse(JSON.stringify(data))
                // console.log(JSON.stringify(taskPoint))
                this.taskPoints.push(taskPoint);
                // console.log(this.taskPoints);
                this.$store.dispatch("addTask", Object(this.taskPointDetailed));
            });
            this.groups = this.formData();
            this.populate()

        },
        watch: {
            name() {
                this.errorMessages = ''
            },
            selectedEmployee: function () {
                // console.log(this.selectedEmployee)
                this.$root.$emit('scheduled-task-employee-selected', this.selectedEmployee);
            },
            scheduledDays: function (value) {
                if (value.length === 7) {
                    this.everyDay = true;
                } else {
                    this.everyDay = false;
                }
            },

        },
        computed: {
            getScheduledTasks() {
                return this.$store.getters.getTasks;
            },


        },
    }
</script>
<style scoped>
    ::v-deep .v-dialog {
        width: 400px !important
    }

    .month-picker-days {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        margin: 16px 16px 8px;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
    }

    .month-picker-day {
        margin: 8px;
        border-radius: 100%;
        min-width: 36px;
        height: 36px;
        text-align: center;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        text-transform: uppercase;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    .active {
        background-color: #1e96dc !important;
        color: #fff;
    }

    ::v-deep .new-task-left-panel {
        width: 370px;
        padding: 0;
        height: 95vh
    }

    .left-panel-go-back-btn {
        width: 40px;
        height: 40px;
    }

    .task-item {
        padding-top: 20px
    }

    .task-item-index {
        border-color: #1e96dc;
        border: 3px solid;
        border-radius: 100%;
        width: 26px;
        height: 26px;
        margin-right: 16px;
        text-align: center;
        font-weight: bold;
        font-size: 13px;
        line-height: 19px;
        -ms-flex-item-align: start;
        align-self: flex-start;

        border-color: #1e96dc;
        color: #1e96dc;
    }

    .v-list-item__content>* {
        flex: none
    }

    .task-item-selected-line {
        width: 3px;
        height: 80px;
        position: absolute;
        left: -16px;
        background-color: #1e96dc !important;
    }

    .delete-task-point-btn {
        position: absolute;
        top: 5px;
        right: 5px
    }

    .drag-task-point-btn {
        position: absolute;
        top: 0;
        right: 50%
    }

    .drag-task-point-btn:hover {
        cursor: move
    }

    .header-title {
        order: 1;
    }

    .icon-in-expansion-header {
        order: 0;
        margin-right: 10px
    }

    .select-chevron.activated {
        transform: rotate(-180deg);
    }

    .employee-task-select-panel {
        left: 685px;
        width: 330px;
        background-color: rgb(255, 255, 255);
        border-radius: 4px;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        flex-direction: column;
        min-height: 500px;
        max-height: calc(100% - 40px);
        transition: transform 0.2s ease-in-out 0s, -webkit-transform 0.2s ease-in-out 0s;
        position: fixed;

    }

    ::v-deep .v-slide-group__prev,
    ::v-deep .v-slide-group__next {
        display: none !important;
    }

    .new-form {
        color: #1e96dc !important;
    }

    .task-point-panel {
        max-height: 450px;
        overflow: auto;
    }

    .task-point-item {
        padding: 0;
        padding-top: 10px;
        padding-bottom: 10px
    }

    .add-new-point-section {
        padding: 10px;
    }

    .small-grey-text {
        font-size: 11px;
        color: rgba(0, 0, 0, 0.54);
    }

    ::v-deep .large-task-field input {
        font-size: 18px !important;
        font-weight: bold;
    }
</style>