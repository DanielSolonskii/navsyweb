<template>
        <l-control v-if="displayHistoryWidget" class="panel-on-map left leaflet-control info-widget"
            disableClickPropagation disableScrollPropagation>
            <v-slide-x-transition>
            <div class="history-widget pa-3 elevation-10">
                <div class="d-flex justify-space-between">
                    <h3 class="tracker-list-header__title">
                        История</h3>
                    <div class="d-flex">
                        <!-- dropdown-test-->
                        <v-menu top>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon v-bind="attrs" v-on="on" class="mr-3">mdi-cog</v-icon>
                            </template>
                            <v-list>
                                <v-list-item v-for="(item, index) in historyOptions" :key="index" @click.stop.prevent>
                                    <v-checkbox :input-value="active"></v-checkbox>
                                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                        <!-- dropdown-test-->
                        <v-icon @click="closeHistoryWidget()">mdi-close</v-icon>
                    </div>
                </div>
                <div>
                    <div class="d-flex justify-center align-center mt-2 mb-2 pa-1 date-info-widget">
                        <v-icon class="mr-6" color="primary">
                            mdi-calendar
                        </v-icon>
                        <div>
                            <p class="range-selector mb-0">
                                {{ this.dateTimeSelected }}
                            </p>
                        </div>
                    </div>
                    <v-tabs v-model="tab" centered class="v-tabs-info-widget">
                        <v-tabs-slider></v-tabs-slider>
                        <v-tab href="#tab-1">
                            Поездки
                        </v-tab>
                        <v-tab href="#tab-2">
                            События
                        </v-tab>
                    </v-tabs>
                    <v-tabs-items v-model="tab">
                        <v-tab-item key="0" value="tab-1">
                            <div class="d-flex justify-space-between align-center mt-4" @click="minimized =!minimized">
                                <div class="d-flex align-center">
                                    <v-fade-transition leave-absolute>
                                        <v-checkbox v-if="!minimized" v-model="ex4" color="primary" value="primary"
                                            hide-details class="mt-0 pt-0"></v-checkbox>
                                    </v-fade-transition>
                                    <p class="mb-0 drivers-name">Антон Газель</p>
                                </div>
                                <div>
                                    <v-fade-transition leave-absolute v-if="!minimized">
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon class="mr-2 pointer-on-hover" v-on="on" v-bind="attrs">
                                                    mdi-palette
                                                </v-icon>
                                            </template>
                                            <span>Выбрать способ раскраски</span>
                                        </v-tooltip>
                                    </v-fade-transition>
                                    <v-fade-transition leave-absolute v-if="!minimized">
                                        <v-menu top>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon v-bind="attrs" v-on="on" class="mr-2 pointer-on-hover">
                                                    mdi-radius
                                                </v-icon>
                                            </template>
                                            <v-list style="min-width: 200px">
                                                <v-slider v-model="slider" class="align-center" :max="max" :min="min"
                                                    hide-details>
                                                    <template v-slot:append>
                                                        <v-text-field v-model="slider" class="mt-0 pt-0" hide-details
                                                            single-line type="number" style="width: 60px">
                                                        </v-text-field>
                                                    </template>
                                                </v-slider>
                                            </v-list>
                                        </v-menu>
                                    </v-fade-transition>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon class="mr-2 pointer-on-hover" v-on="on" v-bind="attrs">
                                                mdi-tray-arrow-down</v-icon>
                                        </template>
                                        <span v-if="minimized">Скачать KML-файл одним треком</span>
                                        <span v-else>Скачать KML-файл с разбиением по поездкам</span>
                                    </v-tooltip>
                                </div>
                            </div>
                            <div>
                                <v-fade-transition leave-absolute>
                                    <v-list-item v-if="minimized" class="pa-0 mt-3">
                                        <div class="d-flex flex-column align-center text-center">
                                            <div class="travel-history-date mb-1">
                                                <div class="travel-history-date__label">
                                                    14:18
                                                </div>
                                                <div class="travel-history-date__tip grey--text">
                                                    20.10.2021
                                                </div>
                                            </div>
                                            <div class="history-check-box-wrapper">
                                                <v-checkbox v-model="ex4" color="primary" value="primary" hide-details
                                                    class="mt-0 pt-0">
                                                </v-checkbox>
                                            </div>
                                            <div class="travel-history-date mt-1">
                                                <div class="travel-history-date__label">
                                                    14:18
                                                </div>
                                                <div class="travel-history-date__tip grey--text">
                                                    20.10.2021
                                                </div>
                                            </div>
                                        </div>
                                        <div class="travel-history-dumbbell">
                                            <v-icon>mdi-circle-small</v-icon>
                                            <div class="travel-history-dumbbell__line"></div>
                                            <v-icon>mdi-circle-small</v-icon>
                                        </div>
                                        <!-- history details -->
                                        <div class="travel-history-details">
                                            <div class="travel-history-details__address grey--text mb-2">
                                                Марпосадское шоссе, 22, Чебоксары, Чувашия, 428011
                                            </div>
                                            <div class="travel-history-details__info">
                                                <div class="travel-history-details__distance has-tooltip"
                                                    data-original-title="null">
                                                    <v-tooltip bottom>
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <v-icon class="pointer-on-hover" v-on="on" v-bind="attrs">
                                                                mdi-directions</v-icon>
                                                        </template>
                                                        <span>Пробег</span>
                                                    </v-tooltip>
                                                    1118.24
                                                    <span class="travel-history-details__units grey--text">
                                                        км
                                                    </span>
                                                </div>
                                                <div class="travel-history-details__duration has-tooltip"
                                                    data-original-title="null">
                                                    <v-tooltip bottom>
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <v-icon class="pointer-on-hover" v-on="on" v-bind="attrs">
                                                                mdi-timelapse</v-icon>
                                                        </template>
                                                        <span>Пробег</span>
                                                    </v-tooltip>
                                                    <div class="travel-history-track-duration d-flex align-center">
                                                        <!----><span>
                                                            5
                                                            <span
                                                                class="travel-history-track-duration__units grey--text">
                                                                д
                                                            </span></span><span>
                                                            10
                                                            <span
                                                                class="travel-history-track-duration__units grey--text">
                                                                ч
                                                            </span></span><span>
                                                            0
                                                            <span
                                                                class="travel-history-track-duration__units grey--text">
                                                                м
                                                            </span></span></div>
                                                </div>
                                            </div>
                                            <div class="travel-history-details__address grey--text mt-2">
                                                97К-009, 101 к721Б, Новочебоксарск, Чувашия, 429965
                                            </div>
                                        </div>
                                        <!-- history details -->
                                    </v-list-item>
                                </v-fade-transition>
                                <v-fade-transition leave-absolute>
                                    <v-list-item v-if="!minimized" class="pa-0 mt-3 d-flex justify-space-between">
                                        <v-checkbox v-model="ex4" color="primary" value="primary" hide-details
                                            class="mt-0 pt-0">
                                        </v-checkbox>
                                        <div>4:17</div>
                                        <div>
                                            <v-icon>mdi-directions</v-icon>
                                            <span class="track-item-mini-view__units grey--text">13
                                                км
                                            </span>
                                        </div>
                                        <div>
                                            <v-icon>mdi-timelapse</v-icon>
                                            <span class="track-item-mini-view__units grey--text">7
                                                м
                                            </span>
                                        </div>

                                        <v-menu offset-y>
                                            <template v-slot:activator="{ on }">
                                                <div class="history-widget-color-picker"
                                                    :style="{ 'background-color': color }" dark v-on="on">
                                                </div>
                                            </template>
                                            <v-color-picker value="#7417BE" v-model="color" hide-canvas hide-inputs
                                                show-swatches class="mx-auto">
                                            </v-color-picker>
                                        </v-menu>
                                    </v-list-item>
                                </v-fade-transition>
                            </div>
                        </v-tab-item>
                        <v-tab-item key="1" value="tab-2">
                            <v-list-item-group v-model="settings" multiple active-class="" class="geozone-item">
                                <v-expansion-panels flat>
                                    <v-expansion-panel hide-actions>
                                        <v-expansion-panel-header class="pl-0 pr-0 pb-0">
                                            <v-list-item class="pa-0">
                                                <template v-slot:default="{ active }">
                                                    <v-list-item-action class="mr-3">
                                                        <v-checkbox :input-value="active"></v-checkbox>
                                                    </v-list-item-action>
                                                    <v-list-item-content>
                                                        <v-list-item-title>Антон Газель (67)</v-list-item-title>
                                                        <v-list-item-subtitle class="mt-2">
                                                            <v-tooltip bottom>
                                                                <template v-slot:activator="{ on, attrs }">
                                                                    <v-icon class="pointer-on-hover" v-on="on"
                                                                        v-bind="attrs">mdi-speedometer</v-icon>
                                                                </template>
                                                                <span>Превышение скорости</span>
                                                            </v-tooltip>
                                                            <span class="ml-3">67</span>
                                                        </v-list-item-subtitle>
                                                    </v-list-item-content>
                                                </template>
                                            </v-list-item>
                                        </v-expansion-panel-header>
                                        <v-expansion-panel-content class="expansion-panel-events">
                                            <v-list>
                                                <v-list-item-group v-model="model">
                                                    <v-list-item v-for="(item, i) in items" :key="i"
                                                        class="expansion-panel-tracker-item pa-0">
                                                        <v-list-item-icon class="mr-0 mt-2 mb-1">
                                                            <v-checkbox class="check-all-checkbox" color="info"
                                                                hide-details>
                                                            </v-checkbox>
                                                        </v-list-item-icon>
                                                        <v-list-item-content class="pa-0">
                                                            <v-list-item-title class="expansion-panel-title"
                                                                v-text="item.text"></v-list-item-title>
                                                            <v-list-item-subtitle class="pr-3" v-if="item.location">
                                                                {{ item.location }}
                                                            </v-list-item-subtitle>
                                                        </v-list-item-content>
                                                        <v-tooltip bottom>
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-icon class="pointer-on-hover" v-on="on"
                                                                    v-bind="attrs">
                                                                    mdi-speedometer</v-icon>
                                                            </template>
                                                            <span>Превышение скорости</span>
                                                        </v-tooltip>
                                                    </v-list-item>
                                                </v-list-item-group>
                                            </v-list>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panels>



                            </v-list-item-group>
                        </v-tab-item>
                    </v-tabs-items>
                </div>
            </div>
            </v-slide-x-transition>
        </l-control>
</template>
<script>
    import moment from 'moment';
    import {
        LControl,
    } from 'vue2-leaflet';

    export default {
        name: 'InfoWidget',

        components: {
            LControl
        },
        data: () => ({
            timestampSelectedStart: '',
            timestampSelectedEnd: '',
            dateStart: '',
            dateEnd: '',
            dateTimeSelected: '',
            // test
            isMounted: false,
            active: true,
            model: {},
            settings: {},
            ex4: null,
            items: [{
                    icon: 'mdi-inbox',
                    text: 'Превышение скорости – 76 км/ч',
                    subtitle: 'true'
                },
                {
                    icon: 'mdi-star',
                    text: 'Превышение скорости – 76 км/ч',
                    online: false
                },
                {
                    icon: 'mdi-send',
                    text: 'Превышение скорости – 76 км/ч',
                    location: 'ул. Энтузиастов, 9, Чебоксары, Чувашия, 428034',
                    online: true
                },
                {
                    icon: 'mdi-email-open',
                    text: 'Превышение скорости – 76 км/ч',
                    online: true
                },
            ],
            historyDate: '',
            minimized: true,
            color: 'pink',
            displayHistoryWidget: true,
            historyOptions: [{
                    title: 'Показывать LBS'
                },
                {
                    title: 'Кластеризовать'
                },
                {
                    title: 'Умный фильтр'
                },
            ],
            tab: null,
        }),
        methods: {
            closeHistoryWidget() {
                this.displayHistoryWidget = !this.displayHistoryWidget;
            },
            formatTimestampToShow(date) {
                if (!this.isMounted)
                    return;
                // let result = moment.unix(unixtimestamp).format('DD.MM.YYYY HH:mm');
                this.dateTimeSelected = date;
                this.timestampSelectedStart = moment(this.dateTimeSelected[0]).unix()
                this.timestampSelectedEnd = moment(this.dateTimeSelected[1]).unix()
                this.dateStart = moment(this.dateTimeSelected[0]).format('DD.MM.YYYY HH.mm')
                this.dateEnd = moment(this.dateTimeSelected[1]).format('DD.MM.YYYY HH.mm')
                this.dateTimeSelected = this.dateStart + ' - ' + this.dateEnd
                // return result
            },
        },
        mounted() {
            this.isMounted = true;
            this.closeHistoryWidget()

            this.$root.$on("show-history", (data) => {
                // format date
                this.dateTimeSelected = data;
                this.timestampSelectedStart = moment(this.dateTimeSelected[0]).unix()
                this.timestampSelectedEnd = moment(this.dateTimeSelected[1]).unix()
                this.dateStart = moment(this.dateTimeSelected[0]).format('DD.MM.YYYY HH.mm')
                this.dateEnd = moment(this.dateTimeSelected[1]).format('DD.MM.YYYY HH.mm')
                this.dateTimeSelected = this.dateStart + ' - ' + this.dateEnd
                // format date
                this.displayHistoryWidget = true
                this.historyDate = data
                console.log(this.dateTimeSelected)
            });
            this.$root.$on("some-root-event", () => {
                // this.closeHistoryWidget()
                 this.displayHistoryWidget = false
                // this.closeInfoWidget()
                // this.selectedInfo = this.selectInfo(data);
                // if (this.displayInfoWidget == false) {
                //     this.closeInfoWidget()
                // }
            });

        },
    }
</script>