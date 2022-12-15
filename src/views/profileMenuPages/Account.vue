<template>
    <v-row>
        <v-col cols="6">
            <v-row justify="space-between" align="center" class="ma-0"
                style="height: 44px; background-color: #505a64; color: white">
                <div class="cols-header">
                    Учетная запись
                </div>
            </v-row>
            <v-card class="pa-0" style="height: calc(100%);">

                <v-list-item>
                    <v-list-item-icon>
                        <v-icon>mdi-account</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>{{username}}</v-list-item-title>
                        <v-list-item-subtitle>{{role}}</v-list-item-subtitle>
                        <v-list-item-title>Учетная запись (ID) <b>{{id}}</b></v-list-item-title>
                        <v-list-item-title>Баланс: <b>{{balance}} руб.</b></v-list-item-title>
                        <v-list-item-title>Бонус: {{bonus}} руб.</v-list-item-title>
                        <a href="#balance">Пополнить баланс</a>
                    </v-list-item-content>
                </v-list-item>

            </v-card>
        </v-col>
        <v-col cols="6">
            <v-row justify="space-between" align="center" class="ma-0"
                style="height: 44px; background-color: #505a64; color: white">
                <div class="cols-header">
                    Параметры
                </div>
            </v-row>
            <v-card class="pa-0" style="height: calc(100%);">

                <v-list-item>
                    <v-list-item-icon>
                        <v-icon>mdi-cogs</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title class="pb-2">Основные параметры</v-list-item-title>
                        <v-list-item-subtitle>Язык интерфейса по умолчанию</v-list-item-subtitle>
                        <v-select class="pt-0 mt-0" item-text="name" item-value="last" v-model="defaultSelectedLanguage"
                            :items="languages">
                        </v-select>
                        <v-list-item-subtitle>Часовой пояс</v-list-item-subtitle>
                        <v-select class="pt-0 mt-0" item-text="name" item-value="last" v-model="defaultSelectedTime"
                            :items="timeZones">
                        </v-select>
                        <v-list-item-subtitle>Формат даты</v-list-item-subtitle>
                        <v-select class="pt-0 mt-0" item-text="name" item-value="last"
                            v-model="defaultSelectedDateFormat" :items="dateFormats">
                        </v-select>
                        <v-list-item-subtitle>Формат времени</v-list-item-subtitle>
                        <v-select class="pt-0 mt-0" item-text="name" item-value="last"
                            v-model="defaultSelectedTimeFormat" :items="timeFormats">
                        </v-select>
                        <v-list-item-subtitle>Система мер</v-list-item-subtitle>
                        <v-select class="pt-0 mt-0" item-text="name" item-value="last" v-model="defaultMetricSystem"
                            :items="metricSystems">
                        </v-select>
                        <v-checkbox v-model="smsCheckBox" label="Транслитерация sms уведомлений"></v-checkbox>
                        <div>
                            <v-btn depressed color="primary" @click="changePass()" style="max-width: 170px">
                                Изменить пароль
                            </v-btn>
                        </div>

                    </v-list-item-content>
                </v-list-item>


            </v-card>
            <v-dialog v-model="editpassdialog" width="500">
                <v-card>
                  <v-card-title class="text-h5 grey lighten-2"
                   style="display: flex; justify-content: space-between">
                     <div>{{ username }}</div>
                     <v-btn @click="editpassdialog = false" icon>
                      <v-icon>mdi-close</v-icon>
                         </v-btn>
                        </v-card-title>
                        <v-card-text>
                        <v-form ref="form" v-model="valid" lazy-validation>
                          <h4>Учетная запись (ID): #{{ id }}</h4>
                            <h3>Введите текущий пароль</h3>
                             <v-text-field v-model="newpassword.oldpass" :counter="25">
                             </v-text-field>
							<h3>Введите новый пароль</h3>
                             <v-text-field v-model="newpassword.newpass" :counter="25">
                              </v-text-field>
							<h3>Повторите новый пароль</h3>
                            <v-text-field v-model="newpassword.newpassrepeat" :counter="25">
                            </v-text-field>
                            </v-form>
                             </v-card-text>

                             <v-divider></v-divider>

                            <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="grey" text @click="editpassdialog = false">
                             Отменить
                            </v-btn>
                            <v-btn color="primary" text @click="editpassdialog = false;updateUserPass();">
                             Сохранить
                            </v-btn>
                          </v-card-actions>
                          </v-card>
                          </v-dialog>
        </v-col>
    </v-row>
</template>
<script>
     import httpClient from '@/api'
    export default {
       
        data() {
            return {
                editpassdialog: false,
                
                username: "null",
                role: "null",
                id: 0,
                balance: 0,
                bonus: 0,
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
                // 
                defaultSelectedTime: {
                    name: "Москва UTC+3",
                    last: "msk"
                },
                timeZones: [{
                    name: "Москва UTC+3",
                    last: "msk"
                }, ],
                // 
                defaultSelectedDateFormat: {
                    name: "01.12.2021 (DD.MM.YYYY)",
                    last: "DDMMYYYY"
                },
                dateFormats: [{
                    name: "01.12.2021 (DD.MM.YYYY)",
                    last: "DDMMYYYY"
                }, ],
                // 
                defaultSelectedTimeFormat: {
                    name: "24-часовой (17:20)",
                    last: "24"
                },
                timeFormats: [{
                        name: "24-часовой (17:20)",
                        last: "24"
                    },

                ],
                // 
                defaultMetricSystem: {
                    name: "Метрическая",
                    last: "metric"
                },
                metricSystems: [{
                        name: "Метрическая",
                        last: "metric"
                    },

                ],
                newpassword: {
                    oldpass: null,
                    newpass: null,
                    newpassrepeat: null
                },
                smsCheckBox: false,
            };
        },
        methods: {
            updateUserPass(){
                httpClient.api.updatepass(this.oldpass, this.id, this.newpass)
                .then(resp =>{
                    console.log(resp);
                });
                if(this.newpassword.newpass === this.newpassword.newpassrepeat){
                    this.$alert("Пароль успешно обновлён");
                } else {
                    this.$alert("Неверные данные");
                }
                
            },
            changePass(){
                this.editpassdialog = true;
            },
            loaddata(){
                httpClient.api.getAccountInfo(localStorage.getItem('username'))
                .then(resp =>{
                    console.log(this.defaultSelectedLanguage.name);
                    this.defaultSelectedLanguage.name = resp.data.defaultSelectedLanguagename;
                    this.defaultSelectedLanguage.last = resp.data.defaultSelectedLanguagelast;
                    this.username = resp.data.username;
                    this.role = resp.data.role
                    this.id = resp.data.id
                    this.balance = resp.data.balance
                    this.bonus = resp.data.bonus
                    console.log(this.defaultSelectedLanguage.name);
                });
                 },
        },
            beforeMount(){
                this.loaddata()
            },
        }
    
</script>
<style scoped>
    .cols-header {
        padding-left: 30px
    }
</style>