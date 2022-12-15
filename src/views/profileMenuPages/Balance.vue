<template>
    <v-row class="height: 100%">
        <v-col cols="6" class="height: 100%">
            <v-row justify="space-between" align="center" class="ma-0" style="background-color: #505a64; color: white">
                <div class="cols-header pa-2">
                    Пополнение баланса
                </div>
            </v-row>
            <v-row>

                <v-col :cols="4">
                    <v-tabs v-model="tab" vertical>
                        <v-tab v-for="item in items" :key="item.tab">
                            <v-icon>{{ item.icon }}</v-icon>
                            {{ item.tab }}
                        </v-tab>
                    </v-tabs>
                </v-col>

                <v-col :cols="8">
                    <v-tabs-items v-model="tab">
                        <v-tab-item v-for="item in items" :key="item.tab">
                            <v-card flat>
                                <v-card-text>{{ item.content }}</v-card-text>
                            </v-card>
                        </v-tab-item>
                    </v-tabs-items>
                </v-col>

            </v-row>
            <v-row justify="space-between" align="center" class="ma-0" style="background-color: #505a64; color: white;">
                <div class="cols-header pa-2">
                    Оповещение о снижении баланса
                </div>
            </v-row>
            <v-card class="pa-0">
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title class="mb-3">Оповещения о снижении баланса приходят на указанные email
                            адреса:
                        </v-list-item-title>
                        
                            <div v-for="(textField, i) in textFields" :key="i" class="text-fields-row">
                                <v-text-field :label="textField.label1" v-model="textField.value1"></v-text-field>
                                <v-btn @click="remove(i)" class="error">Удалить</v-btn>
                            </div>
                        <template v-if="textFields.length < 4">
                        <v-btn @click="add" class="primary" style="max-width: 300px">Добавить</v-btn>
                        </template>
                        <template v-else>
                        <span class="mb-3">Максимально допустимое количество email адресов: 4</span>
                        <v-btn disabled style="max-width: 300px">Добавить</v-btn>
                        </template>
                    </v-list-item-content>
                </v-list-item>
            </v-card>
        </v-col>
        <v-col cols="6">
            <v-row justify="space-between" align="center" class="ma-0" style="background-color: #505a64; color: white">
                <div class="cols-header pa-2">
                    История транзакций
                </div>
            </v-row>
            <v-card class="pa-1 pl-6" style="height: 100%">
                <v-dialog v-model="showDatePicker1" width="300">
                    <v-date-picker v-model="dates[0]"></v-date-picker>
                </v-dialog>
                <v-dialog v-model="showDatePicker2" width="300">
                    <v-date-picker v-model="dates[1]"></v-date-picker>
                </v-dialog>
                <v-row>
                    <v-col cols="2">
                        <v-text-field @click="showDatePicker1Func" v-model="dates[0]" prepend-icon="mdi-calendar"
                            readonly>
                        </v-text-field>
                    </v-col>
                    <v-col cols="2">
                        <v-text-field @click="showDatePicker2Func" v-model="dates[1]" prepend-icon="mdi-calendar"
                            readonly>
                        </v-text-field>
                    </v-col>
                    <v-col cols="2">
                        <v-btn class="mt-4" color="primary" small>
                            Показать
                        </v-btn>
                    </v-col>

                </v-row>
                <v-row>
                    За выбранный период транзакций нет
                </v-row>
            </v-card>
        </v-col>
    </v-row>
</template>
<script>
    export default {

        data() {
            return {
                textFields: [],
                showDatePicker1: false,
                showDatePicker2: false,
                items: [{
                        tab: 'Банковский перевод',
                        icon: 'mdi-bank',
                        content: 'Банковский перевод'
                    },
                    {
                        tab: 'Банковские карты',
                        icon: 'mdi-credit-card',
                        content: 'Банковские карты'
                    },
                    {
                        tab: 'SMS платежи',
                        icon: 'mdi-cellphone-check',
                        content: 'SMS платежи'
                    },
                    {
                        tab: 'Сбербанк Онлайн',
                        content: 'Сбербанк Онлайн'
                    },
                    {
                        tab: 'Альфа-Клик',
                        content: 'Альфа-Клик'
                    },
                    {
                        tab: 'QIWI-кошелек',
                        content: 'QIWI-кошелек'
                    },
                    {
                        tab: 'ЮMoney',
                        content: 'ЮMoney'
                    },
                    {
                        tab: 'WebMoney',
                        content: 'WebMoney'
                    },
                    {
                        tab: 'Наличными',
                        content: 'Наличными'
                    },
                ],
                tab: null,
                defaultSelectedLanguage: {
                    name: "Русский",
                    last: "russian"
                },
                languages: [{
                        name: "Русский",
                        last: "russian"
                    },
                    {
                        name: "Английский",
                        last: "english"
                    },
                ],
                defaultSelectedTime: {
                    name: "Москва UTC+3",
                    last: "msk"
                },
                timeZones: [{
                    name: "Москва UTC+3",
                    last: "msk"
                }, ],
                defaultSelectedDateFormat: {
                    name: "01.12.2021 (DD.MM.YYYY)",
                    last: "DDMMYYYY"
                },
                dateFormats: [{
                    name: "01.12.2021 (DD.MM.YYYY)",
                    last: "DDMMYYYY"
                }, ],
                defaultSelectedTimeFormat: {
                    name: "24-часовой (17:20)",
                    last: "24"
                },
                timeFormats: [{
                        name: "24-часовой (17:20)",
                        last: "24"
                    },

                ],
                defaultMetricSystem: {
                    name: "Метрическая",
                    last: "metric"
                },
                metricSystems: [{
                        name: "Метрическая",
                        last: "metric"
                    },

                ],
                smsCheckBox: true,
                dates: ['2019-09-10', '2019-09-20'],
            };
        },
        mounted() {
            this.addInit()
        },
        methods: {
            addInit() {
                this.textFields.push({
                    label1: "email адрес",
                    value1: "demo@email.com",
                })
            },
            add() {
                this.textFields.push({
                    label1: "email адрес",
                    value1: "",
                })
            },

            remove(index) {
                this.textFields.splice(index, 1)
            },
            showDatePicker2Func() {
                this.showDatePicker2 = true
                this.showDatePicker1 = false

            },
            showDatePicker1Func() {
                this.showDatePicker1 = true
                this.showDatePicker2 = false
            },
        },
    }
</script>
<style scoped>
    .cols-header {
        padding-left: 30px
    }

    ::v-deep .theme--light.v-tabs>.v-tabs-bar {
        background-color: #E0E0E3;
    }

    .v-tab {
        max-width: 100% !important;
    }

    ::v-deep .theme--light.v-tabs>.v-tabs-bar .v-tab:not(.v-tab--active),
    .theme--light.v-tabs>.v-tabs-bar .v-tab:not(.v-tab--active)>.v-icon,
    .theme--light.v-tabs>.v-tabs-bar .v-tab:not(.v-tab--active)>.v-btn,
    .theme--light.v-tabs>.v-tabs-bar .v-tab--disabled {
        color: black
    }

    .text-fields-row {
        display: flex;
    }
</style>