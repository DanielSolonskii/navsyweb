<template>
    <div>
        <v-row>
            <v-col style="height: 44px; background-color: #505a64; color: white">
                Качество вождения
            </v-col>
        </v-row>
        <v-row class="mt-0">
            <v-col class="pr-0" cols="2">
                <v-row justify="space-between" align="center" class="ma-0"
                    style="height: 44px; background-color: #505a64; color: white;     box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);">

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

                                <menu-date-time-picker-range v-model="computedDateRange"></menu-date-time-picker-range>

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
                                                        :color="active ? 'primary lighten-1': ''"
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
                                        <v-range-slider v-model="computedControlTimeRange" color="indigo darken-3"
                                            :max="maxTimeControl.unix()" :min="minTimeControl.unix()" step="1800"
                                            hide-details>
                                        </v-range-slider>
                                        <div class="text-center mt-n2">
                                            <span class="indigo--text pointer-on-hover px-1" style="font-size: small"
                                                @click="setControlRangeTimeDay()">
                                                День
                                            </span>
                                            <span class="indigo--text pointer-on-hover px-1" style="font-size: small"
                                                @click="setControlRangeTimeNight()">
                                                Ночь
                                            </span>
                                            <span class="indigo--text pointer-on-hover px-1" style="font-size: small"
                                                @click="setControlRangeTimeDefault()">
                                                Всегда
                                            </span>
                                        </div>
                                    </v-col>
                                </v-row>
                                <v-row class="ma-0">
                                    <v-checkbox v-model="showSeconds" label="Показывать секунды"></v-checkbox>
                                </v-row>
                                <v-row class="ma-0">
                                    <v-btn @click="penaltyOptionsShow">Настройки штрафов</v-btn>
                                </v-row>
                                <v-row style="height: 44px; background-color: #505a64; color: white" class="ma-0">
                                    Качество вождения
                                </v-row>
                                <v-row class="ma-0">
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

                        </v-tab-item>
                        <v-tab-item :key="2" value="contact">
                            <v-card flat>
                                <v-card-text>contact</v-card-text>
                            </v-card>
                        </v-tab-item>
                    </v-tabs-items>
                </v-row>

            </v-col>
            <v-col class="pl-0" cols="9">
                <v-row justify="space-between" align="center" class="ma-0"
                    style="height: 48px; background-color: #505a64; color: white">
                    <div class="cols-header">
                        Параметры
                    </div>
                </v-row>
                <v-card class="pa-0" style="height: calc(100%);">

                </v-card>
            </v-col>
        </v-row>
    </div>
</template>
<script>
    import MenuDateTimePickerRange from "@/components/EcoDrivingDateTimePickerRange";
    import moment from "moment";

    export default {
        components: {
            MenuDateTimePickerRange
        },
        data() {
            return {
                penaltyOptionsShow: false,
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
                showSeconds: true,
                maxTimeControl: moment().hours(23).minutes(59).seconds(59),
                minTimeControl: moment().hours(0).minutes(0).seconds(0),
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
                    plugin: {},

                },
                arrayWeekDays: [1, 2, 3, 4, 5, 6, 0].map(i => moment().day(i)),
                tab: "subscribe",
            }
        },
        computed: {
            computedControlTimeRange: {
                get() {
                    return [moment(this.parametersReport.time_filter.from).unix(), moment(this.parametersReport
                        .time_filter.to).unix()]
                },
                set(range) {
                    this.parametersReport.time_filter.from = new Date(range[0] * 1000)
                    this.parametersReport.time_filter.to = new Date(range[1] * 1000)
                    return range
                },
            },
            computeControlTimeTitle: {
                get() {
                    return "Время контроля: " + moment(this.parametersReport.time_filter.from).format('HH:mm') +
                        " - " +
                        moment(this.parametersReport.time_filter.to).format('HH:mm')
                }
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
        },
        methods: {
            onOpen(e) {
                // ignore initial open
                if (!this.__initial) {
                    this.__initial = true
                    return
                }

                console.log('toggle arrow clicked', e)
            },
            onSelected(e) {
                console.log('checkbox clicked', e)
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
        }
    }
</script>
<style scoped>
    .cols-header {
        padding-left: 30px
    }

    ::v-deep .employees-selection-tree .v-treeview-node__toggle,
    ::v-deep .employees-selection-tree .v-treeview-node__level {
        display: none
    }

    ::v-deep .v-treeview-node__root {
        background-color: #f4f7f9
    }

    ::v-deep .v-slide-group__content {
        justify-content: center;
    }
</style>