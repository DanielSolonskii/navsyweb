<template>
    <l-control v-if="showRightPanel" disableClickPropagation disableScrollPropagation>
        <v-slide-x-transition>
            <v-card ref="form" class="new-task-page-right-panel elevation-10 ml-4" style="overflow: hidden; ">
                <v-card-text class="card-remove-padding">
                    <v-text-field class="large-task-field px-5 pt-6" ref="name" v-model="taskPointDetailed.name"
                        label="Название задания" placeholder="Новое задание" required>
                    </v-text-field>
                    <v-combobox class="remove-top-space px-5" ref="tags" v-model="taskPointDetailed.tags" :filter="filter"
                        :hide-no-data="!search" :items="tags" :search-input.sync="search" hide-selected multiple>
                        <template v-slot:no-data>
                            <v-list-item>
                                <span class="subheading mr-2">Добавьте</span>
                                <v-chip color="primary">
                                    {{ search }}
                                </v-chip>
                            </v-list-item>
                        </template>
                        <template v-slot:selection="{ attrs, item, parent, selected }">
                            <v-chip v-if="item === Object(item)" v-bind="attrs" color="primary" :input-value="selected"
                                label>
                                <span class="pr-2">
                                    {{ item.text }}
                                </span>
                                <v-icon small @click="parent.selectItem(item)">
                                    mdi-close
                                </v-icon>
                            </v-chip>
                        </template>
                        <template v-slot:item="{ index, item }">
                            <v-chip color="primary" dark label>
                                {{ item.text }}
                            </v-chip>
                        </template>
                    </v-combobox>
                    <v-text-field class="remove-top-space px-5" prepend-icon="mdi-map-marker" ref="address"
                        v-model="taskPointDetailed.address" label="Адрес задания" required></v-text-field>
                    <v-combobox class="radius-variants-combobox" dense flat v-model="radius" :items="radiusVariants">
                    </v-combobox>
                    <v-divider class="sub-combobox-divider"></v-divider>
                    <v-row cols="12" class="time-row px-5">
                        <v-col cols="5">
                            <v-combobox label="Время начала" ref="startTime" prepend-icon="mdi-clock-outline" dense flat
                                v-model="taskPointDetailed.startTime" :items="startTimeVariants">
                            </v-combobox>
                        </v-col>
                        <v-col cols="3">
                            <v-text-field :rules="[rules.minDuration]" ref="duration"
                                v-model="taskPointDetailed.duration" prepend-icon="mdi-routes-clock"
                                class="clock-text-field" type="number">
                            </v-text-field>
                        </v-col>
                        <v-col cols="3" style="position: relative">
                            <p class="label-duration">Продолжительность:</p>
                            <v-select return-object ref="durationVariant" dense flat solo
                                v-model="taskPointDetailed.durationVariant" :items="durationVariants"
                                class="duration-variant">
                                <template v-slot:selection="{ item }">
                                    <div>{{ showDurationVariant(item, taskPointDetailed.duration) }}</div>
                                </template>
                                <template v-slot:item="{ item }">
                                    <div>{{ showDurationVariant(item, taskPointDetailed.duration) }}</div>
                                </template>
                            </v-select>
                        </v-col>
                    </v-row>
                    <v-divider></v-divider>
                    <v-expansion-panels class="px-5" flat>
                        <v-expansion-panel>
                            <v-expansion-panel-header class="additional-info-header" @click="scrollFix = !scrollFix">
                                <v-icon class="additionally-icon mr-2">mdi-clock</v-icon>
                                Дополнительно
                            </v-expansion-panel-header>
                            <v-expansion-panel-content class="remove-bottom-space">
                                <v-row cols="12" class="show-more-remove-spacing">
                                    <v-col cols="1"></v-col>
                                    <v-col cols="4">
                                        <v-text-field ref="delay" v-model="taskPointDetailed.delay"
                                            class="center-text clock-text-field" type="number">
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="6">
                                        <p class="label-delay show-more-label">Допустимое опаздание:</p>
                                        <v-combobox ref="durationVariants" dense flat solo
                                            v-model="taskPointDetailed.delayUnit" :items="durationVariants">
                                        </v-combobox>
                                    </v-col>
                                    <v-col cols="1"></v-col>
                                </v-row>
                                <v-row cols="12" class="show-more-remove-spacing">
                                    <v-col cols="1"></v-col>
                                    <v-col cols="4">
                                        <v-text-field ref="visitDuration" class="center-text clock-text-field"
                                            v-model="taskPointDetailed.visitDuration" type="number">
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="6">
                                        <p class="label-late show-more-label">Длительность визита:</p>
                                        <v-combobox ref="visitDurationUnit" dense flat solo
                                            v-model="taskPointDetailed.visitDurationUnit" :items="durationVariants">
                                        </v-combobox>
                                    </v-col>
                                    <v-col cols="1"></v-col>
                                </v-row>
                                <v-row cols="12" class="show-more-remove-spacing">
                                    <v-col cols="1"></v-col>
                                    <v-col cols="4">
                                        <p class="label-ignore show-more-label">Игнорировать случайные визиты
                                            менее:</p>
                                        <v-text-field ref="ignorRandomVisits" class="center-text clock-text-field"
                                            type="number" v-model="taskPointDetailed.ignorRandomVisits">
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-combobox ref="ignorRandomVisitsUnit" dense flat solo
                                            v-model="taskPointDetailed.ignorRandomVisitsUnit" :items="durationVariants">
                                        </v-combobox>
                                    </v-col>
                                    <v-col cols="1"></v-col>
                                </v-row>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                    <v-divider></v-divider>
                    <div :class="{ 'overflow-scroll': scrollFix }">
                        <v-text-field class="px-5" v-model="description" placeholder="Описание" required></v-text-field>
                        <v-autocomplete class="px-5" ref="description" v-model="taskPointDetailed.description" :items="formList"
                            label="Форма" required>
                            <template v-slot:selection="data">
                                <span>{{ data.item.name }}</span>
                            </template>
                            <template v-slot:item="data">
                                <template>
                                    <v-list-item-content>
                                        <v-list-item-title v-html="data.item.name"></v-list-item-title>
                                        <v-list-item-subtitle v-html="data.item.createdDate"></v-list-item-subtitle>
                                    </v-list-item-content>
                                </template>
                            </template>
                        </v-autocomplete>
                    </div>
                    <div class="add-new-form px-5" @click="addNewForm()">
                        <v-icon class="mr-1" color="primary">mdi-plus-circle-outline</v-icon><span
                            style="color: #1976d2; font-size: 1rem">Создать новую форму</span>
                    </div>
                </v-card-text>
                <v-divider class="mt-12"></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-slide-x-reverse-transition>
                        <v-tooltip left>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn icon class="my-0" v-bind="attrs" @click="resetForm" v-on="on">
                                    <v-icon>mdi-refresh</v-icon>
                                </v-btn>
                            </template>
                            <span>Перезагрузить форму</span>
                        </v-tooltip>
                    </v-slide-x-reverse-transition>

                    <v-btn color="primary" text @click="addScheduledTask">
                        Сохранить
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-slide-x-transition>
    </l-control>
</template>
<script>
    import units from '@/utils/units';
    import {
        LControl,
    } from 'vue2-leaflet';

    export default {
        name: 'RightPanel',

        components: {
            LControl
        },
        data() {
            return {
                // test
                number: 0,
                newTaskCounter: 1,
                // test
                search: null,
                scrollFix: false,
                rules: {
                    minDuration: value => value <= 1 || 'Не может быть отрицательным',
                },
                id: 4,
                newTodoText: "",
                doneFilter: false,
                taskPoints: [],
                taskPointDetailed: {
                    id: 4,
                    employeeName: '',
                    ignorRandomVisitsUnit: {
                        text: 'минут',
                        value: '50'
                    },
                    ignorRandomVisits: 0,

                    search: null,
                    visitDurationUnit: {
                        text: 'минут',
                        value: '50'
                    },
                    duration: 1,
                    durationVariant: {
                        text: 'минут',
                        value: '50'
                    },
                    visitDuration: 0,
                    delayUnit: {
                        text: 'минут',
                        value: '50'
                    },
                    delay: 0,
                    startTime: {
                        text: '00:00',
                        value: '50'
                    },
                    address: null,
                    name: '',
                    tags: [],
                },
                description: '',
                tags: [{
                    text: 'Тэг 6',
                    value: 'tag_6'
                }, {
                    text: 'Тэг 7',
                    value: 'tag_7'
                }],
                durationVariants: [{
                        text: 'минута',
                        value: 'mm'
                    },
                    {
                        text: 'день',
                        value: 'dd'
                    },
                    {
                        text: 'час',
                        value: 'hh'
                    },
                ],
                startTimeVariants: [{
                        text: '00:00',
                        value: '50'
                    },
                    {
                        text: '00:20',
                        value: '150'
                    },
                    {
                        text: '00:40',
                        value: '500'
                    },
                    {
                        text: '00:50',
                        value: '1500'
                    }
                ],
                radius: {
                    text: '50 метров',
                    value: '50'
                },
                radiusVariants: [{
                        text: '50 метров',
                        value: '50'
                    },
                    {
                        text: '150 метров',
                        value: '150'
                    },
                    {
                        text: '500 метров',
                        value: '500'
                    },
                    {
                        text: '1500 метров',
                        value: '1500'
                    }
                ],
                showRightPanel: true,
                formList: [{
                    name: 'Ремонт оборудования',
                    createdDate: '21.07.2017 14:11'
                }, {
                    name: 'Доставка воды',
                    createdDate: '21.07.2017 20:11'
                }]
            }
        },
        methods: {
            //test
            addScheduledTask() {
                this.$store.dispatch("addScheduledTask", Object(this.taskPointDetailed));
                this.$root.$emit("add-new-scheduled-task", true);
            },
            // test
            showDurationVariant(durationVariant, duration) {
                if (!this.isMounted)
                    return;
                console.log(duration, durationVariant.value)
                return units(duration, durationVariant.value);
            },
            addNewForm() {
                console.log('new form')
            },
            filter(item, queryText, itemText) {
                if (item.header) return false

                const hasValue = val => val != null ? val : ''

                const text = hasValue(itemText)
                const query = hasValue(queryText)

                return text.toString()
                    .toLowerCase()
                    .indexOf(query.toString().toLowerCase()) > -1
            },
            // addressCheck() {
            //     this.errorMessages = this.address && !this.name ?
            //         `Hey! I'm required` :
            //         ''

            //     return true
            // },
            resetForm() {
                // this.errorMessages = []
                // this.formHasErrors = false
                Object.keys(this.form).forEach(f => {
                    this.$refs[f].reset()
                })
            },
            submit(data) {
                if (data) {
                    // this.taskPoints.push(this.taskPointDetailed);
                    this.$root.$emit("add-new-point", this.taskPointDetailed);

                }
            },
        },
        beforeMount() {
            this.$root.$emit("add-new-point", this.taskPointDetailed);
        },
        mounted() {
            this.taskPointDetailed.name = 'Новое задание ' + this.newTaskCounter;
            this.isMounted = true;
            this.$root.$on("add-new-point-scheduled-btn-pressed", (data) => {
                this.$store.dispatch("addScheduledTask", Object(this.taskPointDetailed));
                this.submit(data);
                // this.taskPointDetailed.id += 1;
                // console.log(this.taskPointDetailed)
                // this.resetForm();
                this.newTaskCounter += 1;
                this.taskPointDetailed.name = 'Новое задание ' + this.newTaskCounter;
            });
            this.$root.$on("scheduled-task-employee-selected", (data) => {
                this.taskPointDetailed.employeeName = data.label
            });
            this.$root.$on("scheduled-task-deleted", (taskPoints) => {
                this.taskPoints = taskPoints;
            });
            this.$root.$on("scheduled-active-task-point", (data) => {
                this.taskPointDetailed = data
                // console.log(this.taskPointDetailed)
            });

        },
        watch: {
            name() {
                this.errorMessages = ''
            },
        },

        computed: {
            //test
            getScheduledTasks() {
                return this.$store.getters.getScheduledTasks;
            },
            //test
            form() {
                return {
                    name: this.name,
                    tags: this.tags,
                    address: this.address,
                    startTime: this.startTime,
                    duration: this.duration,
                    durationVariant: this.durationVariant,
                    delay: this.delay,
                    durationVariants: this.durationVariants,
                    visitDuration: this.visitDuration,
                    visitDurationUnit: this.visitDurationUnit,
                    ignorRandomVisits: this.ignorRandomVisits,
                    ignorRandomVisitsUnit: this.ignorRandomVisitsUnit
                }
            },
        },
    }
</script>
<style scoped>
    ::v-deep .clock-text-field {
        padding-top: 0;
        margin-top: 0;
    }

    ::v-deep .clock-text-field .v-input__slot,
    ::v-deep .clock-text-field .v-input__control {
        max-width: 40px;
    }

    ::v-deep .time-row .col-4,
    ::v-deep .time-row .col-3,
    ::v-deep .time-row .col-5 {}

    ::v-deep .time-row .v-text-field.v-text-field--solo .v-input__control input {
        min-width: 54px !important;
    }

    .additionally-icon {
        flex: none;
    }

    ::v-deep .center-text input {
        text-align: center
    }

    .add-new-form:hover {
        cursor: pointer;
    }


    .show-more-label {
        position: absolute;
        font-size: 11px;
        color: #9e9e9e !important;
        caret-color: #9e9e9e !important;
        display: none;
        z-index: 1000;
    }

    .v-expansion-panel--active .show-more-label {
        display: block
    }

    .label-delay {
        top: 40px;
        left: 50px;
    }

    .label-late {
        top: 95px;
        left: 50px;
    }

    .label-ignore {
        top: 160px;
        left: 50px;
    }

    .label-duration {
        position: absolute;
        font-size: 11px;
        color: #9e9e9e !important;
        caret-color: #9e9e9e !important;
        white-space: nowrap;
        z-index: 100000;
        top: 0px;
        left: -40px
    }

    ::v-deep .v-messages__message {
        display: none
    }

    ::v-deep .duration-variant .v-input__append-inner {
        margin-left: 52px;
        margin-bottom: 6px
    }

    ::v-deep .v-card__actions {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 370px;
        background-color: white;
    }

    .overflow-scroll {
        /* height: 100px; 
        overflow-x: hidden;
        overflow-y: scroll
        */
    }

    ::v-deep .remove-top-space {
        margin-top: 0;
        padding-top: 0
    }

    ::v-deep .remove-bottom-space .v-expansion-panel-content__wrap {
        margin-bottom: 5px;
        padding-bottom: 0
    }

    ::v-deep .show-more-remove-spacing .col {
        margin-top: 0;
        padding-top: 0;
        margin-bottom: 0;
        padding-bottom: 0;
    }

    ::v-deep .radius-variants-combobox {
        width: 50%;
        margin-left: 14%;
    }

    ::v-deep .sub-combobox-divider {
        margin-bottom: 30px;
        margin-top: 20px
    }

::v-deep .large-task-field input {
  font-size: 18px !important;
  font-weight: bold;
}

::v-deep .card-remove-padding{
    padding: 0
}

::v-deep .additional-info-header{
    padding-left: 3px;
    padding-right: 3px;
}
</style>